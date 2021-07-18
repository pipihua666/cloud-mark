import React, { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import { faMarkdown } from '@fortawesome/free-brands-svg-icons'
import PropTypes from 'prop-types'
import useKeyPress from '../../hooks/useKeyPress'

const FileList = ({ files, onFileClick, onSaveEdit, onFileDelete }) => {
  const [editFileId, setEditFileId] = useState('') // 编辑的文件id
  const [value, setValue] = useState('') // 文件title文件框
  const inputEl = useRef(null)
  const isEnterPress = useKeyPress(13)
  const isESCPress = useKeyPress(27)

  const onCloseSearch = () => {
    setEditFileId('')
    setValue('')
  }

  // 添加esc和enter事件
  useEffect(() => {
    if (isEnterPress && editFileId) {
      onSaveEdit(editFileId, value)
      onCloseSearch()
    } else if (isESCPress && editFileId) {
      onCloseSearch()
    }
  }, [isEnterPress, isESCPress])

  // 编辑状态自动聚焦
  useEffect(() => {
    if (editFileId) {
      inputEl.current.focus()
    }
  }, [editFileId])
  return (
    <ul className="list-group list-group-flush">
      {Array.isArray(files) &&
        files.length > 0 &&
        files.map(file => (
          <li
            key={file.id}
            className="list-group-item file-item bg-light d-flex align-items-center"
          >
            {editFileId && editFileId === file.id ? (
              <span className="col-10">
                <input
                  ref={inputEl}
                  className="form-control"
                  value={value}
                  onChange={e => {
                    setValue(e.target.value)
                  }}
                />
              </span>
            ) : (
              <>
                <span className="col-2">
                  <FontAwesomeIcon icon={faMarkdown} />
                </span>
                <span
                  className="col-8 file-link"
                  onClick={() => {
                    onFileClick(file.id)
                  }}
                >
                  {file.title}
                </span>
              </>
            )}
            <button
              className="icon-button col-1"
              onClick={() => {
                setEditFileId(file.id)
                setValue(file.title)
              }}
            >
              <FontAwesomeIcon icon={faEdit} title="编辑" />
            </button>
            <button
              className="icon-button col-1"
              onClick={() => {
                onFileDelete(file.id)
                setValue(file.title)
              }}
            >
              <FontAwesomeIcon icon={faTrash} title="删除" />
            </button>
          </li>
        ))}
    </ul>
  )
}

FileList.propTypes = {
  files: PropTypes.array,
  onFileClick: PropTypes.func.isRequired,
  onSaveEdit: PropTypes.func.isRequired,
  onFileDelete: PropTypes.func.isRequired
}

FileList.defaultProps = {
  files: []
}

export default FileList
