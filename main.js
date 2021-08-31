/*
 * @Author: pipihua
 * @Date: 2021-07-08 22:42:48
 * @LastEditTime: 2021-08-31 23:24:44
 * @LastEditors: pipihua
 * @Description: electron主进程
 * @FilePath: /cloud-mark/main.js
 * 佛祖保佑永无BUG
 */
const { app, globalShortcut, Menu, ipcMain, dialog } = require('electron')
const isDev = require('electron-is-dev')
const path = require('path')
const AppWindow = require('./AppWindow')
const menuTemplate = require('./template/menuTemplate')
const Store = require('electron-store')
const QiniuManager = require('./src/utils/QiniuManager')

const fileStore = new Store({ name: 'FileData' })

const settingsStore = new Store({ name: 'PathSetting' })

// 10以上的版本需要初始化
Store.initRenderer()

// 12版本的electron已经去抽了5版本的remote
require('@electron/remote/main').initialize()

const createQiniuManager = () => {
  const accessKey = settingsStore.get('accessKey')
  const secretKey = settingsStore.get('secretKey')
  const bucketName = settingsStore.get('bucketName')
  return new QiniuManager(accessKey, secretKey, bucketName)
}

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

  // auto sync
  ipcMain.on('upload-file', (event, data) => {
    const manager = createQiniuManager()
    manager
      .uploadFile(data.key, data.path)
      .then(() => {
        mainWindow.webContents.send('active-file-uploaded')
      })
      .catch(() => {
        dialog.showErrorBox('同步出错', '请检查七牛云配置是否正确！')
      })
  })
  ipcMain.on('download-file', (event, data) => {
    const manager = createQiniuManager()
    const filesObj = fileStore.get('files')
    const { key, path, id } = data
    manager.getStat(data.key).then(
      resp => {
        const serverUpdatedTime = Math.round(resp.putTime / 10000)
        const localUpdatedTime = filesObj[id].updatedAt
        if (serverUpdatedTime > localUpdatedTime || !localUpdatedTime) {
          manager.downloadFile(key, path).then(() => {
            mainWindow.webContents.send('file-downloaded', {
              status: 'download-success',
              id
            })
          })
        } else {
          mainWindow.webContents.send('file-downloaded', {
            status: 'no-new-file',
            id
          })
        }
      },
      error => {
        if (error.statusCode === 612) {
          mainWindow.webContents.send('file-downloaded', {
            status: 'no-file',
            id
          })
        }
      }
    )
  })
  ipcMain.on('upload-all-to-qiniu', () => {
    mainWindow.webContents.send('loading-status', true)
    const manager = createQiniuManager()
    const filesObj = fileStore.get('files') || {}
    const uploadPromiseArr = Object.keys(filesObj).map(key => {
      const file = filesObj[key]
      return manager.uploadFile(`${file.title}.md`, file.path)
    })
    Promise.all(uploadPromiseArr).then(result => {
      console.log(result)
      // show uploaded message
      dialog.showMessageBox({
        type: 'info',
        title: `成功上传了${result.length}个文件`,
        message: `成功上传了${result.length}个文件`,
      })
      mainWindow.webContents.send('files-uploaded')
    }).catch(() => {
      dialog.showErrorBox('同步失败', '请检查七牛云参数是否正确')
    }).finally(() => {
      mainWindow.webContents.send('loading-status', false)
    })
  })
  ipcMain.on('qiniu-config-is-saved', () => {
    let qiniuMenu =
      process.platform === 'darwin' ? menu.items[5] : menu.items[4]
    const switchItems = toggle => {
      ;[1, 2, 3].forEach(index => {
        qiniuMenu.submenu.items[index].enabled = toggle
      })
    }
    const qiniuIsConfiged = ['accessKey', 'secretKey', 'bucketName'].every(
      key => !!settingsStore.get(key)
    )
    switchItems(qiniuIsConfiged)
  })
})
