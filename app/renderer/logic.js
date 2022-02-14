import { setChartPoints, setChartPath } from './renderer.js';
import { UISetPlaying, UISetStop } from './ui.js';
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

let chartPoints = [];
let chartPath = [];

$('#repeatButton').click(function () {
    window.tspAPI.tspRestart();
});

$('#generateButton').click(function () {
    UISetStop();
    runAlgo = false;
    window.tspAPI.tspStop();

    chartPoints = generatePoints(11);
    setChartPoints(chartPoints);
    setChartPath([], chartPoints);
});

var runAlgo = false;
$('#runButton').click(function () {
    if (!runAlgo) {
        UISetPlaying();
        runAlgo = true;
        var algorithm = $('#algorithmSelect').val();

        // temporary mask of brute force delay
        if (algorithm === "Brute Force")
            setChartPath(generatePath(chartPoints.length), chartPoints);


        window.tspAPI.tspStart({ points: chartPoints, algorithm: algorithm });
    }
    else {
        UISetStop();
        runAlgo = false;
        window.tspAPI.tspStop();
    };
});

window.tspAPI.addEventListener('tspSetPath', message => {
    setChartPath(message.path, chartPoints);
})

window.tspAPI.addEventListener('tspDone', message => {
    UISetStop();
    runAlgo = false;
})

window.tspAPI.addEventListener('tspAlgorithms', message => {
    console.log(message.algorithms);
    updateAlgorithms(message.algorithms);
    //UISetStop();
    //runAlgo = false;
})

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
