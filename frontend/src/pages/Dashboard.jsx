import { useState, useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import { CheckCircle, User, Mail, Calendar } from 'lucide-react'

function Dashboard() {
  const { user } = useAuthStore()
  const [joinDate, setJoinDate] = useState('')

  useEffect(() => {
    if (user?.createdAt) {
      const date = new Date(user.createdAt)
      setJoinDate(date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }))
    }
  }, [user])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
              {(user?.name?.[0] || user?.email?.[0] || 'U').toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.name || user?.email?.split('@')[0]}! 👋
              </h1>
              <p className="text-gray-600 mt-1">
                Milestone 1: Authentication is complete
              </p>
            </div>
          </div>

          {/* Success Badge */}
          <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-green-800 font-medium">
              You're successfully authenticated with JWT!
            </span>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <User className="h-5 w-5 text-indigo-600" />
              <h3 className="font-semibold text-gray-900">Name</h3>
            </div>
            <p className="text-gray-700">{user?.name || 'Not set'}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <Mail className="h-5 w-5 text-purple-600" />
              <h3 className="font-semibold text-gray-900">Email</h3>
            </div>
            <p className="text-gray-700 text-sm">{user?.email}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="h-5 w-5 text-pink-600" />
              <h3 className="font-semibold text-gray-900">Member Since</h3>
            </div>
            <p className="text-gray-700 text-sm">{joinDate || 'Today'}</p>
          </div>
        </div>

        {/* Milestone Info */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">🎯 Milestone 1 Complete!</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              <span>✅ Backend API with Express.js</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              <span>✅ PostgreSQL Database on Neon.tech</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              <span>✅ JWT Authentication</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              <span>✅ Login & Signup Features</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              <span>✅ Frontend with React & TailwindCSS</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              <span>✅ Live Hosted Application</span>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-white/20">
            <p className="text-indigo-100">
              More features coming in future milestones! 🚀
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
