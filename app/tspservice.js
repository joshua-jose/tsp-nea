const child_process = require('child_process');
const readline = require('readline');
const { ipcMain } = require('electron');

let solverProcess = null;
let rl = null;
let win = null;

var running = false;

/* Events:
tspStart: tells the backend to start a TSP calculation
tspStop: tells the backend to stop TSP calc
tspSetPath: gives the front end the next path to show
*/

function spawnProcess() {
    solverProcess = child_process.spawn('.venv/Scripts/python', ['-u', 'solver/main.py', '--daemon']);

    solverProcess.stderr.on('data', (msg) => {
        console.log(msg.toString());
    });
    rl = readline.createInterface({
        input: solverProcess.stdout,
        terminal: false
    });
}

function init(iwin) {
    win = iwin;
    //var srv = net.createServer((sock) => { });
    //srv.listen(0, () => { });
    //srv.close();
    //var port = srv.address().port;
    /*
    var port = 2445;
    const wss = new WebSocket.Server({ port: port })

    wss.on('connection', function connection(ws) {
        ws.send('first');
        ws.on('message', function message(data) {
            console.log('node received: %s', data);
        });

        ws.send('something');
    });
    */

    // use JSON RPC to pass data?
    spawnProcess();

    ipcMain.on('tspStart', (event, message) => {
        // probably not necessary
        if (solverProcess === undefined || solverProcess === null || solverProcess.killed)
            spawnProcess();

        processSendRequest(message.points, "Brute Force");
        running = true;

        rl.on('line', function (line) {
            var parsed = JSON.parse(line);
            ipcSetPath(parsed.path);

            if (parsed.final) {
                ipcSendDone()
                rl.removeListener('line', arguments.callee);
                running = false;
            }
        });
    });

    ipcMain.on('tspStop', (event, message) => {
        if (running) {
            solverProcess.kill();
            solverProcess = spawnProcess();
        }
        running = false;
    });
}

function processSendRequest(points, algorithm) {
    var data = { 'points': points, 'algorithm': algorithm };
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