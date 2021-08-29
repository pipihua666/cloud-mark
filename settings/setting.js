/*
 * @Author: pipihua
 * @Date: 2021-08-10 22:59:23
 * @LastEditTime: 2021-08-29 23:15:34
 * @LastEditors: pipihua
 * @Description: 设置的js文件
 * @FilePath: /cloud-mark/settings/setting.js
 * 佛祖保佑永无BUG
 */

const remote = require('@electron/remote')
const { ipcRenderer } = require('electron')
const Store = require('electron-store')

const settingsStore = new Store({ name: 'PathSetting' })

const qiniuConfigArr = [
  '#savedFileLocation',
  '#accessKey',
  '#secretKey',
  '#bucketName'
]

const $ = (selector = '') => {
  const result = document.querySelectorAll(selector)
  return result.length > 1 ? result : result[0]
}

document.addEventListener('DOMContentLoaded', () => {
  let savedLocation = settingsStore.get('savedFileLocation')
  if (savedLocation) {
    $('#savedFileLocation').value = savedLocation
  }
  // Fill in the input
  qiniuConfigArr.forEach(selector => {
    const savedValue = settingsStore.get(selector.slice(1))
    if (savedValue) {
      $(selector).value = savedValue
    }
  })
  $('#select-new-location').addEventListener('click', () => {
    remote.dialog
      .showOpenDialog({
        title: '请选择新的文件路径',
        properties: ['openDirectory']
      })
      .then(result => {
        if (Array.isArray(result.filePaths)) {
          const path = result.filePaths[0]
          $('#savedFileLocation').value = path
        }
      })
  })
  $('#settings-form').addEventListener('submit', () => {
    qiniuConfigArr.forEach(selector => {
      const el = $(selector)
      if (el) {
        const { id, value } = el
        settingsStore.set(id, value || '')
      }
    })
    // send a event back to main process to enable menu item if qiniu config is saved
    ipcRenderer.send('qiniu-config-is-saved')
    remote.getCurrentWindow().close()
  })
  $('.nav-tabs').addEventListener('click', e => {
    e.preventDefault()
    $('.nav-link').forEach(el => {
      el.classList.remove('active')
    })
    e.target.classList.add('active')
    $('.config-area').forEach(el => {
      el.style.display = 'none'
    })
    $(e.target.dataset.tab).style.display = 'block'
  })
})
