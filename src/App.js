import FileHeader from './components/FileSearch'

import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  return (
    <div className="App container-fluid">
      <div className="row">
        <div className="col-5 left-panel">
          <FileHeader onFileSearch={() => {}} />
        </div>
        <div className="col-7 right-panel">right</div>
      </div>
    </div>
  )
}

export default App
