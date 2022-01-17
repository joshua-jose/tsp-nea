// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const tspservice = require('./tspservice.ts');

try {
    require('electron-reloader')(module, { ignore: 'app/main' })
} catch (_) { }

let win = null;

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        width: 1200,
        height: 900,
        backgroundColor: '#343A40',
        webPreferences: {
            preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY
        },
        frame: false,
        show: false
    })

    // and load the index.html of the app.
    //win.loadFile(path.join(__dirname, '../renderer/index.html'))
    //win.loadFile(path.join(__dirname, 'index.html'))
    win.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

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

    win.on('closed', function () {
        win = null;
        app.exit(0); // make sure it properly quits, killing async tasks too
    });

    win.on('maximize', sendMaximizeEvent);
    win.on('unmaximize', sendMaximizeEvent);

    //win.once('ready-to-show', () => {
    win.webContents.once('did-finish-load', () => win.show());
    setTimeout(() => win.show(), 2000);

    initWindowIPC();
    tspservice.init(win);
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

function initWindowIPC() {
    ipcMain.on('windowClose', (event, message) => win.close());
    ipcMain.on('windowMinimize', (event, message) => win.minimize());
    ipcMain.on('windowUnmaximize', (event, message) => win.unmaximize());
    ipcMain.on('windowMaximize', (event, message) => win.maximize());

    ipcMain.on('isMaximized', (event, arg) => {
        event.returnValue = win.isMaximized()
    })

    ipcMain.on('windowMaxToggle', (event, message) => {
        if (win.isMaximized())
            win.unmaximize();
        else
            win.maximize();
    });
}
function sendMaximizeEvent() {
    win.webContents.send('maximizeEvent', { 'isMaximized': win.isMaximized() });
}