import { motion, AnimatePresence } from 'framer-motion'
import { X, Phone, Mail, Facebook, MapPin } from 'lucide-react'
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

          {/* Modal - Premium Full-Screen Layout */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 sm:inset-1 md:inset-2 z-[70]"
          >
            <div className="w-full h-full bg-gradient-to-b from-background-soft to-background border border-border flex flex-col overflow-hidden">
              {/* Header - Premium with gradient */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border gap-4 flex-shrink-0 bg-gradient-to-r from-background-soft via-background-soft/50 to-transparent">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin size={14} className="text-motorsport-red flex-shrink-0" />
                    <p className="text-xs sm:text-sm text-foreground-muted">{vehicle.year} • {vehicle.location}</p>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold truncate">
                    {vehicle.brand}
                  </h2>
                  <p className="font-serif text-xl sm:text-2xl text-motorsport-red truncate">
                    {vehicle.model}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-background-soft/50 rounded-full transition-colors flex-shrink-0 border border-border"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Main Content - Full utilization */}
              <div className="flex-1 overflow-y-auto min-h-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 sm:p-6 h-full">
                  {/* Left Column - Large Image (1 col) */}
                  <div className="lg:col-span-2 flex flex-col gap-4 min-h-0">
                    {/* Main Image Gallery */}
                    <div className="flex-1 min-h-0 rounded-lg overflow-hidden border-2 border-border shadow-lg">
                      <ImageGallery
                        images={vehicle.images}
                        alt={`${vehicle.brand} ${vehicle.model}`}
                      />
                    </div>

                    {/* Description Card */}
                    <div className="card-luxury p-4 sm:p-6 rounded-lg border border-border">
                      <h3 className="font-serif text-lg sm:text-xl font-bold mb-3">Overview</h3>
                      <p className="text-sm sm:text-base text-foreground-muted leading-relaxed">
                        {vehicle.description}
                      </p>
                      <p className="text-xs sm:text-sm text-foreground-faint mt-4">
                        💬 Open for trade-ins and cash offers
                      </p>
                    </div>
                  </div>

                  {/* Right Column - Information (1 col) */}
                  <div className="lg:col-span-1 flex flex-col gap-4 min-h-0 overflow-y-auto">
                    {/* Price Card - Premium */}
                    <motion.div
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="card-luxury p-4 sm:p-6 rounded-lg border-2 border-motorsport-red/30 bg-motorsport-red/5"
                    >
                      <p className="text-xs sm:text-sm text-foreground-muted uppercase tracking-wide mb-2">Asking Price</p>
                      <p className="text-3xl sm:text-4xl font-serif font-bold text-motorsport-red">
                        {vehicle.price}
                      </p>
                    </motion.div>

                    {/* Specifications - Grid */}
                    <motion.div
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.15 }}
                      className="card-luxury p-4 sm:p-6 rounded-lg border border-border"
                    >
                      <h3 className="font-serif text-base sm:text-lg font-bold mb-4">Specifications</h3>
                      <div className="space-y-3">
                        {Object.entries(vehicle.specs).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between pb-3 border-b border-border last:border-b-0 last:pb-0">
                            <p className="text-xs sm:text-sm text-foreground-muted uppercase font-semibold">{key}</p>
                            <p className="text-sm sm:text-base font-bold text-foreground">{value}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Contact Information */}
                    <motion.div
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="card-luxury p-4 sm:p-6 rounded-lg border border-border"
                    >
                      <h3 className="font-serif text-base sm:text-lg font-bold mb-4">Get In Touch</h3>
                      <div className="space-y-3">
                        <a href="tel:+639123456789" className="flex items-center gap-3 p-2 sm:p-3 bg-background-soft rounded-lg hover:bg-foreground/10 transition-colors group">
                          <Phone size={18} className="flex-shrink-0 text-motorsport-red group-hover:scale-110 transition-transform" />
                          <div className="min-w-0">
                            <p className="text-xs text-foreground-muted">Call/Viber</p>
                            <p className="text-sm sm:text-base font-semibold truncate">+63 912 345 6789</p>
                          </div>
                        </a>

                        <a href="mailto:hrvdcartrading@gmail.com" className="flex items-center gap-3 p-2 sm:p-3 bg-background-soft rounded-lg hover:bg-foreground/10 transition-colors group">
                          <Mail size={18} className="flex-shrink-0 text-motorsport-red group-hover:scale-110 transition-transform" />
                          <div className="min-w-0">
                            <p className="text-xs text-foreground-muted">Email</p>
                            <p className="text-sm sm:text-base font-semibold truncate">hrvdcartrading@gmail.com</p>
                          </div>
                        </a>

                        <a href="https://www.facebook.com/HRVDCarTrading" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 sm:p-3 bg-background-soft rounded-lg hover:bg-[#1877F2]/10 transition-colors group">
                          <Facebook size={18} className="flex-shrink-0 text-[#1877F2] group-hover:scale-110 transition-transform" />
                          <div className="min-w-0">
                            <p className="text-xs text-foreground-muted">Facebook</p>
                            <p className="text-sm sm:text-base font-semibold truncate">HRVDCarTrading</p>
                          </div>
                        </a>
                      </div>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.25 }}
                      className="flex flex-col gap-3 flex-shrink-0 mt-auto"
                    >
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
                        className="btn-secondary w-full text-center sm:text-sm py-3 rounded-lg font-semibold"
                      >
                        Message on Facebook
                      </a>
                      <a
                        href="#contact"
                        onClick={onClose}
                        className="btn-primary w-full text-center sm:text-sm py-3 rounded-lg font-semibold"
                      >
                        Send Inquiry
                      </a>
                    </motion.div>
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
