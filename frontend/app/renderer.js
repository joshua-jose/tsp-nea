// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

var canvas = document.getElementsByClassName('view-canvas')[0],
    ctx = canvas.getContext('2d');

fitToContainer(canvas);
ctx.fillStyle = 'yellow';
for (var i = 0; i < 75; ++i) {
    for (var j = 0; j < 75; ++j)
        ctx.fillRect(i * 18 + 2, j * 18 + 2, 16, 16);
}

function fitToContainer(canvas) {
    //canvas.width = canvas.offsetWidth;
    //canvas.height = canvas.offsetHeight;
    canvas.width = 1024;
    canvas.height = 1024;
}
