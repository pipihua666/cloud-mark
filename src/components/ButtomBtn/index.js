import React from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const ButtonBtn = ({ text, colorClass, onBtnClick, icon }) => {
  return (
    <button
      type="button"
      className={`btn ${colorClass}`}
      onClick={onBtnClick}
      style={{ width: '100%' }}
    >
      <FontAwesomeIcon icon={icon} />
      <span style={{ marginLeft: 10 }}>{text}</span>
    </button>
  )
}

ButtonBtn.propsTypes = {
  text: PropTypes.string,
  colorClass: PropTypes.string.isRequired,
  onBtnClick: PropTypes.func.isRequired,
  icon: PropTypes.element.isRequired
}

ButtonBtn.defaultProps = {
  text: '新建'
}

export default ButtonBtn
