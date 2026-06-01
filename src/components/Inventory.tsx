import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import VehicleCard from './VehicleCard'
import VehicleModal from './VehicleModal'
import { subscribeToTable, loadInitialData } from '../lib/realtimeSubscriptions'

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

const defaultVehicles: Vehicle[] = [
  {
    id: '1',
    image: '/image/HONDA CIVIC.jpg',
    images: [
      '/image/HONDA CIVIC.jpg',
      '/cars/1.jpg',
      '/cars/2.jpg',
      '/cars/3.jpg',
      '/cars/4.jpg',
      '/cars/5.jpg'
    ],
    brand: 'Honda',
    model: 'Civic VTi VTEC',
    year: 1997,
    price: '₱210,000',
    location: 'Quezon City',
    description: 'All stock engine, 1st owner. Fresh repaint – gas & go. Cold AC, power windows/mirrors. Type R seats, MOMO steering wheel. JBL + Pioneer sound setup. Registered until 2026, complete papers. Fresh & reliable – perfect pang-daily/tambay!',
    specs: {
      'mileage': '1st Owner',
      'condition': 'Fresh Repaint',
      'registration': 'Until 2026'
    },
    available: true
  },
  {
    id: '2',
    image: '/image/TOYOTA LC200.jpg',
    images: [
      '/image/TOYOTA LC200.jpg',
      '/cars/6.jpg',
      '/cars/7.jpg',
      '/cars/8.jpg',
      '/cars/9.jpg',
      '/cars/10.jpg',
      '/cars/11.jpg',
      '/cars/12.jpg'
    ],
    brand: 'Toyota',
    model: 'Land Cruiser LC200',
    year: 2016,
    price: '₱3,815,000',
    location: 'Quezon City',
    description: '4.5L V8 Turbo Diesel, 4x4 AT. 128k kms, Toyota Commonwealth maintained. 100% orig paint, fresh in & out. Beige leather interior, 2 headrest monitors. 20" OEM rims + Dunlop Grandtrek (almost new). Ice-cold AC, no underchassis issues. 2 orig keys, updated reg, free transfer. Luxury + durability – built to last! Open for trade (with cash top-up).',
    specs: {
      'mileage': '128k kms',
      'engine': '4.5L V8 Turbo Diesel',
      'drivetrain': '4x4 AT'
    },
    available: true
  },
  {
    id: '3',
    image: '/image/TOYOTA FJ CRUISER.jpg',
    images: [
      '/image/TOYOTA FJ CRUISER.jpg',
      '/cars/13.jpg',
      '/cars/14.jpg',
      '/cars/15.jpg',
      '/cars/16.jpg',
      '/cars/17.jpg',
      '/cars/18.jpg',
      '/cars/19.jpg',
      '/cars/20.jpg'
    ],
    brand: 'Toyota',
    model: 'FJ Cruiser 4x4',
    year: 2016,
    price: '₱1,780,000',
    location: 'Quezon City',
    description: '47k kms only, fresh PMS done. Brand new Amaron battery. 100% orig paint, complete papers. Old Man Emu BP-51 suspension + UCAs. SCS wheels + BFGoodrich KM3 set of 5. Borla headers + full Borla exhaust. AFE Momentum GT intake. Stage 4 projector retrofit headlights. ₱200K sound setup – Pioneer Z5050, Focal, Crescendo. Solid, built, and loaded – ready to roll! Open to trade + cash offers.',
    specs: {
      'mileage': '47k kms',
      'suspension': 'OME BP-51',
      'sound': '₱200K Setup'
    },
    available: true
  },
  {
    id: '4',
    image: '/image/FORD RANGER WILDTRACK.jpg',
    images: [
      '/image/FORD RANGER WILDTRACK.jpg',
      '/cars/21.jpg',
      '/cars/22.jpg',
      '/cars/23.jpg',
      '/cars/24.jpg',
      '/cars/25.jpg',
      '/cars/26.jpg',
      '/cars/27.jpg',
      '/cars/28.jpg',
      '/cars/29.jpg',
      '/cars/30.jpg'
    ],
    brand: 'Ford',
    model: 'Ranger Wildtrak',
    year: 2018,
    price: '₱995,000',
    location: 'Quezon City',
    description: '3.2L Turbo Diesel, 6AT. 42k kms only, all original & excellent condition. Complete papers, 2 orig keys, manuals. Upgrades: TJM front/rear bumpers + rocksliders, TJM Pace suspension + ARB OME leafs + UCAs, 2" body lift + Bushwacker flares, Mastercraft MXT 35x12.5x20 tires, Safari snorkel + BRC exhaust, Roller lid w/ lock, All-LED headlights & fogs. Off-road ready, no issues – just gas & go! Open for swap/trade + cash offers.',
    specs: {
      'mileage': '42k kms',
      'engine': '3.2L Turbo Diesel',
      'modifications': 'Full Off-Road Build'
    },
    available: true
  }
]

const Inventory = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load initial data
    const initializeData = async () => {
      const data = await loadInitialData('vehicles')
      setVehicles(data.length > 0 ? data : defaultVehicles)
      setLoading(false)
    }

    initializeData()

    // Subscribe to real-time changes
    const subscription = subscribeToTable('vehicles', (updatedVehicles) => {
      setVehicles(updatedVehicles.length > 0 ? updatedVehicles : defaultVehicles)
    })

    // Cleanup subscription on unmount
    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [])

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
