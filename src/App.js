/*
 * @Author: pipihua
 * @Date: 2021-07-08 22:40:53
 * @LastEditTime: 2021-08-30 22:44:17
 * @LastEditors: pipihua
 * @Description: 主应用
 * @FilePath: /cloud-mark/src/App.js
 * 佛祖保佑永无BUG
 */
import { useState } from 'react'
import ButtonBtn from './components/ButtonBtn'
import { v4 as uuidv4 } from 'uuid'
import { faPlus, faFileImport } from '@fortawesome/free-solid-svg-icons'
import SimpleMDE from 'react-simplemde-editor'
import 'easymde/dist/easymde.min.css'

import FileHeader from './components/FileSearch'
import TabList from './components/TabList'
import FileList from './components/FileList'
import fileHelper from './utils/fileHelper'
import { objToArr, flattenArr, timestampToString } from './utils/helper'
import useIpcRenderer from './hooks/useIpcRenderer'

import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'

const { join, basename, dirname, extname } = window.require('path')
const { app, dialog } = window.require('@electron/remote')
const { ipcRenderer } = window.require('electron')
const Store = window.require('electron-store')
const settingsStore = new Store({ name: 'PathSetting' })

const fileStore = new Store({ name: 'FileData' })

const getAutoSync = () =>
  ['accessKey', 'secretKey', 'bucketName', 'enableAutoSync'].every(
    key => !!settingsStore.get(key)
  )

const saveFilesToStore = (files = {}) => {
  const fileStoreObj = objToArr(files).reduce((result, currentFile) => {
    const { id, title, path, createdAt, isSynced, updatedAt } = currentFile
    result[id] = {
      id,
      path,
      title,
      createdAt,
      isSynced,
      updatedAt
    }
    return result
  }, {})
  fileStore.set('files', fileStoreObj)
}

function App() {
  const [files, setFiles] = useState(fileStore.get('files') || {})
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
  const saveLocation =
    settingsStore.get('savedFileLocation') || app.getPath('documents')

  const fileChange = (id, value) => {
    if (value !== files[id].body) {
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
    // set file body
    const currentFile = files[fileID]
    if (!currentFile.isLoaded) {
      fileHelper.readFile(currentFile.path).then(value => {
        const newFile = { ...currentFile, isLoaded: true, body: value }
        setFiles({ ...files, [fileID]: newFile })
      })
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
    const { [id]: deletedFile, ...otherFiles } = files
    // delete new file
    if (files[id].isNew) {
      setFiles(otherFiles)
      return
    }
    // delete exist file
    fileHelper
      .deleteFile(files[id].path)
      .then(() => {
        setFiles(otherFiles)
        saveFilesToStore(otherFiles)
        tabClose(id)
      })
      .catch(() => {
        alert('文件不存在')
        setFiles(otherFiles)
      })
  }

  const fileSearch = keyword => {
    // filter out the new files based on the keyword
    const newFiles = filesArr.filter(file => file.title.includes(keyword))
    setSearchedFiles(newFiles)
  }

  const updateFileName = async (id, title, isNew) => {
    // 如果是新建，保存路径为app.getPath('documents')
    // 如果是更新名称，保存路径为file.path
    const newPath = isNew
      ? join(saveLocation, `${title}.md`)
      : join(dirname(files[id].path), `${title}.md`)
    if (objToArr(files).some(file => file.path === newPath)) {
      alert('文件名已存在')
      return
    }
    const modifiedFile = { ...files[id], title, isNew: false, path: newPath }
    const newFiles = { ...files, [id]: modifiedFile }
    if (isNew) {
      fileHelper.writeFile(newPath, files[id].body).then(() => {
        setFiles(newFiles)
        saveFilesToStore(newFiles)
      })
    } else {
      fileHelper.renameFile(files[id].path, newPath).then(() => {
        setFiles(newFiles)
        saveFilesToStore(newFiles)
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
    const { path, body, title } = activeFile
    fileHelper.writeFile(path, body).then(() => {
      setUnsavedFileIDs(filesArr.filter(id => activeFile.id !== id))
      if (getAutoSync()) {
        ipcRenderer.send('upload-file', {
          key: `${title}.md`,
          path
        })
      }
    })
  }

  const importFile = () => {
    dialog
      .showOpenDialog({
        filters: [
          {
            name: 'my markdown file',
            extensions: ['md']
          }
        ],
        title: '请选择要导入的 Markdown 文件',
        properties: ['openFile', 'multiSelections']
      })
      .then(result => {
        if (Array.isArray(result.filePaths)) {
          // 过滤已经存在的文件
          const filterPaths = result.filePaths.filter(path => {
            const alreadyAdded = Object.values(files).find(
              file => file.path === path
            )
            return !alreadyAdded
          })
          // 构造新的文件到files中
          const newFilesArr = filterPaths.map(path => {
            return {
              id: uuidv4(),
              path,
              title: basename(path, extname(path))
            }
          })
          // 把结果保存到electron store中
          const newFiles = { ...files, ...flattenArr(newFilesArr) }
          setFiles(newFiles)
          saveFilesToStore(newFiles)
          if (newFilesArr.length > 0) {
            dialog.showMessageBox({
              type: 'info',
              title: `成功导入了${newFilesArr.length}个文件`,
              message: `成功导入了${newFilesArr.length}个文件`
            })
          }
        }
      })
  }

  const activeFileUploaded = () => {
    const { id } = activeFile
    const modifiedFile = {
      ...files[id],
      isSynced: true,
      updatedAt: new Date().getTime()
    }
    const newFiles = { ...files, [id]: modifiedFile }
    setFiles(newFiles)
    saveFilesToStore(newFiles)
  }

  useIpcRenderer({
    'create-new-file': createNewFile,
    'import-file': importFile,
    'save-edit-file': saveCurrentFile,
    'active-file-uploaded': activeFileUploaded
  })

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
              onBtnClick={importFile}
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
              />
              {activeFile.isSynced && (
                <span className="sync-status">
                  上次同步于:{timestampToString(activeFile.updatedAt)}
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
