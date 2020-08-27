(function () {
    const image = new Image();
    image.src = 'tiger.jpg';
    image.onload = function () {
        var canvas = document.createElement('canvas');
        document.body.appendChild(canvas);

        // canvas.width = image.naturalWidth;
        // canvas.height = image.naturalHeight;

        var gl = canvas.getContext('webgl');

        var vertexShaderSource = `
    attribute vec2 position;
    varying vec2 texCoords;

    void main() {
        texCoords = (position + 1.0) / 2.0;
        texCoords.y = 1.0 - texCoords.y;
        texCoords.x = 1.0 - texCoords.x;
        gl_Position = vec4(position, 0, 1.0);
    }
`;

        var fragShaderSource = `
    precision highp float;

    varying vec2 texCoords;

    uniform sampler2D textureSampler;

    void main() {
        float warmth = 0.2;
        float brightness = 0.2;

        vec4 color = texture2D(textureSampler, texCoords);
        // color.r += warmth;
        // color.b -= warmth;

        // color.rgb += brightness;
        color.b=0.0;
        // color.g=0.0;
        color.r=0.0;
        gl_FragColor = color.rgba;
    }
`;

        var vertexShader = gl.createShader(gl.VERTEX_SHADER);
        var fragShader = gl.createShader(gl.FRAGMENT_SHADER);

        gl.shaderSource(vertexShader, vertexShaderSource);
        gl.shaderSource(fragShader, fragShaderSource);

        gl.compileShader(vertexShader);
        gl.compileShader(fragShader);

        var program = gl.createProgram();

        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragShader);

        gl.linkProgram(program);
        gl.useProgram(program);


        const vertices = new Float32Array([
            -1, -1,
            -1, 1,
            1, 1,

            -1, -1,
            1, 1,
            1, -1
        ]);

        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        const positionLocation = gl.getAttribLocation(program, 'position');
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(positionLocation);

        const texture = gl.createTexture();
        // gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
})();