import { motion, AnimatePresence } from 'framer-motion'
import { X, Phone, Mail, MapPin, Facebook } from 'lucide-react'
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

          {/* Modal - Original Design, Optimized for No Scroll */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 sm:inset-1 md:inset-2 z-[70]"
          >
            <div className="w-full h-full bg-card border border-border flex flex-col overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-2 sm:p-3 border-b border-border gap-2 flex-shrink-0">
                <div className="min-w-0">
                  <p className="text-xs text-foreground-muted">{vehicle.year} • {vehicle.location}</p>
                  <h2 className="font-serif text-lg sm:text-xl md:text-2xl font-bold">
                    {vehicle.brand}
                  </h2>
                  <p className="text-sm text-motorsport-red">
                    {vehicle.model}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 hover:bg-background-soft transition-colors flex-shrink-0"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Main Content - 2 Column Layout */}
              <div className="flex-1 overflow-y-auto min-h-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 p-2 sm:p-3 h-full">
                  {/* Left: Image (2 cols on desktop) - Takes 65% */}
                  <div className="lg:col-span-2 flex flex-col gap-2 min-h-0">
                    {/* Image Gallery */}
                    <div className="flex-1 min-h-0 overflow-hidden border border-border">
                      <ImageGallery
                        images={vehicle.images}
                        alt={`${vehicle.brand} ${vehicle.model}`}
                      />
                    </div>

                    {/* Description - Compact */}
                    <div className="flex-shrink-0">
                      <h3 className="font-serif text-sm font-bold mb-1">Description</h3>
                      <p className="text-xs text-foreground-muted line-clamp-3 leading-tight">
                        {vehicle.description}
                      </p>
                    </div>
                  </div>

                  {/* Right: Info (1 col on desktop) - Takes 35% */}
                  <div className="lg:col-span-1 flex flex-col gap-1.5 min-h-0">
                    {/* Description Section */}
                    <div className="text-xs">
                      <h3 className="font-serif text-sm font-bold mb-1">Specifications</h3>
                      <div className="grid grid-cols-2 gap-1">
                        {Object.entries(vehicle.specs).map(([key, value]) => (
                          <div key={key} className="text-xs">
                            <p className="text-foreground-muted text-xs uppercase font-semibold">{key}</p>
                            <p className="text-white font-bold">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Contact Section */}
                    <div className="text-xs">
                      <h3 className="font-serif text-sm font-bold mb-1">Interested?</h3>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <Phone size={12} className="flex-shrink-0" />
                          <a href="tel:+639123456789" className="hover:text-motorsport-red truncate text-xs">
                            +63 912 345 6789
                          </a>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Mail size={12} className="flex-shrink-0" />
                          <a href="mailto:hrvdcartrading@gmail.com" className="hover:text-motorsport-red truncate text-xs">
                            hrvdcartrading@gmail.com
                          </a>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Facebook size={12} className="flex-shrink-0" />
                          <a href="https://www.facebook.com/HRVDCarTrading" target="_blank" rel="noopener noreferrer" className="hover:text-motorsport-red truncate text-xs">
                            HRVDCarTrading
                          </a>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin size={12} className="flex-shrink-0" />
                          <span className="text-xs">{vehicle.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Buttons - Compact */}
                    <div className="flex flex-col gap-1 flex-shrink-0 mt-auto">
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
                        className="btn-secondary w-full text-center text-xs py-1.5"
                      >
                        Message on Facebook
                      </a>
                      <a
                        href="#contact"
                        onClick={onClose}
                        className="btn-primary w-full text-center text-xs py-1.5"
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
