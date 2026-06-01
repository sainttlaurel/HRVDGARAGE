import { Star } from 'lucide-react'
import { motion } from 'framer-motion'

interface ReviewStarsProps {
  rating: number
  size?: number
  interactive?: boolean
  onRatingChange?: (rating: number) => void
  className?: string
}

const ReviewStars = ({ rating, size = 16, interactive = false, onRatingChange, className = '' }: ReviewStarsProps) => {
  const handleStarClick = (index: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(index + 1)
    }
  }

  return (
    <div className={`flex gap-1 ${className}`}>
      {[0, 1, 2, 3, 4].map((index) => (
        <motion.button
          key={index}
          onClick={() => handleStarClick(index)}
          disabled={!interactive}
          whileHover={interactive ? { scale: 1.2 } : {}}
          whileTap={interactive ? { scale: 0.9 } : {}}
          className={`${interactive ? 'cursor-pointer' : 'cursor-default'} transition-colors`}
        >
          <Star
            size={size}
            className={`${
              index < Math.round(rating)
                ? 'fill-motorsport-red text-motorsport-red'
                : 'text-foreground-faint'
            }`}
          />
        </motion.button>
      ))}
    </div>
  )
}

export default ReviewStars
