import React, { useRef, useEffect, useState } from 'react'
import { getWebPUrl } from '../lib/imageUtils'

interface LazyImageProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  onLoad?: () => void
  onError?: () => void
  useWebP?: boolean
  useNativeLazy?: boolean
}

/**
 * LazyImage Component
 * Provides lazy loading with WebP support and fallbacks
 * Uses both native loading="lazy" and Intersection Observer for better compatibility
 */
const LazyImage = React.forwardRef<HTMLImageElement, LazyImageProps>(
  (
    {
      src,
      alt,
      className = '',
      width,
      height,
      onLoad,
      onError,
      useWebP = true,
      useNativeLazy = true
    },
    ref
  ) => {
    const internalRef = useRef<HTMLImageElement>(null)
    const imageRef = ref || internalRef
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
      const img = (imageRef as React.RefObject<HTMLImageElement>).current
      if (!img) return

      // Intersection Observer for custom lazy loading
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            // Load the image
            if (img.dataset.src) {
              img.src = img.dataset.src
              img.removeAttribute('data-src')
            }

            // Load WebP source if in picture element
            const picture = img.closest('picture')
            if (picture) {
              const webpSource = picture.querySelector(
                'source[type="image/webp"]'
              ) as HTMLSourceElement | null
              if (webpSource && webpSource.dataset.srcset) {
                webpSource.srcset = webpSource.dataset.srcset
                webpSource.removeAttribute('data-srcset')
              }
            }

            observer.unobserve(img)
          }
        },
        {
          rootMargin: '50px' // Start loading 50px before image enters viewport
        }
      )

      observer.observe(img)

      return () => {
        if (img) {
          observer.unobserve(img)
        }
      }
    }, [imageRef])

    const handleLoad = () => {
      setIsLoaded(true)
      onLoad?.()
    }

    const handleError = () => {
      onError?.()
    }

    // If WebP is supported and useWebP is true, use picture element
    if (useWebP) {
      const webpSrc = getWebPUrl(src)

      return (
        <picture>
          <source
            type="image/webp"
            data-srcset={useNativeLazy ? webpSrc : undefined}
            srcSet={useNativeLazy ? undefined : webpSrc}
          />
          <img
            ref={imageRef}
            data-src={useNativeLazy ? src : undefined}
            src={useNativeLazy ? undefined : src}
            alt={alt}
            className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
            width={width}
            height={height}
            loading={useNativeLazy ? 'lazy' : undefined}
            onLoad={handleLoad}
            onError={handleError}
          />
        </picture>
      )
    }

    // Fallback to regular img tag
    return (
      <img
        ref={imageRef}
        data-src={useNativeLazy ? src : undefined}
        src={useNativeLazy ? undefined : src}
        alt={alt}
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        width={width}
        height={height}
        loading={useNativeLazy ? 'lazy' : undefined}
        onLoad={handleLoad}
        onError={handleError}
      />
    )
  }
)

LazyImage.displayName = 'LazyImage'

export default LazyImage
