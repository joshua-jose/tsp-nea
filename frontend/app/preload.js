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
const ipcRenderer = require('electron').ipcRenderer;

const allowedMessages = ['tspMessage'];

process.once('loaded', () => {
    window.addEventListener('message', event => {
        // do something with custom event
        const message = event.data;
        if (!message.hasOwnProperty('ipcMessage')) return;

        if (allowedMessages.includes(message.ipcMessage)) {
            ipcRenderer.send(message.ipcMessage, message);
        }
    });
});

ipcRenderer.on('ipcReturn', function (evt, message) {
    window.postMessage(message);
});