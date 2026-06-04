// Social media integration utilities

export interface ShareData {
  title: string
  description: string
  url: string
  image?: string
}

export interface SocialShareUrls {
  facebook: string
  twitter: string
  whatsapp: string
  linkedin: string
}

/**
 * Generate social media share URLs
 */
export const generateShareUrls = (data: ShareData): SocialShareUrls => {
  const encodedUrl = encodeURIComponent(data.url)
  const encodedTitle = encodeURIComponent(data.title)
  const encodedDescription = encodeURIComponent(data.description)

  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedDescription}`,
    whatsapp: `https://wa.me/?text=${encodedDescription}%20${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  }
}

/**
 * Share to Facebook
 */
export const shareToFacebook = (data: ShareData): void => {
  const urls = generateShareUrls(data)
  window.open(urls.facebook, 'facebook-share', 'width=600,height=400')
}

/**
 * Share to Twitter
 */
export const shareToTwitter = (data: ShareData): void => {
  const urls = generateShareUrls(data)
  window.open(urls.twitter, 'twitter-share', 'width=600,height=400')
}

/**
 * Share to WhatsApp
 */
export const shareToWhatsApp = (data: ShareData): void => {
  const urls = generateShareUrls(data)
  window.open(urls.whatsapp, 'whatsapp-share', 'width=600,height=400')
}

/**
 * Share to LinkedIn
 */
export const shareToLinkedIn = (data: ShareData): void => {
  const urls = generateShareUrls(data)
  window.open(urls.linkedin, 'linkedin-share', 'width=600,height=400')
}

/**
 * Native Web Share API (for mobile)
 */
export const useNativeShare = async (data: ShareData): Promise<boolean> => {
  if (!navigator.share) {
    return false
  }

  try {
    await navigator.share({
      title: data.title,
      text: data.description,
      url: data.url,
    })
    return true
  } catch (error) {
    if (error instanceof Error && error.message !== 'AbortError') {
      console.warn('Error sharing:', error)
    }
    return false
  }
}

/**
 * Copy share link to clipboard
 */
export const copyShareLink = async (url: string): Promise<boolean> => {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url)
      return true
    }
    // Fallback for older browsers
    const textarea = document.createElement('textarea')
    textarea.value = url
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    return true
  } catch (error) {
    console.warn('Error copying to clipboard:', error)
    return false
  }
}

/**
 * Generate referral link with tracking code
 */
export const generateReferralLink = (baseUrl: string, referralCode: string): string => {
  const separator = baseUrl.includes('?') ? '&' : '?'
  return `${baseUrl}${separator}ref=${referralCode}&utm_source=social&utm_medium=share`
}

/**
 * Track social share event
 */
export const trackSocialShare = (platform: string, itemType: string, itemId: string, itemName: string): void => {
  // Dispatch custom event for analytics
  const event = new CustomEvent('socialShare', {
    detail: {
      platform,
      itemType,
      itemId,
      itemName,
      timestamp: Date.now(),
    },
  })
  window.dispatchEvent(event)
}
