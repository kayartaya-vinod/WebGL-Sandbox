var canvas = document.createElement('canvas');
document.body.appendChild(canvas);
var gl = canvas.getContext('webgl');

gl.clearColor(0.4, 0.7, 0.4, 1);
gl.clear(gl.COLOR_BUFFER_BIT);

canvas.onmousedown = mousedownHandler;

var vertexShaderSource = `
    attribute vec4 position;

    void main() {
        gl_Position = position; //vec4(position, 0, 1.0);
        gl_PointSize = 10.0;
    }
`;
var vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexShaderSource);
gl.compileShader(vertexShader);

var fragShaderSource = `
    void main() {
        gl_FragColor = vec4(0.9, 0.1, 1.0, 1.0);
    }
`;

var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragShader, fragShaderSource);
gl.compileShader(fragShader);

var program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragShader);
gl.linkProgram(program);
gl.useProgram(program);

var points = [];

function mousedownHandler(evt) {
    var x = event.clientX,
        y = event.clientY,
        midX = canvas.width / 2,
        midY = canvas.height / 2,
        rect = evt.target.getBoundingClientRect();

    x = ((x - rect.left) - midX) / midX;
    y = (midY - (y - rect.top)) / midY;
    points.push(x, y);
    draw();
}

function draw() {
    var aPosition = gl.getAttribLocation(program, 'position');
    gl.clear(gl.COLOR_BUFFER_BIT);

    var len = points.length;
    for (var i = 0; i < len; i+=2) {
        // Pass the position of a point to a_Position variable
        gl.vertexAttrib3f(aPosition, points[i], points[i+1], 0.0, 1);
        // Draw
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}

function draw1() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    const vertices = new Float32Array(points);
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLocation);

    // Draw
    gl.drawArrays(gl.LINE_STRIP, 0, points.length / 2);
}