import { Link, useLocation } from 'react-router-dom'
import { GraduationCap, LogOut } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

function Navbar() {
  const location = useLocation()
  const { isAuthenticated, logout, user } = useAuthStore()

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    logout()
  }

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-black stroke-2" />
            </div>
            <span className="text-base font-semibold text-black">
              ScholarScan
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            {isAuthenticated ? (
              <>
                {/* Authenticated Navigation */}
                <Link
                  to="/"
                  className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                    isActive('/') 
                      ? 'bg-gray-100 text-black font-medium' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/dashboard"
                  className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                    isActive('/dashboard') 
                      ? 'bg-gray-100 text-black font-medium' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                  }`}
                >
                  Dashboard
                </Link>

                {/* Authenticated User Buttons */}
                <div className="flex items-center gap-2 ml-3 pl-3 border-l border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-sm font-semibold text-blue-600">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">{user?.name || 'User'}</span>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1.5 rounded-md text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 font-medium transition-colors flex items-center gap-1"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Unauthenticated Navigation */}
                <Link
                  to="/"
                  className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                    isActive('/') 
                      ? 'bg-gray-100 text-black font-medium' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/dashboard"
                  className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                    isActive('/dashboard') 
                      ? 'bg-gray-100 text-black font-medium' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                  }`}
                >
                  Dashboard
                </Link>

                {/* Auth Buttons */}
                <div className="flex items-center gap-2 ml-3 pl-3 border-l border-gray-200">
                  <Link 
                    to="/login" 
                    className="px-4 py-1.5 rounded-md text-sm text-gray-600 hover:bg-gray-50 hover:text-black font-medium transition-colors"
                  >
                    Log in
                  </Link>
                  <Link 
                    to="/signup" 
                    className="ml-2 px-4 py-1.5 rounded-md bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors"
                  >
                    Get ScholarScan free
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
