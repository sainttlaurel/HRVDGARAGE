import { motion, AnimatePresence } from 'framer-motion'
import { X, Phone, Mail, MapPin, DollarSign, Facebook } from 'lucide-react'
import ImageGallery from './ImageGallery'

interface VehicleModalProps {
  isOpen: boolean
  onClose: () => void
  vehicle: {
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
            className="fixed inset-4 md:inset-8 lg:inset-16 z-[70] overflow-hidden"
          >
            <div className="w-full h-full bg-card border border-border rounded-sm overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div>
                  <p className="label-small">{vehicle.year} • {vehicle.location}</p>
                  <h2 className="font-serif text-3xl md:text-4xl mt-2">
                    {vehicle.brand} {vehicle.model}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-background-soft rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
                  {/* Left Column - Image Gallery */}
                  <div className="space-y-6">
                    <ImageGallery
                      images={vehicle.images}
                      alt={`${vehicle.brand} ${vehicle.model}`}
                    />

                    {/* Price Card */}
                    <div className="card-luxury p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="label-small mb-2">Asking Price</p>
                          <p className="text-4xl font-serif text-motorsport-red">
                            {vehicle.price}
                          </p>
                        </div>
                        <DollarSign size={48} className="text-foreground-faint" />
                      </div>
                      <p className="text-sm text-foreground-muted mt-4">
                        💬 Open for trade-ins and cash offers
                      </p>
                    </div>
                  </div>

                  {/* Right Column - Details */}
                  <div className="space-y-6">
                    {/* Description */}
                    <div>
                      <h3 className="font-serif text-2xl mb-4">Description</h3>
                      <p className="text-foreground-muted leading-relaxed">
                        {vehicle.description}
                      </p>
                    </div>

                    {/* Specifications */}
                    <div>
                      <h3 className="font-serif text-2xl mb-4">Specifications</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(vehicle.specs).map(([key, value]) => (
                          <div key={key} className="card-luxury p-4">
                            <p className="label-small mb-2">{key}</p>
                            <p className="font-medium">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="card-luxury p-6 space-y-4">
                      <h3 className="font-serif text-xl mb-4">Interested?</h3>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center flex-shrink-0">
                          <Phone size={18} />
                        </div>
                        <div>
                          <p className="text-xs text-foreground-muted">Call/Viber</p>
                          <a href="tel:+639123456789" className="hover:text-motorsport-red transition-colors">
                            +63 912 345 6789
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center flex-shrink-0">
                          <Mail size={18} />
                        </div>
                        <div>
                          <p className="text-xs text-foreground-muted">Email</p>
                          <a href="mailto:hrvdcartrading@gmail.com" className="hover:text-motorsport-red transition-colors">
                            hrvdcartrading@gmail.com
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center flex-shrink-0">
                          <Facebook size={18} />
                        </div>
                        <div>
                          <p className="text-xs text-foreground-muted">Facebook</p>
                          <a href="https://www.facebook.com/HRVDCarTrading" target="_blank" rel="noopener noreferrer" className="hover:text-motorsport-red transition-colors">
                            HRVDCarTrading
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center flex-shrink-0">
                          <MapPin size={18} />
                        </div>
                        <div>
                          <p className="text-xs text-foreground-muted">Location</p>
                          <p>{vehicle.location}</p>
                        </div>
                      </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <a
                        href="tel:+639123456789"
                        className="btn-secondary flex-1 text-center"
                      >
                        Call Now
                      </a>
                      <a
                        href="https://www.facebook.com/HRVDCarTrading"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary flex-1 text-center"
                      >
                        Message on Facebook
                      </a>
                      <a
                        href="#contact"
                        onClick={onClose}
                        className="btn-primary flex-1 text-center"
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
