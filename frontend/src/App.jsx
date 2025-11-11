import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from './store/authStore'
import HomePage from './pages/HomePage'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Upload from './pages/Upload'
import PaperDetail from './pages/PaperDetail'
import About from './pages/About'
import Pricing from './pages/Pricing'
import Security from './pages/Security'
import Contact from './pages/Contact'

function App() {
  const { isAuthenticated, _hasHydrated } = useAuthStore()
  const { setHasHydrated } = useAuthStore()

  useEffect(() => {
    // Trigger hydration check on mount
    setHasHydrated(true)
  }, [setHasHydrated])

  // Show loading state while hydrating
  if (!_hasHydrated) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/security" element={<Security />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/upload"
          element={isAuthenticated ? <Upload /> : <Navigate to="/login" />}
        />
        <Route
          path="/paper/:id"
          element={isAuthenticated ? <PaperDetail /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  )
}

export default App
