var TEXTURE_BODY_ID = 1;
var TEXTURE_BEER_ID = 2;
var TEXTURE_WALL_ID = 3;
var TEXTURE_MAD_MAX_ID = 4;
var TEXTURE_GRASS_ID = 5;
var MODEL_BODY_ID = 1;
var MODEL_GROUND_ID = 2;

var cubicModel = new renderer.Model(
    MODEL_BODY_ID,
    null, null, null, null,
    [
        // Front face
        -0.5, -0.5, 0.5,
        0.5, -0.5, 0.5,
        0.5, 0.5, 0.5,
        -0.5, 0.5, 0.5,
        // Back face
        -0.5, -0.5, -0.5,
        -0.5, 0.5, -0.5,
        0.5, 0.5, -0.5,
        0.5, -0.5, -0.5,
        // Top face
        -0.5, 0.5, -0.5,
        -0.5, 0.5, 0.5,
        0.5, 0.5, 0.5,
        0.5, 0.5, -0.5,
        // Bottom face
        -0.5, -0.5, -0.5,
        0.5, -0.5, -0.5,
        0.5, -0.5, 0.5,
        -0.5, -0.5, 0.5,
        // Right face
        0.5, -0.5, -0.5,
        0.5, 0.5, -0.5,
        0.5, 0.5, 0.5,
        0.5, -0.5, 0.5,
        // Left face
        -0.5, -0.5, -0.5,
        -0.5, -0.5, 0.5,
        -0.5, 0.5, 0.5,
        -0.5, 0.5, -0.5
    ],
    [
        // Front
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        // Back
        0.0, 0.0, -1.0,
        0.0, 0.0, -1.0,
        0.0, 0.0, -1.0,
        0.0, 0.0, -1.0,
        // Top
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        // Bottom
        0.0, -1.0, 0.0,
        0.0, -1.0, 0.0,
        0.0, -1.0, 0.0,
        0.0, -1.0, 0.0,
        // Right
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        // Left
        -1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0
    ],
    [
        // Front
        0.0, 1.0,
        1.0, 1.0,
        1.0, 0.0,
        0.0, 0.0,
        // Back
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        // Top
        0.0, 0.0,
        0.0, 1.0,
        1.0, 1.0,
        1.0, 0.0,
        // Bottom
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        // Right
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        // Left
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0
    ],
    [
        0, 1, 2, 0, 2, 3,    // front
        4, 5, 6, 4, 6, 7,    // back
        8, 9, 10, 8, 10, 11,   // top
        12, 13, 14, 12, 14, 15,   // bottom
        16, 17, 18, 16, 18, 19,   // right
        20, 21, 22, 20, 22, 23    // left
    ]
);

var groundModel = new renderer.Model(
    MODEL_GROUND_ID,
    null, null, null, null,
    [
        // Top face
        -10, 0, 10,
        -10, 0, -10,
        10, 0, -10,
        10, 0, 10
    ],
    [
        // Top
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0
    ],
    [
        // Top
        0.0, 0.0,
        0.0, 1.0,
        1.0, 1.0,
        1.0, 0.0
    ],
    [
        0, 1, 2, 0, 2, 3    // front
    ]
);

var bodyTexture = new renderer.Texture(
    TEXTURE_BODY_ID,
    null,
    "/Content/webgl_lab/images/hazardous_texture.png"
);

var beerTexture = new renderer.Texture(
    TEXTURE_BEER_ID,
    null,
    "/Content/webgl_lab/images/beer.jpg"
);

var wallTexture = new renderer.Texture(
    TEXTURE_WALL_ID,
    null,
    "/Content/webgl_lab/images/wall.jpg"
);

var madMaxTexture = new renderer.Texture(
    TEXTURE_MAD_MAX_ID,
    null,
    "/Content/webgl_lab/images/mad_max.jpg"
);

var grassTexture = new renderer.Texture(
    TEXTURE_GRASS_ID,
    null,
    "/Content/webgl_lab/images/grass.jpg"
);