const child_process = require('child_process');
const readline = require('readline');
const { ipcMain } = require('electron');
const zmq = require("zeromq");

let solverProcess = null;
let rl = null;
let win = null;
let sock = null;
let endpoint = null;

var running = false;

/* Events:
tspStart: tells the backend to start a TSP calculation
tspStop: tells the backend to stop TSP calc
tspSetPath: gives the front end the next path to show
*/

function spawnProcess() {
    solverProcess = child_process.spawn('.venv/Scripts/python', ['-u', 'solver/main.py', '--daemon', endpoint]);

    solverProcess.stderr.on('data', (msg) => {
        console.log(msg.toString());
    });
    rl = readline.createInterface({
        input: solverProcess.stdout,
        terminal: false
    });

    rl.on('line', recievedMessage);

    solverProcess.on('exit', function () {
        if (solverProcess === undefined || solverProcess === null)
            return;
        solverProcess.kill();
    });
}


const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

async function zmq_listen() {

    while (true) {
        const [msg] = await sock.receive();
        recievedMessage(msg);
    }
}

async function init(iwin) {
    win = iwin;

    sock = new zmq.Request
    await sock.bind("tcp://127.0.0.1:*");
    endpoint = sock.lastEndpoint;

    spawnProcess();
    zmq_listen();

    ipcMain.on('tspStart', (event, message) => {
        running = true;
        processSendRequest(message.points, message.algorithm);

    });

    ipcMain.on('tspStop', (event, message) => {
        if (running) {
            solverProcess.kill();
            solverProcess = spawnProcess();
        }
        running = false;
    });
}

function recievedMessage(line) {
    if (!running)
        return;

    var parsed = JSON.parse(line);
    ipcSetPath(parsed.path);

    if (parsed.final) {
        ipcSendDone();
        running = false;
    }
}

async function processSendRequest(points, algorithm) {
    // check if process is alive
    if (solverProcess === undefined || solverProcess === null || solverProcess.killed)
        spawnProcess();

    var data = { 'points': points, 'algorithm': algorithm };
    await sock.send(JSON.stringify(data));
    solverProcess.stdin.write(JSON.stringify(data) + '\r\n');
}

function ipcSetPath(path) {
    ipcPostMessage('tspSetPath', { 'path': path });
}

function ipcSendDone() {
    ipcPostMessage('tspDone', {});
}

// Send a message to the renderer process
function ipcPostMessage(messageName, data) {
    var message = data;
    message.ipcReturn = messageName;

    win.webContents.send('ipcReturn', message);
}

module.exports = {
    init: init
}