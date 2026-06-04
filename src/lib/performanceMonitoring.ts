/**
 * Performance Monitoring Library
 * Tracks Core Web Vitals, page load metrics, and component performance
 */

import { trackEvent } from './analytics'

// Types
export interface PerformanceMetrics {
  pageLoadTime: number
  ttfb: number // Time to First Byte
  fcp: number // First Contentful Paint
  lcp: number // Largest Contentful Paint
  fid: number | null // First Input Delay
  cls: number // Cumulative Layout Shift
  timeOnPage: number
  componentsLoadTime: Record<string, number>
}

export interface CoreWebVitals {
  lcp: number | null
  fid: number | null
  cls: number | null
}

export interface PerformanceThresholds {
  good: number
  needsImprovement: number
}

// Thresholds for Core Web Vitals (in milliseconds)
const CORE_WEB_VITALS_THRESHOLDS = {
  lcp: { good: 2500, needsImprovement: 4000 },
  fid: { good: 100, needsImprovement: 300 },
  cls: { good: 0.1, needsImprovement: 0.25 }
}

// Store for tracking component load times
const componentLoadTimes: Record<string, number> = {}
const pageStartTime = performance.now()

/**
 * Get page load time since navigation start
 */
export const getPageLoadTime = (): number => {
  if (typeof window === 'undefined' || !performance.timing) return 0
  return performance.timing.loadEventEnd - performance.timing.navigationStart
}

/**
 * Get Time to First Byte (TTFB)
 */
export const getTTFB = (): number => {
  if (typeof window === 'undefined' || !performance.timing) return 0
  return performance.timing.responseStart - performance.timing.navigationStart
}

/**
 * Get First Contentful Paint (FCP)
 */
export const getFCP = (): number => {
  if (typeof window === 'undefined' || !performance.getEntriesByName) return 0
  const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0]
  return fcpEntry ? Math.round(fcpEntry.startTime) : 0
}

/**
 * Get Largest Contentful Paint (LCP) - using PerformanceObserver
 */
export const observeLCP = (callback: (lcp: number) => void): (() => void) => {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return () => {}
  }

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1] as any
      callback(Math.round(lastEntry.renderTime || lastEntry.loadTime))
    })

    observer.observe({ entryTypes: ['largest-contentful-paint'], buffered: true })
    return () => observer.disconnect()
  } catch (e) {
    console.warn('LCP observer not supported:', e)
    return () => {}
  }
}

/**
 * Get First Input Delay (FID) - using PerformanceObserver
 */
export const observeFID = (callback: (fid: number) => void): (() => void) => {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return () => {}
  }

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry: any) => {
        callback(Math.round(entry.processingStart - entry.startTime))
      })
    })

    observer.observe({ entryTypes: ['first-input'], buffered: true })
    return () => observer.disconnect()
  } catch (e) {
    console.warn('FID observer not supported:', e)
    return () => {}
  }
}

/**
 * Get Cumulative Layout Shift (CLS) - using PerformanceObserver
 */
export const observeCLS = (callback: (cls: number) => void): (() => void) => {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return () => {}
  }

  try {
    let clsValue = 0
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
          callback(parseFloat(clsValue.toFixed(3)))
        }
      })
    })

    observer.observe({ entryTypes: ['layout-shift'], buffered: true })
    return () => observer.disconnect()
  } catch (e) {
    console.warn('CLS observer not supported:', e)
    return () => {}
  }
}

/**
 * Track component load time
 */
export const trackComponentLoadTime = (componentName: string): (() => void) => {
  const startTime = performance.now()

  return () => {
    const endTime = performance.now()
    const loadTime = Math.round(endTime - startTime)
    componentLoadTimes[componentName] = loadTime

    // Track if component took longer than 1 second
    if (loadTime > 1000) {
      trackEvent('slow_component_load', {
        component_name: componentName,
        load_time_ms: loadTime,
        severity: loadTime > 3000 ? 'critical' : 'warning'
      })
    }
  }
}

/**
 * Get all component load times
 */
export const getComponentLoadTimes = (): Record<string, number> => {
  return { ...componentLoadTimes }
}

/**
 * Assess Core Web Vitals performance
 */
export const assessCoreWebVital = (
  metric: 'lcp' | 'fid' | 'cls',
  value: number | null
): 'good' | 'needsImprovement' | 'poor' => {
  if (value === null || value === undefined) return 'poor'

  const threshold = CORE_WEB_VITALS_THRESHOLDS[metric]
  if (value <= threshold.good) return 'good'
  if (value <= threshold.needsImprovement) return 'needsImprovement'
  return 'poor'
}

/**
 * Track Core Web Vital
 */
export const trackCoreWebVital = (metric: 'lcp' | 'fid' | 'cls', value: number | null) => {
  if (value === null || value === undefined) return

  const assessment = assessCoreWebVital(metric, value)

  trackEvent(`core_web_vital_${metric}`, {
    metric: metric,
    value: value,
    assessment: assessment,
    threshold_good: CORE_WEB_VITALS_THRESHOLDS[metric].good,
    threshold_improvement: CORE_WEB_VITALS_THRESHOLDS[metric].needsImprovement
  })
}

/**
 * Get memory usage (if available)
 */
export const getMemoryUsage = (): { jsHeapSizeLimit: number; totalJSHeapSize: number; usedJSHeapSize: number } | null => {
  if (typeof window === 'undefined' || !('memory' in performance)) {
    return null
  }

  const memory = (performance as any).memory
  return {
    jsHeapSizeLimit: Math.round(memory.jsHeapSizeLimit / 1048576), // Convert to MB
    totalJSHeapSize: Math.round(memory.totalJSHeapSize / 1048576),
    usedJSHeapSize: Math.round(memory.usedJSHeapSize / 1048576)
  }
}

