import { Queue } from './queue.js';
import { UISetPlaying, UISetStop } from './ui.js';
import { algoIsDone } from './logic.js';

var viewport = document.getElementById('viewport');
var canvas = document.getElementById('view-canvas');
var ctx = canvas.getContext('2d');
var rect;

var myChart;
var pathQueue = new Queue();
var chartPoints;

var updateTask;
var updateDelay = 500;
var running = false;

export function isDoneUpdating() {
    return pathQueue.isEmpty();
}

export function rendererStop() {
    clearInterval(updateTask);
    while (!pathQueue.isEmpty())
        pathQueue.dequeue();

    updateTask = setInterval(updateChartPath, updateDelay);
}

export function getChartCoordinates(offsetX, offsetY) {
    let x = myChart.scales['x'].getValueForPixel(offsetX);
    let y = myChart.scales['y'].getValueForPixel(offsetY);
    return [x, y];
}

// reposition the points
export function setChartPoints(points) {
    var data = [];
    chartPoints = points;
    points.forEach(point => {
        data.push({ x: point[0], y: point[1] })
    });

    myChart.data.datasets[0].data = data;
    myChart.data.datasets[1].data = [];
    myChart.update();
}

// Set up the lines to connect up the right points
export function setChartPath(path, points) {
    pathQueue.enqueue(path);

    //updateChartPath();
}

export function changeUpdateDelay(newDelay) {
    clearInterval(updateTask);
    updateDelay = newDelay;
    updateTask = setInterval(updateChartPath, newDelay);
    //myChart.options.animation.duration = newDelay;
}

function updateChartPath() {
    //if (path.length !== 0)
    //    data.push({ x: chartPoints[path[0]][0], y: chartPoints[path[0]][1] }); // complete the loop

    if (pathQueue.isEmpty()) {
        if (running && algoIsDone()) {
            UISetStop();
            running = false;
        }
        return;
    }

    running = true;
    var data = [];
    pathQueue.dequeue().forEach(index => {
        data.push({ x: chartPoints[index][0], y: chartPoints[index][1] })
    });

    myChart.data.datasets[1].data = data;
    myChart.update();

    if (pathQueue.isEmpty() && algoIsDone()) {
        UISetStop();
        running = false;
    }
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
                    },
                    min: 0,
                    max: 1
                },
                y: {
                    grid: {
                        display: false
                    },
                    min: 0,
                    max: 1
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

    updateTask = setInterval(updateChartPath, updateDelay);
}
/*
module.exports = {
    setChartPoints: setChartPoints,
    setChartPath: setChartPath
}
*/
rendererMain();
