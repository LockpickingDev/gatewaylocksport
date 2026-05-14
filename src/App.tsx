import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { db } from './lib/firebase'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Calendar from './pages/Calendar'
import Archive from './pages/Archive'
import Signup from './pages/Signup'
import Admin from './pages/Admin'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/archive" element={<Archive />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}

export default App