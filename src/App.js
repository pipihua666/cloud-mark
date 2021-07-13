import FileHeader from './components/FileSearch'
import FileList from './components/FileList'
import mocks from './fileMock'
import ButtonBtn from './components/ButtomBtn'
import TabList from './components/TabList'
import { faPlus, faFileImport } from '@fortawesome/free-solid-svg-icons'

import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  const onTabClick = () => {}
  const onTabClose = () => {}
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
          <div className="d-grid gap-2 d-md-flex justify-content-center mt-2">
            <ButtonBtn icon={faPlus} text="新建" colorClass="btn-primary" />
            <ButtonBtn
              icon={faFileImport}
              text="导入"
              colorClass="btn-success"
            />
          </div>
        </div>
        <div className="col-7 right-panel">
          <TabList
            files={[]}
            activeId=""
            unsaveIds={[]}
            onTabClick={onTabClick}
            onCloseTab={onTabClose}
          />
        </div>
      </div>
    </div>
  )
}

export default App
