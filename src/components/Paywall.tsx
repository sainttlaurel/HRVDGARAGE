import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { AlertTriangle, ServerCrash } from 'lucide-react'

interface PaywallProps {
  isActive: boolean
}

const TIKTOK_URL = 'https://www.tiktok.com/@jb.suarez/video/7644094260735741205'

const ERRORS = [
  { code: 500, label: 'Internal Server Error' },
  { code: 429, label: 'Too Many Requests' },
  { code: 403, label: 'Forbidden' },
  { code: 401, label: 'Unauthorized' },
]

const Paywall = ({ isActive }: PaywallProps) => {
  const [visible, setVisible] = useState(false)
  const [cycleIndex, setCycleIndex] = useState(0)

  // Cycle through error codes every 2.5s to create unease
  useEffect(() => {
    if (!isActive) return
    const interval = setInterval(() => {
      setCycleIndex(prev => (prev + 1) % ERRORS.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [isActive])

  useEffect(() => {
    if (isActive) {
      // Small delay so the animation feels intentional
      const t = setTimeout(() => setVisible(true), 100)
      return () => clearTimeout(t)
    }
  }, [isActive])

  const error = ERRORS[cycleIndex]

  return (
    <AnimatePresence>
      {isActive && visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{ backdropFilter: 'blur(12px)', backgroundColor: 'rgba(0,0,0,0.92)' }}
        >
          {/* Scanline effect */}
          <div className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 4px)',
            }}
          />

          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4, ease: 'easeOut' }}
            className="relative max-w-md w-full"
          >
            {/* Terminal-style card */}
            <div className="bg-[#0d0d0d] border border-red-900/60 rounded-sm overflow-hidden shadow-2xl shadow-red-950/40">

              {/* Title bar */}
              <div className="flex items-center gap-2 px-4 py-3 bg-[#111] border-b border-red-900/40">
                <div className="w-3 h-3 rounded-full bg-red-600" />
                <div className="w-3 h-3 rounded-full bg-yellow-600/50" />
                <div className="w-3 h-3 rounded-full bg-green-600/20" />
                <span className="ml-2 text-xs text-red-400/80 font-mono tracking-widest uppercase">
                  System Error
                </span>
              </div>

              {/* Body */}
              <div className="p-8 space-y-6">

                {/* Animated error icon */}
                <div className="flex justify-center">
                  <motion.div
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  >
                    <ServerCrash size={48} className="text-red-500" />
                  </motion.div>
                </div>

                {/* Error code — cycles */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={error.code}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.3 }}
                    className="text-center space-y-1"
                  >
                    <p className="font-mono text-5xl font-bold text-red-500 tracking-tight">
                      {error.code}
                    </p>
                    <p className="font-mono text-sm text-red-400/80 uppercase tracking-widest">
                      {error.label}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Message */}
                <div className="space-y-2 text-center">
                  <p className="text-white/90 font-medium">
                    Access to this service has been restricted.
                  </p>
                  <p className="text-white/50 text-sm leading-relaxed">
                    A critical error was detected. To restore access, follow the instructions sent to your registered contact.
                  </p>
                </div>

                {/* Error trace */}
                <div className="bg-black/60 border border-red-900/30 rounded-sm p-3 font-mono text-xs text-red-400/60 space-y-1">
                  <p>trace_id: <span className="text-red-400/40">{Math.random().toString(36).slice(2, 10).toUpperCase()}</span></p>
                  <p>timestamp: <span className="text-red-400/40">{new Date().toISOString()}</span></p>
                  <p>origin: <span className="text-red-400/40">{typeof window !== 'undefined' ? window.location.hostname : 'unknown'}</span></p>
                </div>

                {/* TikTok CTA */}
                <motion.a
                  href={TIKTOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-3 w-full py-3 px-6 rounded-sm font-medium text-white transition-all"
                  style={{ backgroundColor: '#010101' }}
                >
                  {/* TikTok logo */}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.17 8.17 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
                  </svg>
                  View Recovery Instructions
                </motion.a>

              </div>
            </div>

            {/* Warning strip at bottom */}
            <motion.div
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mt-3 flex items-center justify-center gap-2 text-yellow-500/60 text-xs font-mono"
            >
              <AlertTriangle size={12} />
              <span>DO NOT CLOSE THIS TAB — CONNECTION MAY BE LOST</span>
              <AlertTriangle size={12} />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Paywall
