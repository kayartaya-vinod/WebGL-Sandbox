const image = new Image();
let scaleLevel = 1;
function start() {
    image.src = 'tiger.jpg';
    image.onload = function () { paint(scaleLevel); };
}

function paint(n) {
    const c1 = document.getElementById('c1');
    var gl = c1.getContext('webgl');

    var vertexShaderSource = `
    attribute vec2 position;
    attribute vec2 texPosition; 
    varying vec2 texCoords;

    void main() {
        texCoords = (texPosition + 1.0) / 2.0;
        
        // mirror on y axis
        // texCoords.y = 1.0 - texCoords.y;
        
        // mirror on x-axis
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
        // color.b=0.0;
        // color.g=0.0;
        // color.r=0.0;
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
        -n, -n,   // left-bottom
        -n, n,    // left-top
        n, n,     // right-top

        -n, -n,   // left-bottom
        n, n,     // right-top
        n, -n     // right-bottom
    ]);

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLocation);

    const texVertices = new Float32Array([
        -1, -1,
        -1, 1,
        1, 1,

        -1, -1,
        1, 1,
        1, -1
    ]);
    const texVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, texVertices, gl.STATIC_DRAW);

    const texPositionLocation = gl.getAttribLocation(program, 'texPosition');
    gl.enableVertexAttribArray(texPositionLocation);
    gl.vertexAttribPointer(texPositionLocation, 2, gl.FLOAT, false, 0, 0);

    const texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 6);
}

start();
