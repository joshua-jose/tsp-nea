// Data & logic section
var chartPoints = [[0, 1], [1, 2], [3, 4], [5, 6]];
var chartPath = [0, 1, 2, 3];

// --------------------------------------------------------------------------------------------------

function rand(min, max) {
    return min + Math.random() * (max - min);
}

// creates random points
function generatePoints() {
    var min = 0;
    var max = 1;
    var count = 8;

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

runAlgo = false;
function testAlgo() {
    if (!runAlgo) return;

    chartPath = generatePath(8);
    setChartPath(chartPath);

    setTimeout(testAlgo, 750);
}

$('#generateButton').click(function () {
    chartPoints = generatePoints();
    setChartPoints(chartPoints);
    setChartPath([]);
    window.postMessage({
        ipcMessage: 'tspMessage',
        someData: 123,
    });
});


$('#runButton').click(function () {
    if (!runAlgo) {
        UISetPlaying();
        runAlgo = true;
        testAlgo();
    }
    else {
        UISetStop();
        runAlgo = false;
    };
});

window.addEventListener('message', event => {
    const message = event.data;
    if (!message.hasOwnProperty('ipcReturn')) return;
    console.log(message);
});

function logicMain() {
    chartPoints = generatePoints();
    setChartPoints(chartPoints);
}
$(document).ready(logicMain);
