var vertSource, fragSource;
vertSource = $('#vertex').text();
fragSource = $('#fragment').text();

var canvas1 = document.createElement('canvas');
var canvas2 = document.createElement('canvas');

$('#canvas1').append(canvas1);
$('#canvas2').append(canvas2);

canvas1.width = $('#canvas1').width();
canvas1.height = $('#canvas1').height();
canvas2.width = $('#canvas2').width();
canvas2.height = $('#canvas2').height();

function paintImageOnCanvas(img, canvas) {
    var gl = canvas.getContext('webgl');
    
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertSource);
    gl.shaderSource(fragShader, fragSource);

    gl.compileShader(vertexShader);
    gl.compileShader(fragShader);

    var program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragShader);
    
    gl.linkProgram(program);
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

    const texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    applyBrightness(gl, program);
    applyContrast(gl, program);
    applyScale(gl, program);
    
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

var currentCanvas;
var currentImage;
var img1, img2;

$('#pic1').on('change', function (evt) {
    img1 = new Image();
    img1.src = evt.target.files[0].name;
    img1.onload = function () {
        paintImageOnCanvas(img1, currentCanvas);
    };
    currentImage = img1;

})

$('#pic2').on('change', function (evt) {
    img2 = new Image();
    img2.src = evt.target.files[0].name;
    img2.onload = function () {
        paintImageOnCanvas(img2, currentCanvas);
    };
    currentImage = img2;
});

canvas1.addEventListener('dblclick', function () {
    currentCanvas = canvas1;
    $('#pic1').click();
});

canvas2.addEventListener('dblclick', function () {
    currentCanvas = canvas2;
    $('#pic2').click();
});

canvas1.addEventListener('click', function () {
    currentCanvas = canvas1;
    currentImage = img1;
    $('#canvas1').addClass('selected');
    $('#canvas2').removeClass('selected');
});

canvas2.addEventListener('click', function () {
    currentCanvas = canvas2;
    currentImage = img2;
    $('#canvas2').addClass('selected');
    $('#canvas1').removeClass('selected');
});

function repaint() {
    paintImageOnCanvas(currentImage, currentCanvas);
}



var brightnessLevel = 0.0;
var contrastLevel = 0.0;
var scaleLevel = 0.0;

function applyScale(gl, program) {
    var uniScale = gl.getUniformLocation(program, 'scale');
    gl.uniform1f(uniScale, scaleLevel);
}

function applyBrightness(gl, program) {
    var uniBrightness = gl.getUniformLocation(program, 'brightness');
    gl.uniform1f(uniBrightness, brightnessLevel);
}

function applyContrast(gl, program) {
    var uniContrast = gl.getUniformLocation(program, 'contrast');
    gl.uniform1f(uniContrast, contrastLevel);
}

$('#brightnessRange').on('input', function () {
    brightnessLevel = $(this).val() / 100.0;
    repaint();
});
$('#contrastRange').on('input', function () {
    contrastLevel = $(this).val() / 100.0;
    repaint();
});


console.log('controls.js')



$('#canvas1').on('mousewheel', function(evt) {
   if (evt.originalEvent.wheelDelta >= 0){
       // down
       scaleLevel -=0.01;
    } else {
        // up
        scaleLevel +=0.01;
   }
   repaint();
});
