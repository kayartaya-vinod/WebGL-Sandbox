const image = new Image();
function createProgram(gl, vs, fs) {
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vs);
    gl.shaderSource(fragShader, fs);

    gl.compileShader(vertexShader);
    gl.compileShader(fragShader);

    const program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragShader);

    gl.linkProgram(program);
    gl.useProgram(program);

    return program;
}
function start() {
    image.src = 'tiger.jpg';
    image.onload = paint;
}

function paint() {
    const c1 = document.getElementById('c1');
    var gl = c1.getContext('webgl', { preserveDrawingBuffer: true });

    var vertexShaderSource = `
    attribute vec2 position;
    attribute vec2 texPosition; 
    varying vec2 texCoords;

    void main() {
        texCoords = (texPosition + 1.0) / 2.0;
        gl_Position = vec4(position, 0, 1.);
    }
`;

    var fragShaderSource = `
    precision highp float;

    varying vec2 texCoords;
    uniform sampler2D textureSampler;

    void main() {
        vec4 color = texture2D(textureSampler, texCoords);
        gl_FragColor = color.rgba;
    }
`;

    var program = createProgram(gl, vertexShaderSource, fragShaderSource);

    const vertices = new Float32Array([
        -1, -1,   // left-bottom
        -1, 1,    // left-top
        1, 1,     // right-top

        -1, -1,   // left-bottom
        1, 1,     // right-top
        1, -1     // right-bottom
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
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 6);
    
}

start();

var crop = function (canvas, offsetX, offsetY, width, height, callback) {
    // create an in-memory canvas
    var buffer = document.createElement('canvas');
    var b_ctx = buffer.getContext('2d');
    // set its width/height to the required ones
    buffer.width = width;
    buffer.height = height;
    // draw the main canvas on our buffer one
    // drawImage(source, source_X, source_Y, source_Width, source_Height, 
    //  dest_X, dest_Y, dest_Width, dest_Height)
    b_ctx.drawImage(canvas, offsetX, offsetY, width, height,
        0, 0, buffer.width, buffer.height);
    // now call the callback with the dataURL of our buffer canvas
    callback(buffer.toDataURL());
};

function cropButtonHandler() {
    // require {preserveDrawingBuffer: true} while initializing
    // var gl = c1.getContext('webgl', {preserveDrawingBuffer: true});

    let canvas = document.getElementById('c1');

    crop(canvas, 100, 70, 70, 70, function (data) {
        document.getElementById('out').src = data;
    })
}