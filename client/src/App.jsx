import Favorites from './pages/Favorites'
import Home from './pages/Home'
import { Routes, Route } from 'react-router-dom'
import { MovieProvider } from './contexts/MovieContext'
import Navbar from './components/Navbar'
import "../src/css/App.css"

// Main App component
function App() {
  return (
    <div>
      {/* Provide the movie context to all child components */}
      <MovieProvider>
        {/* Top navigation bar */}
        <Navbar />

        {/* Main content area where routes will render their components */}
        <main className="main-content">
          <Routes>
            {/* Route for Home page */}
            <Route path="/" element={<Home />} />

            {/* Route for Favorites page */}
            <Route path="/favorites" element={<Favorites />} />
          </Routes>
        </main>
      </MovieProvider>
    </div>
  )
}

export default App