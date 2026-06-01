import { motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'

interface PaywallProps {
  isActive: boolean
}

const Paywall = ({ isActive }: PaywallProps) => {
  if (!isActive) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[200] bg-background/95 backdrop-blur-md flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-md w-full bg-card border border-border rounded-lg p-8 text-center space-y-6"
      >
        {/* Error Icon */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex justify-center"
        >
          <div className="w-16 h-16 rounded-full bg-motorsport-red/10 flex items-center justify-center">
            <AlertCircle size={32} className="text-motorsport-red" />
          </div>
        </motion.div>

        {/* Error Message */}
        <div className="space-y-2">
          <h2 className="font-serif text-2xl">Service Unavailable</h2>
          <p className="text-foreground-muted">
            Database connection error. Please try again later.
          </p>
        </div>

        {/* Error Code */}
        <div className="bg-background/50 border border-border rounded p-4">
          <p className="text-xs text-foreground-muted font-mono">
            Error Code: DB_CONNECTION_FAILED
          </p>
          <p className="text-xs text-foreground-muted font-mono mt-1">
            Status: 503 Service Unavailable
          </p>
        </div>

        {/* Retry Button */}
        <button
          onClick={() => window.location.reload()}
          className="w-full btn-primary"
        >
          Retry Connection
        </button>

        {/* Support Text */}
        <p className="text-xs text-foreground-muted">
          If this persists, please contact support.
        </p>
      </motion.div>
    </motion.div>
  )
}

export default Paywall
