import { setChartPoints, setChartPath, getChartCoordinates, changeUpdateDelay, isDoneUpdating, rendererStop } from './renderer.js';
import { UISetPlaying, UISetStop, UISetTime } from './ui.js';
// --------------------------------------------------------------------------------------------------

function rand(min, max) {
    return min + Math.random() * (max - min);
}

// creates random points
function generatePoints(count) {
    var min = 0;
    var max = 1;

    var data = [];
    var i, xvalue, yvalue;

    for (i = 0; i < count; ++i) {
        xvalue = rand(min, max);
        yvalue = rand(min, max);
        data.push([xvalue, yvalue]);
    }

    return data;
}

// generates a range and shuffles it
function generatePath(n) {
    var path = [...Array(n).keys()];
    shuffle(path);
    return path;
}

// shuffles an array
function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}
// --------------------------------------------------------------------------------------------------

/*
 * Logo: circle background with TSP nodes and connections over it
 * python: use threading to be able to pause execution
 * get list of algorithms from python and use that to create option select
 * either add fullscreen support or disable fullscreening
 * lock controls while spawning process
 */

// place button icons for on state and off state
let placeIconOffClass = 'bi-cursor';
let placeIconOnClass = 'bi-cursor-fill';

let chartPoints = []; // array of points
let numberRandom = 8; // number of random points
let placingPoints = false; // are we placing points?
let runAlgo = false; // is the solver running a calculation?
let startTime = 0;
let elapsedTime = 0;

// set the number of random points based on the slider value.
// update when the slider is moved
let rpSlider = $("#randomPoints").slider({});
rpSlider.on("slide", function (sliderValue) {
    //document.getElementById("ex6SliderVal").textContent = sliderValue;
    numberRandom = sliderValue.value;
});

// clear the path when reset button is pressed
$('#repeatButton').click(function () {
    //window.tspAPI.tspRestart();
    setChartPath([], chartPoints);
});

// When the generator button is pressed, stop all calculations. 
// Generate a new set of points, and clear the path 
$('#generateButton').click(function () {
    UISetStop();
    rendererStop();
    window.tspAPI.tspStop();
    runAlgo = false;

    chartPoints = generatePoints(numberRandom);
    setChartPoints(chartPoints);
    setChartPath([], chartPoints);
});

// when the speed slider is updated, calculate a new update delay, and set it
$('#speedRange').change(function () {
    let val = $('#speedRange').val();
    // (100-val) slider is 0-100, change to 100-0, so lowest delay (fastest speed) is on the right
    // (*10)     remap range to 1000-0, so 1000ms is max delay 
    let newDelay = (100 - val) * 10;
    console.log(newDelay);
    changeUpdateDelay(newDelay);
});

$('#placePointsButton').click(function () {
    placingPoints = !placingPoints;

    let placeIcon = $('#placePointsButton > i');

    if (placingPoints) {
        placeIcon.removeClass(placeIconOffClass);
        placeIcon.addClass(placeIconOnClass);
    }
    else {
        placeIcon.removeClass(placeIconOnClass);
        placeIcon.addClass(placeIconOffClass);
    }
});

$('#clearPointsButton').click(function () {
    chartPoints = [];
    setChartPoints(chartPoints);
    runAlgo = false;
});

$('#view-canvas').mousedown(function (evt) {
    //console.log(evt.offsetX + "," + evt.offsetY);
    let [x, y] = getChartCoordinates(evt.offsetX, evt.offsetY);

    if (placingPoints) {
        chartPoints.push([x, y]);
        setChartPoints(chartPoints);
    }
    //setChartPath(generatePath(chartPoints.length), chartPoints);
});

$('#runButton').click(function () {
    if (isDoneUpdating()) {
        UISetPlaying();
        var algorithm = $('#algorithmSelect').val();

        // temporary mask of brute force delay
        if (algorithm === "Brute Force")
            setChartPath(generatePath(chartPoints.length), chartPoints);

        runAlgo = true;
        window.tspAPI.tspStart({ points: chartPoints, algorithm: algorithm });
        startTime = Date.now();
        elapsedTime = 0;
    }
    else {
        UISetStop();
        rendererStop();
        window.tspAPI.tspStop();
    };
});

window.tspAPI.addEventListener('tspSetPath', message => {
    setChartPath(message.path, chartPoints);
})

window.tspAPI.addEventListener('tspDone', message => {
    //UISetStop();
    elapsedTime = Date.now() - startTime;
    UISetTime(elapsedTime);
    runAlgo = false;
})

window.tspAPI.addEventListener('tspAlgorithms', message => {
    console.log(message.algorithms);
    updateAlgorithms(message.algorithms);
    //UISetStop();
    //runAlgo = false;
})

export function algoIsDone() {
    return !runAlgo;
}

function updateAlgorithms(algorithms) {
    var selectBox = $('#algorithmSelect');
    selectBox.empty();
    console.log(algorithms);
    algorithms.forEach(name =>
        selectBox.append(new Option(name))
    );
}

function logicMain() {
    var n = 8;
    chartPoints = generatePoints(n);
    setChartPoints(chartPoints);
    setChartPath(generatePath(n), chartPoints);
    //updateAlgorithms(tspAPI.tspGetAlgorithms());

}
$(document).ready(logicMain);
