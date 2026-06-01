/**
 * Review Service
 * Handles vehicle and part reviews
 */

import { supabase } from './supabase'

export interface Review {
  id: string
  itemId: string
  itemType: 'vehicle' | 'part'
  rating: number
  title: string
  comment: string
  authorName: string
  authorEmail: string
  verified: boolean
  helpful: number
  unhelpful: number
  createdAt: string
  updatedAt: string
  status: 'pending' | 'approved' | 'rejected'
}

export interface ReviewStats {
  averageRating: number
  totalReviews: number
  ratingDistribution: {
    [key: number]: number
  }
}

/**
 * Get reviews for an item
 */
export const getReviews = async (itemId: string, itemType: 'vehicle' | 'part'): Promise<Review[]> => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('itemId', itemId)
      .eq('itemType', itemType)
      .eq('status', 'approved')
      .order('createdAt', { ascending: false })

    if (error) throw error
    return data || []
  } catch (err) {
    console.error('Error fetching reviews:', err)
    return []
  }
}

/**
 * Get review stats for an item
 */
export const getReviewStats = async (itemId: string, itemType: 'vehicle' | 'part'): Promise<ReviewStats> => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('rating')
      .eq('itemId', itemId)
      .eq('itemType', itemType)
      .eq('status', 'approved')

    if (error) throw error

    const reviews = data || []
    if (reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      }
    }

    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    let totalRating = 0

    reviews.forEach((review: any) => {
      const rating = Math.round(review.rating)
      if (rating >= 1 && rating <= 5) {
        ratingDistribution[rating as keyof typeof ratingDistribution]++
        totalRating += review.rating
      }
    })

    return {
      averageRating: totalRating / reviews.length,
      totalReviews: reviews.length,
      ratingDistribution
    }
  } catch (err) {
    console.error('Error fetching review stats:', err)
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    }
  }
}

/**
 * Create a new review
 */
export const createReview = async (review: Omit<Review, 'id' | 'createdAt' | 'updatedAt' | 'helpful' | 'unhelpful'>): Promise<Review | null> => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .insert([
        {
          ...review,
          helpful: 0,
          unhelpful: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ])
      .select()

    if (error) throw error
    return data?.[0] || null
  } catch (err) {
    console.error('Error creating review:', err)
    return null
  }
}

/**
 * Update review helpful count
 */
export const markReviewHelpful = async (reviewId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('reviews')
      .update({ helpful: supabase.rpc('increment_helpful', { review_id: reviewId }) })
      .eq('id', reviewId)

    if (error) throw error
    return true
  } catch (err) {
    console.error('Error marking review helpful:', err)
    return false
  }
}

/**
 * Update review unhelpful count
 */
export const markReviewUnhelpful = async (reviewId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('reviews')
      .update({ unhelpful: supabase.rpc('increment_unhelpful', { review_id: reviewId }) })
      .eq('id', reviewId)

    if (error) throw error
    return true
  } catch (err) {
    console.error('Error marking review unhelpful:', err)
    return false
  }
}

/**
 * Get pending reviews (admin)
 */
export const getPendingReviews = async (): Promise<Review[]> => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('status', 'pending')
      .order('createdAt', { ascending: true })

    if (error) throw error
    return data || []
  } catch (err) {
    console.error('Error fetching pending reviews:', err)
    return []
  }
}

/**
 * Approve review (admin)
 */
export const approveReview = async (reviewId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('reviews')
      .update({ status: 'approved', updatedAt: new Date().toISOString() })
      .eq('id', reviewId)

    if (error) throw error
    return true
  } catch (err) {
    console.error('Error approving review:', err)
    return false
  }
}

/**
 * Reject review (admin)
 */
export const rejectReview = async (reviewId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('reviews')
      .update({ status: 'rejected', updatedAt: new Date().toISOString() })
      .eq('id', reviewId)

    if (error) throw error
    return true
  } catch (err) {
    console.error('Error rejecting review:', err)
    return false
  }
}

/**
 * Delete review (admin)
 */
export const deleteReview = async (reviewId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId)

    if (error) throw error
    return true
  } catch (err) {
    console.error('Error deleting review:', err)
    return false
  }
}
