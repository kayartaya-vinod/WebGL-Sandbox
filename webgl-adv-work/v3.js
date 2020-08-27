var index = 0;
var options = [
    {
        img: null,
        canvas: null,
        brightness: 0.0,
        contrast: 0.0,
        angle: 0.0,
        translateX: 0.0,
        translateY: 0.0,
        zoom: 100,
        grayscale: false,
        negative: false,
        mirror: false,
        gridlines: false,
        superImpose: false,
        split: false,
    },
    {
        img: null,
        canvas: null,
        brightness: 0.0,
        contrast: 0.0,
        angle: 0.0,
        translateX: 0.0,
        translateY: 0.0,
        zoom: 100,
        grayscale: false,
        negative: false,
        mirror: false,
        gridlines: false,
        superImpose: false,
        split: false,
    }
];

options[0].canvas = document.createElement('canvas');
$('#canvas_container_1').append(options[0].canvas);
options[1].canvas = document.createElement('canvas');
$('#canvas_container_2').append(options[1].canvas);

$('#canvas_container_1').on('click', function () {
    index = 0;
    $(this).addClass('selected');
    $('#canvas_container_2').removeClass('selected');
    updateUiControls();
});

$('#canvas_container_2').on('click', function () {
    index = 1;
    $(this).addClass('selected');
    $('#canvas_container_1').removeClass('selected');
    updateUiControls();
});

function updateUiControls() {
    $('#brightness').val(options[index].brightness);
    $('#contrast').val(options[index].contrast);
    $('#angle').val(options[index].angle);
    $('#zoom').val(options[index].zoom);
    $('#translateX').val(options[index].translateX);
    $('#translateY').val(options[index].translateY);

    // checkboxes
    $('#grayscale').prop('checked', options[index].grayscale);
    $('#mirror').prop('checked', options[index].mirror);
    $('#negative').prop('checked', options[index].negative);
    $('#gridlines').prop('checked', options[index].gridlines);
    $('#superImpose').prop('checked', options[index].superImpose);
    $('#split').prop('checked', options[index].split);

}

/////// update options[index] values using the UI controllers
// 1. brightness
$('#brightness').on('input', function () {
    options[index].brightness = $(this).val();
    drawImage();
});
// 2. contrast
$('#contrast').on('input', function () {
    options[index].contrast = $(this).val();
    drawImage();
});
// 3. angle
$('#angle').on('input', function () {
    options[index].angle = $(this).val();
    drawImage();
});
// 4. zoom
$('#zoom').on('input', function () {
    options[index].zoom = $(this).val();
    drawImage();
});
// 5. translateX
$('#translateX').on('input', function () {
    options[index].translateX = $(this).val();
    drawImage();
});
// 6. translateY
$('#translateY').on('input', function () {
    options[index].translateY = $(this).val();
    drawImage();
});

// checkboxes
// 7. grayscale
$('#grayscale').on('change', function () {
    options[index].grayscale = $(this).prop('checked');
    drawImage();
});
// 8. negative
$('#negative').on('change', function () {
    options[index].negative = $(this).prop('checked');
    drawImage();
});
// 9. mirror
$('#mirror').on('change', function () {
    options[index].mirror = $(this).prop('checked');
    drawImage();
});
// 10. gridlines
$('#gridlines').on('change', function () {
    options[index].gridlines = $(this).prop('checked');
    drawImage();
});
// 11. superImpose
$('#superImpose').on('change', function () {
    options[index].superImpose = $(this).prop('checked');
    drawImage();
});
// 12. split
$('#split').on('change', function () {
    options[index].split = $(this).prop('checked');
    drawImage();
});
// 13. reset
$('#btnReset').on('click', function () {
    options[index] = {
        ...options[index],
        brightness: 0.0,
        contrast: 0.0,
        angle: 0.0,
        translateX: 0.0,
        translateY: 0.0,
        zoom: 100,
        grayscale: false,
        negative: false,
        mirror: false,
        gridlines: false,
        superImpose: false,
        split: false,
    };
    drawImage();
    updateUiControls();
});


