/*
 * @Author: pipihua
 * @Date: 2021-07-18 22:29:58
 * @LastEditTime: 2021-07-18 23:07:34
 * @LastEditors: pipihua
 * @Description: nodejs文件操作
 * @FilePath: /cloud-mark/src/utils/fileHelper.js
 * 佛祖保佑永无BUG
 */
const fs = window.require('fs').promises

const fileHelper = {
  readFile: (path = '') => {
    return fs.readFile(path, { encoding: 'utf8' })
  },
  writeFile: (path = '', content = '') => {
    return fs.writeFile(path, content, { encoding: 'utf8' })
  },
  renameFile: (path = '', newPath = '') => {
    return fs.rename(path, newPath)
  },
  deleteFile: (path = '') => {
    return fs.unlink(path)
  }
}

export default fileHelper
