/*
 * @Author: pipihua
 * @Date: 2021-07-18 17:00:35
 * @LastEditTime: 2021-07-18 17:02:37
 * @LastEditors: pipihua
 * @Description: 工具函数
 * @FilePath: /cloud-mark/src/utils/hepler.js
 * 佛祖保佑永无BUG
 */

const flattenArr = (arr = {}) => {
  return arr.reduce((map, item) => {
    map[item.id] = item
    return map
  }, {})
}

const objToArr = (obj = {}) => Object.values(obj)

export { flattenArr, objToArr }
