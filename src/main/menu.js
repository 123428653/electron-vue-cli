'use strict'

import { app, Menu } from 'electron'

let template = [{
  label: 'Application',
  submenu: [
    { label: 'Cut', accelerator: 'CmdOrCtrl+X', role: 'cut' },
    { label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy' },
    { label: 'Paste', accelerator: 'CmdOrCtrl+V', role: 'paste' },
    { label: 'Select All', accelerator: 'CmdOrCtrl+A', role: 'selectAll' },
    { type: 'separator' },
    { label: 'Hide Compare', accelerator: 'CmdOrCtrl+H', role: 'hide' },
    { label: 'Close', accelerator: 'CmdOrCtrl+W', role: 'close' },
    {
      label: 'Quit',
      accelerator: 'CmdOrCtrl+Q',
      role: 'quit'
    }
  ]
}]

app.on('ready', () => {
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
})
