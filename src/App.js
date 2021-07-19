/*
 * @Author: pipihua
 * @Date: 2021-07-08 22:40:53
 * @LastEditTime: 2021-07-19 23:23:15
 * @LastEditors: pipihua
 * @Description: 主应用
 * @FilePath: /cloud-mark/src/App.js
 * 佛祖保佑永无BUG
 */
import { useState } from 'react'
import ButtonBtn from './components/ButtonBtn'
import { v4 as uuidv4 } from 'uuid'
import { faPlus, faFileImport, faSave } from '@fortawesome/free-solid-svg-icons'
import SimpleMDE from 'react-simplemde-editor'
import 'easymde/dist/easymde.min.css'

import FileHeader from './components/FileSearch'
import TabList from './components/TabList'
import FileList from './components/FileList'
import mocks from './fileMock'
import fileHelper from './utils/fileHelper'
import { flattenArr, objToArr } from './utils/helper'

import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'

const { join } = window.require('path')
const { app } = window.require('@electron/remote')

function App() {
  const [files, setFiles] = useState(flattenArr(mocks))
  // 打开的文件ids
  const [openedFileIDs, setOpenedFileIDs] = useState([])
  // 没有保存的文件ids
  const [unsavedFileIDs, setUnsavedFileIDs] = useState([])
  // 搜索出的文件列表
  const [searchedFiles, setSearchedFiles] = useState([])
  // 正在编辑的文件id
  const [activeFileID, setActiveFileID] = useState('')
  const activeFile = files[activeFileID]
  const openedFiles = openedFileIDs.map(openID => {
    return files[openID]
  })
  // TabList,FileList使用数组
  const filesArr = objToArr(files)
  const fileListArr = searchedFiles?.length > 0 ? searchedFiles : filesArr
  const saveLocation = app.getPath('documents')

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
    fileHelper
      .deleteFile(join(saveLocation, `${files[id].title}.md`))
      .then(() => {
        delete files[id]
        setFiles(files)
        tabClose(id)
      })
  }

  const fileSearch = keyword => {
    // filter out the new files based on the keyword
    const newFiles = filesArr.filter(file => file.title.includes(keyword))
    setSearchedFiles(newFiles)
  }

  const updateFileName = (id, title, isNew) => {
    const newFile = { ...files[id], title, isNew: false }
    console.log('title', title)
    if (isNew) {
      fileHelper
        .writeFile(join(saveLocation, `${title}.md`), files[id].body)
        .then(() => {
          setFiles({
            ...files,
            [id]: newFile
          })
        })
    } else {
      fileHelper
        .renameFile(
          join(saveLocation, `${files[id].title}.md`),
          join(saveLocation, `${title}.md`)
        )
        .then(() => {
          setFiles({
            ...files,
            [id]: newFile
          })
        })
    }
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

  const saveCurrentFile = () => {
    fileHelper
      .writeFile(join(saveLocation, `${activeFile.title}.md`), activeFile.body)
      .then(() => {
        setUnsavedFileIDs(filesArr.filter(id => id !== activeFile.id))
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
              <ButtonBtn
                icon={faSave}
                text="保存"
                colorClass="btn-success"
                onBtnClick={saveCurrentFile}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
