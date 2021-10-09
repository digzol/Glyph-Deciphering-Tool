let canvas, ctx, w, h, prevX, prevY, currX, currY;
let isDrawing = false;
let penSize = 5;
let style = "white";

function drawStroke(x, y, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = penSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = style;
    ctx.stroke();
    ctx.closePath();
}

function onDrawingGlyph(e) {
    if (!isDrawing) return;

    prevX = currX;
    prevY = currY;
    currX = e.pageX - canvas.offsetLeft;
    currY = e.pageY - canvas.offsetTop;

    drawStroke(prevX, prevY, currX, currY);
}

function onStartDrawingGlyph(e) {
    e.preventDefault();
    isDrawing = true;

    currX = e.pageX - canvas.offsetLeft;
    currY = e.pageY - canvas.offsetTop;
    prevX = currX;
    prevY = currY;

    drawStroke(prevX, prevY, prevX, prevY);
}

function onResumeDrawingGlyph(e) {
    if (!isDrawing) return;

    prevX = currX;
    prevY = currY;
    currX = e.pageX - canvas.offsetLeft;
    currY = e.pageY - canvas.offsetTop;
}

function onStopDrawingGlyph() {
    isDrawing = false;
}

$(document).ready(function () {
    let $drawingCanvas = $('#drawing-glyph-canvas');
    $drawingCanvas
        .on('mousemove', onDrawingGlyph)
        .on('mousedown', onStartDrawingGlyph)
        .on('mouseup', onStopDrawingGlyph)
        .on('mouseenter', onResumeDrawingGlyph);

    $(document).on('mousedown', function (e) {
        if (isDrawing) e.preventDefault();
    }).on('mouseup', onStopDrawingGlyph);

    $(window).on('blur', function (e) {
        onStopDrawingGlyph(e);
    });

    canvas = $drawingCanvas[0];
    ctx = canvas.getContext("2d");
});