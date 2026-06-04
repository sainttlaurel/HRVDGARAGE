import { useState, useEffect, lazy, Suspense } from 'react'
import LoadingScreen from './components/LoadingScreen'
import Paywall from './components/Paywall'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import Inventory from './components/Inventory'
import Parts from './components/Parts'
import CTA from './components/CTA'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ThemeToggle from './components/ThemeToggle'
import ToastContainer from './components/ToastContainer'
import OfflineIndicator from './components/OfflineIndicator'
import ErrorBoundary from './components/ErrorBoundary'
import AnalyticsConsent from './components/AnalyticsConsent'
import { initializeOfflineSupport } from './lib/offline'
import { initializeGoogleAnalytics, trackPageView } from './lib/analytics'
import { updateMetaTags, setCanonicalURL, addOrganizationSchema, addLocalBusinessSchema, DEFAULT_SEO_CONFIG } from './lib/seo'

// Lazy load heavy components
const GalleryWall = lazy(() => import('./components/GalleryWall'))
const Showreel = lazy(() => import('./components/Showreel'))
const AdminPortal = lazy(() => import('./pages/AdminPortal'))

// Paywall active flag - set to true to enable paywall
const PAYWALL_ACTIVE = false

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [isAdminPage, setIsAdminPage] = useState(window.location.pathname === '/admin')
  const [showPaywall, setShowPaywall] = useState(false)

  useEffect(() => {
    // Lock scroll when paywall is active
    if (PAYWALL_ACTIVE && showPaywall) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [showPaywall])

  useEffect(() => {
    // Initialize offline support
    initializeOfflineSupport()

    // Initialize SEO
    updateMetaTags(DEFAULT_SEO_CONFIG)
    setCanonicalURL('https://sacredgarage.com/')
    addOrganizationSchema()
    addLocalBusinessSchema()

    // Check if user has already consented to analytics
    const consentDecision = localStorage.getItem('analytics_consent')
    if (consentDecision === 'accepted') {
      initializeGoogleAnalytics()
      trackPageView(window.location.pathname, document.title)
    }

  }, [])

  useEffect(() => {
    const handlePopState = () => {
      setIsAdminPage(window.location.pathname === '/admin')
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const handleLoadingComplete = () => {
    setIsLoading(false)
    // Show paywall after loading screen completes
    if (PAYWALL_ACTIVE) {
      setShowPaywall(true)
    }
  }

  const navigateHome = () => {
    window.history.pushState({}, '', '/')
    setIsAdminPage(false)
  }

  const handleAnalyticsConsent = (accepted: boolean) => {
    if (accepted) {
      initializeGoogleAnalytics()
      trackPageView(window.location.pathname, document.title)
    }
  }

  if (isAdminPage) {
    return (
      <ErrorBoundary>
        <>
          <ToastContainer />
          <Suspense fallback={<LoadingScreen onLoadingComplete={() => {}} />}>
            <AdminPortal onNavigateHome={navigateHome} />
          </Suspense>
        </>
      </ErrorBoundary>
    )
  }

  return (
    <ErrorBoundary>
      <>
        {/* Paywall Overlay - Shows after loading screen */}
        <Paywall isActive={showPaywall} />

        <ToastContainer />
        <OfflineIndicator />
        <AnalyticsConsent onConsent={handleAnalyticsConsent} />
        
        {/* Loading Screen - Shows first */}
        {isLoading && <LoadingScreen onLoadingComplete={handleLoadingComplete} />}

        {/* Main Website */}
        <div className="relative">
          {/* Grain Texture Overlay */}
          <div className="grain" />
          
          {/* Main Content */}
          <Navbar />
          <Hero />
          <Features />
          <Inventory />
          <Parts />
          <Suspense fallback={<div className="h-96 bg-background" />}>
            <GalleryWall />
          </Suspense>
          <Suspense fallback={<div className="h-96 bg-background" />}>
            <Showreel />
          </Suspense>
          <CTA />
          <Contact />
          <Footer />

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </>
    </ErrorBoundary>
  )
}

export default App
