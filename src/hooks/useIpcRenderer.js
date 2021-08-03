/*
 * @Author: pipihua
 * @Date: 2021-08-03 23:23:33
 * @LastEditTime: 2021-08-03 23:27:38
 * @LastEditors: pipihua
 * @Description: ipc renderer监听
 * @FilePath: /cloud-mark/src/hooks/useIpcRenderer.js
 * 佛祖保佑永无BUG
 */

import { useEffect } from 'react'

const { ipcRenderer } = window.require('electron')

const useIpcRenderer = (keyCallbackMap = {}) => {
  useEffect(() => {
    Object.keys(keyCallbackMap).forEach(key => {
      ipcRenderer.on(key, keyCallbackMap[key])
    })
    return () => {
      Object.keys(keyCallbackMap).forEach(key => {
        ipcRenderer.removeListener(key, keyCallbackMap[key])
      })
    }
  })
}

export default useIpcRenderer
