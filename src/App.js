import FileHeader from './components/FileSearch'
import FileList from './components/FileList'
import mocks from './fileMock'

import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  return (
    <div className="App container-fluid">
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
        </div>
        <div className="col-7 right-panel">right</div>
      </div>
    </div>
  )
}

export default App
