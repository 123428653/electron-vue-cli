import { BrowserWindow, app, Tray, Menu } from 'electron'
import path from 'path'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let trayIcon = null
let win = null
const getWin = () => {
  BrowserWindow.getAllWindows().forEach(_win => {
    console.log(_win.id)
    if (_win.id) {
      win = _win
    }
  })
}

const template = [
  {
    label: 'Show',
    click: function (item) {
      if (!win) getWin()
      if (win) win.show()
    }
  },
  {
    label: 'Hide',
    click: function (item) {
      if (!win) getWin()
      if (win) win.hide()
    }
  },
  { type: 'separator' },
  {
    label: 'Ouit',
    click: function () {
      // 触发退出程序
      // forceQuit = true
      if (process.platform === 'win32') {
        trayIcon.destroy()
      }
      if (!win) getWin()
      if (win) {
        win.hide()
        win.webContents.send('outapp')
      }
      setTimeout(() => {
        app.quit()
      }, 350)
    }
  }
]

const createTray = () => {
  const iconImg = process.platform === 'win32' ? 'windows-icon.png' : 'iconTemplate.png'
  const iconPath = path.join(__static, iconImg)
  trayIcon = new Tray(iconPath)
  const contextMenu = Menu.buildFromTemplate(template)
  // trayIcon.setToolTip()
  trayIcon.setContextMenu(contextMenu)
  trayIcon.on('click', () => {
    if (!win) getWin()
    if (win) {
      // 窗口是否可见
      if (win.isVisible()) {
        // 窗口是否最小化
        if (win.isMinimized()) {
          win.show()
        } else {
          win.hide()
        }
      } else {
        win.show()
      }
    }
  })
}

app.on('ready', () => {
  createTray()
})

app.on('window-all-closed', () => {
  if (trayIcon) trayIcon.destroy()
})
