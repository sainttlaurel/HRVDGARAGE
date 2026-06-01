/**
 * SEO Utilities for HRVD Car Trading
 * Handles meta tags, structured data, and SEO optimization
 */

export interface SEOConfig {
  title: string
  description: string
  keywords?: string
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product'
  author?: string
  publishedDate?: string
  modifiedDate?: string
}

/**
 * Update meta tags for a page
 */
export function updateMetaTags(config: SEOConfig) {
  // Update title
  document.title = config.title

  // Update or create meta tags
  updateMetaTag('description', config.description)
  if (config.keywords) {
    updateMetaTag('keywords', config.keywords)
  }

  // Open Graph tags
  updateMetaTag('og:title', config.title, 'property')
  updateMetaTag('og:description', config.description, 'property')
  updateMetaTag('og:type', config.type || 'website', 'property')
  if (config.image) {
    updateMetaTag('og:image', config.image, 'property')
  }
  if (config.url) {
    updateMetaTag('og:url', config.url, 'property')
  }

  // Twitter Card tags
  updateMetaTag('twitter:card', 'summary_large_image')
  updateMetaTag('twitter:title', config.title)
  updateMetaTag('twitter:description', config.description)
  if (config.image) {
    updateMetaTag('twitter:image', config.image)
  }

  // Article tags
  if (config.publishedDate) {
    updateMetaTag('article:published_time', config.publishedDate, 'property')
  }
  if (config.modifiedDate) {
    updateMetaTag('article:modified_time', config.modifiedDate, 'property')
  }
  if (config.author) {
    updateMetaTag('article:author', config.author, 'property')
  }
}

/**
 * Update or create a meta tag
 */
function updateMetaTag(name: string, content: string, attribute: 'name' | 'property' = 'name') {
  let tag = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement
  
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attribute, name)
    document.head.appendChild(tag)
  }
  
  tag.content = content
}

/**
 * Add canonical URL
 */
export function setCanonicalURL(url: string) {
  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
  
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.rel = 'canonical'
    document.head.appendChild(canonical)
  }
  
  canonical.href = url
}

/**
 * Generate JSON-LD structured data
 */
export function generateStructuredData(data: Record<string, any>) {
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify(data)
  document.head.appendChild(script)
}

/**
 * Organization structured data
 */
export function addOrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'HRVD Car Trading',
    url: 'https://sacredgarage.com',
    logo: 'https://sacredgarage.com/image/LOGO.webp',
    description: 'Premium pre-owned vehicles and performance parts dealer in Quezon City',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'PH',
      addressLocality: 'Quezon City'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      url: 'https://sacredgarage.com/contact'
    },
    sameAs: [
      'https://www.facebook.com/HRVDCarTrading'
    ]
  }
  generateStructuredData(schema)
}

/**
 * Product structured data for vehicles
 */
export function addProductSchema(product: {
  name: string
  description: string
  image: string
  price?: string
  currency?: string
  availability?: string
  rating?: number
  reviewCount?: number
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    ...(product.price && {
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: product.currency || 'PHP',
        availability: product.availability || 'https://schema.org/InStock'
      }
    }),
    ...(product.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.reviewCount || 1
      }
    })
  }
  generateStructuredData(schema)
}

/**
 * LocalBusiness structured data
 */
export function addLocalBusinessSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'HRVD Car Trading',
    image: 'https://sacredgarage.com/image/LOGO.webp',
    description: 'Premium pre-owned vehicles and performance parts',
    url: 'https://sacredgarage.com',
    telephone: '+63-XXX-XXXX',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Quezon City',
      addressLocality: 'Quezon City',
      addressCountry: 'PH'
    },
    priceRange: '₱₱₱',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '18:00'
    }
  }
  generateStructuredData(schema)
}

/**
 * BreadcrumbList structured data
 */
export function addBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  }
  generateStructuredData(schema)
}

/**
 * FAQPage structured data
 */
export function addFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }
  generateStructuredData(schema)
}

/**
 * Default SEO configuration for homepage
 */
export const DEFAULT_SEO_CONFIG: SEOConfig = {
  title: 'HRVD Car Trading — Premium Pre-Owned Vehicles & Parts | Quezon City',
  description: 'Discover premium pre-owned vehicles and high-performance automotive parts at HRVD Car Trading. Quality cars, expert service, and competitive prices in Quezon City.',
  keywords: 'pre-owned cars, used vehicles, car trading, automotive parts, Quezon City, car dealer, performance parts, vehicle sales',
  image: 'https://sacredgarage.com/image/LOGO.webp',
  url: 'https://sacredgarage.com',
  type: 'website'
}

/**
 * SEO configuration for inventory page
 */
export const INVENTORY_SEO_CONFIG: SEOConfig = {
  title: 'Vehicle Inventory — HRVD Car Trading | Premium Pre-Owned Cars',
  description: 'Browse our extensive inventory of premium pre-owned vehicles. Find your perfect car with detailed specifications, photos, and competitive pricing.',
  keywords: 'used cars for sale, vehicle inventory, pre-owned vehicles, car listings, Quezon City cars',
  type: 'website'
}

/**
 * SEO configuration for parts page
 */
export const PARTS_SEO_CONFIG: SEOConfig = {
  title: 'Automotive Parts — HRVD Car Trading | Performance & OEM Parts',
  description: 'Shop high-quality automotive parts including performance upgrades and OEM replacements. Fast shipping and expert support.',
  keywords: 'automotive parts, car parts, performance parts, OEM parts, car accessories',
  type: 'website'
}

/**
 * SEO configuration for contact page
 */
export const CONTACT_SEO_CONFIG: SEOConfig = {
  title: 'Contact Us — HRVD Car Trading | Get in Touch',
  description: 'Contact HRVD Car Trading for inquiries about vehicles, parts, or services. We\'re here to help with your automotive needs.',
  keywords: 'contact us, customer service, inquiries, support',
  type: 'website'
}
