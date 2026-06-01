import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useState, useEffect } from 'react'

interface AnalyticsConsentProps {
  onConsent: (accepted: boolean) => void
}

const AnalyticsConsent = ({ onConsent }: AnalyticsConsentProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const [hasDecided, setHasDecided] = useState(false)

  useEffect(() => {
    // Check if user has already made a decision
    const consentDecision = localStorage.getItem('analytics_consent')
    if (consentDecision) {
      setHasDecided(true)
    } else {
      // Show banner after 2 seconds
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('analytics_consent', 'accepted')
    setIsVisible(false)
    setHasDecided(true)
    onConsent(true)
  }

  const handleReject = () => {
    localStorage.setItem('analytics_consent', 'rejected')
    setIsVisible(false)
    setHasDecided(true)
    onConsent(false)
  }

  if (hasDecided) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 right-4 z-50 max-w-sm"
        >
          <div className="bg-background border border-border rounded-sm p-6 shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-medium text-sm">Analytics & Cookies</h3>
              <button
                onClick={handleReject}
                className="p-1 hover:bg-foreground-faint/20 rounded transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-foreground-muted mb-4 leading-relaxed">
              We use analytics to understand how you use our site and improve your experience. 
              We respect your privacy and only collect anonymized data. 
              <a 
                href="#privacy" 
                className="text-motorsport-red hover:underline ml-1"
              >
                Learn more
              </a>
            </p>

            <div className="flex gap-3">
              <motion.button
                onClick={handleReject}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-4 py-2 border border-border text-sm font-medium hover:bg-foreground-faint/10 transition-colors rounded-sm"
              >
                Reject
              </motion.button>
              <motion.button
                onClick={handleAccept}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-4 py-2 bg-motorsport-red text-white text-sm font-medium hover:bg-motorsport-red/90 transition-colors rounded-sm"
              >
                Accept
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AnalyticsConsent
