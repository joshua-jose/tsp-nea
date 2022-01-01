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

var chartPoints = [[0, 1], [1, 2], [3, 4], [5, 6]];
var chartPath = [0, 1, 2, 3];

$('#generateButton').click(function () {
    UISetStop();
    runAlgo = false;
    window.tspAPI.tspStop();

    chartPoints = generatePoints(12);
    setChartPoints(chartPoints);
    setChartPath([]);
});

var runAlgo = false;
$('#runButton').click(function () {
    if (!runAlgo) {
        UISetPlaying();
        runAlgo = true;

        window.tspAPI.tspStart({ points: chartPoints });
    }
    else {
        UISetStop();
        runAlgo = false;
        window.tspAPI.tspStop();
    };
});

window.tspAPI.addEventListener('tspSetPath', message => {
    setChartPath(message.path);
})

function logicMain() {
    chartPoints = generatePoints(8);
    setChartPoints(chartPoints);
}
$(document).ready(logicMain);
