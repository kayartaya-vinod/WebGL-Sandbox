(function () {
    const image = new Image();
    image.src = 'neg3.jpg';
    image.onload = function () {
        var canvas = document.createElement('canvas');
        document.body.appendChild(canvas);

        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;

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
    uniform float kernel[9];
    uniform sampler2D textureSampler;
    uniform vec2 u_textureSize;
    uniform float u_kernelWeight;

    void main() {
        float warmth = 0.2;
        float brightness = 0.2;
        vec2 onePixel = vec2(1.0, 1.0) / u_textureSize;
        vec4 colorSum =
            texture2D(textureSampler, texCoords + onePixel * vec2(-1, -1)) * kernel[0] +
            texture2D(textureSampler, texCoords + onePixel * vec2( 0, -1)) * kernel[1] +
            texture2D(textureSampler, texCoords + onePixel * vec2( 1, -1)) * kernel[2] +
            texture2D(textureSampler, texCoords + onePixel * vec2(-1,  0)) * kernel[3] +
            texture2D(textureSampler, texCoords + onePixel * vec2( 0,  0)) * kernel[4] +
            texture2D(textureSampler, texCoords + onePixel * vec2( 1,  0)) * kernel[5] +
            texture2D(textureSampler, texCoords + onePixel * vec2(-1,  1)) * kernel[6] +
            texture2D(textureSampler, texCoords + onePixel * vec2( 0,  1)) * kernel[7] +
            texture2D(textureSampler, texCoords + onePixel * vec2( 1,  1)) * kernel[8] ;
    
        vec4 color = vec4((colorSum / u_kernelWeight).rgb, 1);
        color.r = 1.0 - color.r;
        color.g = 1.0 - color.g;
        color.b = 1.0 - color.b;
        gl_FragColor = color;

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


        const kernelEmbose = [
            -2, -1, 0,
            -1, 1, 1,
            0, 1, 2

            // sharpen
            // 0,-1, 0,
            // -1, 5,-1,
            //  0,-1, 0


            // -1, -1, -1,
            // -1, 9, -1,
            // -1, -1, -1
        ];
        var textureSizeLocation = gl.getUniformLocation(program, "u_textureSize");
        gl.uniform2f(textureSizeLocation, image.width, image.height);

        const kernelLocation = gl.getUniformLocation(program, 'kernel[0]');
        gl.uniform1fv(kernelLocation, kernelEmbose);
        var kernelWeightLocation = gl.getUniformLocation(program, "u_kernelWeight");
        gl.uniform1f(kernelWeightLocation, computeKernelWeight(kernelEmbose));

        function computeKernelWeight(kernel) {
            var weight = kernel.reduce(function (prev, curr) {
                return prev + curr;
            });
            return weight <= 0 ? 1 : weight;
        }

        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
})();