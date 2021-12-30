var viewport = document.getElementById('viewport');
var canvas = document.getElementById('view-canvas');
var ctx = canvas.getContext('2d');
var rect;

var myChart;

/*
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

    var scale = window.devicePixelRatio;

    two.renderer.setSize(width, height);
    canvas.width = width;
    canvas.height = height;

    ctx.scale(1 / scale, 1 / scale);

    rect.translation.set(two.width / 2, two.height / 2);
    two.update();
}


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
*/

var _seed = Date.now();

function rand(min, max) {
    _seed = (_seed * 9301 + 49297) % 233280;
    return min + (_seed / 233280) * (max - min);
}

// creates random points
function generatePoints() {
    var min = 0;
    var max = 100;
    var count = 8;
    var decimals = 8;
    var dfactor = Math.pow(10, decimals) || 0;

    var data = [];
    var i, xvalue, yvalue;

    for (i = 0; i < count; ++i) {

        xvalue = rand(min, max);
        yvalue = rand(min, max);
        data.push([Math.round(dfactor * xvalue) / dfactor, Math.round(dfactor * yvalue) / dfactor]);
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

// reposition the points
function setChartPoints(points) {
    data = [];
    points.forEach(point => {
        data.push({ x: point[0], y: point[1] })
    });

    myChart.data.datasets.forEach(dataset => {
        dataset.data = [...data];
    });
    myChart.update();
}

// Set up the lines to connect up the right points
function setChartPath(path) {
    data = [];

    path.forEach(index => {
        data.push({ x: chartPoints[index][0], y: chartPoints[index][1] })
    });

    myChart.data.datasets[1].data = data;

    myChart.update();
}

// Data & logic section
var chartPoints = [[0, 1], [1, 2], [3, 4], [5, 6]];
var chartPath = [0, 1, 2, 3];

$('#generateButton').click(function () {
    chartPoints = generatePoints();
    setChartPoints(chartPoints);
    setChartPath([]);
});

var i = 2;
$('#placePointsButton').click(function () {
    chartPath = generatePath(8);
    setChartPath(chartPath);
});

// set up chart
function rendererMain() {
    const data = {
        datasets: [{
            backgroundColor: 'rgb(255, 99, 132)',
            data: []
        },
        {
            backgroundColor: 'rgb(54, 162, 235)',
            borderColor: 'rgb(54, 162, 235)',
            type: "line",
            pointRadius: 0,
            data: []
        }],
    };

    const config = {
        type: 'scatter',
        data,
        options: {
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    grid: {
                        display: false
                    }
                },
                y: {
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    };
    myChart = new Chart(
        canvas,
        config
    );

    chartPoints = generatePoints();
    setChartPoints(chartPoints);

}

rendererMain();