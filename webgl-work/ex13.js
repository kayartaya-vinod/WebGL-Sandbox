(function () {
    var canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    var gl = canvas.getContext('webgl');

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, canvas.width, canvas.height)
    }

    window.addEventListener('resize', resize);

    const image = new Image();
    image.src = 'tiger.jpg';
    image.onload = function () {

        // canvas.width = image.naturalWidth;
        // canvas.height = image.naturalHeight;
        resize();

        var vertexShaderSource = `
        attribute vec2 position;
        attribute vec2 texPosition;
        varying vec2 texCoords;
        uniform vec2 scale;

        void main() {
            texCoords = (texPosition + 1.0) / 2.0;
            texCoords.y = 1.0 - texCoords.y;
            texCoords.x = 1.0 - texCoords.x;
            
            gl_Position.x = position.x * scale.x;
            gl_Position.y = position.y * scale.y;
            gl_Position.z = 0.0;
            gl_Position.w = 1.0;

            // gl_Position = vec4(position, 0, 1.0);
        }
        `;
        var fragShaderSource = `
        precision highp float;
        varying vec2 texCoords;
        uniform sampler2D textureSampler;

        void main() {
            vec4 color = texture2D(textureSampler, texCoords);
            gl_FragColor = color;
        }
        `;

        var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        var fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragShaderSource);
        var program = createProgram(gl, vertexShader, fragShader)

        const vertices = new Float32Array([
            -0.75, -0.75,
            -0.75, 0.75,
            0.75, 0.75,
            0.75, -0.75,
        ]);
        setAttribData(gl, 'position', program, vertices);
        setUniformData(gl, 'scale', program, 1.2, 1.2);

        const texVertices = new Float32Array([
            -1, -1,
            -1, 1,
            1, 1,
            1, -1,
        ]);
        setAttribData(gl, 'texPosition', program, texVertices);
        createTexture(gl, image);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    }
})();