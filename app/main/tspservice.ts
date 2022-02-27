const child_process = require('child_process');
const readline = require('readline');
const { ipcMain } = require('electron');
const zmq = require("zeromq");

const IDENTITY = "FRONTEND"

let solverProcess: typeof child_process.child_process = null;
let win = null;
let sock = null;
let endpoint: String = null;
let algorithms: Array<String> = [];

var running: boolean = false;

/* Events:
tspStart: tells the backend to start a TSP calculation
tspStop: tells the backend to stop TSP calc
tspSetPath: gives the front end the next path to show
*/

// spawn the solver process
async function spawnProcess() {
    solverProcess = child_process.spawn('.venv/Scripts/python', ['-u', 'solver/main.py', '--daemon', endpoint]);

    // copy the process output and error messages to our output
    solverProcess.stderr.on('data', (msg: Object) => console.log(msg.toString()));
    solverProcess.stdout.on('data', (msg: Object) => console.log(msg.toString()));

    // Initiate connection with a dummy packet
    await sendReady();
    console.log("ready");
    // Wait for reply with a list of algorithms
    //var algopacket = await recvPacket();

    // On exit, make sure the old process is definitely dead, then attempt a restart
    solverProcess.on('exit', async function () {
        if (!(solverProcess === undefined || solverProcess === null))
            solverProcess.kill();

        spawnProcess();
    });
}
// ------------------------- ZMQ -------------------------
// sending data to the python solver 

// prototype for typing purposes
// This lets us specify the format of our ZMQ packets
class SolverPacket {
    type: String
    path: Int32Array
    final: boolean
    algorithms: Array<String>
}
class Point extends Float32Array { };
class Path extends Int32Array { };

// listen to messages from the solver, and process them
async function solverListen() {
    while (true) {
        const packet = await recvPacket();
        receivedPacket(packet);
    }
}

// send a Javascript Object as a packet to the solver
async function sendPacket(packet: Object) {
    await sock.send(JSON.stringify(packet)); // Send object as JSON
}
// decode a received packet into a Javascript Object
async function recvPacket(): Promise<SolverPacket> {
    return JSON.parse((await sock.receive()).toString()); // Parse bytes as JSON in string
}

// thin API wrapper
// These functions take basic operations and builds the corresponding packet
async function sendReady() {
    await sendPacket({ 'type': 'ready' });
}
async function sendStop() {
    await sendPacket({ 'type': 'stop' });
}
// tells the solver process to start a calculation
async function sendCalculate(points: Array<Point>, algorithm: String) {
    // check if process is alive
    if (solverProcess === undefined || solverProcess === null || solverProcess.killed)
        spawnProcess();

    var data = { 'type': 'calculate', 'points': points, 'algorithm': algorithm };
    await sendPacket(data);
}

// process a received packet
function receivedPacket(packet: SolverPacket) {
    if (packet.type === "path") {
        if (!running)
            return;
        ipcSetPath(packet.path);

        if (packet.final) {
            ipcSendDone();
            running = false;
        }
    }
    else if (packet.type === "algorithms") {
        console.log("Algorithms sent: " + JSON.stringify(packet));
        algorithms = packet.algorithms;
        ipcSendAlgorithms(algorithms);
    }
}

// ------------------------- IPC -------------------------
// Sends data to the browser

function ipcSetPath(path: Path) {
    ipcPostMessage('tspSetPath', { 'path': path });
}

function ipcSendDone() {
    ipcPostMessage('tspDone', {});
}

function ipcSendAlgorithms(ialgorithms: Array<String>) {
    ipcPostMessage('tspAlgorithms', { 'algorithms': ialgorithms });
}

// Send a message to the renderer process
function ipcPostMessage(messageName: String, data) {
    var message = data;
    message.ipcReturn = messageName;

    win.webContents.send('ipcReturn', message);
}

// -------------------------------------------------------
// initialise our service
export async function init(iwin) {
    win = iwin;

    // create a new socket with a given identity
    sock = new zmq.Dealer; // Async Requester
    sock.routingId = IDENTITY;

    await sock.bind("tcp://127.0.0.1:*"); // bind to random port
    endpoint = sock.lastEndpoint; // get address with port

    solverListen(); // start listening to solver packets
    await spawnProcess(); // spawn the solver process


    // listen to messages from browser
    ipcMain.on('tspStart', (event, message) => {
        running = true;
        console.log(message.points, message.algorithm);
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

    ipcMain.on('tspGetAlgorithms', (event, arg) => {
        event.returnValue = algorithms;
    })
}
