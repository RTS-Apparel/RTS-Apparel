import React, { useState } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  className?: string
  style?: React.CSSProperties
  priority?: boolean // true for hero banner, false for everything else
}

export function OptimizedImage({ 
  src, alt, className, style, priority = false 
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  // Normalize Unsplash query params if multiple '?' exist (e.g. when ?w=400... is appended to an already parameterized URL)
  const normalizedSrc = React.useMemo(() => {
    if (!src) return ''
    const parts = src.split('?')
    if (parts.length > 2) {
      return `${parts[0]}?${parts[parts.length - 1]}`
    }
    return src
  }, [src])

  // Fallback image if error
  const fallback = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%231A1A1A'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23E63946' font-size='14' font-family='sans-serif'%3EARTS APPAREL%3C/text%3E%3C/svg%3E"

  return (
    <div style={{ 
      position: 'relative', 
      overflow: 'hidden',
      background: '#1A1A1A',
      ...style 
    }} className={className}>
      
      {/* Skeleton loader — shows until image loads */}
      {!loaded && !error && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, #1A1A1A 25%, #2a1515 50%, #1A1A1A 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.2s infinite'
        }} />
      )}

      {/* Actual image */}
      <img
        src={error ? fallback : normalizedSrc}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => { setError(true); setLoaded(true) }}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'top center',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.3s ease',
          display: 'block'
        }}
      />

      {/* Fallback when error */}
      {error && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: '#1A1A1A',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}>
          <div style={{ fontSize: '32px' }}>👕</div>
          <span style={{ color: '#E63946', fontSize: '12px', fontWeight: 700, letterSpacing: '2px' }}>
            ARTS APPAREL
          </span>
        </div>
      )}
    </div>
  )
}
export default OptimizedImage
