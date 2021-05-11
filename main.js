// Variables ==================================================================
const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const router = require(__dirname + '/app/helper/router.js')
const path = require('path')
const url = require('url')
const APP_FOLDER = 'app'
const PROTOCOL = 'file'
// Configuracion ==============================================================
let mainWindow
// Funciones ==================================================================
function createWindow () {
  electron.protocol.interceptFileProtocol(PROTOCOL, (request,callback) => {
    let url = request.url.substr(PROTOCOL.length + 1)
    url = path.join(__dirname, APP_FOLDER, url)
    url = url.replace(/\\/g, '/')
    url = path.normalize(url)
    callback({path: url})
  })

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
  })
  mainWindow.maximize()
  //mainWindow.setMenu(null)

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', () => {
  createWindow()
  router.init(mainWindow)
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
