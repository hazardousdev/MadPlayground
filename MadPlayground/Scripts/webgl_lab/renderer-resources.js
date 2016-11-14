var Texture = makeStruct("id glId path");
var Model = makeStruct("id positionsBufferId normalsBufferId textureCoordsBufferId indexBufferId vertices normals textureCoords indices");
var Cache = makeStruct("models textures");

var cache = new Cache(
    {},
    {}
);

function setupModel(model) {
    model.positionsBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, model.positionsBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.vertices), gl.STATIC_DRAW);

    model.normalsBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, model.normalsBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.normals),
                  gl.STATIC_DRAW);

    model.textureCoordsBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, model.textureCoordsBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.textureCoords),
                  gl.STATIC_DRAW);

    model.indexBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indexBufferId);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(model.indices), gl.STATIC_DRAW);

    cache.models[model.id] = model;
}

function setupTexture(texture) {
    texture.glId = gl.createTexture();
    var image = new Image();
    image.onload = function () { handleTextureLoaded(image, texture.glId); }
    image.src = texture.path;

    cache.textures[texture.id] = texture;
}

function handleTextureLoaded(image, texture) {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
}