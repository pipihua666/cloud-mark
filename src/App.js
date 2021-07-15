/*
 * @Author: pipihua
 * @Date: 2021-07-08 22:40:53
 * @LastEditTime: 2021-07-15 23:15:28
 * @LastEditors: pipihua
 * @Description: 主应用
 * @FilePath: /cloud-mark/src/App.js
 * 佛祖保佑永无BUG
 */
import { useState } from 'react'
import FileHeader from './components/FileSearch'
import FileList from './components/FileList'
import mocks from './fileMock'
import ButtonBtn from './components/ButtomBtn'
import TabList from './components/TabList'
import { faPlus, faFileImport } from '@fortawesome/free-solid-svg-icons'
import SimpleMDE from 'react-simplemde-editor'
import 'easymde/dist/easymde.min.css'

import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  const [files, setFiles] = useState({})
  const [activeFileID, setActiveFileID] = useState('')
  const [openedFileIDs, setOpenedFileIDs] = useState([])
  const [unsavedFileIDs, setUnsavedFileIDs] = useState([])
  const activeFile = files[activeFileID]
  const openedFiles = openedFileIDs.map(openID => {
    return files[openID]
  })

  const fileChange = (id, value) => {
    if (value !== files[id].body) {
      const newFile = { ...files[id], body: value }
      setFiles({ ...files, [id]: newFile })
      // update unsavedIDs
      if (!unsavedFileIDs.includes(id)) {
        setUnsavedFileIDs([...unsavedFileIDs, id])
      }
    }
  }

  const tabClick = fileID => {
    // set current active file
    setActiveFileID(fileID)
  }

  const tabClose = id => {
    //remove current id from openedFileIDs
    const tabsWithout = openedFileIDs.filter(fileID => fileID !== id)
    setOpenedFileIDs(tabsWithout)
    // set the active to the first opened tab if still tabs left
    if (tabsWithout.length > 0) {
      setActiveFileID(tabsWithout[0])
    } else {
      setActiveFileID('')
    }
  }

  return (
    <div className="App container-fluid px-0">
      <div className="row">
        <div className="col-5 left-panel">
          <FileHeader onFileSearch={() => {}} />
          <FileList
            files={mocks}
            onFileClick={id => {
              console.log('file click:', id)
            }}
            onSaveEdit={id => {
              console.log('file save:', id)
            }}
            onFileDelete={id => {
              console.log('file delete:', id)
            }}
          />
          <div className="d-grid gap-2 d-md-flex justify-content-center mt-2 button-group">
            <ButtonBtn icon={faPlus} text="新建" colorClass="btn-primary" />
            <ButtonBtn
              icon={faFileImport}
              text="导入"
              colorClass="btn-success"
            />
          </div>
        </div>
        <div className="col-7 right-panel">
          {!activeFile && (
            <div className="start-page">选择或者创建新的 Markdown 文档</div>
          )}
          {activeFile && (
            <>
              <TabList
                files={openedFiles}
                activeId={activeFileID}
                unsaveIds={unsavedFileIDs}
                onTabClick={tabClick}
                onCloseTab={tabClose}
              />
              <SimpleMDE
                key={activeFile && activeFile.id}
                value={activeFile && activeFile.body}
                onChange={value => {
                  fileChange(activeFile.id, value)
                }}
                options={{
                  minHeight: '515px'
                }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
