import { useState, useEffect, useRef, useCallback } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Loader2, Search, AlertCircle } from 'lucide-react'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import api from '../api/axios'

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

function PDFViewer({ pdfUrl, pageNumber = 1, highlightText = '', onClose }) {
  const [numPages, setNumPages] = useState(null)
  const [currentPage, setCurrentPage] = useState(pageNumber)
  const [scale, setScale] = useState(1.2)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null)
  const [pdfDoc, setPdfDoc] = useState(null) // eslint-disable-line no-unused-vars
  const [searchingPages, setSearchingPages] = useState(false)
  const [searchStatus, setSearchStatus] = useState('')
  const containerRef = useRef(null)

  // Fetch PDF with authentication and create blob URL
  useEffect(() => {
    let blobUrl = null
    
    const fetchPdf = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Extract paper ID from URL
        const paperId = pdfUrl.split('/papers/')[1]?.split('/pdf')[0]
        if (!paperId) {
          throw new Error('Invalid PDF URL')
        }
        
        // First, try to get the PDF URL (which may be a Vercel Blob URL)
        try {
          const urlResponse = await api.get(`/papers/${paperId}/pdf`)
          if (urlResponse.data?.url) {
            // Got a Vercel Blob URL - load directly from there
            console.log('Using blob URL:', urlResponse.data.url)
            setPdfBlobUrl(urlResponse.data.url)
            setLoading(false)
            return
          }
        } catch (urlErr) {
          console.log('PDF URL fetch failed, trying blob download:', urlErr.response?.status)
        }
        
        // Fall back to downloading as blob
        const response = await api.get(`/papers/${paperId}/pdf`, {
          responseType: 'blob'
        })
        
        const blob = new Blob([response.data], { type: 'application/pdf' })
        blobUrl = URL.createObjectURL(blob)
        setPdfBlobUrl(blobUrl)
      } catch (err) {
        console.error('Failed to fetch PDF:', err)
        
        // Check if it's a cloud deployment limitation
        if (err.response?.status === 501) {
          setError('PDF viewing is not available in the cloud deployment. Please run the backend locally to view PDF files.')
        } else if (err.response?.status === 404) {
          setError('PDF file not found.')
        } else {
          setError('Failed to load PDF. Please try again.')
        }
        setLoading(false)
      }
    }
    
    fetchPdf()
    
    // Cleanup blob URL on unmount
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl)
      }
    }
  }, [pdfUrl])

  useEffect(() => {
    setCurrentPage(pageNumber)
  }, [pageNumber])

  const onDocumentLoadSuccess = async ({ numPages: pages }) => {
    setNumPages(pages)
    setLoading(false)
    
    // If we have highlight text, search for it across all pages
    if (highlightText && pdfBlobUrl) {
      searchForTextInPdf(pages)
    }
  }

  // Search through all pages to find the text
  const searchForTextInPdf = async (totalPages) => {
    if (!highlightText || !pdfBlobUrl) return
    
    setSearchingPages(true)
    setSearchStatus('Searching for text...')
    
    try {
      const loadingTask = pdfjs.getDocument(pdfBlobUrl)
      const pdf = await loadingTask.promise
      setPdfDoc(pdf)
      
      const normalizeText = (text) => {
        return text
          .toLowerCase()
          .replace(/[\n\r]+/g, ' ')
          .replace(/\s+/g, ' ')
          .replace(/[^\w\s]/g, '')
          .trim()
      }
      
      const searchTerms = normalizeText(highlightText).split(' ').filter(w => w.length > 3)
      const keyTerms = searchTerms.filter(w => w.length > 5).slice(0, 5)
      
      if (keyTerms.length === 0) {
        setSearchingPages(false)
        return
      }
      
      // Search each page for the text
      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        const page = await pdf.getPage(pageNum)
        const textContent = await page.getTextContent()
        const pageText = normalizeText(textContent.items.map(item => item.str).join(' '))
        
        // Check if this page contains most of the key terms
        const matchCount = keyTerms.filter(term => pageText.includes(term)).length
        
        if (matchCount >= Math.ceil(keyTerms.length * 0.5)) {
          console.log(`Found matching text on page ${pageNum}`)
          setSearchStatus(`Found on page ${pageNum}`)
          setCurrentPage(pageNum)
          setSearchingPages(false)
          return
        }
      }
      
      setSearchStatus('Text not found - showing suggested page')
      console.log('Text not found in any page, staying on suggested page')
    } catch (err) {
      console.error('Error searching PDF:', err)
      setSearchStatus('')
    } finally {
      setSearchingPages(false)
    }
  }

  const onDocumentLoadError = (error) => {
    console.error('PDF load error:', error)
    setError('Failed to load PDF')
    setLoading(false)
  }

  // Highlight text in the PDF after page renders
  const highlightTextInPage = useCallback(() => {
    if (!highlightText || !containerRef.current) return

    // Try multiple times with increasing delays for PDFs that render slowly
    const attemptHighlight = (attempt = 0) => {
      const textLayer = containerRef.current?.querySelector('.react-pdf__Page__textContent')
      if (!textLayer) {
        if (attempt < 10) {
          setTimeout(() => attemptHighlight(attempt + 1), 300)
        }
        return
      }

      // Get all text-containing elements (spans, divs, etc.)
      const textElements = textLayer.querySelectorAll('span, div[role="presentation"]')
      if (textElements.length === 0 && attempt < 10) {
        setTimeout(() => attemptHighlight(attempt + 1), 300)
        return
      }

      // Also check for br tags which some PDFs use
      const allElements = textLayer.querySelectorAll('*')

      // Clear previous highlights from all elements
      allElements.forEach(el => {
        el.style.backgroundColor = ''
        el.style.borderRadius = ''
        el.style.boxShadow = ''
        el.removeAttribute('data-highlighted')
      })

      // Normalize the search text
      const normalizeText = (text) => {
        return text
          .toLowerCase()
          .replace(/[\n\r]+/g, ' ')
          .replace(/\s+/g, ' ')
          .replace(/[^\w\s]/g, '')
          .trim()
      }

      const searchText = normalizeText(highlightText)
      const searchWords = searchText.split(' ').filter(w => w.length > 2)
      
      if (searchWords.length === 0) return

      let foundMatch = false
      let highlightedElements = []

      // Build element data
      const elementsWithText = Array.from(allElements)
        .filter(el => el.textContent && el.textContent.trim())
        .map(el => ({
          el,
          text: normalizeText(el.textContent || ''),
          rawText: (el.textContent || '').toLowerCase()
        }))

      // Get key words (longer, more significant words)
      const keyWords = searchWords
        .filter(w => w.length > 3)
        .sort((a, b) => b.length - a.length)
        .slice(0, 8)

      // Strategy 1: Look for elements that contain multiple search words
      elementsWithText.forEach((item) => {
        const { el, text, rawText } = item
        
        if (!text || text.length < 2) return
        
        // Count how many search words appear in this element
        const matchingWords = keyWords.filter(word => 
          text.includes(word) || rawText.includes(word)
        )
        const matchRatio = keyWords.length > 0 ? matchingWords.length / keyWords.length : 0

        // Match if we find significant portion of key words
        if (matchRatio >= 0.15 || matchingWords.length >= 2) {
          applyHighlight(el)
          highlightedElements.push(el)
          foundMatch = true
        }
      })

      // Strategy 2: If no match yet, try individual significant words
      if (!foundMatch && keyWords.length > 0) {
        const veryKeyWords = keyWords.filter(w => w.length > 5).slice(0, 4)
        
        elementsWithText.forEach(({ el, text, rawText }) => {
          const hasKeyWord = veryKeyWords.some(word => 
            text.includes(word) || rawText.includes(word)
          )
          if (hasKeyWord) {
            applyHighlight(el, 0.4)
            highlightedElements.push(el)
            foundMatch = true
          }
        })
      }

      // Strategy 3: Look for partial word matches (for hyphenated or split text)
      if (!foundMatch && keyWords.length > 0) {
        const longWords = keyWords.filter(w => w.length > 6)
        
        elementsWithText.forEach(({ el, text, rawText }) => {
          const hasPartialMatch = longWords.some(word => {
            // Check if at least half of the word matches
            const halfWord = word.substring(0, Math.ceil(word.length / 2))
            return text.includes(halfWord) || rawText.includes(halfWord)
          })
          if (hasPartialMatch) {
            applyHighlight(el, 0.3)
            highlightedElements.push(el)
            foundMatch = true
          }
        })
      }

      // Scroll to first highlighted element
      if (highlightedElements.length > 0) {
        highlightedElements[0].scrollIntoView({ behavior: 'smooth', block: 'center' })
      }

      function applyHighlight(element, opacity = 0.6) {
        element.style.backgroundColor = `rgba(255, 235, 59, ${opacity})`
        element.style.borderRadius = '2px'
        element.style.boxShadow = '0 0 2px rgba(255, 235, 59, 0.8)'
        element.setAttribute('data-highlighted', 'true')
      }

      // If still no match found, log for debugging
      if (!foundMatch) {
        console.log('No highlight match found for:', highlightText.substring(0, 50))
        console.log('Search words:', keyWords)
        console.log('Total text elements:', elementsWithText.length)
      }
    }

    // Start attempting to highlight after a short delay
    setTimeout(() => attemptHighlight(0), 200)
  }, [highlightText])

  const goToPrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1))
  }

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, numPages || prev))
  }

  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 3))
  }

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5))
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Page {currentPage} of {numPages || '...'}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={goToPrevPage}
              disabled={currentPage <= 1}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goToNextPage}
              disabled={currentPage >= numPages}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={zoomOut}
            className="p-2 rounded-lg hover:bg-gray-100"
            title="Zoom out"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <span className="text-sm text-gray-600 min-w-[60px] text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={zoomIn}
            className="p-2 rounded-lg hover:bg-gray-100"
            title="Zoom in"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-100"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Highlight info bar */}
      {highlightText && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2 flex items-center justify-between">
          <p className="text-sm text-yellow-800">
            <span className="font-medium">Highlighting:</span> &ldquo;{highlightText.substring(0, 100)}...&rdquo;
          </p>
          {searchingPages && (
            <div className="flex items-center gap-2 text-sm text-yellow-700">
              <Search className="w-4 h-4 animate-pulse" />
              <span>Searching pages...</span>
            </div>
          )}
          {searchStatus && !searchingPages && (
            <div className="flex items-center gap-2 text-sm text-yellow-700">
              <AlertCircle className="w-4 h-4" />
              <span>{searchStatus}</span>
            </div>
          )}
        </div>
      )}

      {/* PDF Container */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-auto bg-gray-800 flex justify-center py-4"
      >
        {loading && (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center h-full text-center px-8">
            <AlertCircle className="w-16 h-16 text-yellow-500 mb-4" />
            <p className="text-white text-lg font-medium mb-2">PDF Not Available</p>
            <p className="text-gray-400 max-w-md mb-6">{error}</p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors"
            >
              Close Viewer
            </button>
          </div>
        )}

        {pdfBlobUrl && (
          <Document
            file={pdfBlobUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={null}
            className="flex justify-center"
          >
            <Page
              pageNumber={currentPage}
              scale={scale}
              onRenderSuccess={highlightTextInPage}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              className="shadow-2xl"
            />
          </Document>
        )}
      </div>
    </div>
  )
}

export default PDFViewer
