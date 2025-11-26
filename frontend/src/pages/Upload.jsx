import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload as UploadIcon, FileText, CheckCircle, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/axios'

function Upload() {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const navigate = useNavigate()

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        toast.error('Please upload a PDF file')
        return
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB')
        return
      }
      setFile(selectedFile)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      if (droppedFile.type !== 'application/pdf') {
        toast.error('Please upload a PDF file')
        return
      }
      if (droppedFile.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB')
        return
      }
      setFile(droppedFile)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleUpload = async () => {
    console.log('🚀 handleUpload called')
    console.log('📁 File state:', file)
    console.log('⏳ Uploading state:', uploading)
    
    if (!file) {
      console.log('❌ No file selected')
      toast.error('Please select a file')
      return
    }

    console.log('✅ File validation passed, starting upload...')
    setUploading(true)
    setProgress(0)

    const formData = new FormData()
    formData.append('pdf', file)
    console.log('📦 FormData created:', formData.get('pdf'))

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 500)

      const { data } = await api.post('/papers', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      clearInterval(progressInterval)
      setProgress(100)

      toast.success('Paper uploaded and analyzed successfully!')
      setTimeout(() => {
        console.log('🔄 Navigating to paper detail:', data.paper.id)
        navigate(`/paper/${data.paper.id}`)
      }, 1000)
    } catch (error) {
      console.error('❌ Upload error:', error)
      console.error('Error response:', error.response)
      console.error('Error message:', error.message)
      console.error('Error status:', error.response?.status)
      console.error('Error data:', error.response?.data)
      setProgress(0)
      toast.error(error.response?.data?.error || 'Upload failed')
    } finally {
      console.log('🏁 Upload process finished, resetting uploading state')
      setUploading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-4 text-gray-600 hover:text-black flex items-center gap-2 transition-colors"
        >
          ← Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Research Paper</h1>
        <p className="text-gray-600">
          Upload a PDF file and let AI analyze and summarize it for you
        </p>
      </div>

      {/* Upload Card */}
      <div className="card">
        {!file ? (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-primary-500 transition-colors cursor-pointer"
            onClick={() => document.getElementById('file-input').click()}
          >
            <UploadIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Drop your PDF here or click to browse
            </h3>
            <p className="text-gray-600 mb-4">
              Maximum file size: 10MB
            </p>
            <input
              id="file-input"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            <button className="btn-primary">
              Select PDF File
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <FileText className="h-12 w-12 text-primary-600" />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{file.name}</h4>
                <p className="text-sm text-gray-600">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              {!uploading && (
                <button
                  onClick={() => setFile(null)}
                  className="text-gray-600 hover:text-red-600 transition-colors"
                >
                  Remove
                </button>
              )}
            </div>

            {uploading && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">
                    {progress < 100 ? 'Analyzing paper...' : 'Complete!'}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {!uploading && (
              <button
                onClick={handleUpload}
                className="w-full btn-primary"
              >
                Upload and Analyze
              </button>
            )}
          </div>
        )}
      </div>

      {/* Info Cards */}
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <div className="card">
          <CheckCircle className="h-8 w-8 text-green-600 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            AI-Powered Analysis
          </h3>
          <p className="text-gray-600">
            Our AI extracts key information, generates summaries, and categorizes your research paper automatically.
          </p>
        </div>
        <div className="card">
          <AlertCircle className="h-8 w-8 text-blue-600 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Secure & Private
          </h3>
          <p className="text-gray-600">
            Your papers are securely stored and only accessible to you. We use industry-standard encryption.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Upload
