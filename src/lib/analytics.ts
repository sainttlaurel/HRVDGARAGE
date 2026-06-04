/**
 * Analytics Utilities
 * Provides event tracking and analytics integration
 */

/**
 * Track page view
 */
export const trackPageView = (pageName: string, path: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'GA_MEASUREMENT_ID', {
      page_path: path,
      page_title: pageName
    })
  }
}

/**
 * Track custom event
 */
export const trackEvent = (eventName: string, eventData?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventData)
  }
}

/**
 * Track vehicle view
 */
export const trackVehicleView = (vehicleId: string, brand: string, model: string) => {
  trackEvent('view_vehicle', {
    vehicle_id: vehicleId,
    brand: brand,
    model: model,
    category: 'vehicle'
  })
}

/**
 * Track vehicle details view
 */
export const trackVehicleDetailsView = (vehicleId: string, brand: string, model: string) => {
  trackEvent('view_vehicle_details', {
    vehicle_id: vehicleId,
    brand: brand,
    model: model,
    category: 'vehicle',
    timestamp: new Date().toISOString()
  })
}

/**
 * Track part view
 */
export const trackPartView = (partId: string, partName: string, category: string) => {
  trackEvent('view_part', {
    part_id: partId,
    part_name: partName,
    category: category
  })
}

/**
 * Track inquiry submission
 */
export const trackInquirySubmission = (inquiryType?: string) => {
  trackEvent('submit_inquiry', {
    inquiry_type: inquiryType || 'general',
    timestamp: new Date().toISOString()
  })
}

/**
 * Track part purchase
 */
export const trackPartPurchase = (partId: string, partName: string, quantity: number, price: string) => {
  trackEvent('purchase_part', {
    part_id: partId,
    part_name: partName,
    quantity: quantity,
    price: price,
    timestamp: new Date().toISOString()
  })
}

/**
 * Track gallery interaction
 */
export const trackGalleryInteraction = (action: string, imageIndex?: number) => {
  trackEvent('gallery_interaction', {
    action: action,
    image_index: imageIndex,
    timestamp: new Date().toISOString()
  })
}

/**
 * Track admin login
 */
export const trackAdminLogin = (success: boolean) => {
  trackEvent('admin_login', {
    success: success,
    timestamp: new Date().toISOString()
  })
}

/**
 * Track search
 */
export const trackSearch = (searchQuery: string, resultsCount: number) => {
  trackEvent('search', {
    search_query: searchQuery,
    results_count: resultsCount,
    timestamp: new Date().toISOString()
  })
}

/**
 * Track filter application
 */
export const trackFilterApplication = (filterType: string, filterValue: string) => {
  trackEvent('apply_filter', {
    filter_type: filterType,
    filter_value: filterValue,
    timestamp: new Date().toISOString()
  })
}

/**
 * Track scroll depth
 */
export const trackScrollDepth = (depth: number) => {
  trackEvent('scroll_depth', {
    depth_percentage: depth,
    timestamp: new Date().toISOString()
  })
}

/**
 * Track time on page
 */
export const trackTimeOnPage = (pageName: string, timeInSeconds: number) => {
  trackEvent('time_on_page', {
    page_name: pageName,
    time_seconds: timeInSeconds,
    timestamp: new Date().toISOString()
  })
}

/**
 * Track external link click
 */
export const trackExternalLinkClick = (url: string, linkText: string) => {
  trackEvent('external_link_click', {
    url: url,
    link_text: linkText,
    timestamp: new Date().toISOString()
  })
}

/**
 * Track social media link click
 */
export const trackSocialMediaClick = (platform: string, url: string) => {
  trackEvent('social_media_click', {
    platform: platform,
    url: url,
    timestamp: new Date().toISOString()
  })
}

/**
 * Track review submission
 */
export const trackReviewSubmission = (itemType: string, itemName: string, rating: number) => {
  trackEvent('submit_review', {
    item_type: itemType,
    item_name: itemName,
    rating: rating,
    timestamp: new Date().toISOString()
  })
}

/**
 * Initialize Google Analytics
 */
export const initializeGoogleAnalytics = (measurementId?: string) => {
  if (typeof window === 'undefined') return

  const id = measurementId || 'G-XXXXXXXXXX'

  // Load Google Analytics script
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`
  document.head.appendChild(script)

  // Initialize gtag
  window.dataLayer = window.dataLayer || []
  function gtag(...args: unknown[]) {
    (window.dataLayer as unknown[]).push(args)
  }
  window.gtag = gtag
  gtag('js', new Date())
  gtag('config', id, {
    page_path: window.location.pathname,
    page_title: document.title
  })
}

// Extend window interface for TypeScript
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}
