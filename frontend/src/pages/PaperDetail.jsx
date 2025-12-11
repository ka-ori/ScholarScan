import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Calendar, FileText, Edit2, Save, X, 
  ExternalLink, User, ChevronRight, Eye, Trash2, Plus
} from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/axios'
import PDFViewer from '../components/PDFViewer'

function PaperDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [paper, setPaper] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({})
  const [keyFindings, setKeyFindings] = useState([])
  const [summaryText, setSummaryText] = useState('')
  
  const [showPdfViewer, setShowPdfViewer] = useState(false)
  const [pdfPageNumber, setPdfPageNumber] = useState(1)
  const [highlightText, setHighlightText] = useState('')

   
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [editingNoteId, setEditingNoteId] = useState(null)
  const [editNoteContent, setEditNoteContent] = useState('')

  useEffect(() => {
    const fetchPaper = async () => {
      try {
        const { data } = await api.get(`/papers/${id}`)
        
         
        let parsedSummary = ''
        let parsedFindings = []
        
        const rawSummary = data.paper.summary || ''
        
         
        if (typeof rawSummary === 'string' && rawSummary.trim().startsWith('{')) {
          try {
            const parsed = JSON.parse(rawSummary)
            parsedSummary = parsed.summary || rawSummary
            parsedFindings = parsed.keyFindings || []
          } catch {
             
            parsedSummary = rawSummary
          }
        } else if (typeof rawSummary === 'object' && rawSummary !== null) {
           
          parsedSummary = rawSummary.summary || ''
          parsedFindings = rawSummary.keyFindings || []
        } else {
          parsedSummary = rawSummary
        }
        
         
        if (data.paper.summaryText) {
          parsedSummary = data.paper.summaryText
        }
        if (data.paper.keyFindings && Array.isArray(data.paper.keyFindings) && data.paper.keyFindings.length > 0) {
          parsedFindings = data.paper.keyFindings
        }
        
        setPaper(data.paper)
        setSummaryText(parsedSummary)
        setKeyFindings(parsedFindings)
        
        setFormData({
          title: data.paper.title,
          authors: data.paper.authors || '',
          summary: parsedSummary,
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
    fetchPaper()
    fetchNotes()
  }, [id, navigate])

  const fetchNotes = async () => {
    try {
      const { data } = await api.get(`/notes/${id}`)
      setNotes(data.notes)
    } catch (error) {
      console.error('Failed to fetch notes', error)
    }
  }

  const handleAddNote = async () => {
    if (!newNote.trim()) return
    try {
      const { data } = await api.post('/notes', { content: newNote, paperId: id })
      setNotes([data.note, ...notes])
      setNewNote('')
      toast.success('Note added')
    } catch (error) {
      toast.error('Failed to add note')
    }
  }

  const handleUpdateNote = async (noteId) => {
    if (!editNoteContent.trim()) return
    try {
      const { data } = await api.put(`/notes/${noteId}`, { content: editNoteContent })
      setNotes(notes.map(n => n.id === noteId ? data.note : n))
      setEditingNoteId(null)
      toast.success('Note updated')
    } catch (error) {
      toast.error('Failed to update note')
    }
  }

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Delete this note?')) return
    try {
      await api.delete(`/notes/${noteId}`)
      setNotes(notes.filter(n => n.id !== noteId))
      toast.success('Note deleted')
    } catch (error) {
      toast.error('Failed to delete note')
    }
  }

  const handleDeletePaper = async () => {
    if (!window.confirm('Are you sure you want to delete this paper? This action cannot be undone.')) return
    try {
      await api.delete(`/papers/${id}`)
      toast.success('Paper deleted successfully')
      navigate('/dashboard')
    } catch (error) {
      toast.error('Failed to delete paper')
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
      summary: summaryText,
      keywords: paper.keywords.join(', '),
      category: paper.category,
      publicationYear: paper.publicationYear || '',
      journal: paper.journal || '',
      doi: paper.doi || '',
    })
    setEditing(false)
  }

  const handleFindingClick = (finding) => {
    setPdfPageNumber(finding.pageNumber || 1)
    setHighlightText(finding.textSnippet || finding.finding)
    setShowPdfViewer(true)
  }

  const categories = [
    'Computer Science', 'Artificial Intelligence', 'Machine Learning',
    'Natural Language Processing', 'Computer Vision', 'Bioinformatics',
    'Physics', 'Mathematics', 'Chemistry', 'Biology', 'Medicine',
    'Engineering', 'Social Sciences', 'Economics', 'Psychology', 'Other',
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-black border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {showPdfViewer && (
        <PDFViewer
          pdfUrl={`${import.meta.env.VITE_API_URL}/papers/${id}/pdf`}
          pageNumber={pdfPageNumber}
          highlightText={highlightText}
          onClose={() => setShowPdfViewer(false)}
        />
      )}

      <div className="max-w-5xl mx-auto px-6 py-12">
        { }
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setPdfPageNumber(1)
                setHighlightText('')
                setShowPdfViewer(true)
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-200 rounded-lg hover:border-black transition-colors"
            >
              <Eye className="h-4 w-4" />
              View PDF
            </button>
            {!editing ? (
              <>
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={handleDeletePaper}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </>
            ) : (
              <>
                <button onClick={handleCancel} className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-200 rounded-lg hover:border-black transition-colors">
                  <X className="h-4 w-4" />
                  Cancel
                </button>
                <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                  <Save className="h-4 w-4" />
                  Save
                </button>
              </>
            )}
          </div>
        </div>

        { }
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            {editing ? (
              <select
                className="text-xs px-3 py-1 border border-gray-200 rounded-full"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            ) : (
              <span className="text-xs px-3 py-1 bg-black text-white rounded-full">{paper.category}</span>
            )}
            <span className="text-xs text-gray-400">
              {new Date(paper.uploadedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
          </div>

          {editing ? (
            <input
              type="text"
              className="w-full text-3xl font-semibold border-b border-gray-200 pb-2 focus:outline-none focus:border-black"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          ) : (
            <h1 className="text-3xl font-semibold text-black leading-tight">{paper.title}</h1>
          )}

          <div className="flex items-center gap-6 mt-4 text-sm text-gray-500">
            <div className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              {editing ? (
                <input
                  type="text"
                  className="border-b border-gray-200 focus:outline-none focus:border-black bg-transparent"
                  placeholder="Authors"
                  value={formData.authors}
                  onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
                />
              ) : (
                <span>{paper.authors || 'Unknown authors'}</span>
              )}
            </div>
            {paper.publicationYear && (
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>{paper.publicationYear}</span>
              </div>
            )}
            {paper.doi && (
              <a 
                href={`https://doi.org/${paper.doi}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-black transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                <span>DOI</span>
              </a>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          { }
          <div className="lg:col-span-2 space-y-10">
            { }
            <section>
              <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">Summary</h2>
              {editing ? (
                <textarea
                  className="w-full border border-gray-200 rounded-lg p-4 focus:outline-none focus:border-black text-gray-700 leading-relaxed"
                  rows="6"
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                />
              ) : (
                <p className="text-gray-700 leading-relaxed">{summaryText}</p>
              )}
            </section>

            { }
            {keyFindings.length > 0 && (
              <section>
                <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
                  Key Findings ({keyFindings.length})
                </h2>
                <div className="space-y-3">
                  {keyFindings.map((finding, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleFindingClick(finding)}
                      className="group p-4 border border-gray-100 rounded-lg hover:border-gray-300 transition-all cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs text-gray-400 uppercase tracking-wide">
                              {finding.section || 'Finding'}
                            </span>
                            {finding.pageNumber && (
                              <span className="text-xs text-gray-300">p. {finding.pageNumber}</span>
                            )}
                          </div>
                          <p className="text-gray-800 text-sm">{finding.finding}</p>
                          {finding.textSnippet && (
                            <p className="text-xs text-gray-400 mt-2 italic border-l-2 border-gray-200 pl-3">
                              {finding.textSnippet}
                            </p>
                          )}
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-black transition-colors flex-shrink-0 mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          { }
          <div className="space-y-8">
            { }
            <section>
              <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">Keywords</h2>
              {editing ? (
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black"
                  placeholder="keyword1, keyword2"
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {paper.keywords.map((keyword, idx) => (
                    <span key={idx} className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
                      {keyword}
                    </span>
                  ))}
                </div>
              )}
            </section>

            { }
            <section>
              <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">File</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <span className="truncate" title={paper.fileName}>{paper.fileName}</span>
                </div>
                <div className="text-gray-400 text-xs">
                  {(paper.fileSize / 1024 / 1024).toFixed(2)} MB
                </div>
              </div>
            </section>

            { }
            <section className="pt-6 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-semibold text-black">{keyFindings.length}</div>
                  <div className="text-xs text-gray-400">Findings</div>
                </div>
                <div>
                  <div className="text-2xl font-semibold text-black">{paper.keywords.length}</div>
                  <div className="text-xs text-gray-400">Keywords</div>
                </div>
              </div>
            </section>

            { }
            <section className="pt-6 border-t border-gray-100">
              <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">Personal Notes</h2>
              
              { }
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note..."
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                />
                <button 
                  onClick={handleAddNote}
                  className="p-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              { }
              <div className="space-y-3">
                {notes.map((note) => (
                  <div key={note.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 group">
                    {editingNoteId === note.id ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editNoteContent}
                          onChange={(e) => setEditNoteContent(e.target.value)}
                          className="flex-1 bg-white border border-gray-200 rounded px-2 py-1 text-sm"
                          autoFocus
                        />
                        <button 
                          onClick={() => handleUpdateNote(note.id)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                        >
                          <Save className="h-3 w-3" />
                        </button>
                        <button 
                          onClick={() => setEditingNoteId(null)}
                          className="p-1 text-gray-400 hover:bg-gray-200 rounded"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-between items-start gap-2">
                        <p className="text-sm text-gray-700 break-words">{note.content}</p>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => {
                              setEditingNoteId(note.id)
                              setEditNoteContent(note.content)
                            }}
                            className="p-1 text-gray-400 hover:text-black hover:bg-gray-200 rounded"
                          >
                            <Edit2 className="h-3 w-3" />
                          </button>
                          <button 
                            onClick={() => handleDeleteNote(note.id)}
                            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    )}
                    <div className="text-xs text-gray-400 mt-2">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaperDetail
