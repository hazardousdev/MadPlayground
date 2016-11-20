worm = (function () {
    var Apple = makeStruct("position modelId textureId");
    var Head = makeStruct("position modelId textureId");
    var Body = makeStruct("position next modelId textureId");
    var Worm = makeStruct("head bodies velocity");  // ужас какой!
    var Wall = makeStruct("position modelId textureId");
    var Ground = makeStruct("position modelId textureId");

    var bounds = vec2.fromValues(-7, 7); // квадратное поле. min, max для обеих осей сразу

    var apples = {};
    var worm = {};
    var walls = {};
    var ground = {};

    var objectsToRender = [];

    function initWormData() {
        objectsToRender.splice(0);

        apples = [
            new Apple(
                vec3.fromValues(0, 0, 2),
                cubicModel.id,
                beerTexture.id
            )
        ];

        var head = new Head(
            vec3.fromValues(0, 0, 0),
            cubicModel.id,
            madMaxTexture.id
        );

        var bodies = [
            new Body(
                vec3.fromValues(0, 0, 1),
                head,
                cubicModel.id,
                beerTexture.id
            )
        ];

        worm = new Worm(
            head,
            bodies,
            vec2.fromValues(0, -1)
        );

        walls = [];
        for (var i = bounds[0] - 1; i <= bounds[1] + 1; i++) {
            walls.push(
                new Wall(
                    vec3.fromValues(i, 0, bounds[0] - 1),
                    cubicModel.id,
                    wallTexture.id
                )
            );
            walls.push(
                new Wall(
                    vec3.fromValues(i, 0, bounds[1] + 1),
                    cubicModel.id,
                    wallTexture.id
                )
            );
            walls.push(
                new Wall(
                    vec3.fromValues(bounds[0] - 1, 0, -i),
                    cubicModel.id,
                    wallTexture.id
                )
            );
            walls.push(
                new Wall(
                    vec3.fromValues(bounds[1] + 1, 0, -i),
                    cubicModel.id,
                    wallTexture.id
                )
            );
        }

        ground = new Ground(
            vec3.fromValues(0, -0.5, 0),
            groundModel.id,
            grassTexture.id
        )

        objectsToRender.push(apples, head, bodies, walls, ground);
    }

    function initWormRendering() {
        renderer.resources.setupModel(cubicModel);
        renderer.resources.setupModel(groundModel);

        renderer.resources.setupTexture(bodyTexture);
        renderer.resources.setupTexture(beerTexture);
        renderer.resources.setupTexture(wallTexture);
        renderer.resources.setupTexture(madMaxTexture);
        renderer.resources.setupTexture(grassTexture);
    }

    function crawl() {
        var nextHeadPosition = vec3.fromValues(
            worm.head.position[0] + worm.velocity[0],
            0,
            worm.head.position[2] + worm.velocity[1]
        );

        if (nextHeadPosition[0] < bounds[0]
            || nextHeadPosition[0] > bounds[1]
            || nextHeadPosition[2] < bounds[0]
            || nextHeadPosition[2] > bounds[1]) {
            die(); 
            return;
        }

        worm.bodies.forEach(function (item, i, arr) {
            if (vec3.exactEquals(nextHeadPosition, item.position)) {
                die(); // :'(
                return;
            }
        });

        apples.forEach(function (item, i, arr) {
            if (vec3.exactEquals(nextHeadPosition, item.position)) {
                grow(); // C:
                return;
            }
        });

        for (var i = worm.bodies.length - 1; i >= 0; i--) {
            worm.bodies[i].position = vec3.fromValues(
                worm.bodies[i].next.position[0],
                0,
                worm.bodies[i].next.position[2]
            );
        }
        worm.head.position[0] += worm.velocity[0];
        worm.head.position[2] += worm.velocity[1];

        var logMsg = "head: (" + worm.head.position[0] + ", " + worm.head.position[2] + ")";
        worm.bodies.forEach(function (item, i, arr) {
            logMsg += "body-" + i + ": (" + item.position[0] + ", " + item.position[2] + ")"
        });
        console.log(logMsg);
    }

    function die() {
        console.log("died");
        initWormData();
    }

    function grow() {
        landApples();
        var newBody = new Body(
            worm.bodies[worm.bodies.length - 1].position,
            worm.bodies[worm.bodies.length - 1],
            worm.bodies[worm.bodies.length - 1].modelId,
            worm.bodies[worm.bodies.length - 1].textureId
        );
        worm.bodies.push(newBody);
        console.log("growing");
    }

    function landApples() {
        var possiblePositions = [];

        for (var i = bounds[0]; i <= bounds[1]; i++) {
            for (var j = bounds[0]; j <= bounds[1]; j++) {
                possiblePositions.push(vec3.fromValues(i, 0, j));
            }
        }

        var emptyPositions = possiblePositions.filter(function (pos, i, arr) {
            var empty = true;
            worm.bodies.forEach(function (body, i, arr) {
                if (vec3.exactEquals(pos, body.position)) {
                    empty = false;
                    return;
                }
                if (vec3.exactEquals(pos, worm.head.position)) {
                    empty = false;
                }
            });
            return empty;
        });

        var position = emptyPositions[getRandomInt(0, emptyPositions.length - 1)];
        apples[0].position = position;
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function processKey(e) {
        switch (e.keyCode) {
            case 87: // W
                if (!vec2.exactEquals(worm.velocity, vec2.fromValues(0, 1))) {
                    worm.velocity = vec2.fromValues(0, -1);
                }
                break;
            case 83: // S
                if (!vec2.exactEquals(worm.velocity, vec2.fromValues(0, -1))) {
                    worm.velocity = vec2.fromValues(0, 1);
                }
                break;
            case 65: // A
                if (!vec2.exactEquals(worm.velocity, vec2.fromValues(1, 0))) {
                    worm.velocity = vec2.fromValues(-1, 0);
                }
                break;
            case 68: // D
                if (!vec2.exactEquals(worm.velocity, vec2.fromValues(-1, 0))) {
                    worm.velocity = vec2.fromValues(1, 0);
                }
                break;
            default:
                return;
        }
    }

    function processMouseMove(e) {
        // if scroll button pressed
        if (e.button === 1) {
            // TODO возможно, нужно комбинировать
            renderer.camera.rotateAroundUp(e.movementX * 0.01);
            renderer.camera.rotateAroundLeft(e.movementY * 0.01);
        }
    }

    return {
        awake: function() {
            window.onkeydown = processKey;
            window.onmousemove = processMouseMove;
            initWormData();
            initWormRendering();

            console.log("awaken");
            setInterval(crawl, 100);
        },

        objectsToRender: objectsToRender,

        collectionToRender: function (renderableObjects) {
            // здесь нужно заполнять objects[] объектами, у которых есть position (vec3 из библиотеки gl-matrix), modelId, textureId
            // TODO возможно, следует создать в worm.js коллекцию с объектами. сделать ссылку на нее в какой-то переменной в renderer. обновлять из worm, дергать из renderer? 

            renderableObjects.push(worm.head);
            worm.bodies.forEach(function (item, i, arr) {
                renderableObjects.push(item);
            });
            apples.forEach(function (item, i, arr) {
                renderableObjects.push(item);
            });
            walls.forEach(function (item, i, arr) {
                renderableObjects.push(item);
            });
            renderableObjects.push(ground);
        }
    }
})();