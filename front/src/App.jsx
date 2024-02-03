import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Walls from './pages/Walls'
import About from './pages/About'
import './styles/App.css'

function App() {
 
  return (
    <>
     <Routes>
      <Route index element={<Home />} />
      <Route path="Walls" element={<Walls />} />
      <Route path="About" element={<About />} />
     </Routes>
    </>
  )
}

export default App
