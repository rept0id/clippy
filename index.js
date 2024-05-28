/* global __dirname, process */

const { app, BrowserWindow, screen, ipcMain } = require('electron');
const path = require('path');

/*** * * ***/

const clippyW = 125;
const clippyH = 100;

const msgWelcome = `
  <h1>Hello, from Clippy !</h1>
  <br>
  <h5>Give the double-click a whirl to set the animation in motion and toggle the opening/closing of this modal.</h5>
  <h5>A single click sets the animation in motion.</h5>
  <h5>Gently guiding your mouse over Clippy or giving it a jolly good press reveals the close button.</h5>
`;

/*** * * ***/

let modalWindow;

function modalWindowCreate(text = "") {

  const display = screen.getDisplayNearestPoint(screen.getCursorScreenPoint());
  const displayW = display.workArea.width;
  const displayH = display.workArea.height;

  const modalMarginTopBottom = clippyW*2;
  const modalMarginLeftRight = clippyH*2;

  /*** * * ***/

  if (typeof modalWindow != "undefined") {
    modalWindowDestroy();
  }

  /*** * * ***/

  modalWindow = new BrowserWindow({
    width: (displayW - modalMarginTopBottom),
    height: (displayH - modalMarginLeftRight),
    title: 'Clippy',
    frame: false,
    transparent: true,
    icon: __dirname + '/assets/icon/icon.ico',
  });

  modalWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(`
    <html>
      <head>
        <style>
          body { 
            color: white;
            margin: 0;
            font-family: system-ui;
            background-color: #333;
          }
          #content {
            text-align: center;
            top: 50%;
            position: absolute;
            width: 100vw;
            transform: translate(0,-50%);
          }
        </style>
      </head>
      <body>
        <div id="content">
          `+text+`
        </div>
      </body>
    </html>
  `));

}

function modalWindowDestroy() {
  modalWindow.close();
  modalWindow = undefined;
}

function mainWindowCreate() {

  const display = screen.getDisplayNearestPoint(screen.getCursorScreenPoint());
  const displayW = display.workArea.width;
  const displayH = display.workArea.height;

  /*** * * ***/

  const win = new BrowserWindow({
    width: clippyW,
    height: clippyH,
    title: 'Clippy',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    transparent: true,
    frame: false,
    icon: __dirname + '/assets/icon/icon.ico'
  });

  /*** * * ***/

  win.setPosition((displayW - clippyW), (displayH - clippyH));

  win.setAlwaysOnTop(true, 'screen');

  win.loadFile('index.html');

  // win.setIgnoreMouseEvents(true, { forward: true });

}

app.whenReady().then(() => {

  mainWindowCreate();

  /*** * * ***/

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindowCreate();
    }
  });

  /*** * * ***/

  ipcMain.handle('quit-app', () => {
    app.quit();
  });

  ipcMain.handle('dblclick', () => {
    if (typeof modalWindow != "undefined") {
      modalWindowDestroy();
    } else {
      modalWindowCreate(msgWelcome);
    }
  });

  modalWindowCreate(msgWelcome);

});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
