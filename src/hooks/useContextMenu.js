/*
 * @Author: pipihua
 * @Date: 2021-08-02 23:10:06
 * @LastEditTime: 2021-08-03 22:55:46
 * @LastEditors: pipihua
 * @Description: 上下文菜单
 * @FilePath: /cloud-mark/src/hooks/useContextMenu.js
 * 佛祖保佑永无BUG
 */

import { useEffect, useRef } from 'react'
const remote = window.require('@electron/remote')
const { Menu, MenuItem } = window.require('@electron/remote')

// 添加deps是为了让useEffect重新渲染
// 如果不重新渲染，click回调中的引用的回调一直是挂载组件时的回调，里面的变量也不会发生改变，
// 所以导致fileClick中的openedFileIDs一直是初始化时的空数组，点击打开的文件一直只有一个
const useContextMenu = (menuItems = [], domSelector = '', deps = []) => {
  const clickedElement = useRef(null)
  useEffect(() => {
    const menu = new Menu()
    menuItems.forEach(item => {
      menu.append(
        new MenuItem({
          click: () => item.click(clickedElement.current),
          label: item.label
        })
      )
    })
    const handleContextMenu = e => {
      if (document.querySelector(domSelector).contains(e.target)) {
        clickedElement.current = e.target
        menu.popup({
          window: remote.getCurrentWindow()
        })
      }
    }
    window.addEventListener('contextmenu', handleContextMenu)
    return () => {
      window.removeEventListener('contextmenu', handleContextMenu)
    }
  }, deps)
  return clickedElement
}

export default useContextMenu
