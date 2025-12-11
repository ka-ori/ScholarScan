import { useState, useEffect, useRef, useCallback } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Loader2, Search, AlertCircle } from 'lucide-react'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import api from '../api/axios'

 
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

function PDFViewer({ pdfUrl, pageNumber = 1, highlightText = '', onClose }) {
  const [numPages, setNumPages] = useState(null)
  const [currentPage, setCurrentPage] = useState(pageNumber)
  const [scale, setScale] = useState(1.2)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null)
  const [pdfDoc, setPdfDoc] = useState(null)  
  const [searchingPages, setSearchingPages] = useState(false)
  const [searchStatus, setSearchStatus] = useState('')
  const containerRef = useRef(null)

   
  useEffect(() => {
    let blobUrl = null
    
    const fetchPdf = async () => {
      try {
        setLoading(true)
        setError(null)
        
         
        const paperId = pdfUrl.split('/papers/')[1]?.split('/pdf')[0]
        if (!paperId) {
          throw new Error('Invalid PDF URL')
        }
        
         
        try {
          const urlResponse = await api.get(`/papers/${paperId}/pdf`)
          if (urlResponse.data?.url) {
             
            console.log('Using blob URL:', urlResponse.data.url)
            setPdfBlobUrl(urlResponse.data.url)
            setLoading(false)
            return
          }
        } catch (urlErr) {
          console.log('PDF URL fetch failed, trying blob download:', urlErr.response?.status)
        }
        
         
        const response = await api.get(`/papers/${paperId}/pdf`, {
          responseType: 'blob'
        })
        
        const blob = new Blob([response.data], { type: 'application/pdf' })
        blobUrl = URL.createObjectURL(blob)
        setPdfBlobUrl(blobUrl)
      } catch (err) {
        console.error('Failed to fetch PDF:', err)
        
         
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
    
     
    if (highlightText && pdfBlobUrl) {
      searchForTextInPdf(pages)
    }
  }

   
  const searchForTextInPdf = async (totalPages) => {
    if (!highlightText || !pdfBlobUrl) return
    
    setSearchingPages(true)
    setSearchStatus('Searching for text...')
    
    try {
      const loadingTask = pdfjs.getDocument(pdfBlobUrl)
      const pdf = await loadingTask.promise
      setPdfDoc(pdf)
      
       
      const searchPhrase = highlightText.toLowerCase().trim()
      
       
      const commonWords = ['the', 'and', 'was', 'she', 'her', 'had', 'that', 'with', 'for', 'but', 'not', 'this', 'from', 'they', 'were', 'been', 'have', 'are', 'being', 'would', 'could', 'after', 'first', 'also', 'into', 'only', 'over', 'such', 'even', 'most', 'other', 'some', 'very', 'just', 'about', 'which', 'when', 'there', 'because', 'through']
      const words = searchPhrase.split(/\s+/).filter(w => w.length > 3)
      const distinctiveWords = words.filter(w => !commonWords.includes(w.replace(/[^\w]/g, '')))
      
       
      const keyTerms = distinctiveWords
        .sort((a, b) => b.length - a.length)
        .slice(0, 6)
      
      console.log('Searching for distinctive terms:', keyTerms)
      
      if (keyTerms.length === 0) {
        setSearchingPages(false)
        return
      }
      
       
      let bestPage = null
      let bestScore = 0
      
      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        const page = await pdf.getPage(pageNum)
        const textContent = await page.getTextContent()
        const pageText = textContent.items.map(item => item.str).join(' ').toLowerCase()
        
         
        const shortPhrase = searchPhrase.substring(0, 40).replace(/[^\w\s]/g, '')
        if (pageText.replace(/[^\w\s]/g, '').includes(shortPhrase)) {
          console.log(`Found exact phrase match on page ${pageNum}`)
          setSearchStatus(`Found on page ${pageNum}`)
          setCurrentPage(pageNum)
          setSearchingPages(false)
          return
        }
        
         
        const matchCount = keyTerms.filter(term => pageText.includes(term.replace(/[^\w]/g, ''))).length
        const score = matchCount / keyTerms.length
        
        if (score > bestScore) {
          bestScore = score
          bestPage = pageNum
        }
      }
      
       
      if (bestPage && bestScore >= 0.5) {
        console.log(`Best match on page ${bestPage} with score ${bestScore}`)
        setSearchStatus(`Found on page ${bestPage}`)
        setCurrentPage(bestPage)
      } else {
        setSearchStatus('Text not found - showing suggested page')
        console.log('Text not found in any page, staying on suggested page')
      }
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

   
  const highlightTextInPage = useCallback(() => {
    if (!highlightText || !containerRef.current) return

     
    const attemptHighlight = (attempt = 0) => {
      const textLayer = containerRef.current?.querySelector('.react-pdf__Page__textContent')
      if (!textLayer) {
        if (attempt < 10) {
          setTimeout(() => attemptHighlight(attempt + 1), 300)
        }
        return
      }

       
      const allElements = Array.from(textLayer.querySelectorAll('span, div'))
        .filter(el => el.textContent && el.textContent.trim().length > 0)
      
      if (allElements.length === 0 && attempt < 10) {
        setTimeout(() => attemptHighlight(attempt + 1), 300)
        return
      }

       
      allElements.forEach(el => {
        el.style.backgroundColor = ''
        el.style.borderRadius = ''
        el.style.boxShadow = ''
        el.removeAttribute('data-highlighted')
      })

       
      const commonWords = ['the', 'and', 'was', 'she', 'her', 'had', 'that', 'with', 'for', 'but', 'not', 'this', 'from', 'they', 'were', 'been', 'have', 'are', 'being', 'would', 'could', 'after', 'first', 'also', 'into', 'only', 'over', 'such', 'even', 'most', 'other', 'some', 'very', 'just', 'about', 'which', 'when', 'there', 'because', 'through', 'child', 'children', 'mother', 'father', 'long', 'own', 'felt', 'feel', 'made', 'make', 'said', 'told', 'left', 'went', 'came', 'took', 'gave', 'got', 'all', 'any', 'way', 'one', 'two']
      
       
      const fullPageText = allElements.map(el => el.textContent).join(' ').toLowerCase()
      
       
      const searchLower = highlightText.toLowerCase().trim()
      const searchWords = searchLower.split(/\s+/).filter(w => w.length > 2)
      
       
      const distinctiveWords = searchWords
        .map(w => w.replace(/[^\w]/g, ''))
        .filter(w => w.length > 4 && !commonWords.includes(w))
      
      console.log('Highlighting with distinctive words:', distinctiveWords.slice(0, 5))
      
      let foundMatch = false
      let highlightedElements = []

       
      const shortPhrase = searchLower.substring(0, 50).replace(/[^\w\s]/g, '').trim()
      const pageTextNormalized = fullPageText.replace(/[^\w\s]/g, '')
      
      if (pageTextNormalized.includes(shortPhrase)) {
         
        const phraseWords = shortPhrase.split(/\s+/).filter(w => w.length > 3 && !commonWords.includes(w))
        
        allElements.forEach(el => {
          const elText = el.textContent.toLowerCase().replace(/[^\w\s]/g, '')
          const matchingWords = phraseWords.filter(w => elText.includes(w))
          
          if (matchingWords.length >= 1 && elText.length > 2) {
            applyHighlight(el)
            highlightedElements.push(el)
            foundMatch = true
          }
        })
      }

       
      if (!foundMatch && distinctiveWords.length > 0) {
        allElements.forEach(el => {
          const elText = el.textContent.toLowerCase().replace(/[^\w]/g, '')
          
           
          const hasDistinctive = distinctiveWords.some(word => elText.includes(word))
          
          if (hasDistinctive && elText.length > 3) {
            applyHighlight(el, 0.5)
            highlightedElements.push(el)
            foundMatch = true
          }
        })
      }

       
      if (highlightedElements.length > 0) {
        highlightedElements[0].scrollIntoView({ behavior: 'smooth', block: 'center' })
        console.log('Highlighted', highlightedElements.length, 'elements')
      }

      function applyHighlight(element, opacity = 0.6) {
        element.style.backgroundColor = `rgba(255, 235, 59, ${opacity})`
        element.style.borderRadius = '2px'
        element.style.boxShadow = '0 0 3px rgba(255, 235, 59, 0.9)'
        element.setAttribute('data-highlighted', 'true')
      }

      if (!foundMatch) {
        console.log('No highlight match found on this page')
        console.log('Distinctive words:', distinctiveWords)
      }
    }

     
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
      { }
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

      { }
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

      { }
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
