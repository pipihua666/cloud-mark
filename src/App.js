import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  return (
    <div className="App container-fluid">
      <div className="row">
        <div className="col-3 bg-danger left-panel">left</div>
        <div className="col-9 bg-primary right-panel">right</div>
      </div>
    </div>
  )
}

export default App
