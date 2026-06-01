import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import ReviewStars from './ReviewStars'
import { getReviewStats, ReviewStats as ReviewStatsType } from '../lib/reviewService'

interface ReviewStatsProps {
  itemId: string
  itemType: 'vehicle' | 'part'
}

const ReviewStats = ({ itemId, itemType }: ReviewStatsProps) => {
  const [stats, setStats] = useState<ReviewStatsType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true)
      const data = await getReviewStats(itemId, itemType)
      setStats(data)
      setLoading(false)
    }

    loadStats()
  }, [itemId, itemType])

  if (loading || !stats) {
    return (
      <div className="card-luxury p-6">
        <div className="h-24 bg-background-soft rounded-sm animate-pulse" />
      </div>
    )
  }

  if (stats.totalReviews === 0) {
    return (
      <div className="card-luxury p-6 text-center">
        <p className="text-foreground-muted">No reviews yet</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-luxury p-6"
    >
      <div className="space-y-6">
        {/* Average Rating */}
        <div className="flex items-center gap-6">
          <div>
            <div className="text-5xl font-serif font-bold text-motorsport-red">
              {stats.averageRating.toFixed(1)}
            </div>
            <ReviewStars rating={stats.averageRating} size={16} className="mt-2" />
            <p className="text-xs text-foreground-muted mt-2">
              Based on {stats.totalReviews} review{stats.totalReviews !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = stats.ratingDistribution[rating] || 0
              const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0

              return (
                <div key={rating} className="flex items-center gap-3">
                  <span className="text-xs font-medium w-8">{rating}★</span>
                  <div className="flex-1 h-2 bg-background-soft rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.5, delay: (5 - rating) * 0.1 }}
                      className="h-full bg-motorsport-red"
                    />
                  </div>
                  <span className="text-xs text-foreground-muted w-8 text-right">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ReviewStats
