/**
 * Real-Time Subscriptions for Supabase
 * Replaces polling with instant updates using Supabase real-time subscriptions
 */

import { supabase, isSupabaseAvailable } from './supabase'

export type TableName = 'vehicles' | 'parts' | 'inquiries' | 'part_orders' | 'vehicle_inquiries' | 'business_settings'

interface SubscriptionCallback {
  (data: Record<string, unknown>[]): void
}

interface SubscriptionManager {
  unsubscribe: () => void
}

/**
 * Subscribe to real-time changes for a specific table
 * Automatically syncs to localStorage and calls callback
 */
export const subscribeToTable = (
  tableName: TableName,
  onDataChange: SubscriptionCallback
): SubscriptionManager | null => {
  if (!isSupabaseAvailable || !supabase) {
    console.warn(`⚠️ Supabase not available, cannot subscribe to ${tableName}`)
    return null
  }

  try {
    console.log(`🔔 Subscribing to real-time changes for ${tableName}...`)

    // Subscribe to all changes (INSERT, UPDATE, DELETE)
    const subscription = supabase
      .channel(`public:${tableName}`)
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events
          schema: 'public',
          table: tableName
        },
        (payload: Record<string, unknown>) => {
          console.log(`📡 Real-time update received for ${tableName}:`, payload.eventType)
          
          // Fetch latest data from Supabase
          fetchAndUpdateTable(tableName, onDataChange)
        }
      )
      .subscribe((status: string) => {
        if (status === 'SUBSCRIBED') {
          console.log(`✅ Successfully subscribed to ${tableName}`)
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`❌ Error subscribing to ${tableName}`)
        } else if (status === 'TIMED_OUT') {
          console.warn(`⏱️ Subscription timeout for ${tableName}`)
        }
      })

    // Return unsubscribe function
    return {
      unsubscribe: () => {
        console.log(`🔕 Unsubscribing from ${tableName}`)
        if (supabase) supabase.removeChannel(subscription)
      }
    }
  } catch (error) {
    console.error(`❌ Error setting up subscription for ${tableName}:`, error)
    return null
  }
}

/**
 * Fetch latest data from Supabase and update localStorage
 */
const fetchAndUpdateTable = async (
  tableName: TableName,
  onDataChange: SubscriptionCallback
) => {
  if (!isSupabaseAvailable || !supabase) return

  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error(`❌ Error fetching ${tableName}:`, error)
      return
    }

    if (data) {
      // Update localStorage
      localStorage.setItem(tableName, JSON.stringify(data))
      console.log(`✅ Updated ${tableName} in localStorage (${data.length} items)`)
      
      // Call callback with new data
      onDataChange(data)
    }
  } catch (error) {
    console.error(`❌ Error updating ${tableName}:`, error)
  }
}

/**
 * Initialize real-time subscriptions for multiple tables
 * Returns cleanup function to unsubscribe from all
 */
export const initializeRealtimeSubscriptions = (
  tables: Array<{ name: TableName; callback: SubscriptionCallback }>
): (() => void) => {
  const subscriptions: SubscriptionManager[] = []

  tables.forEach(({ name, callback }) => {
    const subscription = subscribeToTable(name, callback)
    if (subscription) {
      subscriptions.push(subscription)
    }
  })

  // Return cleanup function
  return () => {
    console.log('🔕 Cleaning up all real-time subscriptions...')
    subscriptions.forEach(sub => sub.unsubscribe())
  }
}

/**
 * Load initial data from Supabase for a table
 */
export const loadInitialData = async (tableName: TableName): Promise<Record<string, unknown>[]> => {
  if (!isSupabaseAvailable || !supabase) {
    console.warn(`⚠️ Supabase not available, loading from localStorage`)
    const saved = localStorage.getItem(tableName)
    return saved ? JSON.parse(saved) : []
  }

  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error(`❌ Error loading ${tableName}:`, error)
      // Fallback to localStorage
      const saved = localStorage.getItem(tableName)
      return saved ? JSON.parse(saved) : []
    }

    if (data) {
      // Update localStorage with latest data
      localStorage.setItem(tableName, JSON.stringify(data))
      console.log(`✅ Loaded ${tableName} from Supabase (${data.length} items)`)
      return data
    }

    return []
  } catch (error) {
    console.error(`❌ Error loading ${tableName}:`, error)
    // Fallback to localStorage
    const saved = localStorage.getItem(tableName)
    return saved ? JSON.parse(saved) : []
  }
}
