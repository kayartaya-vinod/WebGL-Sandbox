var canvas = document.createElement('canvas');
document.body.appendChild(canvas);
var gl = canvas.getContext('webgl');


var vertexShaderSource = `
    attribute vec2 position;

    void main() {
        gl_Position = vec4(position, 0, 1.0);
        gl_PointSize = 10.0;
    }
`;

var fragShaderSource = `
    void main() {
        gl_FragColor = vec4(0.9, 0.1, 1.0, 1.0);
    }
`;

const vertices = new Float32Array([
    -1, -1,
    -.5, .5,
    1, 1,

    -1, -1,
    0.2, 0,
    0.5, -1,

    0.5, -1,
    0.75, 0.8,
    1, -1
]);

const triangleVertices = new Float32Array([
    -0.75, -0.75,
    -0.75, 0.0,
    0.0, 0.0
]);

const lineVertices = new Float32Array([
    0.75, 0.0,
    0.0, -0.75
]);

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragShaderSource);
const program = createProgram(gl, vertexShader, fragShader);
// setAttribData(gl, 'position', program, vertices);

// gl.drawArrays(gl.TRIANGLES, 0, 9);
// gl.drawArrays(gl.TRIANGLE_FAN, 0, 9);
// gl.drawArrays(gl.LINES, 0, 9);
// gl.drawArrays(gl.LINE_LOOP, 0, 9);
// gl.drawArrays(gl.POINTS, 0, 9);

drawGeometry(gl.POINTS, vertices);
drawGeometry(gl.TRIANGLES, triangleVertices);
drawGeometry(gl.LINES, lineVertices);

function drawGeometry(type, vertices) {
    setAttribData(gl, 'position', program, vertices);
    gl.drawArrays(type, 0, vertices.length / 2);
}