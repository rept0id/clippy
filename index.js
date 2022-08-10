const { app, BrowserWindow, screen, ipcMain } = require('electron')
const path = require('path')

/*

  create window :

  1. load options from json file
  2. set Electron's window parameters
  3. calculate window position ( screen size - window size )
  4. set values

*/

function createWindow () {

  const options = require('./options.json'); 

  /* 
    Electron loads window's title first from package.json and then from index.html <title>
    If your values are different ex. clippy (package.json) then Clippy (index.html), that change s visible to user for a second.
    Solution : set Electron's window title preference during init. This way you bypass package.json title which usually is lowercase.
  */
  const win = new BrowserWindow({
    width: options.width,
    height: options.height,
    title: 'Clippy',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    transparent: options.transparent, //default : true
    frame: options.frame, //default: false
    icon: __dirname + '/assets/icon/icon.ico',
  })

  const position = {
    x : screen.getPrimaryDisplay().size.width - options.width - 50,
    y : screen.getPrimaryDisplay().size.height - options.height - 50
  }

  win.setPosition(position.x, position.y);

  win.setAlwaysOnTop(options.alwaysOnTop, 'screen');

  win.loadFile('index.html');

}

// electron's code + our custom app close handler using ipcMain, called from preload.js.

app.whenReady().then(() => {

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  })

  ipcMain.handle('quit-app', () => {
    app.quit();
  });

})

//electron's code

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
