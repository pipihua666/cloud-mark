/*
 * @Author: pipihua
 * @Date: 2021-08-10 22:26:20
 * @LastEditTime: 2021-08-10 22:36:02
 * @LastEditors: pipihua
 * @Description: 窗口类
 * @FilePath: /cloud-mark/AppWindow.js
 * 佛祖保佑永无BUG
 */

const { BrowserWindow } = require('electron')

class AppWindow extends BrowserWindow {
  constructor(config = {}, urlPath = '') {
    const basicConfig = {
      width: 700,
      height: 600,
      webPreferences: {
        // 可在浏览器环境使用nodejs
        nodeIntegration: true,
        // window.require is not a function
        contextIsolation: false,
        // 开启使用remote模块
        enableRemoteModule: true,
        show: false,
        backgroundColor: '#efefef'
      }
    }
    const finalConfig = {
      ...basicConfig,
      ...config
    }
    super(finalConfig)
    this.loadURL(urlPath)
    this.once('ready-to-show', () => {
      this.show()
    })
  }
}

module.exports = AppWindow
