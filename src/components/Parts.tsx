import { motion } from 'framer-motion'
import { useState, useEffect, useCallback } from 'react'
import PartCard from './PartCard'
import PartModal from './PartModal'
import PartsPurchaseModal from './PartsPurchaseModal'
import { Part, partsService } from '../lib/supabase'
import { subscribeToTable } from '../lib/realtimeSubscriptions'
import { onDataChange } from '../lib/dataEvents'

const Parts = () => {
  const [parts, setParts] = useState<Part[]>([])
  const [selectedPart, setSelectedPart] = useState<Part | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  // Reload fresh data from the service layer
  const reloadParts = useCallback(async () => {
    try {
      const data = await partsService.getAll()
      setParts(data)
    } catch (error) {
      console.error('Error reloading parts:', error)
    }
  }, [])

  useEffect(() => {
    // Load initial data
    const initializeData = async () => {
      const data = await partsService.getAll()
      setParts(data)
      setLoading(false)
    }

    initializeData()

    // Subscribe to Supabase real-time changes (works when Supabase is configured)
    const subscription = subscribeToTable('parts', (updatedParts) => {
      setParts(updatedParts as unknown as Part[])
    })

    const unsubscribeDataChange = onDataChange('parts', () => {
      reloadParts()
    })

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
      unsubscribeDataChange()
    }
  }, [reloadParts])

  // Filter to show only available parts
  const availableParts = parts.filter(p => p.available)

  const handleInquire = (part: Part) => {
    setSelectedPart(part)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    // Don't clear selectedPart here - it might be needed for purchase modal
  }

  const handleClosePurchaseModal = () => {
    setIsPurchaseModalOpen(false)
    setTimeout(() => setSelectedPart(null), 300)
  }

  if (loading) {
    return (
      <section id="parts" className="relative py-32 overflow-hidden">
        <div className="container-luxury relative z-10 text-center">
          <p className="text-foreground-muted">Loading parts...</p>
        </div>
      </section>
    )
  }

  return (
    <>
      <section id="parts" className="relative py-32 overflow-hidden">
      {/* Background Image - Using car 1.jpg */}
      <div className="absolute inset-0 opacity-5">
        <picture>
          <source
            type="image/webp"
            srcSet="/cars/1.webp"
          />
          <img
            src="/cars/1.jpg"
            alt="Background"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/98 to-background" />
      </div>

      <div className="container-luxury relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <p className="label-small mb-4">Performance Parts</p>
          <h2 className="heading-section mb-6">
            Upgrade Your Build
          </h2>
          <p className="text-lg text-foreground-muted">
            Quality aftermarket and OEM parts for your project. 
            From suspension to engine upgrades – all verified and ready to ship.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {availableParts.map((part, index) => (
            <PartCard 
              key={part.id} 
              {...part} 
              index={index}
              onInquire={() => handleInquire(part)}
            />
          ))}
        </div>

        {availableParts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-foreground-muted">
              All parts are currently sold. Check back soon for new inventory!
            </p>
          </div>
        )}

        {availableParts.length < parts.length && (
          <p className="text-sm text-foreground-faint text-center mt-4">
            {parts.length - availableParts.length} part(s) sold
          </p>
        )}

        {/* Parts Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16 p-8 card-luxury"
        >
          <p className="text-lg text-foreground-muted mb-4">
            🔧 Looking for specific parts? Send us your requirements!
          </p>
          <a href="#contact" className="btn-primary inline-block">
            Request Parts
          </a>
        </motion.div>
      </div>
    </section>

    {/* Part Detail Modal */}
    {selectedPart && (
      <PartModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        part={selectedPart}
        onPurchase={() => {
          setIsPurchaseModalOpen(true)
        }}
      />
    )}

    {/* Purchase Modal */}
    {selectedPart && (
      <PartsPurchaseModal
        isOpen={isPurchaseModalOpen}
        onClose={handleClosePurchaseModal}
        part={selectedPart}
      />
    )}
  </>
  )
}

export default Parts
