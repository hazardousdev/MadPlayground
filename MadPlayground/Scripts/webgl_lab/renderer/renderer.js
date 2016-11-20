(function () {
    // TODO возможно, стоит все публичные поля организовывать таким способом.
    // чтобы не плодить ненужные под-неймспейсы renderer.*.publicMethod. но это не точно
    renderer.renderScene = function () {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        var vpMatrix = mat4.create();
        var vMatrix = mat4.create();
        var pMatrix = mat4.create();

        mat4.perspective(pMatrix, 45, 800.0 / 800.0, 0.1, 100.0);
        mat4.lookAt(
            vMatrix,
            renderer.camera.eye,
            renderer.camera.center,
            renderer.camera.up
        );
        mat4.multiply(vpMatrix, pMatrix, vMatrix);

        renderer.renderableObjects.forEach(function (object, i, arr) {
            parseAndRenderObjects(object, vpMatrix);
        });
    }

    function parseAndRenderObjects(object, vpMatrix) {
        if (!isEmptyObject(object)) {
            if (object.position && object.textureId && object.modelId) {
                renderObject(object, vpMatrix);
            } else if (Array.isArray(object)) {
                object.forEach(function (nestedObject, i, arr) {
                    parseAndRenderObjects(nestedObject, vpMatrix);
                });
            }
        }
    }

    function renderObject(object, vpMatrix) {
        var vMatrix = mat4.create();
        mat4.fromTranslation(vMatrix, vec3.fromValues(object.position[0], object.position[1], object.position[2]))

        var mvpMatrix = mat4.create();
        mat4.multiply(mvpMatrix, vpMatrix, vMatrix);

        var model = renderer.resources.cache.models[object.modelId];
        var texture = renderer.resources.cache.textures[object.textureId];

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
        var mvpUniform = gl.getUniformLocation(shaderProgram, "uMVPMatrix");
        gl.uniformMatrix4fv(mvpUniform, false, new Float32Array(mvpMatrix));
        gl.drawElements(gl.TRIANGLES, model.indices.length, gl.UNSIGNED_SHORT, 0);
    }
})();