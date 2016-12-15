const {app, BrowserWindow, Menu} = require('electron');
const jsonfile = require('jsonfile');
const path = require('path');
const request = require('request');
let win;
let lastWindowBounds;
const template = [
  {
    label: 'Edit',
    submenu: [
      {
        role: 'undo'
      },
      {
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        role: 'cut'
      },
      {
        role: 'copy'
      },
      {
        role: 'paste'
      },
      {
        role: 'pasteandmatchstyle'
      },
      {
        role: 'delete'
      },
      {
        role: 'selectall'
      }
    ]
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click (item, focusedWindow) {
          if (focusedWindow) focusedWindow.webContents.executeJavaScript(`webViewReload();`);
        }
      },
      {
        label: 'Back',
        accelerator: 'Alt+Left',
        click (item, focusedWindow) {
          if (focusedWindow) focusedWindow.webContents.executeJavaScript(`webViewBack();`);
        }
      },
      {
        label: 'Forward',
        accelerator: 'Alt+Right',
        click (item, focusedWindow) {
          if (focusedWindow) focusedWindow.webContents.executeJavaScript(`webViewForward();`);
        }
      },
      {
        label: 'Home',
        accelerator: 'Alt+H',
        click (item, focusedWindow) {
          if (focusedWindow) focusedWindow.webContents.executeJavaScript(`webViewHome();`);
        }
      },
      {
        role: 'toggledevtools'
      },
      {
        type: 'separator'
      },
      {
        role: 'resetzoom'
      },
      {
        role: 'zoomin'
      },
      {
        role: 'zoomout'
      },
      {
        type: 'separator'
      },
      {
        role: 'togglefullscreen'
      }
    ]
  },
  {
    role: 'window',
    submenu: [
      {
        role: 'minimize'
      },
      {
        role: 'close'
      }
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click () { require('electron').shell.openExternal('http://electron.atom.io') }
      }
    ]
  }
]

if (process.platform === 'darwin') {
  template.unshift({
    label: app.getName(),
    submenu: [
      {
        role: 'about'
      },
      {
        type: 'separator'
      },
      {
        role: 'services',
        submenu: []
      },
      {
        type: 'separator'
      },
      {
        role: 'hide'
      },
      {
        role: 'hideothers'
      },
      {
        role: 'unhide'
      },
      {
        type: 'separator'
      },
      {
        role: 'quit'
      }
    ]
  })
  // Edit menu.
  template[1].submenu.push(
    {
      type: 'separator'
    },
    {
      label: 'Speech',
      submenu: [
        {
          role: 'startspeaking'
        },
        {
          role: 'stopspeaking'
        }
      ]
    }
  )
  // View menu
  template[2].submenu[1].accelerator = 'Cmd+Left';
  template[2].submenu[2].accelerator = 'Cmd+Right';
  template[2].submenu[3].accelerator = 'Cmd+H';
  // Window menu.
  template[3].submenu = [
    {
      label: 'Close',
      accelerator: 'CmdOrCtrl+W',
      role: 'close'
    },
    {
      label: 'Minimize',
      accelerator: 'CmdOrCtrl+M',
      role: 'minimize'
    },
    {
      label: 'Zoom',
      role: 'zoom'
    },
    {
      type: 'separator'
    },
    {
      label: 'Bring All to Front',
      role: 'front'
    }
  ]
}
const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

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
        width: 800,
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
