import { Routes, Route } from 'react-router-dom'
// Placeholder imports for pages
import './styles/App.css'
import Home from './pages/Home'
import Discovery from './pages/Discovery'
import BirdDetail from './pages/BirdDetail'

// Placeholder layout components
import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  return (
    <div className="app-container">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/discovery" element={<Discovery />} />
          <Route path="/bird/:uid" element={<BirdDetail />} />
          {/* Add more routes here later */}
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
