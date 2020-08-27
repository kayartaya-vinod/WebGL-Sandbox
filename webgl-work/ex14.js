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
        attribute vec4 position;
        attribute vec2 texPosition;
        varying vec2 texCoords;
        uniform mat4 rotationMatrix;

        void main() {
            texCoords = (texPosition + 1.0) / 2.0;
            gl_Position = rotationMatrix * position ;
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

        const angle = 20.0;
        const radian = Math.PI * angle / 180.0;
        const cosTheta = Math.cos(radian);
        const sinTheta = Math.sin(radian);
        const rotationMatrix = new Float32Array([
            cosTheta, sinTheta, 0, 0, 
            -sinTheta, cosTheta, 0, 0, 
            0, 0, 1, 0, 
            0, 0, 0, 1, 
        ]);
        gl.uniformMatrix4fv(gl.getUniformLocation(program, 'rotationMatrix'), false, rotationMatrix);

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