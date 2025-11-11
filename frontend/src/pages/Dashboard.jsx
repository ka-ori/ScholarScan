import { useState } from 'react'
import { 
  FileText, Upload, Brain, Search, Filter, Clock, Tag, LogOut
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

function Dashboard() {
  const navigate = useNavigate()
  const { logout } = useAuthStore()
  const [activeView, setActiveView] = useState('library')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Mock data for demonstration
  const mockPapers = [
    {
      id: 1,
      title: "Attention Is All You Need: A Comprehensive Study of...",
      description: "This seminal paper introduces the Transformer architecture, revolutionizing natural language...",
      category: "Machine Learning",
      date: "2024-01-15",
      tags: ["Transformers", "Attention Mechanism", "Neural Networks"],
      status: "analyzed"
    },
    {
      id: 2,
      title: "Deep Residual Learning for Image Recognition",
      description: "ResNet introduces skip connections that enable training of extremely deep neural networks. This breakthrough...",
      category: "Computer Vision",
      date: "2024-01-12",
      tags: ["ResNet", "Deep Learning", "Image Classification"],
      status: "analyzed"
    },
    {
      id: 3,
      title: "BERT: Pre-training of Deep Bidirectional Transformers fo...",
      description: "BERT demonstrates the power of bidirectional pre-training for language representations. By using masked...",
      category: "Natural Language Processing",
      date: "2024-01-10",
      tags: ["BERT", "Pre-training", "Language Models"],
      status: "analyzing"
    },
    {
      id: 4,
      title: "Generative Adversarial Networks",
      description: "GANs present a novel framework for training generative models through an adversarial process...",
      category: "Machine Learning",
      date: "2024-01-08",
      tags: ["GANs", "Generative Models", "Deep Learning"],
      status: "analyzed"
    },
    {
      id: 5,
      title: "Reinforcement Learning in Robotics",
      description: "This comprehensive survey explores the application of reinforcement learning techniques in robotic...",
      category: "Robotics",
      date: "2024-01-05",
      tags: ["Reinforcement Learning", "Robotics", "Control"],
      status: "analyzed"
    },
    {
      id: 6,
      title: "Graph Neural Networks: A Review",
      description: "GNNs extend deep learning to graph-structured data, enabling powerful representations for molecular...",
      category: "Data Science",
      date: "2024-01-03",
      tags: ["GNNs", "Graph Theory", "Neural Networks"],
      status: "analyzing"
    }
  ]

  const categories = [
    "Machine Learning",
    "Computer Vision", 
    "Natural Language Processing",
    "Robotics",
    "Data Science"
  ]

  const getCategoryColor = (category) => {
    const colors = {
      "Machine Learning": "bg-blue-500",
      "Computer Vision": "bg-purple-500",
      "Natural Language Processing": "bg-green-500",
      "Robotics": "bg-orange-500",
      "Data Science": "bg-pink-500"
    }
    return colors[category] || "bg-gray-500"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-black mb-2">Your Research Library</h1>
            <p className="text-gray-600">Upload, analyze, and organize your academic papers with AI</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center gap-2 border border-gray-200"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveView('upload')}
            className={`px-6 py-3 font-medium transition-colors relative ${
              activeView === 'upload'
                ? 'text-black border-b-2 border-black'
                : 'text-gray-500 hover:text-black'
            }`}
          >
            Upload Paper
          </button>
          <button
            onClick={() => setActiveView('library')}
            className={`px-6 py-3 font-medium transition-colors relative ${
              activeView === 'library'
                ? 'text-black border-b-2 border-black'
                : 'text-gray-500 hover:text-black'
            }`}
          >
            My Library (6)
          </button>
        </div>

        {activeView === 'upload' ? (
          /* Upload View */
          <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-16 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Upload className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-xl font-bold text-black mb-3">Upload Research Paper</h3>
              <p className="text-gray-600 mb-6">Drag and drop your PDF file here, or click to browse</p>
              <button className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
                Browse Files
              </button>
              <p className="text-sm text-gray-500 mt-4">
                <FileText className="w-4 h-4 inline mr-1" />
                PDF files only, max 50MB
              </p>
            </div>
          </div>
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
                  onChange={(e) => setSearchQuery(e.target.value)}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockPapers.map((paper) => (
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
                      {new Date(paper.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-black mb-2 line-clamp-2">
                    {paper.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {paper.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {paper.tags.slice(0, 2).map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium border border-gray-200"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                    {paper.tags.length > 2 && (
                      <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium border border-gray-200">
                        +{paper.tags.length - 2} more
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

                  {/* Status Badge */}
                  {paper.status === 'analyzing' && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <Brain className="w-4 h-4 text-gray-500 animate-pulse" />
                        <span className="text-xs text-gray-500 font-medium">AI Analysis in progress...</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Dashboard
