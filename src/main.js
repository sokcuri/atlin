const {app, BrowserWindow} = require('electron');
const jsonfile = require('jsonfile');
const path = require('path');
const request = require('request');
let win;
let lastWindowBounds;

var saveConfig = (data) => {
    if (data !== null && typeof data === 'object') { // only object not null or und
        let file = path.join(app.getPath('userData'), 'config.json');
        try {
            jsonfile.writeFileSync(file, data);
        } catch (e) {
            console.error('json writeFileSync Error.');
            console.dir(e);    
        }
    }
};

var loadConfig = () => {
    let file = path.join(app.getPath('userData'), 'config.json');
    try {
        let data = jsonfile.readFileSync(file);
        return data;
    } catch (e) {
        console.error('jsonfile readFileSync Error.');
        console.dir(e);
        return {};
    }
};

app.on('ready', () => {
    let config = loadConfig();
    let options = {
        width: 500,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            partition: 'persist:atlatool'
        }
    }
    if (config && config.bounds) {
        options.width = config.bounds.width;
        options.height = config.bounds.height;
        options.x = config.bounds.x;
        options.y = config.bounds.y;
    }
    if (process.platform == 'darwin') {
        options.frame = false;
        options.titleBarStyle = 'hidden-inset';
    }
    else {
        options.frame = false;
    }
    
    
    win = new BrowserWindow(options);
    win.on('maximize', (e) => {
        win.webContents.executeJavaScript(`document.body.classList.add('maximized');`);
    });
    win.on('unmaximize', (e) => {
        win.webContents.executeJavaScript(`document.body.classList.remove('maximized');`);
    });
    win.on('close', (e) => {
        let bounds;
        if (e.sender.isMaximized())
            e.sender.restore();
        
        if (e.sender.isFullScreen())
            e.sender.setFullScreen(false);
        
        bounds = e.sender.getBounds();
        let data = loadConfig();
        data.bounds = bounds;
        saveConfig(data);
    });
    win.on('closed', (e) => {
        win = null;
    });

    win.webContents.on('dom-ready', (e) => {
        //console.info('dom-ready');
    });

    win.loadURL(`file://${__dirname}/index.html`);
});

app.on('browser-window-focus', function (e, win) {
  win.webContents.executeJavaScript(`document.body.classList.remove('deactivated');document.body.classList.add('activated');`);
});

app.on('browser-window-blur', function (e, win) {
  win.webContents.executeJavaScript(`document.body.classList.remove('activated');document.body.classList.add('deactivated');`);
});
