import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

function LazyImage({ 
  src, 
  alt = 'Image', 
  placeholder = null, 
  className = '',
  onLoad = null,
  eager = false,
  width = null,
  height = null
}) {
  LazyImage.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    onLoad: PropTypes.func,
    eager: PropTypes.bool,
    width: PropTypes.number,
    height: PropTypes.number
  }
  const [imageSrc, setImageSrc] = useState(eager ? src : placeholder)
  const [imageRef, setImageRef] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (eager || !('IntersectionObserver' in globalThis)) {
      setImageSrc(src)
      return
    }

    if (!imageRef) return

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setImageSrc(src)
            observer.unobserve(entry.target)
          }
        })
      },
      {
        rootMargin: '50px',
        threshold: 0.01
      }
    )

    observer.observe(imageRef)

    return () => {
      if (imageRef && observer) {
        observer.unobserve(imageRef)
      }
    }
  }, [imageRef, src, eager])

  const handleImageLoad = () => {
    setIsLoaded(true)
    if (onLoad) {
      onLoad()
    }
  }

  const handleError = () => {
    setError(true)
  }

  if (error) {
    return (
      <img 
        alt={alt}
        className={`${className} bg-gray-200 flex items-center justify-center text-gray-500 text-sm w-full h-full object-cover`}
        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23e5e7eb' width='100' height='100'/%3E%3Ctext x='50' y='50' font-size='12' fill='%236b7280' text-anchor='middle' dy='.3em'%3EImage unavailable%3C/text%3E%3C/svg%3E"
      />
    )
  }

  return (
    <div
      ref={setImageRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        ...(width ? { width: `${width}px` } : {}),
        ...(height ? { height: `${height}px` } : {}),
        ...(width && height ? { 
          paddingBottom: `${(height / width) * 100}%`,
          position: 'relative'
        } : {})
      }}
    >
      {placeholder && imageSrc === placeholder && (
        <img
          src={placeholder}
          alt={alt}
          className={`${className} absolute inset-0 blur-sm scale-105`}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}

      <img
        src={imageSrc}
        alt={alt}
        className={`
          ${className}
          absolute inset-0 w-full h-full object-cover
          transition-opacity duration-300
          ${isLoaded ? 'opacity-100' : 'opacity-0'}
        `}
        onLoad={handleImageLoad}
        onError={handleError}
        width={width}
        height={height}
      />

      {!isLoaded && imageSrc !== placeholder && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}

export default LazyImage
