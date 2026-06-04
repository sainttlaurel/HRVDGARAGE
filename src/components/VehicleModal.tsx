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

          {/* Modal - Fixed layout without double scroll */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-2 sm:inset-3 md:inset-4 z-[70]"
          >
            <div className="w-full h-full bg-card border border-border rounded-sm flex flex-col overflow-hidden">
              {/* Header - Compact, fixed height */}
              <div className="flex items-center justify-between p-3 border-b border-border gap-2 flex-shrink-0 bg-background-soft">
                <div className="min-w-0">
                  <p className="text-xs text-foreground-muted">{vehicle.year} • {vehicle.location}</p>
                  <h2 className="font-serif text-base sm:text-lg truncate">
                    {vehicle.brand} {vehicle.model}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-background rounded transition-colors flex-shrink-0"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Main Content Grid - NO NESTED SCROLLING */}
              <div className="flex-1 overflow-y-auto min-h-0">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-2 p-3 h-full">
                  {/* Left: Image (2 cols on desktop) */}
                  <div className="md:col-span-2 flex flex-col gap-2 min-h-0">
                    <div className="flex-1 min-h-0 rounded overflow-hidden border border-border">
                      <ImageGallery
                        images={vehicle.images}
                        alt={`${vehicle.brand} ${vehicle.model}`}
                      />
                    </div>
                    <div className="card-luxury p-2 flex-shrink-0">
                      <p className="text-xs text-foreground-muted">Price</p>
                      <p className="text-lg font-serif text-motorsport-red">{vehicle.price}</p>
                    </div>
                  </div>

                  {/* Right: Details (3 cols on desktop) */}
                  <div className="md:col-span-3 flex flex-col gap-2 min-h-0">
                    {/* About Section */}
                    <div className="flex-shrink-0">
                      <h3 className="font-serif text-sm font-bold mb-1">About</h3>
                      <p className="text-xs text-foreground-muted line-clamp-2">{vehicle.description}</p>
                    </div>

                    {/* Specs Grid */}
                    <div className="flex-shrink-0">
                      <h3 className="font-serif text-sm font-bold mb-1">Details</h3>
                      <div className="grid grid-cols-3 gap-1">
                        {Object.entries(vehicle.specs).map(([key, value]) => (
                          <div key={key} className="card-luxury p-1.5 text-center min-h-0">
                            <p className="text-xs text-foreground-muted uppercase truncate">{key}</p>
                            <p className="text-xs font-bold truncate">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Contact Section */}
                    <div className="flex-shrink-0">
                      <h3 className="font-serif text-sm font-bold mb-1">Contact</h3>
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2">
                          <Phone size={12} className="flex-shrink-0" />
                          <a href="tel:+639123456789" className="hover:text-motorsport-red truncate">
                            +63 912 345 6789
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail size={12} className="flex-shrink-0" />
                          <a href="mailto:hrvdcartrading@gmail.com" className="hover:text-motorsport-red truncate">
                            hrvdcartrading@gmail.com
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Facebook size={12} className="flex-shrink-0" />
                          <a href="https://www.facebook.com/HRVDCarTrading" target="_blank" rel="noopener noreferrer" className="hover:text-motorsport-red truncate">
                            HRVDCarTrading
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons - Sticky at bottom */}
                    <div className="flex flex-col gap-1.5 flex-shrink-0 mt-auto pt-2 border-t border-border">
                      <div className="flex gap-1.5">
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
                      </div>
                      <a
                        href="#contact"
                        onClick={onClose}
                        className="btn-primary w-full text-center text-xs py-2"
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
