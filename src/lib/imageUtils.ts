/**
 * Image Optimization Utilities
 * Provides lazy loading, WebP format support, and responsive image handling
 */

/**
 * Generate WebP URL from original image path
 * Assumes WebP versions are available with .webp extension
 */
export const getWebPUrl = (imagePath: string): string => {
  if (!imagePath) return ''
  
  // If already a webp, return as is
  if (imagePath.endsWith('.webp')) {
    return imagePath
  }
  
  // Replace extension with .webp
  const lastDotIndex = imagePath.lastIndexOf('.')
  if (lastDotIndex === -1) {
    return imagePath + '.webp'
  }
  
  return imagePath.substring(0, lastDotIndex) + '.webp'
}

/**
 * Get responsive image srcset for different screen sizes
 * Generates srcset string for responsive images
 */
export const getResponsiveSrcSet = (imagePath: string): string => {
  if (!imagePath) return ''
  
  // For now, return single size - can be extended for actual responsive images
  return `${imagePath} 1x`
}

/**
 * Get responsive WebP srcset
 */
export const getResponsiveWebPSrcSet = (imagePath: string): string => {
  if (!imagePath) return ''
  
  const webpUrl = getWebPUrl(imagePath)
  return `${webpUrl} 1x`
}

/**
 * Check if browser supports WebP format
 * Uses a simple check - can be enhanced with actual feature detection
 */
export const supportsWebP = (): boolean => {
  // Check if running in browser
  if (typeof window === 'undefined') {
    return false
  }
  
  // Simple check - most modern browsers support WebP
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  
  try {
    return canvas.toDataURL('image/webp').indexOf('image/webp') === 0
  } catch {
    return false
  }
}

/**
 * Intersection Observer hook for lazy loading
 * Returns a ref to attach to an image element
 */
export const useIntersectionObserver = (
  callback?: (isVisible: boolean) => void
): React.RefObject<HTMLImageElement> => {
  const ref = React.useRef<HTMLImageElement>(null)
  
  React.useEffect(() => {
    if (!ref.current) return
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          
          // Load the actual image
          if (img.dataset.src) {
            img.src = img.dataset.src
            img.removeAttribute('data-src')
          }
          
          // Load WebP source if available
          const picture = img.closest('picture')
          if (picture) {
            const webpSource = picture.querySelector('source[type="image/webp"]') as HTMLSourceElement | null
            if (webpSource && webpSource.dataset.srcset) {
              webpSource.srcset = webpSource.dataset.srcset
              webpSource.removeAttribute('data-srcset')
            }
          }
          
          observer.unobserve(img)
          callback?.(true)
        }
      },
      {
        rootMargin: '50px' // Start loading 50px before image enters viewport
      }
    )
    
    observer.observe(ref.current)
    
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [callback])
  
  return ref
}

/**
 * Generate picture element HTML for WebP with fallback
 * Returns JSX for picture element with WebP and fallback formats
 */
export const generatePictureElement = (
  imagePath: string,
  alt: string,
  className?: string,
  lazy: boolean = true
): {
  webpSrcSet: string
  fallbackSrc: string
  alt: string
  className?: string
  lazy: boolean
} => {
  return {
    webpSrcSet: lazy ? '' : getResponsiveWebPSrcSet(imagePath),
    fallbackSrc: lazy ? '' : imagePath,
    alt,
    className,
    lazy
  }
}

/**
 * Preload image for better performance
 * Useful for images that will be shown soon
 */
export const preloadImage = (imagePath: string): void => {
  if (typeof window === 'undefined') return
  
  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = 'image'
  link.href = imagePath
  document.head.appendChild(link)
}

/**
 * Preload WebP image
 */
export const preloadWebPImage = (imagePath: string): void => {
  if (typeof window === 'undefined') return
  
  const webpUrl = getWebPUrl(imagePath)
  preloadImage(webpUrl)
}

/**
 * Get optimized image URL with optional size parameter
 * Can be extended to work with image CDN services
 */
export const getOptimizedImageUrl = (
  imagePath: string,
  options?: {
    width?: number
    height?: number
    quality?: number
    format?: 'webp' | 'jpg' | 'png'
  }
): string => {
  if (!imagePath) return ''
  
  // For now, return original path
  // This can be extended to use image optimization services like:
  // - Cloudinary
  // - ImageKit
  // - Imgix
  // - AWS CloudFront with Lambda@Edge
  
  if (options?.format === 'webp') {
    return getWebPUrl(imagePath)
  }
  
  return imagePath
}

// Import React for useRef and useEffect
import React from 'react'
