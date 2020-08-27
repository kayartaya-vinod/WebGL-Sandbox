(async function () {

    let resp = await fetch('./vs.vert');
    const vs = await resp.text();
    resp = await fetch('./fs.frag');
    const fs = await resp.text();



    const canvas = document.getElementById('canvas');
    const gl = canvas.getContext('webgl');

    if (!gl) {
        throw new Error('No support for WebGL');
    }

    const { mat4 } = glMatrix;
    let matrix = mat4.create();
    mat4.translate(matrix, matrix, [2, 5, 1]);
    mat4.translate(matrix, matrix, [-1, -3, 0]);

    console.log(matrix);

    const vertexData = [
        0, 1, 0,
        1, -1, 0,
        -1, -1, 0
    ];

    const colorData = [
        1, 0, 0,
        0, 1, 0,
        0, 0, 1
    ];

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vs);
    gl.compileShader(vertexShader);

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fs);
    gl.compileShader(fragmentShader);

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

    const colorLocation = gl.getAttribLocation(program, 'color');
    gl.enableVertexAttribArray(colorLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);


    gl.useProgram(program);

    console.log('gl.getAttribLocation(program, \'position\')', gl.getAttribLocation(program, 'position'));
    console.log('gl.getAttribLocation(program, \'color\')', gl.getAttribLocation(program, 'color'));

    gl.drawArrays(gl.TRIANGLES, 0, 3);
})();