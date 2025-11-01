import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, FileText, Calendar, Tag, Trash2, Edit } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/axios'

function Dashboard() {
  const [papers, setPapers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [stats, setStats] = useState({ totalPapers: 0, categoryCounts: [] })
  const navigate = useNavigate()

  useEffect(() => {
    fetchPapers()
    fetchStats()
  }, [category, search])

  const fetchPapers = async () => {
    try {
      const params = {}
      if (search) params.search = search
      if (category) params.category = category
      
      const { data } = await api.get('/papers', { params })
      setPapers(data.papers)
    } catch (error) {
      toast.error('Failed to fetch papers')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/papers/stats/summary')
      setStats(data)
    } catch (error) {
      console.error('Failed to fetch stats')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this paper?')) return

    try {
      await api.delete(`/papers/${id}`)
      toast.success('Paper deleted successfully')
      fetchPapers()
      fetchStats()
    } catch (error) {
      toast.error('Failed to delete paper')
    }
  }

  const categories = [
    'All',
    'Computer Science',
    'Artificial Intelligence',
    'Machine Learning',
    'Natural Language Processing',
    'Computer Vision',
    'Bioinformatics',
    'Physics',
    'Mathematics',
    'Chemistry',
    'Biology',
    'Medicine',
    'Engineering',
    'Social Sciences',
    'Economics',
    'Psychology',
    'Other',
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Research Papers</h1>
        <p className="text-gray-600">
          Manage and explore your analyzed research papers
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Papers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPapers}</p>
            </div>
            <FileText className="h-10 w-10 text-primary-600" />
          </div>
        </div>
        {stats.categoryCounts.slice(0, 3).map((cat, idx) => (
          <div key={idx} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{cat.category}</p>
                <p className="text-2xl font-bold text-gray-900">{cat.count}</p>
              </div>
              <Tag className="h-10 w-10 text-primary-600" />
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                className="input-field pl-10"
                placeholder="Search papers by title, authors, or keywords..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="md:w-64">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                className="input-field pl-10"
                value={category}
                onChange={(e) => setCategory(e.target.value === 'All' ? '' : e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Papers List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading papers...</p>
        </div>
      ) : papers.length === 0 ? (
        <div className="card text-center py-12">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No papers found
          </h3>
          <p className="text-gray-600 mb-6">
            Upload your first research paper to get started
          </p>
          <button
            onClick={() => navigate('/upload')}
            className="btn-primary"
          >
            Upload Paper
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {papers.map((paper) => (
            <div
              key={paper.id}
              className="card hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/paper/${paper.id}`)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full font-medium">
                      {paper.category}
                    </span>
                    {paper.publicationYear && (
                      <span className="text-sm text-gray-500">
                        {paper.publicationYear}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {paper.title}
                  </h3>
                  {paper.authors && (
                    <p className="text-sm text-gray-600 mb-3">
                      {paper.authors}
                    </p>
                  )}
                  <p className="text-gray-700 mb-4 line-clamp-2">
                    {paper.summary}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {paper.keywords.map((keyword, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(paper.uploadedAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      {(paper.fileSize / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/paper/${paper.id}`)
                    }}
                    className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(paper.id)
                    }}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dashboard