////// draw the picture using the options[index]
function drawImage() {
    var option = options[index];
    var gl = option.canvas.getContext('webgl');

    var vertexSource = $('#vertex').text();
    var fragmentSource = $('#fragment').text();

    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

    var program = createProgram(gl, vertexShader, fragmentShader);
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

    var textureSamplerLocation = gl.getUniformLocation(program, "textureSampler");

    const texture = gl.createTexture();
    gl.uniform1i(textureSamplerLocation, 0);  // texture unit 0

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, option.img);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    const brightnessPosition = gl.getUniformLocation(program, 'brightness');
    const contrastPosition = gl.getUniformLocation(program, 'contrast');
    const grayscalePosition = gl.getUniformLocation(program, 'grayscale');
    const mirrorPosition = gl.getUniformLocation(program, 'mirror');
    const negativePosition = gl.getUniformLocation(program, 'negative');
    const gridlinesPosition = gl.getUniformLocation(program, 'gridlines');

    const translateXPosition = gl.getUniformLocation(program, 'translateX');
    const translateYPosition = gl.getUniformLocation(program, 'translateY');
    const zoomPosition = gl.getUniformLocation(program, 'zoom');
    const superImposePosition = gl.getUniformLocation(program, 'superImpose');
    const splitPosition = gl.getUniformLocation(program, 'split');

    gl.uniform1f(brightnessPosition, option.brightness / 100);
    gl.uniform1f(contrastPosition, option.contrast / 100);
    gl.uniform1i(grayscalePosition, option.grayscale);
    gl.uniform1i(mirrorPosition, option.mirror);
    gl.uniform1i(negativePosition, option.negative);

    gl.uniform1f(translateXPosition, option.translateX / 100);
    gl.uniform1f(translateYPosition, option.translateY / 100);
    gl.uniform1f(zoomPosition, option.zoom / 100);
    gl.uniform1f(gridlinesPosition, option.gridlines);
    gl.uniform1f(superImposePosition, option.superImpose);
    gl.uniform1f(splitPosition, option.split);

    if (option.superImpose === true || option.split === true) {
        const secondaryTexture = gl.createTexture();
        var textureSamplerSecondaryLocation = gl.getUniformLocation(program, "textureSamplerSecondary");
        gl.uniform1i(textureSamplerSecondaryLocation, 1);  // texture unit 1

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, secondaryTexture);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        let canvas = (index == 0) ? options[1].canvas : options[0].canvas;
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);

    }

    var angle = option.angle * Math.PI / 180;
    const cosSinB = new Float32Array([
        Math.cos(angle), -Math.sin(angle),
        Math.sin(angle), Math.cos(angle)
    ]);

    const cosSinBLocation = gl.getUniformLocation(program, 'cosSinB');
    gl.uniformMatrix2fv(cosSinBLocation, false, cosSinB);

    // for gridlines
    // https://stackoverflow.com/questions/24772598/drawing-a-grid-in-a-webgl-fragment-shader
    gl.drawArrays(gl.TRIANGLES, 0, 6);

}

function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log('There is a problem with shader: ', gl.SHADER_TYPE);
        console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);
    return program;
}

$('#canvas_container_1').on('dblclick', function () {
    $('#pic1').click();
});

$('#canvas_container_2').on('dblclick', function () {
    $('#pic2').click();
});


$('#pic1').on('change', function (evt) {
    var img = new Image;
    img.src = evt.target.files[0].name;
    options[0].img = img;
    options[0].canvas.width = $('#canvas_container_1').width();
    options[0].canvas.height = $('#canvas_container_1').height();
    index = 0;
    options[0].img.onload = function () {
        drawImage();
    };
})

$('#pic2').on('change', function (evt) {
    var img = new Image;
    img.src = evt.target.files[0].name;
    options[1].img = img;
    options[1].canvas.width = $('#canvas_container_2').width();
    options[1].canvas.height = $('#canvas_container_2').height();
    index = 1;
    options[1].img.onload = function () {
        drawImage();
    };
});
