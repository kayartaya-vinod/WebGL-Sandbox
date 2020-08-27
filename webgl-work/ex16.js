var canvas = document.createElement('canvas');
document.body.appendChild(canvas);
var gl = canvas.getContext('webgl');

gl.clearColor(0.4, 0.7, 0.4, 1);
gl.clear(gl.COLOR_BUFFER_BIT);

var vertexShaderSource = `
    attribute vec2 position;
    attribute vec2 texPosition; 
    varying vec2 texCoords;

    void main() {
        texCoords = (position + 1.0) / 2.0;
        gl_Position = vec4(position, 0, 1.0);
        gl_PointSize = 3.0;
    }
`;
var vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexShaderSource);
gl.compileShader(vertexShader);

if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.log('There is a problem with shader: ', gl.SHADER_TYPE);
    console.log(gl.getShaderInfoLog(vertexShader));
    gl.deleteShader(vertexShader);
}

var fragShaderSource = `
    precision highp float;
    varying vec2 texCoords;
    uniform sampler2D textureSampler;

    void main() {
        gl_FragColor = texture2D(textureSampler, texCoords);
    }
`;

var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragShader, fragShaderSource);
gl.compileShader(fragShader);

if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
    console.log('There is a problem with shader: ', gl.SHADER_TYPE);
    console.log(gl.getShaderInfoLog(fragShader));
    gl.deleteShader(fragShader);
}
var program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragShader);
gl.linkProgram(program);
gl.useProgram(program);

var n = initBuffers();

// Specify the color for clearing <canvas>
gl.clearColor(0, 0, 0, 1);
gl.clear(gl.COLOR_BUFFER_BIT);

const image = new Image();
image.onload = function(){
    initTexture(gl, image);
    draw();
};
image.src = './tiger.jpg';


function draw() {
    // Draw a line
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
}


function initBuffers() {
    var vertexBuffer = gl.createBuffer(),
        vertices = [],
        vertCount = 2;
    for (var i = 0.0; i <= 360; i += 1) {
        // degrees to radians
        var j = i * Math.PI / 180;
        // X Y Z
        var vert1 = [
            Math.sin(j),
            Math.cos(j),
            // 0,
        ];
        var vert2 = [
            0,
            0,
            // 0,
        ];
        // DONUT:
        // var vert2 = [
        //   Math.sin(j)*0.5,
        //   Math.cos(j)*0.5,
        // ];
        vertices = vertices.concat(vert1);
        vertices = vertices.concat(vert2);
    }
    var n = vertices.length / vertCount;
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    var aPosition = gl.getAttribLocation(program, 'position');
    gl.vertexAttribPointer(aPosition, vertCount, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);

    return n;
}

function initTexture(gl, image) {
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
}