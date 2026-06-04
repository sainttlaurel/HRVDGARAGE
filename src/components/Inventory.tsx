import { motion } from 'framer-motion'
import { useState, useEffect, useCallback } from 'react'
import VehicleCard from './VehicleCard'
import VehicleModal from './VehicleModal'
import { subscribeToTable } from '../lib/realtimeSubscriptions'
import { onDataChange } from '../lib/dataEvents'
import { vehicleService } from '../lib/supabase'

interface Vehicle {
  id: string
  image: string
  images: string[]
  brand: string
  model: string
  year: number
  price: string
  location: string
  description: string
  specs: Record<string, string>
  available: boolean
  createdAt?: string
  updatedAt?: string
}

const Inventory = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  // Reload fresh data from the service layer
  const reloadVehicles = useCallback(async () => {
    try {
      const data = await vehicleService.getAll()
      setVehicles(data)
    } catch (error) {
      console.error('Error reloading vehicles:', error)
    }
  }, [])

  useEffect(() => {
    // Load initial data
    const initializeData = async () => {
      try {
        const data = await vehicleService.getAll()
        setVehicles(data)
      } catch (error) {
        console.error('Error loading vehicles:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeData()

    // Subscribe to Supabase real-time changes (works when Supabase is configured)
    const subscription = subscribeToTable('vehicles', (updatedVehicles) => {
      setVehicles(updatedVehicles as unknown as Vehicle[])
    })

    // Admin CRUD in same session (navigate home after edit)
    const unsubscribeDataChange = onDataChange('vehicles', () => {
      reloadVehicles()
    })

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
      unsubscribeDataChange()
    }
  }, [reloadVehicles])

  // Filter to show only available vehicles
  const availableVehicles = vehicles.filter(v => v.available)

  const handleViewDetails = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedVehicle(null), 300)
  }

  if (loading) {
    return (
      <section id="inventory" className="relative py-32 overflow-hidden">
        <div className="container-luxury relative z-10 text-center">
          <p className="text-foreground-muted">Loading inventory...</p>
        </div>
      </section>
    )
  }

  return (
    <>
      <section id="inventory" className="relative py-32 overflow-hidden">
      {/* Background Image - Subtle overlay */}
      <div className="absolute inset-0 opacity-5">
        <picture>
          <source
            type="image/webp"
            srcSet="/cars/20.webp"
          />
          <img
            src="/cars/20.jpg"
            alt="Background"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-b from-background-soft via-background-soft/98 to-background-soft" />
      </div>

      <div className="container-luxury relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <p className="label-small mb-4">Current Collection</p>
          <h2 className="heading-section mb-6">
            Premium Modified Vehicles
          </h2>
          <p className="text-lg text-foreground-muted">
            Each vehicle has been carefully selected and verified. From JDM classics to modern off-roaders, 
            all with complete papers and ready for transfer.
          </p>
          {availableVehicles.length < vehicles.length && (
            <p className="text-sm text-foreground-faint mt-4">
              {vehicles.length - availableVehicles.length} vehicle(s) sold
            </p>
          )}
        </motion.div>

        {availableVehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {availableVehicles.map((vehicle, index) => (
              <VehicleCard 
                key={vehicle.id} 
                {...vehicle} 
                index={index}
                onViewDetails={() => handleViewDetails(vehicle)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-foreground-muted">
              All vehicles are currently sold. Check back soon for new inventory!
            </p>
          </div>
        )}

        {/* Trade Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16 p-8 card-luxury"
        >
          <p className="text-lg text-foreground-muted">
            💬 Open for trade-ins and cash offers • All vehicles located in Quezon City
          </p>
        </motion.div>
      </div>
    </section>

    {/* Vehicle Detail Modal */}
    {selectedVehicle && (
      <VehicleModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        vehicle={selectedVehicle}
      />
    )}
  </>
  )
}

export default Inventory
