import { BrowserRouter,Route,Routes,Link } from 'react-router-dom'
import './App.css'
import Home from './Pages/Home/Home'
import LogIn from './Pages/LogIn/LogIn'
import SignUp from './Pages/SignUp/SignUp'

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home />}/>
      <Route path='/login' element={<LogIn />}/>
      <Route path='/signup' element={<SignUp />}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App
