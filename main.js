const {app, globalShortcut, BrowserWindow} = require('electron');

let mainWindow;

app.on('window-all-closed', () => {
  if (process.platform != 'darwin')
    app.quit();
});

app.setPath("userData", __dirname + "/saved_recordings");

app.on('ready', () => {
  mainWindow = new BrowserWindow({width: 800, height: 600});
  const ret = globalShortcut.register('CmdOrCtrl+F12', () => {
    console.log('CommandOrControl+X is pressed')
  })


  if (!ret) {
    console.log('registration failed')
  }

  // Check whether a shortcut is registered.
  console.log(globalShortcut.isRegistered('CmdOrCtrl+F12'))
  mainWindow.loadURL('file://' + __dirname + '/index.html');
  // mainWindow.minimize();
  // mainWindow.setSkipTaskbar(true);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});
