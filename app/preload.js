/*
window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    for (const type of ['chrome', 'node', 'electron']) {
        replaceText(`${type}-version`, process.versions[type])
    }
})
*/
const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('tspAPI', {
    tspStart: (message) => ipcRenderer.send('tspStart', message),
    tspStop: () => ipcRenderer.send('tspStop', {}),

    addEventListener: (eventName, cb) => {
        ipcRenderer.on('ipcReturn', function (event, message) {
            if (!message.hasOwnProperty('ipcReturn')) return;

            if (message.ipcReturn === eventName)
                cb(message);
        });
    }
})

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