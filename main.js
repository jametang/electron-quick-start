// Modules to control application life and create native browser window
const { app, ipcMain, BrowserWindow, nativeTheme } = require('electron')
const path = require('node:path')

function createWindow () {
  // Create the browser window.
  let mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  
  // add window icon
  mainWindow.setIcon(path.join(__dirname, 'assets/logo.png'))

      // 设置Content Security Policy
  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': ["default-src 'self'"]
      }
    });
  });

  // and load the index.html of the app.
  // mainWindow.loadFile('index.html')
  mainWindow.loadFile('main.html')

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', () => {
    mainWindow = null
    console.log('closed')
  })

  //open dark model
  ipcMain.handle('dark-mode:toggle', () => {
    if (nativeTheme.shouldUseDarkColors) {
      nativeTheme.themeSource = 'light'
    } else {
      nativeTheme.themeSource = 'dark'
    }
    return nativeTheme.shouldUseDarkColors
  })
  
  ipcMain.handle('dark-mode:system', () => {
    nativeTheme.themeSource = 'system'
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// app.whenReady().then(() => {
//   createWindow()

//   app.on('activate', function () {
//     // On macOS it's common to re-create a window in the app when the
//     // dock icon is clicked and there are no other windows open.
//     if (BrowserWindow.getAllWindows().length === 0) createWindow()
//   })
// })

app.on('ready', function (){
  console.log('ready')
  createWindow()
})

app.on('activate', function (){
  console.log('activate')
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quit
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  app.quit()
  // if (process.platform !== 'darwin') app.quit()
})

app.on('before-quit', function (){
  console.log('before-quit')
})
app.on('will-quit', function (){
  console.log('will-quit')
})
app.on('quit', function (){
  console.log('quit')
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
