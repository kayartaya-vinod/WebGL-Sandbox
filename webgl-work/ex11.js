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
            attribute vec2 translate;
            attribute vec2 texPosition;
            varying vec2 texCoords;

            void main() {
                texCoords = (texPosition + 1.0) / 2.0;
                texCoords.y = 1.0 - texCoords.y;
                texCoords.x = 1.0 - texCoords.x;
                gl_Position = vec4(position+translate, 0, 1.0);
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

        const translateVertices = new Float32Array([
            0.25, 0.25,
            0.0, 0.0,
            0.0, 0.0,
            0.0, 0.0
        ]);
        setAttribData(gl, 'translate', program, translateVertices);

        const texVertices = new Float32Array([
            -1, -1,
            -1, 1,
            1, 1,
            1, -1,
        ]);
        setAttribData(gl, 'texPosition', program, texVertices);

        const texture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    }
})();