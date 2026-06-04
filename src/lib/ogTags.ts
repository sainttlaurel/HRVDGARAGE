// Open Graph (OG) meta tags for social media sharing

export interface OGConfig {
  title: string
  description: string
  image: string
  url: string
  type?: string
  siteName?: string
}

/**
 * Update OG meta tags for social media sharing
 */
export const updateOGTags = (config: OGConfig): void => {
  const {
    title,
    description,
    image,
    url,
    type = 'website',
    siteName = 'HRVD Car Trading',
  } = config

  // Update or create OG title
  updateMetaTag('og:title', title)

  // Update or create OG description
  updateMetaTag('og:description', description)

  // Update or create OG image
  updateMetaTag('og:image', image)

  // Update or create OG URL
  updateMetaTag('og:url', url)

  // Update or create OG type
  updateMetaTag('og:type', type)

  // Update or create OG site name
  updateMetaTag('og:site_name', siteName)

  // Update Twitter Card tags for better Twitter sharing
  updateMetaTag('twitter:card', 'summary_large_image')
  updateMetaTag('twitter:title', title)
  updateMetaTag('twitter:description', description)
  updateMetaTag('twitter:image', image)
  updateMetaTag('twitter:site', '@HRVDCarTrading')
}

/**
 * Update or create a meta tag
 */
const updateMetaTag = (property: string, content: string): void => {
  let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement
  
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute('property', property)
    document.head.appendChild(meta)
  }
  
  meta.content = content
}

/**
 * Generate OG tags for a vehicle
 */
export const getVehicleOGConfig = (vehicle: {
  brand: string
  model: string
  year: number
  price: string
  image: string
  description: string
}): OGConfig => {
  return {
    title: `${vehicle.brand} ${vehicle.model} - ${vehicle.price}`,
    description: vehicle.description.slice(0, 160),
    image: vehicle.image,
    url: window.location.href,
    type: 'product',
    siteName: 'HRVD Car Trading',
  }
}

/**
 * Generate OG tags for a part
 */
export const getPartOGConfig = (part: {
  brand: string
  name: string
  price: string
  image: string
  description: string
}): OGConfig => {
  return {
    title: `${part.brand} ${part.name} - ${part.price}`,
    description: part.description.slice(0, 160),
    image: part.image,
    url: window.location.href,
    type: 'product',
    siteName: 'HRVD Car Trading',
  }
}
