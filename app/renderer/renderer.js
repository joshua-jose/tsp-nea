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

// reposition the points
export function setChartPoints(points) {
    var data = [];
    points.forEach(point => {
        data.push({ x: point[0], y: point[1] })
    });

    myChart.data.datasets[0].data = data;
    myChart.data.datasets[1].data = [];
    myChart.update();
}

// Set up the lines to connect up the right points
export function setChartPath(path, chartPoints) {
    var data = [];

    path.forEach(index => {
        data.push({ x: chartPoints[index][0], y: chartPoints[index][1] })
    });
    //if (path.length !== 0)
    //    data.push({ x: chartPoints[path[0]][0], y: chartPoints[path[0]][1] }); // complete the loop

    myChart.data.datasets[1].data = data;

    myChart.update();
}

// set up chart
function rendererMain() {

    const data = {
        datasets: [{
            backgroundColor: 'rgb(255, 99, 132)', // Individual points
            data: []
        },
        {
            backgroundColor: 'rgb(54, 162, 235)', // Path between points
            borderColor: 'rgb(54, 162, 235)',
            type: "line",
            pointRadius: 0,
            data: [],
            tension: 0.03
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
}
/*
module.exports = {
    setChartPoints: setChartPoints,
    setChartPath: setChartPath
}
*/
rendererMain();
