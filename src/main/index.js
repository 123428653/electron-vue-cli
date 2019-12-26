'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'
import './menu/application-menu'
import './tray/tray'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
// let forceQuit = false
let isQuit = false
const isMac = process.platform === 'darwin'
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9088`
  : `file://${__dirname}/index.html`

const debug = /--debug/.test(process.argv[2])
const MainVersion = process.versions.electron.split('.')[0]

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    show: false,
    width: 1000,
    height: 690,
    useContentSize: true,
    resizable: false,
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
    }
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('close', (e) => {
    if (isMac) {
      if (!isQuit) {
        e.preventDefault()
        mainWindow.hide()
      } else {
        mainWindow = null
        app.quit()
      }
      return
    }
    mainWindow = null
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    if (debug) {
      mainWindow.webContents.openDevTools()
    }
  })
}
/**
 * 单一实例
 */
if (MainVersion > 3) {
  // 单一实例
  const gotTheLock = app.requestSingleInstanceLock() // Electron4.0版本后已废除app.makeSingleInstance方法
  if (!gotTheLock) {
    app.quit()
  } else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
    // 当运行第二个实例时,将会聚焦到myWindow这个窗口
      if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore()
        mainWindow.focus()
      }
    })
    app.on('ready', createWindow)
  }
} else {
  // 单一实例兼容低版本Electron
  const shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
  if (shouldQuit) {
    app.quit()
  }
  app.on('ready', createWindow)
}
// app.on('ready', createWindow)

ipcMain.on('minimize', (event) => {
  mainWindow.minimize()
})

ipcMain.on('close', (event) => {
  if (mainWindow.isVisible()) {
    mainWindow.hide()
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', () => {
  // 在win的close之前执行
  isQuit = true
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  } else {
    mainWindow.show()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
