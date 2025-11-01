import { Link, useNavigate, useLocation } from 'react-router-dom'
import { GraduationCap, LogOut, Upload, LayoutDashboard, Sparkles, Home } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <GraduationCap className="h-8 w-8 text-indigo-600 group-hover:text-indigo-700 transition-colors" />
              <Sparkles className="h-4 w-4 text-purple-500 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              ScholarScan
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive('/') 
                      ? 'bg-indigo-50 text-indigo-600 font-medium' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Home className="h-4 w-4" />
                  <span className="hidden sm:inline">Home</span>
                </Link>
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive('/dashboard') 
                      ? 'bg-indigo-50 text-indigo-600 font-medium' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
                <Link
                  to="/upload"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive('/upload') 
                      ? 'bg-indigo-50 text-indigo-600 font-medium' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Upload className="h-4 w-4" />
                  <span className="hidden sm:inline">Upload</span>
                </Link>
                
                {/* User Menu */}
                <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
                  <div className="hidden md:flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                      {(user?.name?.[0] || user?.email?.[0] || 'U').toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {user?.name || user?.email?.split('@')[0]}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                    title="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-5 py-2 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-all duration-200"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
