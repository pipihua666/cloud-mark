import { useState, useEffect } from 'react'

const useKeyPress = targetKeyCode => {
  const [isKeyPress, setKeyPress] = useState(false)
  useEffect(() => {
    const handleKeyUp = ({ keyCode }) => {
      if (keyCode === targetKeyCode) {
        setKeyPress(false)
      }
    }
    const handleKeyDown = ({ keyCode }) => {
      if (keyCode === targetKeyCode) {
        setKeyPress(true)
      }
    }
    document.addEventListener('keyup', handleKeyUp)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keyup', handleKeyUp)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])
  return isKeyPress
}

export default useKeyPress
