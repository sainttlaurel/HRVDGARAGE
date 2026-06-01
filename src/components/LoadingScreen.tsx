import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

interface LoadingScreenProps {
  onLoadingComplete: () => void
}

// Funny troll error messages
const trollErrors = [
  '🤖 Initializing AI to judge your car choices...',
  '⚙️ Recalibrating the vibe check algorithm...',
  '🚗 Teaching the server how to drift...',
  '💾 Downloading more RAM...',
  '🔧 Fixing bugs that don\'t exist yet...',
  '🎨 Making pixels look extra shiny...',
  '📡 Communicating with the car gods...',
  '🌍 Rotating the earth for better loading...',
  '⚡ Charging the internet battery...',
  '🎯 Calibrating the hype machine...',
]

const LoadingScreen = ({ onLoadingComplete }: LoadingScreenProps) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [shouldExit, setShouldExit] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const [currentError, setCurrentError] = useState(0)

  useEffect(() => {
    // Change error message every 800ms for comedy effect
    const errorInterval = setInterval(() => {
      setCurrentError((prev) => (prev + 1) % trollErrors.length)
    }, 800)

    return () => clearInterval(errorInterval)
  }, [])

  useEffect(() => {
    // Minimum display time of 3 seconds (reduced from 8)
    const minTimer = setTimeout(() => {
      if (isVideoLoaded || videoError) {
        setShouldExit(true)
      }
    }, 3000)

    // Fallback: Force exit after 5 seconds if video hasn't loaded (reduced from 12)
    const maxTimer = setTimeout(() => {
      setShouldExit(true)
    }, 5000)

    return () => {
      clearTimeout(minTimer)
      clearTimeout(maxTimer)
    }
  }, [isVideoLoaded, videoError])

  useEffect(() => {
    if (shouldExit) {
      // Wait for exit animation to complete
      const exitTimer = setTimeout(() => {
        onLoadingComplete()
      }, 800)
      return () => clearTimeout(exitTimer)
    }
  }, [shouldExit, onLoadingComplete])

  const handleVideoLoad = () => {
    setIsVideoLoaded(true)
  }

  const handleVideoEnd = () => {
    setShouldExit(true)
  }

  const handleVideoError = () => {
    setVideoError(true)
  }

  return (
    <AnimatePresence>
      {!shouldExit && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] bg-background flex items-center justify-center"
        >
          {/* Video Background */}
          {!videoError && (
            <video
              autoPlay
              muted
              playsInline
              onLoadedData={handleVideoLoad}
              onEnded={handleVideoEnd}
              onError={handleVideoError}
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="/video/loading screeeeeeen.mp4" type="video/mp4" />
            </video>
          )}

          {/* Fallback Background (if video fails) */}
          {videoError && (
            <div className="absolute inset-0 bg-gradient-to-br from-background via-background-soft to-background" />
          )}

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-background/30" />

          {/* Loading Text with Troll Errors */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-foreground border-t-transparent rounded-full"
                />
                <p className="label-small">Loading Experience</p>
              </div>
              
              {/* Troll Error Messages */}
              <motion.div
                key={currentError}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-xs text-foreground-muted italic max-w-xs"
              >
                {trollErrors[currentError]}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default LoadingScreen
