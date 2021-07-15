/*
 * @Author: pipihua
 * @Date: 2021-07-08 22:42:48
 * @LastEditTime: 2021-07-15 22:47:23
 * @LastEditors: pipihua
 * @Description: electron主进程
 * @FilePath: /cloud-mark/main.js
 * 佛祖保佑永无BUG
 */
const { app, BrowserWindow, globalShortcut } = require('electron')
const isDev = require('electron-is-dev')

app.on('ready', () => {
  const mainWindow = new BrowserWindow({
    width: 1440,
    height: 768,
    webPreferences: {
      nodeIntegration: true
    }
  })
  const url = isDev ? 'http://localhost:3000' : 'https://baidu.com'
  mainWindow.loadURL(url)
  globalShortcut.register('CommandOrControl+Shift+i', function () {
    mainWindow.webContents.openDevTools({ mode: 'bottom' })
  })
})
