/*
 * @Author: zhaokh
 * @Date: 2021-07-08 22:42:48
 * @LastEditTime: 2021-07-08 22:47:48
 * @LastEditors: zhaokh
 * @Description: electron 入口
 * @FilePath: /cloud-mark/main.js
 */

const { app, BrowserWindow } = require('electron')
const isDev = require('electron-is-dev')

app.on('ready', () => {
  const mainWindow = new BrowserWindow({
    height: 1000,
    with: 1200,
    webPreferences: {
      nodeIntegration: true
    }
  })
  const url = isDev ? 'http://localhost:3000' : 'https://baidu.com'
  mainWindow.loadURL(url)
})
