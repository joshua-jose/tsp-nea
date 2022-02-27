const { ipcRenderer, contextBridge } = require('electron');

// Expose our API to the browser
// This lets the browser send start and stop commands to the node.js process through IPC
contextBridge.exposeInMainWorld('tspAPI', {
    tspStart: (message) => ipcRenderer.send('tspStart', message),
    tspStop: () => ipcRenderer.send('tspStop', {}),
    tspRestart: () => ipcRenderer.send('tspRestart', {}),
    tspGetAlgorithms: () => { return ipcRenderer.sendSync('tspGetAlgorithms'); },

    addEventListener: (eventName, cb) => {
        ipcRenderer.on('ipcReturn', function (event, message) {
            if (!message.hasOwnProperty('ipcReturn')) return;

            if (message.ipcReturn === eventName)
                cb(message);
        });
    }
})

// expose window controls to the browser
contextBridge.exposeInMainWorld('electron', {
    windowClose: () => ipcRenderer.send('windowClose'),
    windowMinimize: () => ipcRenderer.send('windowMinimize'),
    windowMaximize: () => ipcRenderer.send('windowMaximize'),
    windowUnmaximize: () => ipcRenderer.send('windowUnmaximize'),
    windowMaxToggle: () => ipcRenderer.send('windowMaxToggle'),
    windowIsMazimized: () => { return ipcRenderer.sendSync('isMaximized'); },

    addMaxEventListener: (cb) => {
        ipcRenderer.on('maximizeEvent', function (event, message) {
            cb(message.isMaximized);
        });
    }

})