const {app, BrowserWindow} = require('electron');

let win;
app.on('ready', () => {
    let options = {
        width: 500,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            partition: 'persist:atlatool'
        }
    }
    if (process.platform == 'darwin') {
        options.titleBarStyle = 'hidden-inset';
    }
    else {
        options.frame = false;
    }
    win = new BrowserWindow(options);
    win.loadURL(`file://${__dirname}/chrometab.html`);
});