import { useState, useRef, MouseEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ZoomIn } from 'lucide-react'

interface ImageZoomProps {
  src: string
  alt: string
  className?: string
}

const ImageZoom = ({ src, alt, className = '' }: ImageZoomProps) => {
  const [isZoomed, setIsZoomed] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const imageRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return

    const rect = imageRef.current.getBoundingClientRect()
    
    // Calculate precise percentage position (0-100%)
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100))

    // Update positions immediately for smooth tracking
    setPosition({ x, y })
    setCursorPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }

  const handleMouseEnter = () => {
    setIsZoomed(true)
  }

  const handleMouseLeave = () => {
    setIsZoomed(false)
  }

  return (
    <div
      ref={imageRef}
      className={`relative overflow-hidden ${isZoomed ? 'cursor-none' : 'cursor-zoom-in'} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Normal Image */}
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        animate={{
          scale: isZoomed ? 1.15 : 1,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Zoomed Overlay - Follows mouse freely */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `url(${src})`,
              backgroundSize: '800%',
              backgroundPosition: `${position.x}% ${position.y}%`,
              backgroundRepeat: 'no-repeat',
            }}
          />
        )}
      </AnimatePresence>

      {/* Magnifying Glass - Follows cursor precisely */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              x: cursorPosition.x - 96,
              y: cursorPosition.y - 96
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ 
              duration: 0.1,
              ease: "linear"
            }}
            className="absolute w-48 h-48 rounded-full border-4 border-foreground shadow-2xl pointer-events-none overflow-hidden"
            style={{
              left: 0,
              top: 0,
              backgroundImage: `url(${src})`,
              backgroundSize: '900%',
              backgroundPosition: `${position.x}% ${position.y}%`,
              backgroundRepeat: 'no-repeat',
            }}
          >
            {/* Magnifier Icon */}
            <div className="absolute inset-0 flex items-center justify-center bg-background/5">
              <ZoomIn size={32} className="text-foreground opacity-20" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Zoom Indicator */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-4 right-4 px-3 py-1 bg-background/90 backdrop-blur-sm border border-border rounded-sm"
          >
            <p className="text-xs uppercase tracking-luxury flex items-center gap-2">
              <ZoomIn size={12} />
              Zoom Active
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hover Hint */}
      {!isZoomed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-4 right-4 px-3 py-1 bg-background/70 backdrop-blur-sm border border-border rounded-sm"
        >
          <p className="text-xs uppercase tracking-luxury flex items-center gap-2 text-foreground-muted">
            <ZoomIn size={12} />
            Hover to Zoom
          </p>
        </motion.div>
      )}
    </div>
  )
}

export default ImageZoom
