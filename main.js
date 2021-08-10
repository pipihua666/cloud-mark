/*
 * @Author: pipihua
 * @Date: 2021-07-08 22:42:48
 * @LastEditTime: 2021-08-10 23:07:57
 * @LastEditors: pipihua
 * @Description: electron主进程
 * @FilePath: /cloud-mark/main.js
 * 佛祖保佑永无BUG
 */
const { app, globalShortcut, Menu, ipcMain } = require('electron')
const isDev = require('electron-is-dev')
const path = require('path')
const AppWindow = require('./AppWindow')
const menuTemplate = require('./template/menuTemplate')
const Store = require('electron-store')
// 10以上的版本需要初始化
Store.initRenderer()

// 12版本的electron已经去抽了5版本的remote
require('@electron/remote/main').initialize()

app.on('ready', () => {
  const mainConfig = {
    width: 1200,
    height: 768
  }
  const url = isDev ? 'http://localhost:3000' : 'https://baidu.com'
  const mainWindow = new AppWindow(mainConfig, url)
  globalShortcut.register('CommandOrControl+Shift+i', function () {
    mainWindow.webContents.openDevTools({ mode: 'bottom' })
  })
  // set the menu
  const menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)

  // listen setting event
  ipcMain.on('open-settings-window', () => {
    const settingsWindowConfig = {
      width: 500,
      height: 400,
      parent: mainWindow
    }
    const filePath = `file://${path.join(__dirname, './settings/setting.html')}`
    const settingWindow = new AppWindow(settingsWindowConfig, filePath)
    globalShortcut.register('CommandOrControl+Shift+o', function () {
      settingWindow.webContents.openDevTools({ mode: 'bottom' })
    })
    settingWindow.removeMenu()
  })
})
