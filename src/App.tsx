import { useState, useEffect, lazy, Suspense } from 'react'
import LoadingScreen from './components/LoadingScreen'
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
import { loadFromSupabaseToLocalStorage, syncLocalStorageToSupabase } from './lib/syncToSupabase'
import { initializeOfflineSupport } from './lib/offline'
import { initializeDefaultData } from './lib/initializeData'
import { initializeGoogleAnalytics, trackPageView } from './lib/analytics'

// Lazy load heavy components
const GalleryWall = lazy(() => import('./components/GalleryWall'))
const Showreel = lazy(() => import('./components/Showreel'))
const AdminPortal = lazy(() => import('./pages/AdminPortal'))

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [isAdminPage, setIsAdminPage] = useState(window.location.pathname === '/admin')

  useEffect(() => {
    // Initialize offline support
    initializeOfflineSupport()

    // Initialize default data in localStorage
    initializeDefaultData()

    // Check if user has already consented to analytics
    const consentDecision = localStorage.getItem('analytics_consent')
    if (consentDecision === 'accepted') {
      initializeGoogleAnalytics()
      trackPageView(window.location.pathname, document.title)
    }

    // Sync data on app load
    const initializeData = async () => {
      // First, load from Supabase to get latest data
      await loadFromSupabaseToLocalStorage()
      // Then, sync any local changes back to Supabase
      await syncLocalStorageToSupabase()
    }
    
    initializeData()
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
        <ToastContainer />
        <OfflineIndicator />
        <AnalyticsConsent onConsent={handleAnalyticsConsent} />
        
        {/* Loading Screen */}
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
