let outer = document.getElementById('sidebar-collapse'),
    wrapper = document.getElementById('sidebar'),
    maxWidth = outer.scrollWidth,
    maxHeight = outer.scrollHeight;

let runIconClass = 'bi-play-fill';
let pauseIconClass = 'bi-pause-fill';

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

function UISetPlaying() {
    var runIcon = $('#runButton > i');
    var spinner = $('#repeatButton > .spinner-border');
    var repeatIcon = $('#repeatButton > i');

    runIcon.removeClass(runIconClass);
    runIcon.addClass(pauseIconClass);

    repeatIcon.css("display", "none");
    spinner.css('display', 'block');
}

function UISetStop() {
    var runIcon = $('#runButton > i');
    var spinner = $('#repeatButton > .spinner-border');
    var repeatIcon = $('#repeatButton > i');

    runIcon.removeClass(pauseIconClass);
    runIcon.addClass(runIconClass);

    repeatIcon.css('display', 'block');
    spinner.css('display', 'none');
}

$(document).ready(function () {
    /*
    $('[data-toggle="tooltip"]').tooltip({
        offset: setOffset
    });
    */
    setSidebarOffset(1);
    window.electron.windowTriggerResizeEvent();
    //window.addEventListener("resize", barResize);
    //barResize();
});

$('#min-button').click(function () {
    window.electron.windowMinimize();
})
$('#max-button').click(function () {
    window.electron.windowMaxToggle();
})
$('#restore-button').click(function () {
    window.electron.windowMaxToggle();
})
$('#close-button').click(function () {
    window.electron.windowClose();
})

window.electron.addMaxMinEventListener(function (isMaximized) {
    if (isMaximized) {
        $('body').addClass('maximized');
    } else {
        $('body').removeClass('maximized');
    }
})