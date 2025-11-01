import { useState, useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import { FileText, Upload, Brain, Sparkles, Search, Calendar, User } from 'lucide-react'

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

  // Mock data for demonstration - shows what the dashboard will look like when papers are uploaded
  const mockPapers = []

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Research Library
            </h1>
            <p className="text-gray-600">
              Welcome back, {user?.name || user?.email?.split('@')[0]}! 📚
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>{user?.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Papers</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <FileText className="h-10 w-10 text-indigo-500 opacity-50" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Analyzed</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <Brain className="h-10 w-10 text-purple-500 opacity-50" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-pink-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">This Month</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <Calendar className="h-10 w-10 text-pink-500 opacity-50" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Member Since</p>
                <p className="text-sm font-semibold text-gray-900">{joinDate || 'Today'}</p>
              </div>
              <Sparkles className="h-10 w-10 text-green-500 opacity-50" />
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          {mockPapers.length === 0 ? (
            // Empty State
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 mb-6">
                <Upload className="h-12 w-12 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                No Papers Yet
              </h2>
              <p className="text-gray-600 max-w-md mx-auto mb-8">
                Upload your first research paper to get AI-powered analysis, summaries, and insights. 
                PDF upload functionality coming in the next milestone!
              </p>
              
              {/* Coming Soon Badge */}
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl border-2 border-indigo-200">
                <Sparkles className="h-5 w-5 text-indigo-600" />
                <span className="font-semibold text-indigo-900">
                  Upload Feature Coming Soon
                </span>
              </div>

              {/* Feature Preview */}
              <div className="mt-12 grid md:grid-cols-3 gap-6 text-left">
                <div className="p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl">
                  <Upload className="h-8 w-8 text-indigo-600 mb-3" />
                  <h3 className="font-bold text-gray-900 mb-2">Easy Upload</h3>
                  <p className="text-sm text-gray-600">
                    Drag & drop PDF files for instant processing
                  </p>
                </div>
                <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                  <Brain className="h-8 w-8 text-purple-600 mb-3" />
                  <h3 className="font-bold text-gray-900 mb-2">AI Analysis</h3>
                  <p className="text-sm text-gray-600">
                    Automatic extraction of key insights and summaries
                  </p>
                </div>
                <div className="p-6 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl">
                  <Search className="h-8 w-8 text-pink-600 mb-3" />
                  <h3 className="font-bold text-gray-900 mb-2">Search & Organize</h3>
                  <p className="text-sm text-gray-600">
                    Find papers quickly with smart search and filters
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // Papers Grid (will be populated later)
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Paper cards will appear here when upload is implemented */}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
