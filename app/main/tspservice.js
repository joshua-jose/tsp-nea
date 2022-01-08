const child_process = require('child_process');
const readline = require('readline');
const { ipcMain } = require('electron');
const zmq = require("zeromq");

const IDENTITY = "FRONTEND"

let solverProcess = null;
let win = null;
let sock = null;
let endpoint = null;

var running = false;

/* Events:
tspStart: tells the backend to start a TSP calculation
tspStop: tells the backend to stop TSP calc
tspSetPath: gives the front end the next path to show
*/

// Hot reload on file change

function spawnProcess() {
    solverProcess = child_process.spawn('.venv/Scripts/python', ['-u', 'solver/main.py', '--daemon', endpoint]);

    solverProcess.stderr.on('data', (msg) => console.log(msg.toString()));
    solverProcess.stdout.on('data', (msg) => console.log(msg.toString()));

    // On exit, make sure the old process is definitely dead, then attempt a restart
    solverProcess.on('exit', function () {
        if (solverProcess === undefined || solverProcess === null)
            return;
        solverProcess.kill();
        spawnProcess();
    });
}

const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

// ------------------------- ZMQ -------------------------
// sending data to the python solver 

async function solverListen() {
    while (true) {
        const packet = await recvPacket();
        receivedPacket(packet);
    }
}

async function sendPacket(packet) {
    await sock.send(JSON.stringify(packet)); // Send object as JSON
}
async function recvPacket() {
    return JSON.parse((await sock.receive()).toString()); // Parse bytes as JSON in string
}

// thin API wrapper
async function sendReady() {
    await sendPacket({ 'type': 'ready' });
}
async function sendStop() {
    await sendPacket({ 'type': 'stop' });
}
async function sendCalculate(points, algorithm) {
    // check if process is alive
    if (solverProcess === undefined || solverProcess === null || solverProcess.killed)
        spawnProcess();

    var data = { 'type': 'calculate', 'points': points, 'algorithm': algorithm };
    await sendPacket(data);
}

function receivedPacket(packet) {
    if (!running)
        return;

    if (packet.type === "path") {
        ipcSetPath(packet.path);

        if (packet.final) {
            ipcSendDone();
            running = false;
        }
    }
}

// ------------------------- IPC -------------------------
// Sends data to the browser

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

// -------------------------------------------------------

async function init(iwin) {
    win = iwin;

    // create a new socket with a given identity
    sock = new zmq.Dealer; // Async Requester
    sock.routingId = IDENTITY;

    await sock.bind("tcp://127.0.0.1:*"); // bind to random port
    endpoint = sock.lastEndpoint; // get address with port

    spawnProcess();

    // Initiate connection with a dummy packet
    await sendReady();
    // Wait for reply with a list of algorithms
    packet = await recvPacket();
    console.log(packet.algorithms);

    solverListen();

    // messages from browser
    ipcMain.on('tspStart', (event, message) => {
        running = true;
        sendCalculate(message.points, message.algorithm);

    });
    ipcMain.on('tspStop', (event, message) => {
        if (running)
            sendStop();
        running = false;
    });

    ipcMain.on('tspRestart', (event, message) => {
        if (running)
            sendStop();
        running = false;
        solverProcess.kill();
    });
}

module.exports = {
    init: init
}