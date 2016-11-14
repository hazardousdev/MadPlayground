function renderScene() {
    // Clear the canvas before we start drawing on it.

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Establish the perspective with which we want to view the
    // scene. Our field of view is 45 degrees, with a width/height
    // ratio of 640:480, and we only want to see objects between 0.1 units
    // and 100 units away from the camera.

    perspectiveMatrix = makePerspective(45, 800.0 / 800.0, 0.1, 100.0);

    var objects = []

    updateScene(objects);

    objects.forEach(function (item, i, arr) {
        renderObject(item);
    });
}

function renderObject(object) {
    // Set the drawing position to the "identity" point, which is
    // the center of the scene.

    loadIdentity();

    // Now move the drawing position a bit to where we want to start
    // drawing the cube.

    mvTranslate([object.position.x, object.position.y, -21.0]);

    var model = cache.models[object.modelId];
    var texture = cache.textures[object.textureId];

    gl.bindBuffer(gl.ARRAY_BUFFER, model.positionsBufferId);
    gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, model.textureCoordsBufferId);
    gl.vertexAttribPointer(textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, model.normalsBufferId);
    gl.vertexAttribPointer(vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

    // Specify the texture to map onto the faces.

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture.glId);
    gl.uniform1i(gl.getUniformLocation(shaderProgram, "uSampler"), 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indexBufferId);
    setMatrixUniforms(); //TODO что это и куда можно деть
    gl.drawElements(gl.TRIANGLES, model.indices.length, gl.UNSIGNED_SHORT, 0);
}