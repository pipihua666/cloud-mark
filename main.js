/*
 * @Author: pipihua
 * @Date: 2021-07-08 22:42:48
 * @LastEditTime: 2021-07-19 23:24:54
 * @LastEditors: pipihua
 * @Description: electron主进程
 * @FilePath: /cloud-mark/main.js
 * 佛祖保佑永无BUG
 */
const { app, BrowserWindow, globalShortcut } = require('electron')
const isDev = require('electron-is-dev')

// 12版本的electron已经去抽了5版本的remote
require('@electron/remote/main').initialize()

app.on('ready', () => {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 768,
    webPreferences: {
      // 可在浏览器环境使用nodejs
      nodeIntegration: true,
      // window.require is not a function
      contextIsolation: false,
      // 开启使用remote模块
      enableRemoteModule: true
    }
  })
  const url = isDev ? 'http://localhost:3000' : 'https://baidu.com'
  mainWindow.loadURL(url)
  globalShortcut.register('CommandOrControl+Shift+i', function () {
    mainWindow.webContents.openDevTools({ mode: 'bottom' })
  })
})
