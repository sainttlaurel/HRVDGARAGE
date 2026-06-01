import { motion } from 'framer-motion'
import { useState } from 'react'
import ReviewStars from './ReviewStars'
import { createReview } from '../lib/reviewService'
import { trackReviewSubmission } from '../lib/analytics'

interface ReviewFormProps {
  itemId: string
  itemType: 'vehicle' | 'part'
  itemName: string
  onReviewSubmitted?: () => void
}

const ReviewForm = ({ itemId, itemType, itemName, onReviewSubmitted }: ReviewFormProps) => {
  const [rating, setRating] = useState(0)
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [authorEmail, setAuthorEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (rating === 0) {
      setError('Please select a rating')
      return
    }
    if (!title.trim()) {
      setError('Please enter a title')
      return
    }
    if (!comment.trim()) {
      setError('Please enter a comment')
      return
    }
    if (!authorName.trim()) {
      setError('Please enter your name')
      return
    }
    if (!authorEmail.trim()) {
      setError('Please enter your email')
      return
    }

    setLoading(true)

    try {
      const review = await createReview({
        itemId,
        itemType,
        rating,
        title,
        comment,
        authorName,
        authorEmail,
        verified: false,
        status: 'pending'
      })

      if (review) {
        // Track review submission
        trackReviewSubmission(itemType, itemName, rating)

        setSubmitted(true)
        setRating(0)
        setTitle('')
        setComment('')
        setAuthorName('')
        setAuthorEmail('')

        // Hide success message after 3 seconds
        setTimeout(() => {
          setSubmitted(false)
          onReviewSubmitted?.()
        }, 3000)
      } else {
        setError('Failed to submit review. Please try again.')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error('Error submitting review:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-luxury p-6"
    >
      <h3 className="font-serif text-2xl mb-6">Write a Review</h3>

      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-green-500/20 text-green-400 rounded-sm text-sm"
        >
          ✓ Thank you! Your review has been submitted and is pending approval.
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-motorsport-red/20 text-motorsport-red rounded-sm text-sm"
        >
          ✗ {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div>
          <label className="label-small block mb-3">Rating *</label>
          <ReviewStars
            rating={rating}
            size={24}
            interactive={true}
            onRatingChange={setRating}
          />
        </div>

        {/* Title */}
        <div>
          <label className="label-small block mb-3">Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
            className="w-full bg-background border border-border px-4 py-3 focus:outline-none focus:border-foreground transition-colors disabled:opacity-50"
            placeholder="Summarize your experience"
          />
        </div>

        {/* Comment */}
        <div>
          <label className="label-small block mb-3">Comment *</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={loading}
            rows={4}
            className="w-full bg-background border border-border px-4 py-3 focus:outline-none focus:border-foreground transition-colors resize-none disabled:opacity-50"
            placeholder="Share your detailed experience..."
          />
        </div>

        {/* Name */}
        <div>
          <label className="label-small block mb-3">Your Name *</label>
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            disabled={loading}
            className="w-full bg-background border border-border px-4 py-3 focus:outline-none focus:border-foreground transition-colors disabled:opacity-50"
            placeholder="John Doe"
          />
        </div>

        {/* Email */}
        <div>
          <label className="label-small block mb-3">Email *</label>
          <input
            type="email"
            value={authorEmail}
            onChange={(e) => setAuthorEmail(e.target.value)}
            disabled={loading}
            className="w-full bg-background border border-border px-4 py-3 focus:outline-none focus:border-foreground transition-colors disabled:opacity-50"
            placeholder="john@example.com"
          />
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={loading}
          className="btn-primary w-full disabled:opacity-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </motion.button>
      </form>
    </motion.div>
  )
}

export default ReviewForm
