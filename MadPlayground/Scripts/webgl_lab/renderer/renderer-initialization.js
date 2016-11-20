var renderer = {};

var gl;
var shaderProgram;

var vertexPositionAttribute;
var vertexNormalAttribute;
var textureCoordAttribute;

(function () {

    renderer.renderableObjects = [];

    var ArcBallCamera = makeStruct("eye center up rotateAroundLeft");
    var Model = makeStruct("id positionsBufferId normalsBufferId textureCoordsBufferId indexBufferId vertices normals textureCoords indices");
    var Texture = makeStruct("id glId path");

    renderer.Model = Model;
    renderer.Texture = Texture;

    renderer.start = function (args) {

        renderer.renderableObjects = args.collectionToRender;

        if (args && args.camera && args.camera.type === "arcball") {
            renderer.camera = new ArcBallCamera(
                args.camera.eye,
                args.camera.center,
                args.camera.up
            );
            addArcBallCameraRotations();
        } else {
            renderer.camera = new ArcBallCamera(
                vec3.fromValues(0, 0, -1),
                vec3.fromValues(0, 0, 0),
                vec3.fromValues(0, 1, 0)
            );
            addArcBallCameraRotations();
        }

        canvas = document.getElementById(args.canvasId);
        initWebGL(canvas);      // Initialize the GL context

        // Only continue if WebGL is available and working

        if (gl) {
            gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
            gl.clearDepth(1.0);                 // Clear everything
            gl.enable(gl.DEPTH_TEST);           // Enable depth testing
            gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

            renderer.shaders.initShaders();

            setInterval(renderer.renderScene, 15);
        }
    }

    function initWebGL(canvas) {
        gl = null;

        try {
            gl = canvas.getContext("experimental-webgl");
        }
        catch (e) {
        }

        // If we don't have a GL context, give up now

        if (!gl) {
            alert("Unable to initialize WebGL. Your browser may not support it.");
        }
    }

    function addArcBallCameraRotations() {
        renderer.camera.rotateAroundLeft = function (angle) {
            if (angle != 0) {
                var forward = vec3.create();
                vec3.sub(forward, renderer.camera.center, renderer.camera.eye);
                vec3.normalize(forward, forward);
                var left = vec3.create();
                vec3.cross(left, forward, renderer.camera.up); // LEFT?
                quaternion = quat.create();
                quat.setAxisAngle(
                    quaternion,
                    left,
                    -angle
                );

                vec3.transformQuat(
                    renderer.camera.eye,
                    renderer.camera.eye,
                    quaternion
                );
            }
        };
        renderer.camera.rotateAroundUp = function (angle) {
            if (angle != 0) {
                vec3.rotateY(
                    renderer.camera.eye,
                    renderer.camera.eye,
                    renderer.camera.center,
                    -angle
                );
            }
        };
    }
})();