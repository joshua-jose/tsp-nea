var viewport = document.getElementsByClassName('viewport')[0];
var canvas = document.getElementsByClassName('view-canvas')[0]

var two = new Two({
    autostart: true,
    fitted: true,
    domElement: canvas
}).appendTo(viewport);

window.addEventListener("resize", resize);

var rect;

draw();
resize();

function draw() {
    for (var i = 0; i < 25; ++i) {
        for (var j = 0; j < 25; ++j) {
            let size = 64;
            let spacing = 2;
            let delta = size + spacing;
            var r = two.makeRectangle(i * delta + spacing + size / 2, j * delta + spacing + size / 2, size, size);
            r.fill = 'rgb(255, 255, 0)';
        }
    }

    rect = two.makeRectangle(two.width / 2, two.height / 2, 50, 50);
    rect.fill = 'rgb(255, 100, 100)';
}

two.bind('update', function () {
    rect.rotation += 0.01;
});

function resize() {
    var width = viewport.offsetWidth;
    var height = viewport.offsetHeight;

    var scale = window.devicePixelRatio; // Change to 1 on retina screens to see blurry canvas.

    two.renderer.setSize(width, height);
    canvas.width = width;
    canvas.height = height;

    var ctx = canvas.getContext('2d');
    ctx.scale(1 / scale, 1 / scale);

    rect.translation.set(two.width / 2, two.height / 2);
}

/*
//window.addEventListener('resize', updateCanvas);
//updateCanvas();
function updateCanvas() {
    var canvas = document.getElementsByClassName('view-canvas')[0],
        ctx = canvas.getContext('2d');

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    ctx.fillStyle = 'yellow';
    for (var i = 0; i < 75; ++i) {
        for (var j = 0; j < 75; ++j)
            ctx.fillRect(i * 18 + 2, j * 18 + 2, 16, 16);
    }
}
*/