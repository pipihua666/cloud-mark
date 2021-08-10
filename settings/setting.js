/*
 * @Author: pipihua
 * @Date: 2021-08-10 22:59:23
 * @LastEditTime: 2021-08-10 23:22:46
 * @LastEditors: pipihua
 * @Description: 设置的js文件
 * @FilePath: /cloud-mark/settings/setting.js
 * 佛祖保佑永无BUG
 */

const remote = require('@electron/remote')
const Store = require('electron-store')

const settingsStore = new Store({ name: 'PathSetting' })

const $ = (id = '') => document.getElementById(id)

document.addEventListener('DOMContentLoaded', () => {
  let savedLocation = settingsStore.get('savedFileLocation')
  if (savedLocation) {
    $('savedFileLocation').value = savedLocation
  }
  $('select-new-location').addEventListener('click', () => {
    remote.dialog
      .showOpenDialog({
        title: '请选择新的文件路径',
        properties: ['openDirectory']
      })
      .then(result => {
        if (Array.isArray(result.filePaths)) {
          const path = result.filePaths[0]
          $('savedFileLocation').value = path
          savedLocation = path
        }
      })
  })
  $('settings-form').addEventListener('submit', () => {
    settingsStore.set('savedFileLocation', savedLocation)
    remote.getCurrentWindow().close()
  })
})
