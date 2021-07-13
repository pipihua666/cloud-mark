import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import './styles.scss'

const TabList = ({ files, activeId, unsaveIds, onTabClick, onCloseTab }) => {
  return (
    <ul className="nav nav-pills tablist-component">
      {files.map(file => {
        const withUnsavedMark = unsaveIds.includes(file.id)
        const fClassName = classNames({
          'nav-link': true,
          active: file.id === activeId,
          withUnsaved: withUnsavedMark
        })
        return (
          <li className="nav-item" key={file.id}>
            <button
              className={fClassName}
              onClick={e => {
                e.preventDefault()
                onTabClick(file.id)
              }}
            >
              {file.title}
              <span
                className="ml-2 close-icon"
                onClick={e => {
                  e.stopPropagation()
                  onCloseTab(file.id)
                }}
              >
                <FontAwesomeIcon icon={faTimes} />
              </span>
              {withUnsavedMark && (
                <span className="rounded-circle ml-2 unsaved-icon"></span>
              )}
            </button>
          </li>
        )
      })}
    </ul>
  )
}

TabList.propTypes = {
  files: PropTypes.array, // 打开的文件
  activeId: PropTypes.string, // 正在编辑的文件
  unsaveIds: PropTypes.array, // 未保存的文件
  onTabClick: PropTypes.func,
  onCloseTab: PropTypes.func
}
TabList.defaultProps = {
  unsaveIds: []
}

export default TabList
