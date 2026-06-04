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

          {/* Modal - Clean and Simple */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 sm:inset-1 md:inset-2 z-[70]"
          >
            <div className="w-full h-full bg-card border border-border flex flex-col overflow-hidden">
              {/* Header - Simple */}
              <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border gap-3 flex-shrink-0">
                <div className="min-w-0">
                  <p className="text-xs text-foreground-muted">{vehicle.year} • {vehicle.location}</p>
                  <h2 className="font-serif text-lg sm:text-2xl">
                    {vehicle.brand}
                  </h2>
                  <p className="text-sm text-motorsport-red">
                    {vehicle.model}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-background-soft transition-colors flex-shrink-0"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Main Content */}
              <div className="flex-1 overflow-y-auto min-h-0">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 p-3 sm:p-4 h-full">
                  {/* Left: Image (3 cols on desktop) */}
                  <div className="lg:col-span-3 flex flex-col gap-3 min-h-0">
                    {/* Image Gallery */}
                    <div className="flex-1 min-h-0 overflow-hidden border border-border">
                      <ImageGallery
                        images={vehicle.images}
                        alt={`${vehicle.brand} ${vehicle.model}`}
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <h3 className="font-serif text-base font-bold mb-2">About</h3>
                      <p className="text-xs sm:text-sm text-foreground-muted leading-relaxed">
                        {vehicle.description}
                      </p>
                    </div>
                  </div>

                  {/* Right: Info (2 cols on desktop) */}
                  <div className="lg:col-span-2 flex flex-col gap-3 min-h-0 overflow-y-auto">
                    {/* Price */}
                    <div className="card-luxury p-3">
                      <p className="text-xs text-foreground-muted mb-1">Price</p>
                      <p className="text-2xl font-serif text-motorsport-red font-bold">
                        {vehicle.price}
                      </p>
                    </div>

                    {/* Specs */}
                    <div>
                      <h3 className="font-serif text-base font-bold mb-2">Specs</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(vehicle.specs).map(([key, value]) => (
                          <div key={key} className="card-luxury p-2">
                            <p className="text-xs text-foreground-muted uppercase truncate">{key}</p>
                            <p className="text-xs font-bold truncate">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Contact */}
                    <div>
                      <h3 className="font-serif text-base font-bold mb-2">Contact</h3>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center gap-2">
                          <Phone size={14} />
                          <a href="tel:+639123456789" className="hover:text-motorsport-red truncate">
                            +63 912 345 6789
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail size={14} />
                          <a href="mailto:hrvdcartrading@gmail.com" className="hover:text-motorsport-red truncate">
                            hrvdcartrading@gmail.com
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Facebook size={14} />
                          <a href="https://www.facebook.com/HRVDCarTrading" target="_blank" rel="noopener noreferrer" className="hover:text-motorsport-red truncate">
                            HRVDCarTrading
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col gap-2 flex-shrink-0 mt-auto">
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
                        className="btn-secondary w-full text-center text-xs sm:text-sm py-2"
                      >
                        Message on Facebook
                      </a>
                      <a
                        href="#contact"
                        onClick={onClose}
                        className="btn-primary w-full text-center text-xs sm:text-sm py-2"
                      >
                        Send Inquiry
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
