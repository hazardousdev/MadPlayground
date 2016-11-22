worm = (function () {
    var Apple = makeStruct("position rotation modelId textureId");
    var Head = makeStruct("position rotation modelId textureId");
    var Body = makeStruct("position rotation next modelId textureId");
    var Worm = makeStruct("head bodies alive velocity");  // ужас какой!
    var Wall = makeStruct("position rotation modelId textureId");
    var Ground = makeStruct("position modelId textureId");

    var bounds = vec2.fromValues(-7, 7); // квадратное поле. min, max для обеих осей сразу

    var apples = {};
    var worm = {};
    var walls = {};
    var ground = {};

    var objectsToRender = [];

    function initWormData() {
        if (physicsLoopId) {
            cancelAnimationFrame(physicsLoopId);
        };
        objectsToRender.splice(0);

        apples = [];

        var head = new Head(
            vec3.create(),
            quat.create(),
            cubicModel.id,
            madMaxTexture.id
        );

        var bodies = [
            new Body(
                vec3.fromValues(0, 0, 1),
                quat.create(),
                head,
                cubicModel.id,
                beerTexture.id
            )
        ];

        worm = new Worm(
            head,
            bodies,
            true,
            vec2.fromValues(0, -1)
        );

        walls = [];
        for (var i = bounds[0] - 1; i <= bounds[1] + 1; i++) {
            walls.push(
                new Wall(
                    vec3.fromValues(i, 0, bounds[0] - 1),
                    quat.create(),
                    cubicModel.id,
                    wallTexture.id
                )
            );
            walls.push(
                new Wall(
                    vec3.fromValues(i, 0, bounds[1] + 1),
                    quat.create(),
                    cubicModel.id,
                    wallTexture.id
                )
            );
            walls.push(
                new Wall(
                    vec3.fromValues(bounds[0] - 1, 0, -i),
                    quat.create(),
                    cubicModel.id,
                    wallTexture.id
                )
            );
            walls.push(
                new Wall(
                    vec3.fromValues(bounds[1] + 1, 0, -i),
                    quat.create(),
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

        landApples();

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

    function getRandomCANNONVec3(min, max) {
        return new CANNON.Vec3(
            getRandomArbitary(min, max),
            getRandomArbitary(min, max),
            getRandomArbitary(min, max)
        );
    }

    function crawl() {
        if (!worm.alive) {
            return;
        };

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
    }

    function die() {
        console.log("died");
        worm.alive = false;
        initWormPhysics();
    }

    function grow() {
        landApples();
        var newBody = new Body(
            worm.bodies[worm.bodies.length - 1].position,
            quat.create(),
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
        apples[0] = new Apple(
            position,
            quat.create(),
            cubicModel.id,
            beerTexture.id
        );
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getRandomArbitary(min, max) {
        return Math.random() * (max - min) + min;
    }


    function processKey(e) {
        switch (e.keyCode) {
            case 87: // W
                if (worm.alive && !vec2.exactEquals(worm.velocity, vec2.fromValues(0, 1))) {
                    worm.velocity = vec2.fromValues(0, -1);
                }
                break;
            case 83: // S
                if (worm.alive && !vec2.exactEquals(worm.velocity, vec2.fromValues(0, -1))) {
                    worm.velocity = vec2.fromValues(0, 1);
                }
                break;
            case 65: // A
                if (worm.alive && !vec2.exactEquals(worm.velocity, vec2.fromValues(1, 0))) {
                    worm.velocity = vec2.fromValues(-1, 0);
                }
                break;
            case 68: // D
                if (worm.alive && !vec2.exactEquals(worm.velocity, vec2.fromValues(-1, 0))) {
                    worm.velocity = vec2.fromValues(1, 0);
                }
                break;
            case 13: // Enter
                initWormData();
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

    var physicsLoopId;

    function initWormPhysics() {

        var world = new CANNON.World();
        world.gravity.set(0, -9.82, 0);

        addWorldPlane(world);

        addBoxPhysicalProperties(world, worm.head, 5);
        addBoxPhysicalProperties(world, apples[0], 0);
        worm.bodies.forEach(function (item, i, arr) {
            addBoxPhysicalProperties(world, item, 5);
        });
        
        var fieldExtent = bounds[1] + 1;
        addWallPhysicalProperties(world, new CANNON.Vec3(0, 0.5, -fieldExtent)); // back
        addWallPhysicalProperties(world, new CANNON.Vec3(0, 0.5, fieldExtent)); // front
        addWallPhysicalProperties(world, new CANNON.Vec3(-fieldExtent, 0.5, 0), true); // left
        addWallPhysicalProperties(world, new CANNON.Vec3(fieldExtent, 0.5, 0), true); // right

        var fixedTimeStep = 1.0 / 60.0;
        var maxSubSteps = 3;
        var lastTime;
        (function simloop(time) {
            physicsLoopId = requestAnimationFrame(simloop);
            if (lastTime !== undefined) {
                var dt = (time - lastTime) / 1000;
                world.step(fixedTimeStep, dt, maxSubSteps);
            }

            synchronizePhysicalProperties(worm.head);
            synchronizePhysicalProperties(apples[0]);
            worm.bodies.forEach(function (item, i, arr) {
                synchronizePhysicalProperties(item);
            });

            lastTime = time;
        })();
    };

    function synchronizePhysicalProperties(object) {
        object.position[0] = object.physical.position.x;
        object.position[1] = object.physical.position.y;
        object.position[2] = object.physical.position.z;

        object.rotation[0] = object.physical.quaternion.x;
        object.rotation[1] = object.physical.quaternion.y;
        object.rotation[2] = object.physical.quaternion.z;
        object.rotation[3] = object.physical.quaternion.w;
    };

    function addBoxPhysicalProperties(world, object, velocityScalar) {
        var mass = 100;
        var halfExtent = 0.5;

        var cubicBody = new CANNON.Body({
            mass: mass,
            position: new CANNON.Vec3(
                object.position[0],
                object.position[1],
                object.position[2]
            ),
            shape: new CANNON.Box(new CANNON.Vec3(halfExtent, halfExtent, halfExtent)),
            velocity: new CANNON.Vec3(worm.velocity[0] * velocityScalar, velocityScalar, worm.velocity[1] * velocityScalar),
            angularVelocity: getRandomCANNONVec3(-5, 5)
        });
        world.addBody(cubicBody);

        object.physical = cubicBody;
    };

    function addWallPhysicalProperties(world, wallPosition, vertical) {
        var halfExtents = new CANNON.Vec3(bounds[1], 0.5, 0.5);

        var wallBody = new CANNON.Body({
            position: wallPosition,
            shape: new CANNON.Box(halfExtents),
            type: CANNON.Body.STATIC
        });
        if (vertical) {
            wallBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), -Math.PI / 2);
        };
        world.addBody(wallBody);
    };

    function addWorldPlane(world) {
        var groundBody = new CANNON.Body({
            mass: 0,
            position: new CANNON.Vec3(
                ground.position[0],
                ground.position[1],
                ground.position[2]
            ),
            shape: new CANNON.Plane()
        });
        // повернем плоскость, чтобы смотрела на +y
        groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
        world.addBody(groundBody);
    };

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