import { motion } from 'framer-motion'
import { useState, useEffect, useCallback } from 'react'
import PartCard from './PartCard'
import PartModal from './PartModal'
import PartsPurchaseModal from './PartsPurchaseModal'
import { Part, partsService } from '../lib/supabase'
import { subscribeToTable, loadInitialData } from '../lib/realtimeSubscriptions'
import { onDataChange } from '../lib/dataEvents'

const defaultParts: Part[] = [
  {
    id: '1',
    image: '/image/parts/sample-part.jpg',
    category: 'Suspension',
    name: 'Coilover Kit',
    brand: 'BC Racing',
    price: '₱45,000',
    condition: 'Brand New',
    description: 'Adjustable coilover suspension kit. Height and damping adjustable. Fits various applications.',
    available: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    image: '/image/parts/sample-part.jpg',
    category: 'Exhaust',
    name: 'Cat-Back Exhaust',
    brand: 'HKS',
    price: '₱35,000',
    condition: 'Used - Excellent',
    description: 'Stainless steel cat-back exhaust system. Deep tone, minimal drone. Complete with hardware.',
    available: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    image: '/image/parts/sample-part.jpg',
    category: 'Wheels',
    name: 'Forged Wheels 18"',
    brand: 'Rays Volk Racing',
    price: '₱120,000',
    condition: 'Used - Good',
    description: 'Set of 4 genuine Rays Volk Racing TE37. 18x9.5 +22 offset. Minor curb rash, structurally perfect.',
    available: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    image: '/image/parts/sample-part.jpg',
    category: 'Engine',
    name: 'Turbo Kit',
    brand: 'Garrett',
    price: '₱85,000',
    condition: 'Brand New',
    description: 'Complete turbo kit with manifold, downpipe, and oil lines. Supports up to 400hp.',
    available: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '5',
    image: '/image/parts/sample-part.jpg',
    category: 'Interior',
    name: 'Racing Seats (Pair)',
    brand: 'Bride',
    price: '₱55,000',
    condition: 'Used - Excellent',
    description: 'Pair of Bride Low Max racing seats. FRP shell, excellent condition. Side mounts included.',
    available: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '6',
    image: '/image/parts/sample-part.jpg',
    category: 'Electronics',
    name: 'ECU Tuner',
    brand: 'Hondata',
    price: '₱28,000',
    condition: 'Used - Good',
    description: 'Hondata FlashPro for Honda/Acura. Includes cable and software license. Fully functional.',
    available: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

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
      setParts((data.length > 0 ? data : defaultParts) as Part[])
    } catch (error) {
      console.error('Error reloading parts:', error)
    }
  }, [])

  useEffect(() => {
    // Load initial data
    const initializeData = async () => {
      const data = await loadInitialData('parts')
      setParts((data.length > 0 ? data : defaultParts) as Part[])
      setLoading(false)
    }

    initializeData()

    // Subscribe to Supabase real-time changes (works when Supabase is configured)
    const subscription = subscribeToTable('parts', (updatedParts) => {
      setParts((updatedParts.length > 0 ? updatedParts : defaultParts) as Part[])
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
