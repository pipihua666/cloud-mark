import React, { useState, useEffect, useRef } from 'react'

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
    <div className="alert alert-info">
      {!inputActive ? (
        <div className="d-flex justify-content-between align-items-center">
          <span>我的云文档</span>
          <button
            className="btn btn-primary"
            onClick={() => {
              setInputActive(true)
            }}
          >
            搜索
          </button>
        </div>
      ) : (
        <div className="row">
          <div className="col-9">
            <input
              ref={inputEl}
              className="form-control"
              value={value}
              onChange={e => {
                setValue(e.target.value)
              }}
            />
          </div>
          <button className="btn btn-primary col-3" onClick={onCloseSearch}>
            关闭
          </button>
        </div>
      )}
    </div>
  )
}

export default FileSearch
