/*
 * @Author: pipihua
 * @Date: 2021-07-18 17:00:35
 * @LastEditTime: 2021-08-02 23:53:07
 * @LastEditors: pipihua
 * @Description: 工具函数
 * @FilePath: /cloud-mark/src/utils/helper.js
 * 佛祖保佑永无BUG
 */

const flattenArr = (arr = {}) => {
  return arr.reduce((map, item) => {
    map[item.id] = item
    return map
  }, {})
}

const objToArr = (obj = {}) => Object.values(obj)

const getNodeParent = (node = null, parentClass = '') => {
  let current = node
  while (current) {
    if (current.classList.contains(parentClass)) {
      return current
    }
    current = current.parentNode
  }
  return null
}

export { flattenArr, objToArr, getNodeParent }
