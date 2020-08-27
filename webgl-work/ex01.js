var canvas = document.createElement('canvas');
document.body.appendChild(canvas);
var gl = canvas.getContext('webgl');

gl.clearColor(0.4, 0.7, 0.4, 1);
gl.clear(gl.COLOR_BUFFER_BIT);

var vertexShaderSource = `
    attribute vec2 position;

    void main() {
        gl_Position = vec4(position, 0, 1.0);
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

const vertices = new Float32Array([
    -0.7, -0.7,
    -0.7, 0.7,
    0.7, 0.7,
    -0.5, -0.7,
    0.7, 0.5,
    0.7, -0.7
]);

const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
const positionLocation = gl.getAttribLocation(program, 'position');
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(positionLocation);


// gl.drawArrays(gl.POINTS, 0, 6); // set gl_PointSize in vertex shader
// gl.drawArrays(gl.LINES, 0, 6);
// gl.drawArrays(gl.LINE_STRIP, 0, 6);
// gl.drawArrays(gl.LINE_LOOP, 0, 6);
// gl.drawArrays(gl.TRIANGLES, 0, 6);
// gl.drawArrays(gl.TRIANGLE_STRIP, 0, 6);
gl.drawArrays(gl.TRIANGLE_FAN, 0, 6);

