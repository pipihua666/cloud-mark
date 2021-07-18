/*
 * @Author: pipihua
 * @Date: 2021-07-08 22:40:53
 * @LastEditTime: 2021-07-18 17:14:43
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
import { v4 as uuidv4 } from 'uuid'
import TabList from './components/TabList'
import { faPlus, faFileImport } from '@fortawesome/free-solid-svg-icons'
import SimpleMDE from 'react-simplemde-editor'
import 'easymde/dist/easymde.min.css'
import { flattenArr, objToArr } from './utils/hepler'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  const [files, setFiles] = useState(flattenArr(mocks))
  const [activeFileID, setActiveFileID] = useState('')
  const [openedFileIDs, setOpenedFileIDs] = useState([])
  const [unsavedFileIDs, setUnsavedFileIDs] = useState([])
  const [searchedFiles, setSearchedFiles] = useState([])
  const activeFile = files[activeFileID]
  const openedFiles = openedFileIDs.map(openID => {
    return files[openID]
  })
  const filesArr = objToArr(files)
  const fileListArr = searchedFiles?.length > 0 ? searchedFiles : filesArr

  const fileChange = (id, value) => {
    const newFile = files[id]
    newFile.body = value
    setFiles({
      ...files,
      [id]: newFile
    })
    if (!unsavedFileIDs.includes(id)) {
      setUnsavedFileIDs([...unsavedFileIDs, id])
    }
  }

  const tabClick = fileID => {
    // set current active file
    setActiveFileID(fileID)
  }

  const fileClick = fileID => {
    // set current active file
    setActiveFileID(fileID)
    // then add new fileID to openedFiles
    if (!openedFileIDs.includes(fileID)) {
      setOpenedFileIDs([...openedFileIDs, fileID])
    }
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

  const deleteFile = id => {
    delete files[id]
    setFiles(files)
    tabClose(id)
  }

  const fileSearch = keyword => {
    // filter out the new files based on the keyword
    const newFiles = filesArr.filter(file => file.title.includes(keyword))
    setSearchedFiles(newFiles)
  }

  const updateFileName = (id, title) => {
    const newFile = files[id]
    newFile.title = title
    newFile.isNew = false
    setFiles({
      ...files,
      [id]: newFile
    })
  }

  const createNewFile = () => {
    const newID = uuidv4()
    const newFiles = {
      id: newID,
      title: '',
      body: '## 请输入Markdown',
      createdAt: new Date().getTime(),
      isNew: true
    }

    setFiles({
      ...files,
      [newID]: newFiles
    })
  }

  return (
    <div className="App container-fluid px-0">
      <div className="row">
        <div className="col-5 left-panel">
          <FileHeader onFileSearch={fileSearch} />
          <FileList
            files={fileListArr}
            onFileClick={fileClick}
            onSaveEdit={updateFileName}
            onFileDelete={deleteFile}
          />
          <div className="d-grid gap-2 d-md-flex justify-content-center mt-2 button-group">
            <ButtonBtn
              icon={faPlus}
              text="新建"
              colorClass="btn-primary"
              onBtnClick={createNewFile}
            />
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
