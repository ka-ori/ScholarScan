import { ChevronLeft, ChevronRight } from 'lucide-react'

function PaginationControls({ 
  currentPage, 
  totalPages, 
  onPageChange,
  isLoading = false,
  pageSize = 10,
  totalCount = 0
}) {
  const startIndex = (currentPage - 1) * pageSize + 1
  const endIndex = Math.min(currentPage * pageSize, totalCount)

  const handlePrevious = () => {
    if (currentPage > 1 && !isLoading) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages && !isLoading) {
      onPageChange(currentPage + 1)
    }
  }

  const handlePageInput = (e) => {
    const value = Number.parseInt(e.target.value)
    if (value > 0 && value <= totalPages && !isLoading) {
      onPageChange(value)
    }
  }

  if (totalPages <= 1) {
    return null
  }

  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8 py-6">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1 || isLoading}
        className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Previous</span>
      </button>

      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Page</span>
        <input
          type="number"
          min="1"
          max={totalPages}
          value={currentPage}
          onChange={handlePageInput}
          disabled={isLoading}
          className="w-12 px-2 py-1 border border-gray-200 rounded text-center text-sm disabled:bg-gray-100"
          aria-label="Current page number"
        />
        <span className="text-sm text-gray-600">of {totalPages}</span>
      </div>

      {totalCount > 0 && (
        <span className="text-xs sm:text-sm text-gray-500">
          Showing {startIndex}–{endIndex} of {totalCount}
        </span>
      )}

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages || isLoading}
        className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        aria-label="Next page"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}

export default PaginationControls
