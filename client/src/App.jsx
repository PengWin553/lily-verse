import Favorites from './pages/Favorites'
import Home from './pages/Home'
import MangaDetail from './pages/MangaDetail'
import { Routes, Route } from 'react-router-dom'
import { MangaProvider } from './contexts/MangaContext'
import Navbar from './components/Navbar'
import "../src/css/App.css"
import UncleBrada from './pages/UncleBradaLoveEuphie'

// Main App component
function App() {
  return (
    <div>
      {/* Provide the Manga context to all child components */}
      <MangaProvider>
        {/* Top navigation bar */}
        <Navbar />

        {/* Main content area where routes will render their components */}
        <main className="main-content">
          <Routes>
            {/* Route for Home page */}
            <Route path="/" element={<Home />} />

            {/* Route for Favorites page */}
            <Route path="/favorites" element={<Favorites />} />

            {/* Route for Manga Detail page */}
            <Route path="/manga/:id" element={<MangaDetail />} />

            <Route path="/uncle-brada-love-euphie" element={<UncleBrada />} />
          </Routes>
        </main>
      </MangaProvider>
    </div>
  )
}

export default App