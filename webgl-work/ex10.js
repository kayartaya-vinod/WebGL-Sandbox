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
                vec4 color = texture2D(textureSampler, texCoords);
                
                // color.r = color.r>.6 ? 1.0: color.r;
                // color.g = color.g>.6 ? 1.0: color.g;
                // color.b = color.b>.6 ? 1.0: color.b;
                
                // color.r = 1.0-color.r;
                // color.g = 1.0-color.g;
                // color.b = 1.0-color.b;

                // color.b = 0.0;
                // color.g = 0.0;
                
                // gl_FragColor = mix(color, color.rbga, 1.0);
                // gl_FragColor = color * vec4(vec3(0.25), 1.0);
                // gl_FragColor = step(0.6, color);
                // gl_FragColor = smoothstep(0.4, 1.0, color);
                
                // color = color.r > 0.5 && color.g > 0.5 && 
                //     color.b > 0.5 ? vec4(1.0): vec4(vec3(0.2), 1.0);
                // gl_FragColor = color;
                
                gl_FragColor = color;
            }
        `;

        var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        var fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragShaderSource);
        var program = createProgram(gl, vertexShader, fragShader)

        const vertices = new Float32Array([
            -1, -1,
            -1, 1,
            1, 1,

            -1, -1,
            1, 1,
            1, -1
        ]);

        setAttribData(gl, 'position', program, vertices);

        const texture = gl.createTexture();
        // gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
})();