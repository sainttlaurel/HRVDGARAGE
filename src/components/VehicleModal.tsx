import { motion, AnimatePresence } from 'framer-motion'
import { X, Phone, Mail, Facebook } from 'lucide-react'
import ImageGallery from './ImageGallery'
import SocialShareButton from './SocialShareButton'

interface VehicleModalProps {
  isOpen: boolean
  onClose: () => void
  vehicle: {
    id?: string
    image: string
    images: string[]
    brand: string
    model: string
    year: number
    price: string
    location: string
    description: string
    specs: Record<string, string>
  }
}

const VehicleModal = ({ isOpen, onClose, vehicle }: VehicleModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/95 backdrop-blur-sm z-[60]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-2 sm:inset-4 md:inset-8 lg:inset-16 z-[70] overflow-hidden"
          >
            <div className="w-full h-full bg-card border border-border rounded-sm overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-2 sm:p-3 border-b border-border gap-2">
                <div className="min-w-0">
                  <p className="label-small text-xs">{vehicle.year} • {vehicle.location}</p>
                  <h2 className="font-serif text-lg sm:text-2xl md:text-3xl mt-1 truncate">
                    {vehicle.brand} {vehicle.model}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-background-soft rounded-full transition-colors flex-shrink-0"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3 md:gap-4 p-3 sm:p-4">
                  {/* Left Column - Image Gallery */}
                  <div className="space-y-2 sm:space-y-3">
                    <ImageGallery
                      images={vehicle.images}
                      alt={`${vehicle.brand} ${vehicle.model}`}
                    />

                    {/* Price Card */}
                    <div className="card-luxury p-2 sm:p-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="label-small mb-1 text-xs">Asking Price</p>
                          <p className="text-lg sm:text-xl md:text-2xl font-serif text-motorsport-red truncate">
                            {vehicle.price}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-foreground-muted mt-2">
                        💬 Open for trade-ins and cash offers
                      </p>
                    </div>
                  </div>

                  {/* Right Column - Details */}
                  <div className="space-y-2 sm:space-y-3 overflow-y-auto max-h-96">
                    {/* Description */}
                    <div>
                      <h3 className="font-serif text-sm sm:text-lg mb-2">Description</h3>
                      <p className="text-xs sm:text-sm text-foreground-muted leading-relaxed line-clamp-3">
                        {vehicle.description}
                      </p>
                    </div>

                    {/* Specifications */}
                    <div>
                      <h3 className="font-serif text-sm sm:text-lg mb-2">Specifications</h3>
                      <div className="grid grid-cols-2 gap-1 sm:gap-2">
                        {Object.entries(vehicle.specs).map(([key, value]) => (
                          <div key={key} className="card-luxury p-2 sm:p-2">
                            <p className="label-small mb-1 text-xs">{key}</p>
                            <p className="text-xs sm:text-sm font-medium truncate">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Contact Info - Compact */}
                    <div className="card-luxury p-2 sm:p-3 space-y-2">
                      <h3 className="font-serif text-sm sm:text-base mb-2">Contact</h3>
                      
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="flex-shrink-0" />
                        <a href="tel:+639123456789" className="text-xs sm:text-sm hover:text-motorsport-red transition-colors truncate">
                          +63 912 345 6789
                        </a>
                      </div>

                      <div className="flex items-center gap-2">
                        <Mail size={14} className="flex-shrink-0" />
                        <a href="mailto:hrvdcartrading@gmail.com" className="text-xs sm:text-sm hover:text-motorsport-red transition-colors truncate">
                          hrvdcartrading@gmail.com
                        </a>
                      </div>

                      <div className="flex items-center gap-2">
                        <Facebook size={14} className="flex-shrink-0" />
                        <a href="https://www.facebook.com/HRVDCarTrading" target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm hover:text-motorsport-red transition-colors truncate">
                          HRVDCarTrading
                        </a>
                      </div>
                    </div>

                    {/* CTA Buttons - Compact */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
                      <SocialShareButton
                        title={`${vehicle.brand} ${vehicle.model} - ${vehicle.price}`}
                        description={vehicle.description}
                        url={window.location.href}
                        itemType="vehicle"
                        itemId={vehicle.id || ''}
                        itemName={`${vehicle.brand} ${vehicle.model}`}
                      />
                      <a
                        href="https://www.facebook.com/HRVDCarTrading"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary flex-1 text-center text-xs py-2"
                      >
                        Facebook
                      </a>
                      <a
                        href="#contact"
                        onClick={onClose}
                        className="btn-primary flex-1 text-center text-xs py-2"
                      >
                        Inquire
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default VehicleModal
