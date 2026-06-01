import { motion } from 'framer-motion'
import { ArrowUpRight, Package } from 'lucide-react'
import { getWebPUrl } from '../lib/imageUtils'
import { trackPartView } from '../lib/analytics'

interface PartCardProps {
  image: string
  category: string
  name: string
  brand: string
  price: string
  condition: string
  description: string
  index: number
  onInquire: () => void
  partId?: string
}

const PartCard = ({ image, category, name, brand, price, condition, description, index, onInquire, partId }: PartCardProps) => {
  const webpImage = getWebPUrl(image)

  const handleInquire = () => {
    // Track part view
    if (partId) {
      trackPartView(partId, name, category)
    }
    onInquire()
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
      <div className="relative aspect-square overflow-hidden bg-background-soft">
        {/* Placeholder if no image */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Package size={64} className="text-foreground-faint" />
        </div>
        
        {/* Actual Image (if exists) */}
        <picture>
          <source
            type="image/webp"
            srcSet={webpImage}
          />
          <motion.img
            src={image}
            alt={`${brand} ${name}`}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.6 }}
            loading="lazy"
            onError={(e) => {
              // Hide image if it fails to load
              e.currentTarget.style.display = 'none'
            }}
          />
        </picture>
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4 px-3 py-1 bg-background/80 backdrop-blur-sm border border-border">
          <p className="label-small">{category}</p>
        </div>

        {/* Condition Badge */}
        <div className="absolute top-4 right-4 px-3 py-1 bg-motorsport-red/90 backdrop-blur-sm">
          <p className="text-xs font-medium">{condition}</p>
        </div>
        
        {/* Hover Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center"
        >
          <motion.button
            onClick={handleInquire}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 border border-foreground text-foreground font-medium text-sm uppercase tracking-luxury transition-all duration-300 hover:bg-foreground hover:text-background"
          >
            Inquire
            <ArrowUpRight className="inline-block ml-2" size={16} />
          </motion.button>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="label-small">{brand}</p>
            <h3 className="font-serif text-xl mt-2">
              {name}
            </h3>
          </div>
          <div className="text-right">
            <p className="text-xl font-medium text-motorsport-red">{price}</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-foreground-muted leading-relaxed line-clamp-2">
          {description}
        </p>
      </div>
    </motion.div>
  )
}

export default PartCard
