'use strict'

import { app, BrowserWindow, ipcMain, Menu } from 'electron'

import menu from './settings/menu'

let mainWindow = null

app.on('window-all-closed', () => {
  app.quit()
})

let winProps = {
  width: 1000,
  height: 800,
  titleBarStyle: 'hidden-inset'
}

if (process.env.NODE_ENV !== 'development') {
  winProps = {
    width: 800,
    height: 435,
    frame: true,
    resizeable: false,
    titleBarStyle: 'hidden-inset'
  }
}

app.on('ready', () => {
  mainWindow = new BrowserWindow(winProps)

  mainWindow.loadURL(`file://${__dirname}/index.html`)

  Menu.setApplicationMenu(menu)

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
})

ipcMain.on('showWindow', (event, data) => {
  mainWindow.focus()
})
