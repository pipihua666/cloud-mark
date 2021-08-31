/*
 * @Author: pipihua
 * @Date: 2021-08-31 23:19:13
 * @LastEditTime: 2021-08-31 23:37:08
 * @LastEditors: pipihua
 * @Description: 加载
 * @FilePath: /cloud-mark/src/components/Loader/index.js
 */

import React from 'react'
import './style.scss'

const Loader = ({ text = '处理中' }) => (
  <div className="loading-component text-center">
    <div className="spinner-grow text-primary" role="status">
      <span className="sr-only">{text}</span>
    </div>
    <h5 className="text-primary">{text}</h5>
  </div>
)

export default Loader
