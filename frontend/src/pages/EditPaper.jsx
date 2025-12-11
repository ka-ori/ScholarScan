import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, X } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/axios'

function EditPaper() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    summary: '',
    keywords: '',
    category: '',
    publicationYear: '',
    journal: '',
    doi: '',
    notes: ''
  })

  const categories = [
    'Computer Science', 'Artificial Intelligence', 'Machine Learning',
    'Natural Language Processing', 'Computer Vision', 'Bioinformatics',
    'Physics', 'Mathematics', 'Chemistry', 'Biology', 'Medicine',
    'Engineering', 'Social Sciences', 'Economics', 'Psychology', 'Other',
  ]

  useEffect(() => {
    const fetchPaper = async () => {
      try {
        const { data } = await api.get(`/papers/${id}`)
        const paper = data.paper
        const summary = paper.summaryText || paper.summary
        
        setFormData({
          title: paper.title || '',
          authors: paper.authors || '',
          summary: summary || '',
          keywords: paper.keywords?.join(', ') || '',
          category: paper.category || '',
          publicationYear: paper.publicationYear || '',
          journal: paper.journal || '',
          doi: paper.doi || '',
          notes: paper.notes || ''
        })
      } catch (error) {
        toast.error('Failed to load paper')
        navigate('/dashboard')
      } finally {
        setLoading(false)
      }
    }
    fetchPaper()
  }, [id, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const updateData = {
        title: formData.title,
        authors: formData.authors || null,
        summary: formData.summary,
        keywords: formData.keywords.split(',').map(k => k.trim()).filter(Boolean),
        category: formData.category,
        publicationYear: formData.publicationYear ? parseInt(formData.publicationYear) : null,
        journal: formData.journal || null,
        doi: formData.doi || null
      }

      await api.put(`/papers/${id}`, updateData)
      toast.success('Paper updated successfully')
      navigate(`/paper/${id}`)
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update paper')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-black border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-12">
        { }
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(`/paper/${id}`)}
            className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Paper
          </button>
        </div>

        <h1 className="text-2xl font-semibold text-black mb-8">Edit Paper</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          { }
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-black transition-colors"
            />
          </div>

          { }
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              Authors
            </label>
            <input
              type="text"
              name="authors"
              value={formData.authors}
              onChange={handleChange}
              placeholder="John Doe, Jane Smith"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-black transition-colors"
            />
          </div>

          { }
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-black transition-colors bg-white"
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          { }
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                Publication Year
              </label>
              <input
                type="number"
                name="publicationYear"
                value={formData.publicationYear}
                onChange={handleChange}
                placeholder="2024"
                min="1900"
                max="2100"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-black transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                Journal / Conference
              </label>
              <input
                type="text"
                name="journal"
                value={formData.journal}
                onChange={handleChange}
                placeholder="Nature, IEEE, etc."
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-black transition-colors"
              />
            </div>
          </div>

          { }
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              DOI
            </label>
            <input
              type="text"
              name="doi"
              value={formData.doi}
              onChange={handleChange}
              placeholder="10.1000/xyz123"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-black transition-colors"
            />
          </div>

          { }
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              Keywords
            </label>
            <input
              type="text"
              name="keywords"
              value={formData.keywords}
              onChange={handleChange}
              placeholder="machine learning, AI, neural networks"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-black transition-colors"
            />
            <p className="text-xs text-gray-400 mt-1">Separate keywords with commas</p>
          </div>

          { }
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              Summary
            </label>
            <textarea
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              rows="6"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-black transition-colors resize-none"
            />
          </div>

          { }
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate(`/paper/${id}`)}
              className="flex items-center gap-2 px-6 py-2.5 text-sm border border-gray-200 rounded-lg hover:border-black transition-colors"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditPaper
