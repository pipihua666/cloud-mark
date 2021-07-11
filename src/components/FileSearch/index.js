import React, { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'

// 雪碧图:
// 1. 一张图片上拼接了很多小图片，根据每个图片的位置通过background-position来进行定位显示
// 2. 不能缩放，不能通过css控制

// Font Icon
// 1. 通过字体的字符编码代替图标，通过特定的class+伪类的方式插入到浏览器中
// 2. 本身就是字符，只能通过字符相关的css属性来控制样式
// 3. 经常需要下载好几个大的字体文件，没用到的字体文件占用多余的空间
// 4. 当文件加载失败的时候会有奇怪的bug，浏览器可能将这些图标渲染成奇怪的字符

// SVG
// 优势：可以通过任何的css属性来控制

const FileSearch = ({ onFileSearch }) => {
  const [inputActive, setInputActive] = useState(false)
  const [value, setValue] = useState('')
  const inputEl = useRef(null)

  const onCloseSearch = event => {
    event.preventDefault()
    setInputActive(false)
    setValue('')
  }

  // 添加esc和enter事件
  useEffect(() => {
    const handleKeyUpEvent = event => {
      if (event.keyCode === 13 && inputActive) {
        onFileSearch(value)
      } else if (event.keyCode === 27 && inputActive) {
        onCloseSearch(event)
      }
    }
    document.addEventListener('keyup', handleKeyUpEvent)
    return () => {
      document.removeEventListener('keyup', handleKeyUpEvent)
    }
  }, [inputActive, value, onFileSearch])

  // 编辑状态自动聚焦
  useEffect(() => {
    if (inputActive) {
      inputEl.current.focus()
    }
  }, [inputActive])

  return (
    <div className="alert alert-info d-flex justify-content-between align-items-center">
      {!inputActive ? (
        <>
          <span>我的云文档</span>
          <button
            className="icon-button"
            onClick={() => {
              setInputActive(true)
            }}
          >
            <FontAwesomeIcon icon={faSearch} title="搜索" size="lg" />
          </button>
        </>
      ) : (
        <>
          <div>
            <input
              ref={inputEl}
              className="form-control"
              value={value}
              onChange={e => {
                setValue(e.target.value)
              }}
            />
          </div>
          <button className="icon-button" onClick={onCloseSearch}>
            <FontAwesomeIcon icon={faTimes} title="关闭" size="lg" />
          </button>
        </>
      )}
    </div>
  )
}

export default FileSearch
