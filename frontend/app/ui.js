let outer = document.getElementById('sidebar-collapse'),
    wrapper = document.getElementById('sidebar'),
    maxWidth = outer.scrollWidth,
    maxHeight = outer.scrollHeight;


function barResize() {
    let scale,
        width = window.innerWidth,
        height = window.innerHeight,
        isMax = width >= maxWidth && height >= maxHeight;

    scale = Math.min(width / maxWidth, height / maxHeight);
    outer.style.transform = isMax ? '' : 'scale(' + scale + ')';
    wrapper.style.width = isMax ? '' : maxWidth * scale;
    wrapper.style.height = isMax ? '' : maxHeight * scale;


    if (!isMax) {
        setSidebarOffset(scale);
    }
}

function setSidebarOffset(scale) {
    var offset = $('#sidebar-toggle').outerHeight() * scale;
    var padding = parseInt($('#sidebar-toggle').css('paddingTop'));

    $('#sidebar-collapse').css('margin-top', -offset);
    $('#title-text-box').css('height', offset - padding);
}

$(document).ready(function () {
    setSidebarOffset(1);
    //window.addEventListener("resize", barResize);
    //barResize();
});