/**
 * Track memory usage if it exceeds threshold
 */
export const trackMemoryUsageIfHigh = (thresholdMB: number = 50) => {
  const memory = getMemoryUsage()
  if (memory && memory.usedJSHeapSize > thresholdMB) {
    trackEvent('high_memory_usage', {
      used_heap_size_mb: memory.usedJSHeapSize,
      total_heap_size_mb: memory.totalJSHeapSize,
      heap_limit_mb: memory.jsHeapSizeLimit,
      threshold_mb: thresholdMB
    })
  }
}

/**
 * Get resource timing for specific resource
 */
export const getResourceTiming = (resourceName: string) => {
  if (typeof window === 'undefined' || !performance.getEntriesByName) return null

  const entries = performance.getEntriesByName(resourceName)
  if (entries.length === 0) return null

  const entry = entries[0]
  return {
    name: entry.name,
    duration: Math.round(entry.duration),
    transferSize: (entry as any).transferSize || 0,
    decodedBodySize: (entry as any).decodedBodySize || 0,
    encodedBodySize: (entry as any).encodedBodySize || 0,
    serverTiming: (entry as any).serverTiming || []
  }
}

/**
 * Get all resource timings
 */
export const getAllResourceTimings = () => {
  if (typeof window === 'undefined' || !performance.getEntriesByType) return []

  return performance
    .getEntriesByType('resource')
    .filter((entry: PerformanceEntry) => entry.duration > 100) // Only resources taking > 100ms
    .map((entry: any) => ({
      name: entry.name.split('/').pop(),
      duration: Math.round(entry.duration),
      transferSize: entry.transferSize || 0,
      decodedBodySize: entry.decodedBodySize || 0
    }))
    .sort((a, b) => b.duration - a.duration)
    .slice(0, 10) // Top 10 slowest resources
}

/**
 * Track slow resources
 */
export const trackSlowResources = (thresholdMs: number = 2000) => {
  if (typeof window === 'undefined') return

  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry: any) => {
      if (entry.duration > thresholdMs) {
        trackEvent('slow_resource', {
          resource_name: entry.name.split('/').pop(),
          duration_ms: Math.round(entry.duration),
          size_kb: Math.round(entry.transferSize / 1024),
          threshold_ms: thresholdMs
        })
      }
    })
  })

  try {
    observer.observe({ entryTypes: ['resource'], buffered: true })
    return () => observer.disconnect()
  } catch (e) {
    console.warn('Resource observer not supported:', e)
    return () => {}
  }
}

/**
 * Get page visibility state and track
 */
export const trackPageVisibility = () => {
  if (typeof window === 'undefined' || !document.addEventListener) return

  document.addEventListener('visibilitychange', () => {
    const visibilityState = document.visibilityState
    trackEvent('page_visibility_change', {
      visibility_state: visibilityState,
      timestamp: new Date().toISOString()
    })
  })
}

/**
 * Collect all performance metrics
 */
export const collectPerformanceMetrics = async (): Promise<PerformanceMetrics> => {
  return new Promise((resolve) => {
    // Wait for page load if not already loaded
    if (document.readyState !== 'complete') {
      window.addEventListener('load', () => {
        setTimeout(() => {
          resolve({
            pageLoadTime: getPageLoadTime(),
            ttfb: getTTFB(),
            fcp: getFCP(),
            lcp: 0, // Will be updated by observer
            fid: null,
            cls: 0, // Will be updated by observer
            timeOnPage: Math.round((performance.now() - pageStartTime) / 1000),
            componentsLoadTime: getComponentLoadTimes()
          })
        }, 100)
      })
    } else {
      setTimeout(() => {
        resolve({
          pageLoadTime: getPageLoadTime(),
          ttfb: getTTFB(),
          fcp: getFCP(),
          lcp: 0,
          fid: null,
          cls: 0,
          timeOnPage: Math.round((performance.now() - pageStartTime) / 1000),
          componentsLoadTime: getComponentLoadTimes()
        })
      }, 100)
    }
  })
}

/**
 * Initialize performance monitoring
 */
export const initializePerformanceMonitoring = () => {
  if (typeof window === 'undefined') return

  // Track Core Web Vitals
  let lcp = 0
  let fid: number | null = null
  let cls = 0

  // Observe LCP
  observeLCP((value) => {
    lcp = value
    trackCoreWebVital('lcp', value)
  })

  // Observe FID
  observeFID((value) => {
    fid = value
    trackCoreWebVital('fid', value)
  })

  // Observe CLS
  observeCLS((value) => {
    cls = value
    trackCoreWebVital('cls', value)
  })

  // Track slow resources
  trackSlowResources(2000)

  // Track page visibility changes
  trackPageVisibility()

  // Track memory usage periodically (every 30 seconds)
  setInterval(() => {
    trackMemoryUsageIfHigh(50)
  }, 30000)

  return {
    getLCP: () => lcp,
    getFID: () => fid,
    getCLS: () => cls
  }
}

/**
 * Get performance summary for debugging
 */
export const getPerformanceSummary = async () => {
  const metrics = await collectPerformanceMetrics()
  const memory = getMemoryUsage()
  const slowResources = getAllResourceTimings()

  return {
    metrics,
    memory,
    slowResources,
    timestamp: new Date().toISOString()
  }
}
