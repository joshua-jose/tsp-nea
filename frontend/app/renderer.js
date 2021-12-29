var viewport = document.getElementsByClassName('viewport')[0];
var canvas = document.getElementsByClassName('view-canvas')[0]
var ctx = canvas.getContext('2d');
var rect;

var two = new Two({
    autostart: true,
    fitted: true,
    domElement: canvas
}).appendTo(viewport);

// Set up event listeners
//window.addEventListener("resize", resize);
new ResizeObserver(resize).observe(viewport);

two.bind('update', function () {
    rect.rotation += 0.01;
});

// set up once
draw();
resize();

function draw() {
    for (var i = 0; i < 25; ++i) {
        for (var j = 0; j < 25; ++j) {
            let size = 64;
            let spacing = 2;
            let delta = size + spacing;
            var r = two.makeRectangle(i * delta + size / 2, j * delta + size / 2, size, size);
            r.fill = 'rgb(255, 255, 0)';
        }
    }

    rect = two.makeRectangle(two.width / 2, two.height / 2, 50, 50);
    rect.fill = 'rgb(255, 100, 100)';
}
function resize() {
    var width = viewport.offsetWidth;
    var height = viewport.offsetHeight;

    var scale = window.devicePixelRatio; // Change to 1 on retina screens to see blurry canvas.

    two.renderer.setSize(width, height);
    canvas.width = width;
    canvas.height = height;

    ctx.scale(1 / scale, 1 / scale);

    rect.translation.set(two.width / 2, two.height / 2);
    two.update();
}


let outer = document.getElementById('sidebar-collapse'),
    wrapper = document.getElementById('sidebar'),
    maxWidth = outer.offsetWidth,
    maxHeight = outer.offsetHeight;

window.addEventListener("resize", barResize);
resize();

function barResize() {
    let scale,
        width = window.innerWidth,
        height = window.innerHeight,
        isMax = width >= maxWidth && height >= maxHeight;

    scale = Math.min(width / maxWidth, height / maxHeight);
    outer.style.transform = isMax ? '' : 'scale(' + scale + ')';
    wrapper.style.width = isMax ? '' : maxWidth * scale;
    wrapper.style.height = isMax ? '' : maxHeight * scale;

    // This code is a duplicate of inline code in the sidebar
    if (!isMax) {
        var offset = $('#sidebar-toggle').outerHeight() * scale;
        var padding = parseInt($('#sidebar-toggle').css('paddingTop'));

        $('#sidebar-collapse').css('margin-top', -offset);
        $('#title-text-box').css('height', offset - padding);
    }
}