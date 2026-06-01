import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import ImageZoom from './ImageZoom'
import { getWebPUrl } from '../lib/imageUtils'

interface ImageGalleryProps {
  images: string[]
  alt: string
}

const ImageGallery = ({ images, alt }: ImageGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const goToImage = (index: number) => {
    setCurrentIndex(index)
  }

  const currentImage = images[currentIndex]
  const webpImage = getWebPUrl(currentImage)

  return (
    <>
      <div className="space-y-4">
        {/* Main Image with Zoom */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-sm border border-border group">
          <picture>
            <source
              type="image/webp"
              srcSet={webpImage}
            />
            <ImageZoom
              src={currentImage}
              alt={`${alt} - Image ${currentIndex + 1}`}
              className="w-full h-full"
            />
          </picture>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background z-10"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background z-10"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Image Counter */}
          <div className="absolute bottom-4 left-4 px-3 py-1 bg-background/90 backdrop-blur-sm border border-border rounded-sm">
            <p className="text-xs uppercase tracking-luxury">
              {currentIndex + 1} / {images.length}
            </p>
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={() => setIsFullscreen(true)}
            className="absolute bottom-4 right-4 px-3 py-1 bg-background/90 backdrop-blur-sm border border-border rounded-sm hover:bg-background transition-colors"
          >
            <p className="text-xs uppercase tracking-luxury">View Fullscreen</p>
          </button>
        </div>

        {/* Thumbnail Strip */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((image, index) => {
              const webpThumb = getWebPUrl(image)
              return (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-sm overflow-hidden border-2 transition-all ${
                    index === currentIndex
                      ? 'border-motorsport-red'
                      : 'border-border hover:border-foreground-muted'
                  }`}
                >
                  <picture>
                    <source
                      type="image/webp"
                      srcSet={webpThumb}
                    />
                    <img
                      src={image}
                      alt={`${alt} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </picture>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background flex items-center justify-center"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center hover:bg-background-soft transition-colors z-10"
            >
              <X size={24} />
            </button>

            {/* Fullscreen Image */}
            <div className="relative w-full h-full flex items-center justify-center p-8">
              <picture>
                <source
                  type="image/webp"
                  srcSet={getWebPUrl(images[currentIndex])}
                />
                <img
                  src={images[currentIndex]}
                  alt={`${alt} fullscreen`}
                  className="max-w-full max-h-full object-contain"
                  loading="lazy"
                />
              </picture>

              {/* Navigation */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={goToPrevious}
                    className="absolute left-8 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-card border border-border flex items-center justify-center hover:bg-background-soft transition-colors"
                  >
                    <ChevronLeft size={28} />
                  </button>
                  <button
                    onClick={goToNext}
                    className="absolute right-8 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-card border border-border flex items-center justify-center hover:bg-background-soft transition-colors"
                  >
                    <ChevronRight size={28} />
                  </button>
                </>
              )}

              {/* Counter */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 bg-card border border-border rounded-sm">
                <p className="text-sm uppercase tracking-luxury">
                  {currentIndex + 1} / {images.length}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ImageGallery
