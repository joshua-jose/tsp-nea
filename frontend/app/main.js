// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, contextBridge } = require('electron')
const path = require('path')


try {
    require('electron-reloader')(module)
} catch (_) { }

let win = null;

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        width: 1200,
        height: 900,
        backgroundColor: '#343A40',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            autoHideMenuBar: true
        },
        frame: false,
        show: false
    })
    //win.removeMenu();
    // and load the index.html of the app.
    win.loadFile(path.join(__dirname, 'index.html'))

    // Open the DevTools.
    // win.webContents.openDevTools()

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow()

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })

    win.on('maximize', toggleMaxMin);
    win.on('unmaximize', toggleMaxMin);

    //win.once('ready-to-show', () => {
    win.webContents.once('did-finish-load', function () {
        win.show()
    })

    initTSP();
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

function initWindowIPC() {
    ipcMain.on('windowClose', (event, message) => {
        win.close();
    });
    ipcMain.on('windowMinimize', (event, message) => {
        win.minimize();
    });
    ipcMain.on('windowUnmaximize', (event, message) => {
        win.unmaximize();
    });
    ipcMain.on('windowMaximize', (event, message) => {
        win.maximize();
    });
    ipcMain.on('windowTriggerResizeEvent', (event, message) => {
        toggleMaxMin();
    });

    ipcMain.on('windowMaxToggle', (event, message) => {
        if (win.isMaximized())
            win.unmaximize();
        else
            win.maximize();
    });
}
function toggleMaxMin() {
    win.webContents.send('winMaxMin', { 'isMaximized': win.isMaximized() });
}
initWindowIPC();

// TSP logic 

var runAlgo = false;
let points = [];
function testAlgo() {
    if (!runAlgo) return;

    n = points.length;
    chartPath = generatePath(n);
    ipcPostMessage('tspSetPath', { 'path': chartPath });

    setTimeout(testAlgo, 750);
}

/* Events:
tspStart: tells the backend to start a TSP calculation
tspStop: tells the backend to stop TSP calc
tspSetPath: gives the front end the next path to show
*/

function initTSP() {

    ipcMain.on('tspStart', (event, message) => {
        runAlgo = true;
        points = message.points;

        testAlgo();
    });

    ipcMain.on('tspStop', (event, message) => {
        runAlgo = false;
    });
}

function ipcPostMessage(messageName, data) {
    var message = data;
    message.ipcReturn = messageName;

    win.webContents.send('ipcReturn', message);
}

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