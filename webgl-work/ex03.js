var canvas = document.createElement('canvas');
document.body.appendChild(canvas);
var gl = canvas.getContext('webgl');

var vertexShaderSource = `
    attribute vec2 position;

    varying vec2 texCoords;

    void main() {
        texCoords = (position + 1.0) / 2.0;
        gl_Position = vec4(position, 0, 1.0);
    }
`;

var fragShaderSource = `
    precision highp float;
    varying vec2 texCoords;

    void main() {
        gl_FragColor = vec4(texCoords, 1.0, 1.0);
    }
`;

var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
var fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragShaderSource);
var program = createProgram(gl, vertexShader, fragShader);

const vertices = new Float32Array([
    -1, -1,
    -1, 1,
    1, 1,

    -1, -1,
    1, 1,
    1, -1
]);

setAttribData(gl, 'position', program, vertices);


gl.drawArrays(gl.TRIANGLES, 0, 6);