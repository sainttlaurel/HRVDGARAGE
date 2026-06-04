import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { getWebPUrl } from '../lib/imageUtils'
import { trackVehicleDetailsView } from '../lib/analytics'

interface VehicleCardProps {
  image: string
  images: string[]
  brand: string
  model: string
  year: number
  price: string
  location: string
  description: string
  specs: Record<string, string>
  index: number
  onViewDetails: () => void
  vehicleId?: string
}

const VehicleCard = ({ image, images, brand, model, year, price, location, description, specs, index, onViewDetails, vehicleId }: VehicleCardProps) => {
  const webpImage = getWebPUrl(image)

  const handleViewDetails = () => {
    // Track vehicle details view
    if (vehicleId) {
      trackVehicleDetailsView(vehicleId, brand, model)
    }
    onViewDetails()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="group card-luxury overflow-hidden"
    >
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <picture>
          <source
            type="image/webp"
            srcSet={webpImage}
          />
          <motion.img
            src={image}
            alt={`${brand} ${model}`}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.6 }}
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
              const parent = target.closest('.relative')
              if (parent && !parent.querySelector('.img-placeholder')) {
                const placeholder = document.createElement('div')
                placeholder.className = 'img-placeholder w-full h-full flex items-center justify-center bg-card'
                placeholder.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="opacity-20"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>'
                parent.prepend(placeholder)
              }
            }}
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
        
        {/* Image Count Badge */}
        {images && images.length > 1 && (
          <div className="absolute top-4 right-4 px-3 py-1 bg-background/80 backdrop-blur-sm border border-border rounded-sm">
            <p className="text-xs uppercase tracking-luxury">{images.length} Photos</p>
          </div>
        )}
        
        {/* Hover Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center"
        >
          <motion.button
            onClick={handleViewDetails}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary"
          >
            View Details
            <ArrowUpRight className="inline-block ml-2" size={18} />
          </motion.button>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="label-small">{year} • {location}</p>
            <h3 className="font-serif text-2xl md:text-3xl mt-2">
              {brand} {model}
            </h3>
          </div>
          <div className="text-right">
            <p className="label-small">Price</p>
            <p className="text-xl font-medium mt-2">{price}</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-foreground-muted leading-relaxed line-clamp-3">
          {description}
        </p>

        {/* Specs */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
          {Object.entries(specs).map(([key, value]) => (
            <div key={key}>
              <p className="label-small">{key}</p>
              <p className="text-sm font-medium mt-1">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default VehicleCard
