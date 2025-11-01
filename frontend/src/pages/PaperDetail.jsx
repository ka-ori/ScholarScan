import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, FileText, Tag, Edit2, Save, X, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/axios'
import PDFPreviewModal from '../components/PDFPreviewModal'

function PaperDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [paper, setPaper] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({})
  const [showPDFPreview, setShowPDFPreview] = useState(false)
  const [selectedSection, setSelectedSection] = useState('')
  const [selectedTextSnippet, setSelectedTextSnippet] = useState('')
  const [selectedPageNumber, setSelectedPageNumber] = useState(null)

  useEffect(() => {
    fetchPaper()
  }, [id])

  const fetchPaper = async () => {
    try {
      const { data } = await api.get(`/papers/${id}`)
      setPaper(data.paper)
      setFormData({
        title: data.paper.title,
        authors: data.paper.authors || '',
        summary: data.paper.summary,
        keywords: data.paper.keywords.join(', '),
        category: data.paper.category,
        publicationYear: data.paper.publicationYear || '',
        journal: data.paper.journal || '',
        doi: data.paper.doi || '',
      })
    } catch (error) {
      toast.error('Failed to fetch paper details')
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const updateData = {
        ...formData,
        keywords: formData.keywords.split(',').map((k) => k.trim()).filter(Boolean),
        publicationYear: formData.publicationYear ? parseInt(formData.publicationYear) : null,
      }

      const { data } = await api.put(`/papers/${id}`, updateData)
      setPaper(data.paper)
      setEditing(false)
      toast.success('Paper updated successfully')
    } catch (error) {
      toast.error('Failed to update paper')
    }
  }

  const handleCancel = () => {
    setFormData({
      title: paper.title,
      authors: paper.authors || '',
      summary: paper.summary,
      keywords: paper.keywords.join(', '),
      category: paper.category,
      publicationYear: paper.publicationYear || '',
      journal: paper.journal || '',
      doi: paper.doi || '',
    })
    setEditing(false)
  }

  const categories = [
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

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading paper...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Dashboard
        </button>
        <div className="flex gap-2">
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 btn-primary"
            >
              <Edit2 className="h-4 w-4" />
              Edit
            </button>
          ) : (
            <>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 btn-secondary"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 btn-primary"
              >
                <Save className="h-4 w-4" />
                Save
              </button>
            </>
          )}
        </div>
      </div>

      {/* Paper Details */}
      <div className="card">
        {/* Category and Date */}
        <div className="flex items-center gap-4 mb-4">
          {editing ? (
            <select
              className="input-field"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          ) : (
            <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full font-medium">
              {paper.category}
            </span>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            Uploaded {new Date(paper.uploadedAt).toLocaleDateString()}
          </div>
        </div>

        {/* Title */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          {editing ? (
            <input
              type="text"
              className="input-field"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          ) : (
            <h1 className="text-3xl font-bold text-gray-900">{paper.title}</h1>
          )}
        </div>

        {/* Authors */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Authors
          </label>
          {editing ? (
            <input
              type="text"
              className="input-field"
              placeholder="John Doe, Jane Smith"
              value={formData.authors}
              onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
            />
          ) : (
            <p className="text-gray-600">{paper.authors || 'Not specified'}</p>
          )}
        </div>

        {/* Publication Info */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Publication Year
            </label>
            {editing ? (
              <input
                type="number"
                className="input-field"
                placeholder="2024"
                value={formData.publicationYear}
                onChange={(e) => setFormData({ ...formData, publicationYear: e.target.value })}
              />
            ) : (
              <p className="text-gray-600">{paper.publicationYear || 'N/A'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Journal/Conference
            </label>
            {editing ? (
              <input
                type="text"
                className="input-field"
                placeholder="Nature"
                value={formData.journal}
                onChange={(e) => setFormData({ ...formData, journal: e.target.value })}
              />
            ) : (
              <p className="text-gray-600">{paper.journal || 'N/A'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              DOI
            </label>
            {editing ? (
              <input
                type="text"
                className="input-field"
                placeholder="10.1000/xyz123"
                value={formData.doi}
                onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
              />
            ) : (
              <p className="text-gray-600">{paper.doi || 'N/A'}</p>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Summary
          </label>
          {editing ? (
            <textarea
              className="input-field"
              rows="8"
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            />
          ) : (
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                {paper.summary}
              </p>
            </div>
          )}
        </div>

        {/* Key Findings with PDF Preview Links */}
        {!editing && paper.keyFindings && paper.keyFindings.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary-600" />
              Key Findings & References
            </h3>
            <div className="space-y-3">
              {paper.keyFindings.map((finding, idx) => (
                <div
                  key={`finding-${idx}`}
                  className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-semibold text-sm">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 mb-2">{finding.finding}</p>
                      <button
                        onClick={() => {
                          setSelectedSection(finding.section)
                          setSelectedTextSnippet(finding.textSnippet || '')
                          setSelectedPageNumber(finding.pageNumber || null)
                          setShowPDFPreview(true)
                        }}
                        className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium"
                      >
                        <ExternalLink className="h-4 w-4" />
                        View in PDF: {finding.section}
                        {finding.pageNumber && (
                          <span className="text-xs text-gray-500">(Page {finding.pageNumber})</span>
                        )}
                        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                          finding.confidence === 'high' ? 'bg-green-100 text-green-700' :
                          finding.confidence === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {finding.confidence} confidence
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Keywords */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Keywords
          </label>
          {editing ? (
            <input
              type="text"
              className="input-field"
              placeholder="machine learning, AI, neural networks"
              value={formData.keywords}
              onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {paper.keywords.map((keyword, idx) => (
                <span
                  key={idx}
                  className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                >
                  <Tag className="h-3 w-3" />
                  {keyword}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* File Info */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">File Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Filename</p>
                <p className="font-medium text-gray-900">{paper.fileName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">File Size</p>
                <p className="font-medium text-gray-900">
                  {(paper.fileSize / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Preview Modal */}
      <PDFPreviewModal
        isOpen={showPDFPreview}
        onClose={() => setShowPDFPreview(false)}
        pdfUrl={`http://localhost:5001/uploads/${paper?.filePath}`}
        section={selectedSection}
        textSnippet={selectedTextSnippet}
        pageNumber={selectedPageNumber}
      />
    </div>
  )
}

export default PaperDetail

