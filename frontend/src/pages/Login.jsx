import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react'
import { Notyf } from 'notyf'
import 'notyf/notyf.min.css'
import api from '../api/axios'
import { useAuthStore } from '../store/authStore'

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const { login } = useAuthStore()
  const navigate = useNavigate()

  // Initialize Notyf only once
  const notyf = useMemo(() => new Notyf({
    duration: 4000,
    position: { x: 'right', y: 'bottom' },
    dismissible: true,
    ripple: false,
    types: [
      {
        type: 'error',
        background: '#ef4444',
        icon: {
          className: 'notyf__icon--error',
          tagName: 'span',
          text: '✕'
        },
        duration: 4000,
        dismissible: true
      },
      {
        type: 'success',
        background: '#22c55e',
        icon: {
          className: 'notyf__icon--success',
          tagName: 'span',
          text: '✓'
        },
        duration: 2000,
        dismissible: true
      }
    ]
  }), [])

  const validateField = (name, value) => {
    if (name === 'email') {
      if (!value.trim()) {
        return 'Email address is required'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Please enter a valid email address'
      }
    }
    
    if (name === 'password') {
      if (!value) {
        return 'Password is required'
      } else if (value.length < 6) {
        return 'Password must be at least 6 characters'
      }
    }
    
    return null
  }

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true })
    
    // Validate on blur
    const error = validateField(field, formData[field])
    const newErrors = { ...errors }
    
    if (error) {
      newErrors[field] = error
    } else {
      delete newErrors[field]
    }
    
    // Always preserve submit error
    if (errors.submit) {
      newErrors.submit = errors.submit
    }
    
    setErrors(newErrors)
  }

  const handleSubmit = async (e) => {
    console.log('=== handleSubmit called ===', e)
    // Prevent ALL default form behavior
    if (e && typeof e.preventDefault === 'function') {
      console.log('Calling preventDefault')
      e.preventDefault()
      e.stopPropagation()
    }
    console.log('After preventDefault, formData:', formData)
    
    // Validate all fields
    const newErrors = {}
    const emailError = validateField('email', formData.email)
    const passwordError = validateField('password', formData.password)
    
    if (emailError) newErrors.email = emailError
    if (passwordError) newErrors.password = passwordError
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      notyf.error('Please fix the errors in the form')
      return
    }

    setLoading(true)

    try {
      const { data } = await api.post('/api/auth/login', formData)
      setLoading(false)
      login(data.token, data.user)
      notyf.success('Login successful! Redirecting...')
      // ONLY reset on success
      setFormData({ email: '', password: '' })
      setTouched({})
      setErrors({})
      setTimeout(() => navigate('/dashboard'), 800)
    } catch (error) {
      setLoading(false)
      const errorMessage = error.response?.data?.error || 'Login failed. Please try again.'
      console.error('Login error:', errorMessage)
      console.log('Form data before error toast:', formData)
      // IMPORTANT: DO NOT clear formData, touched, or errors on error
      // User needs to see what they entered and the error message
      notyf.error(errorMessage)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    
    // Only validate if field has been touched
    if (touched[name]) {
      const error = validateField(name, value)
      const newErrors = { ...errors }
      
      if (error) {
        newErrors[name] = error
      } else {
        delete newErrors[name]
      }
      
      // CRITICAL: Always preserve submit error when typing
      if (errors.submit) {
        newErrors.submit = errors.submit
      }
      
      setErrors(newErrors)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Left Side - Features/Content */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-50 to-blue-100 flex-col justify-center items-center p-8 lg:p-12">
        <div className="max-w-md">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            Start analyzing instantly
          </h2>
          <p className="text-base lg:text-lg text-gray-600 mb-8">
            Join thousands of researchers who use ScholarScan to save time and accelerate their work.
          </p>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Instant Summaries</h3>
                <p className="text-sm text-gray-600">Get key insights from your papers in seconds</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Never Lose Context</h3>
                <p className="text-sm text-gray-600">All your research in one organized place</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Save Time</h3>
                <p className="text-sm text-gray-600">Spend less time reading, more time researching</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-6 py-8 sm:py-12 lg:px-16">
        <div className="w-full max-w-sm mx-auto">
          {/* Header */}
          <div className="mb-8 sm:mb-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-sm sm:text-base text-gray-600">Sign in to your ScholarScan account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  required
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-colors ${
                    touched.email && errors.email
                      ? 'border-red-300 bg-red-50'
                      : touched.email && formData.email && !errors.email
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-300'
                  }`}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur('email')}
                />
                {touched.email && !errors.email && formData.email && (
                  <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                )}
              </div>
              {touched.email && errors.email && (
                <div className="mt-2 flex gap-2 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  {errors.email}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  required
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-colors ${
                    touched.password && errors.password
                      ? 'border-red-300 bg-red-50'
                      : touched.password && formData.password && !errors.password
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={() => handleBlur('password')}
                />
                {touched.password && !errors.password && formData.password && (
                  <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                )}
              </div>
              {touched.password && errors.password && (
                <div className="mt-2 flex gap-2 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  {errors.password}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || errors.email || errors.password}
              className="w-full py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-gray-600">
            Don{"'"}t have an account?{' '}
            <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
