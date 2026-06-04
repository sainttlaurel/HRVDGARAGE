import { motion, AnimatePresence } from 'framer-motion'
import { X, Phone, Mail, MapPin, Facebook, MessageCircle, CheckCircle2, Gauge, Users, Calendar, Zap } from 'lucide-react'
import { useState } from 'react'
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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const specIcons: Record<string, React.ReactNode> = {
    mileage: <Gauge size={20} />,
    owner: <Users size={20} />,
    transmission: <Zap size={20} />,
    registration: <Calendar size={20} />,
    fuel: <Zap size={20} />,
    condition: <CheckCircle2 size={20} />,
  }

  // Extract key specs for display
  const displaySpecs = Object.entries(vehicle.specs).slice(0, 6).map(([key, value]) => ({
    label: key,
    value,
    icon: specIcons[key.toLowerCase()] || <CheckCircle2 size={20} />
  }))

  // Parse vehicle highlights from description or specs
  const highlights = [
    'All Stock Engine',
    '1st Owner',
    'Fresh Repaint',
    'Cold Air Conditioning',
    'Power Windows',
    'Complete Papers',
    'Registered Until 2026',
  ]

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
            className="fixed inset-0 bg-black/95 backdrop-blur-sm z-[60]"
          />

          {/* Modal - Premium Luxury Redesign */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-6xl max-h-[90vh] bg-black border border-white/10 flex flex-col overflow-y-auto custom-scrollbar">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 transition-colors z-10 bg-black/50 rounded"
              >
                <X size={24} className="text-white" />
              </button>

              {/* Main Content */}
              <div className="p-6 sm:p-8">
                {/* Hero Section - Vehicle Title & Price */}
                <div className="mb-8 border-b border-white/20 pb-8">
                  <p className="text-sm text-white/60 uppercase tracking-widest mb-2">
                    {vehicle.year} • {vehicle.location}
                  </p>
                  <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3 font-serif">
                    {vehicle.brand} {vehicle.model}
                  </h1>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <p className="text-4xl sm:text-5xl font-bold text-[#D4001A]">
                      {vehicle.price}
                    </p>
                    <div className="flex gap-2 text-sm text-white/60 uppercase tracking-widest">
                      <span className="px-3 py-1 border border-white/30 rounded">Available</span>
                    </div>
                  </div>
                </div>

                {/* Gallery Section */}
                <div className="mb-8">
                  <div className="mb-4 border border-white/20 aspect-video bg-black overflow-hidden rounded">
                    <img
                      src={vehicle.images[selectedImageIndex] || vehicle.image}
                      alt={`${vehicle.brand} ${vehicle.model}`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Thumbnails */}
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {vehicle.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`w-20 h-20 flex-shrink-0 border-2 transition-all ${
                          selectedImageIndex === idx
                            ? 'border-[#D4001A]'
                            : 'border-white/20 hover:border-white/40'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`View ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* CTA Buttons - Prominent */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                  <a
                    href="https://www.facebook.com/HRVDCarTrading"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-4 bg-[#D4001A] text-white font-bold text-center hover:bg-[#B3000F] transition-colors rounded text-sm sm:text-base"
                  >
                    Contact Seller
                  </a>
                  <a
                    href="#contact"
                    onClick={onClose}
                    className="px-6 py-4 border-2 border-white text-white font-bold text-center hover:bg-white hover:text-black transition-colors rounded text-sm sm:text-base"
                  >
                    Send Inquiry
                  </a>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-3 gap-2 mb-8">
                  <a
                    href="tel:+639123456789"
                    className="flex items-center justify-center gap-2 py-3 border border-white/20 hover:border-white/40 transition-colors rounded text-white text-xs sm:text-sm"
                  >
                    <Phone size={16} />
                    <span className="hidden sm:inline">Call</span>
                  </a>
                  <a
                    href="https://www.facebook.com/HRVDCarTrading"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3 border border-white/20 hover:border-white/40 transition-colors rounded text-white text-xs sm:text-sm"
                  >
                    <MessageCircle size={16} />
                    <span className="hidden sm:inline">Messenger</span>
                  </a>
                  <a
                    href="mailto:hrvdcartrading@gmail.com"
                    className="flex items-center justify-center gap-2 py-3 border border-white/20 hover:border-white/40 transition-colors rounded text-white text-xs sm:text-sm"
                  >
                    <Mail size={16} />
                    <span className="hidden sm:inline">Email</span>
                  </a>
                </div>

                {/* Specifications Grid */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-widest text-sm">
                    Quick Specifications
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {displaySpecs.map((spec, idx) => (
                      <div key={idx} className="border border-white/20 p-4 rounded hover:border-white/40 transition-colors">
                        <div className="text-white/60 mb-2">{spec.icon}</div>
                        <p className="text-xs uppercase tracking-widest text-white/60 mb-2">{spec.label}</p>
                        <p className="text-lg font-bold text-white">{spec.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-white/10 mb-8" />

                {/* Highlights Section */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-widest text-sm">
                    Vehicle Highlights
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-white">
                        <CheckCircle2 size={20} className="text-[#D4001A] flex-shrink-0" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-white/10 mb-8" />

                {/* Description Section */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-widest text-sm">
                    Description
                  </h2>
                  <p className="text-base text-white/80 leading-relaxed mb-4">
                    {vehicle.description}
                  </p>
                  <SocialShareButton
                    title={`${vehicle.brand} ${vehicle.model} - ${vehicle.price}`}
                    description={vehicle.description}
                    url={window.location.href}
                    itemType="vehicle"
                    itemId={vehicle.id || ''}
                    itemName={`${vehicle.brand} ${vehicle.model}`}
                  />
                </div>

                {/* Seller Information */}
                <div className="border-t border-white/10 pt-8">
                  <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-widest text-sm">
                    Seller Information
                  </h2>
                  <div className="border border-white/20 p-6 rounded">
                    <p className="text-2xl font-bold text-white mb-4">Sacred Garage</p>
                    <div className="space-y-2 text-white/80 text-sm">
                      <p><MapPin size={16} className="inline mr-2" />{vehicle.location}</p>
                      <p><Phone size={16} className="inline mr-2" /><a href="tel:+639123456789" className="hover:text-white">+63 912 345 6789</a></p>
                      <p><Mail size={16} className="inline mr-2" /><a href="mailto:hrvdcartrading@gmail.com" className="hover:text-white">hrvdcartrading@gmail.com</a></p>
                      <p><Facebook size={16} className="inline mr-2" /><a href="https://www.facebook.com/HRVDCarTrading" target="_blank" rel="noopener noreferrer" className="hover:text-white">HRVDCarTrading</a></p>
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
