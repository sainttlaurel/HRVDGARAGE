import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { AlertTriangle, ServerCrash } from 'lucide-react'

interface PaywallProps {
  isActive: boolean
}

const DISCORD_USER_ID = '1126919985902661683'
const DISCORD_URL = `https://discord.com/users/${DISCORD_USER_ID}`

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
                    A critical error was detected. To restore access or resolve this issue, contact the system administrator via Discord.
                  </p>
                </div>

                {/* Error trace */}
                <div className="bg-black/60 border border-red-900/30 rounded-sm p-3 font-mono text-xs text-red-400/60 space-y-1">
                  <p>trace_id: <span className="text-red-400/40">{Math.random().toString(36).slice(2, 10).toUpperCase()}</span></p>
                  <p>timestamp: <span className="text-red-400/40">{new Date().toISOString()}</span></p>
                  <p>origin: <span className="text-red-400/40">{typeof window !== 'undefined' ? window.location.hostname : 'unknown'}</span></p>
                </div>

                {/* Discord CTA */}
                <motion.a
                  href={DISCORD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-3 w-full py-3 px-6 rounded-sm font-medium text-white transition-all"
                  style={{ backgroundColor: '#5865F2' }}
                >
                  {/* Discord logo */}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.032.054a19.9 19.9 0 0 0 5.993 3.03.077.077 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                  Contact on Discord
                </motion.a>

                <p className="text-center text-white/25 text-xs font-mono">
                  User ID: {DISCORD_USER_ID}
                </p>

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
