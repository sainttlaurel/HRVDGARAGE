import { motion } from 'framer-motion'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import ReviewStars from './ReviewStars'
import { getReviews, Review } from '../lib/reviewService'

interface ReviewListProps {
  itemId: string
  itemType: 'vehicle' | 'part'
}

const ReviewList = ({ itemId, itemType }: ReviewListProps) => {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadReviews = async () => {
      setLoading(true)
      const data = await getReviews(itemId, itemType)
      setReviews(data)
      setLoading(false)
    }

    loadReviews()
  }, [itemId, itemType])

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-background-soft rounded-sm animate-pulse" />
        ))}
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-foreground-muted">No reviews yet. Be the first to review!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map((review, index) => (
        <motion.div
          key={review.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="card-luxury p-6"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ReviewStars rating={review.rating} size={14} />
                <span className="text-xs font-medium text-foreground-muted">
                  {review.rating.toFixed(1)}
                </span>
              </div>
              <h4 className="font-medium">{review.title}</h4>
              <p className="text-xs text-foreground-muted mt-1">
                By {review.authorName} • {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
            {review.verified && (
              <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-sm">
                Verified
              </span>
            )}
          </div>

          {/* Comment */}
          <p className="text-sm text-foreground-muted mb-4 leading-relaxed">
            {review.comment}
          </p>

          {/* Footer */}
          <div className="flex items-center gap-4 pt-4 border-t border-border">
            <button className="flex items-center gap-2 text-xs text-foreground-muted hover:text-motorsport-red transition-colors">
              <ThumbsUp size={14} />
              <span>{review.helpful}</span>
            </button>
            <button className="flex items-center gap-2 text-xs text-foreground-muted hover:text-motorsport-red transition-colors">
              <ThumbsDown size={14} />
              <span>{review.unhelpful}</span>
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default ReviewList
