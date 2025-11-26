import { useState, useEffect } from 'react'
import { 
  FileText, Upload, Brain, Search, Filter, Clock, Tag, LogOut, Settings
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import api from '../api/axios'
import toast from 'react-hot-toast'

function Dashboard() {
  const navigate = useNavigate()
  const { logout, user } = useAuthStore()
  const [activeView, setActiveView] = useState('library')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [papers, setPapers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPapers()
  }, [selectedCategory])

  const fetchPapers = async (search = searchQuery) => {
    try {
      setLoading(true)
      const params = {}
      if (selectedCategory !== 'All Categories') {
        params.category = selectedCategory
      }
      if (search) {
        params.search = search
      }
      
      const { data } = await api.get('/papers', { params })
      setPapers(data.papers || [])
    } catch (error) {
      console.error('Failed to fetch papers:', error)
      toast.error('Failed to load papers')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const categories = [
    'Computer Science',
    'Artificial Intelligence',
    'Machine Learning',
    'Natural Language Processing',
    'Computer Vision',
    'Physics',
    'Mathematics',
    'Other'
  ]

  const getCategoryColor = (category) => {
    const colors = {
      'Computer Science': 'bg-blue-500',
      'Artificial Intelligence': 'bg-purple-500',
      'Machine Learning': 'bg-indigo-500',
      'Natural Language Processing': 'bg-green-500',
      'Computer Vision': 'bg-pink-500',
      'Physics': 'bg-yellow-500',
      'Mathematics': 'bg-red-500',
      'Other': 'bg-gray-500'
    }
    return colors[category] || 'bg-gray-500'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 xl:px-8 py-6 sm:py-8">
        {/* Welcome Section with User Name */}
        <div className="mb-8 bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex-1">
              <p className="text-gray-600 text-xs sm:text-sm mb-1">Welcome back,</p>
              <h1 className="text-2xl sm:text-3xl font-bold text-black">
                {user?.name || 'Researcher'}! 👋
              </h1>
              <p className="text-gray-600 text-sm mt-2">Upload, analyze, and organize your papers with AI</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate('/settings')}
                className="w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors flex items-center justify-center sm:justify-start gap-2 border border-gray-200"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center justify-center sm:justify-start gap-2 border border-gray-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 overflow-x-auto">
          <button
            onClick={() => navigate('/upload')}
            className={`px-4 sm:px-6 py-3 font-medium transition-colors relative whitespace-nowrap text-sm sm:text-base ${
              activeView === 'upload'
                ? 'text-black border-b-2 border-black'
                : 'text-gray-500 hover:text-black'
            }`}
          >
            Upload Paper
          </button>
          <button
            onClick={() => setActiveView('library')}
            className={`px-4 sm:px-6 py-3 font-medium transition-colors relative whitespace-nowrap text-sm sm:text-base ${
              activeView === 'library'
                ? 'text-black border-b-2 border-black'
                : 'text-gray-500 hover:text-black'
            }`}
          >
            My Library ({papers.length})
          </button>
        </div>

        {activeView === 'upload' ? (
          /* Upload View */
          navigate('/upload')
        ) : (
          /* Library View */
          <div>
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search papers by title, keywords, or summary..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    // Fetch papers with search query
                    fetchPapers(e.target.value)
                  }}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div className="flex gap-2">
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white text-gray-700"
                >
                  <option>All Categories</option>
                  {categories.map(cat => (
                    <option key={cat}>{cat}</option>
                  ))}
                </select>
                <button className="px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Filter className="w-5 h-5 text-gray-600" />
                </button>
                <select className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white text-gray-700">
                  <option>Most Recent</option>
                  <option>Oldest First</option>
                  <option>A-Z</option>
                  <option>Z-A</option>
                </select>
              </div>
            </div>

            {/* Papers Grid */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading your papers...</p>
                </div>
              </div>
            ) : papers.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No papers yet</h3>
                <p className="text-gray-600 mb-6">Upload your first research paper to get started with AI analysis</p>
                <button 
                  onClick={() => navigate('/upload')}
                  className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  Upload Paper
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {papers.map((paper) => (
                  <div
                    key={paper.id}
                    className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => navigate(`/paper/${paper.id}`)}
                  >
                    {/* Category Badge */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className={`w-10 h-10 ${getCategoryColor(paper.category)} rounded-lg flex items-center justify-center`}>
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        {new Date(paper.uploadedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-black mb-2 line-clamp-2">
                      {paper.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {typeof paper.summary === 'string' && paper.summary.startsWith('{') 
                        ? JSON.parse(paper.summary).summary 
                        : paper.summary}
                    </p>

                    {/* Keywords/Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(paper.keywords || []).slice(0, 2).map((tag, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium border border-gray-200"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                      {(paper.keywords || []).length > 2 && (
                        <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium border border-gray-200">
                          +{paper.keywords.length - 2} more
                        </span>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-sm text-gray-600">{paper.category}</span>
                      <button className="text-sm font-medium text-black hover:underline flex items-center gap-1">
                        View Details
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default Dashboard
