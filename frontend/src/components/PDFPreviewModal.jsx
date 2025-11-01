import { X, ChevronUp, ChevronDown } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import './pdf-text-layer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PDFPreviewModal({ isOpen, onClose, pdfUrl, section, textSnippet, pageNumber: propsPageNumber }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.2);
  const [pdfDocument, setPdfDocument] = useState(null);
  const currentSnippetRef = useRef(null);

  // Reset everything when modal opens with new snippet
  useEffect(() => {
    if (isOpen && textSnippet) {
      currentSnippetRef.current = textSnippet;
      
      // Set page directly from props if provided
      const initialPage = propsPageNumber && propsPageNumber >= 1 ? Math.floor(propsPageNumber) : 1;
      console.log('📄 Opening PDF on page:', initialPage, 'with snippet:', textSnippet.substring(0, 50) + '...');
      setPageNumber(initialPage);
      setIsAnimating(true);
    }
  }, [isOpen, textSnippet, propsPageNumber]);

  // Highlight text when page changes
  useEffect(() => {
    if (!textSnippet || pageNumber < 1) return;
    
    const timer = setTimeout(() => {
      highlightTextInPage(textSnippet);
    }, 400);
    
    return () => clearTimeout(timer);
  }, [textSnippet, pageNumber]);

  const highlightTextInPage = (searchText) => {
    const textLayer = document.querySelector('.react-pdf__Page__textContent');
    if (!textLayer) {
      console.log('❌ Text layer not found');
      return;
    }

    console.log('🎨 Attempting to highlight:', searchText.substring(0, 50) + '...');

    // Clear previous highlights
    const previousHighlights = textLayer.querySelectorAll('span[data-highlighted="true"]');
    previousHighlights.forEach(span => {
      span.setAttribute('data-highlighted', 'false');
      span.style.backgroundColor = 'transparent';
    });

    const spans = textLayer.querySelectorAll('span');
    console.log('📝 Total spans:', spans.length);

    // Extract significant words from search text (longer than 4 chars)
    const searchWords = searchText
      .toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 4)
      .map(word => word.replace(/[^\w]/g, ''));

    console.log('🔍 Looking for words:', searchWords);

    let highlightedCount = 0;

    spans.forEach(span => {
      const spanText = span.textContent.toLowerCase().replace(/[^\w\s]/g, '');
      
      // Check if span contains any of the significant words
      const containsWord = searchWords.some(word => spanText.includes(word));
      
      if (containsWord) {
        span.setAttribute('data-highlighted', 'true');
        span.style.backgroundColor = 'rgba(255, 255, 0, 0.6)';
        span.style.transition = 'background-color 0.3s ease';
        highlightedCount++;
      }
    });

    console.log('✨ Highlighted', highlightedCount, 'spans with significant words:', searchWords);
  };

  const onDocumentLoadSuccess = ({ numPages: totalPages }) => {
    console.log('📚 PDF loaded successfully with', totalPages, 'pages');
    setNumPages(totalPages);
  };

  const onPageLoadSuccess = (page) => {
    setPdfDocument(page._transport.commonObjs);
  };

  const changePage = (offset) => {
    setPageNumber(prevPageNumber => {
      const newPage = prevPageNumber + offset;
      if (newPage >= 1 && newPage <= numPages) {
        return newPage;
      }
      return prevPageNumber;
    });
  };

  const previousPage = () => changePage(-1);
  const nextPage = () => changePage(1);

  const zoomIn = () => setScale(prev => Math.min(prev + 0.2, 2.0));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.6));

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
      setPageNumber(1);
      setNumPages(null);
      setPdfDocument(null);
      currentSnippetRef.current = null;
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
      isAnimating ? 'opacity-100' : 'opacity-0'
    }`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col transform transition-all duration-300 ${
        isAnimating ? 'scale-100 translate-y-0' : 'scale-95 -translate-y-4'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">PDF Preview</h2>
            {section && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Section: {section}
              </p>
            )}
          </div>
          
          {/* Controls */}
          <div className="flex items-center gap-4">
            {/* Zoom controls */}
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={zoomOut}
                className="p-2 rounded-md hover:bg-white dark:hover:bg-gray-600 transition-colors"
                title="Zoom Out"
              >
                <span className="text-lg font-bold text-gray-700 dark:text-gray-200">−</span>
              </button>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 min-w-[3.5rem] text-center px-2">
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={zoomIn}
                className="p-2 rounded-md hover:bg-white dark:hover:bg-gray-600 transition-colors"
                title="Zoom In"
              >
                <span className="text-lg font-bold text-gray-700 dark:text-gray-200">+</span>
              </button>
            </div>
            
            {/* Close button */}
            <button
              onClick={handleClose}
              className="p-2 rounded-lg bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 transition-colors group"
              title="Close"
            >
              <X className="w-5 h-5 text-red-600 dark:text-red-300 group-hover:text-red-700 dark:group-hover:text-red-200" />
            </button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900 p-6">
          <div className="flex justify-center">
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
              }
              error={
                <div className="text-center p-8 text-red-600">
                  Failed to load PDF. Please try again.
                </div>
              }
            >
              <Page
                pageNumber={pageNumber}
                scale={scale}
                onLoadSuccess={onPageLoadSuccess}
                renderTextLayer={true}
                renderAnnotationLayer={false}
                loading={
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  </div>
                }
              />
            </Document>
          </div>
        </div>

        {/* Footer with page navigation */}
        {numPages && (
          <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <button
              onClick={previousPage}
              disabled={pageNumber <= 1}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-medium disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed hover:bg-indigo-700 active:bg-indigo-800 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <ChevronUp className="w-4 h-4" />
              <span>Previous</span>
            </button>
            
            <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                Page {pageNumber}
              </span>
              <span className="text-sm text-gray-400">of</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {numPages}
              </span>
            </div>
            
            <button
              onClick={nextPage}
              disabled={pageNumber >= numPages}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-medium disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed hover:bg-indigo-700 active:bg-indigo-800 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <span>Next</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
