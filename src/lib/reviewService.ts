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
  if (!supabase) return []
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('itemId', itemId)
      .eq('itemType', itemType)
      .eq('status', 'approved')
      .order('createdAt', { ascending: false })

    if (error) throw error
    return (data as Review[]) || []
  } catch (err) {
    console.error('Error fetching reviews:', err)
    return []
  }
}

/**
 * Get review stats for an item
 */
export const getReviewStats = async (itemId: string, itemType: 'vehicle' | 'part'): Promise<ReviewStats> => {
  const empty: ReviewStats = {
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  }

  if (!supabase) return empty

  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('rating')
      .eq('itemId', itemId)
      .eq('itemType', itemType)
      .eq('status', 'approved')

    if (error) throw error

    const reviews = (data as Array<{ rating: number }>) || []
    if (reviews.length === 0) return empty

    const ratingDistribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    let totalRating = 0

    reviews.forEach((review) => {
      const rating = Math.round(review.rating)
      if (rating >= 1 && rating <= 5) {
        ratingDistribution[rating] = (ratingDistribution[rating] || 0) + 1
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
    return empty
  }
}

/**
 * Create a new review
 */
export const createReview = async (
  review: Omit<Review, 'id' | 'createdAt' | 'updatedAt' | 'helpful' | 'unhelpful'>
): Promise<Review | null> => {
  if (!supabase) return null
  try {
    const newReview = {
      ...review,
      helpful: 0,
      unhelpful: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('reviews')
      .insert([newReview])
      .select()

    if (error) throw error
    return ((data as Review[]) ?? [])[0] || null
  } catch (err) {
    console.error('Error creating review:', err)
    return null
  }
}

/**
 * Update review helpful count (increment via raw update)
 */
export const markReviewHelpful = async (reviewId: string): Promise<boolean> => {
  if (!supabase) return false
  try {
    // Fetch current value, then increment
    const { data: existing, error: fetchError } = await supabase
      .from('reviews')
      .select('helpful')
      .eq('id', reviewId)
      .single()

    if (fetchError) throw fetchError

    const current = (existing as { helpful: number }).helpful ?? 0
    const { error } = await supabase
      .from('reviews')
      .update({ helpful: current + 1 })
      .eq('id', reviewId)

    if (error) throw error
    return true
  } catch (err) {
    console.error('Error marking review helpful:', err)
    return false
  }
}

/**
 * Update review unhelpful count (increment via raw update)
 */
export const markReviewUnhelpful = async (reviewId: string): Promise<boolean> => {
  if (!supabase) return false
  try {
    const { data: existing, error: fetchError } = await supabase
      .from('reviews')
      .select('unhelpful')
      .eq('id', reviewId)
      .single()

    if (fetchError) throw fetchError

    const current = (existing as { unhelpful: number }).unhelpful ?? 0
    const { error } = await supabase
      .from('reviews')
      .update({ unhelpful: current + 1 })
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
  if (!supabase) return []
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('status', 'pending')
      .order('createdAt', { ascending: true })

    if (error) throw error
    return (data as Review[]) || []
  } catch (err) {
    console.error('Error fetching pending reviews:', err)
    return []
  }
}

/**
 * Approve review (admin)
 */
export const approveReview = async (reviewId: string): Promise<boolean> => {
  if (!supabase) return false
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
  if (!supabase) return false
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
  if (!supabase) return false
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
