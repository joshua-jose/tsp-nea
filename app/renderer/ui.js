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

export function UISetPlaying() {
    var runIcon = $('#runButton > i');
    var spinner = $('#repeatButton > .spinner-border');
    var repeatIcon = $('#repeatButton > i');

    runIcon.removeClass(runIconClass);
    runIcon.addClass(pauseIconClass);

    repeatIcon.css("display", "none");
    spinner.css('display', 'block');
}

export function UISetStop() {
    var runIcon = $('#runButton > i');
    var spinner = $('#repeatButton > .spinner-border');
    var repeatIcon = $('#repeatButton > i');

    runIcon.removeClass(pauseIconClass);
    runIcon.addClass(runIconClass);

    repeatIcon.css('display', 'block');
    spinner.css('display', 'none');
}

// time in ms
export function UISetTime(time) {
    var timeTakenText = $('#timeTakenText');
    var seconds = Math.round(time) / 1000

    timeTakenText.text(`${seconds}s`);
}

$(document).ready(function () {
    /*
    $('[data-toggle="tooltip"]').tooltip({
        offset: setOffset
    });
    */
    setSidebarOffset(1);

    // This exists to get the maximised status when the webpage is loaded
    if (window.electron.windowIsMazimized())
        $('body').addClass('maximized');

    //window.addEventListener("resize", barResize);
    //barResize();
});

$('#min-button').click(() => window.electron.windowMinimize());
$('#max-button').click(() => window.electron.windowMaxToggle());
$('#restore-button').click(() => window.electron.windowMaxToggle());
$('#close-button').click(() => window.electron.windowClose());

window.electron.addMaxEventListener(function (isMaximized) {
    if (isMaximized) {
        $('body').addClass('maximized');
    } else {
        $('body').removeClass('maximized');
    }
})

/*
module.exports = {
    barResize: barResize,
    setSidebarOffset: setSidebarOffset,
    UISetPlaying: UISetPlaying,
    UISetStop: UISetStop
}
*/