import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router,Routes, Route} from 'react-router-dom'
import Home from './Pages/Home';
import Sale from './Pages/Sale'
function App() {
  return (
    <>
     <Router>
        <Routes>
          <Route exact path="/" element={<Home/>}/>
          <Route exact path="/presale" element={<Sale/>}/>
        
        
        </Routes>
    </Router>
    
    </>
  );
}

export default App;
