var Vector2 = makeStruct("x y");
var Apple = makeStruct("position modelId textureId");
var Head = makeStruct("position modelId textureId");
var Body = makeStruct("position next modelId textureId");
var Worm = makeStruct("head bodies velocity");  // ужас какой!
var Wall = makeStruct("position modelId textureId");
var Ground = makeStruct("position modelId textureId");

var bounds = new Vector2(-7, 7); // квадратное поле. min, max для обеих осей сразу
var apples;
var worm;
var walls;
var ground;

function initWormData() {
    apples = [
    new Apple(
        new Vector2(0, -2),
        bodyModel.id,
        beerTexture.id
    )
    ];

    var head = new Head(
        new Vector2(0, 0),
        bodyModel.id,
        madMaxTexture.id
    );

    worm = new Worm(
        head,
        [
            new Body(
                new Vector2(0, -1),
                head,
                bodyModel.id,
                beerTexture.id
            )
        ],
        new Vector2(0, 1)
    );

    walls = [];
    for (var i = bounds.x - 1; i <= bounds.y + 1; i++) {
        walls.push(
            new Wall(
                new Vector2(i, bounds.x - 1),
                bodyModel.id,
                wallTexture.id
            )
        );
        walls.push(
            new Wall(
                new Vector2(i, bounds.y + 1),
                bodyModel.id,
                wallTexture.id
            )
        );
        walls.push(
            new Wall(
                new Vector2(bounds.x - 1, i),
                bodyModel.id,
                wallTexture.id
            )
        );
        walls.push(
            new Wall(
                new Vector2(bounds.y + 1, i),
                bodyModel.id,
                wallTexture.id
            )
        );
    }

    ground = new Ground(
        new Vector2(0, 0),
        groundModel.id,
        grassTexture.id
    )
}

function initWormRendering() {
    setupModel(bodyModel);
    setupModel(groundModel);

    setupTexture(bodyTexture);
    setupTexture(beerTexture);
    setupTexture(wallTexture);
    setupTexture(madMaxTexture);
    setupTexture(grassTexture);
}

function crawl() {
    var nextHeadPosition = new Vector2(
        worm.head.position.x + worm.velocity.x,
        worm.head.position.y + worm.velocity.y
    );

    if (nextHeadPosition.x < bounds.x
        || nextHeadPosition.x > bounds.y
        || nextHeadPosition.y < bounds.x
        || nextHeadPosition.y > bounds.y) {
        die(); 
        return;
    }

    worm.bodies.forEach(function (item, i, arr) {
        if (isEqualVectors(nextHeadPosition, item.position)) {
            die(); // :'(
            return;
        }
    });

    apples.forEach(function (item, i, arr) {
        if (isEqualVectors(nextHeadPosition, item.position)) {
            grow(); // C:
            return;
        }
    });

    for (var i = worm.bodies.length - 1; i >= 0; i--) {
        worm.bodies[i].position = new Vector2(
            worm.bodies[i].next.position.x,
            worm.bodies[i].next.position.y
        );
    }
    worm.head.position.x += worm.velocity.x;
    worm.head.position.y += worm.velocity.y;

    var logMsg = "head: (" + worm.head.position.x + ", " + worm.head.position.y + ")";
    worm.bodies.forEach(function (item, i, arr) {
        logMsg += "body-" + i + ": (" + item.position.x + ", " + item.position.y + ")"
    });
    console.log(logMsg);
}

function awakeWorm() {
    window.onkeydown = processKey;
    initWormData();
    initWormRendering();

    console.log("awaken");
    setInterval(crawl, 100);
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

    for (var i = bounds.x; i <= bounds.y; i++) {
        for (var j = bounds.x; j <= bounds.y; j++) {
            possiblePositions.push(new Vector2(i, j));
        }
    }

    var emptyPositions = possiblePositions.filter(function (pos, i, arr) {
        var empty = true;
        worm.bodies.forEach(function (body, i, arr) {
            if (isEqualVectors(pos, body.position)) {
                empty = false;
                return;
            }
            if (isEqualVectors(pos, worm.head.position)) {
                empty = false;
            }
        });
        return empty;
    });

    var position = emptyPositions[getRandomInt(0, emptyPositions.length - 1)];
    apples[0].position = position;
}

function isEqualVectors(vec1, vec2) {
    return vec1.x === vec2.x && vec1.y === vec2.y;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function processKey(e) {
    switch (e.keyCode) {
        case 87: // W
            if (!isEqualVectors(worm.velocity, new Vector2(0, -1))) {
                worm.velocity = new Vector2(0, 1);
            }
            break;
        case 83: // S
            if (!isEqualVectors(worm.velocity, new Vector2(0, 1))) {
                worm.velocity = new Vector2(0, -1);
            }
            break;
        case 65: // A
            if (!isEqualVectors(worm.velocity, new Vector2(1, 0))) {
                worm.velocity = new Vector2(-1, 0);
            }
            break;
        case 68: // D
            if (!isEqualVectors(worm.velocity, new Vector2(-1, 0))) {
                worm.velocity = new Vector2(1, 0);
            }
            break;
        default:
            return;
    }
}