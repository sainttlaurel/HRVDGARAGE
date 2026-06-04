/**
 * Real-Time Subscriptions for Supabase
 * Replaces polling with instant updates using Supabase real-time subscriptions
 */

import { dispatchDataChange } from './dataEvents'
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
 * Fetch latest data from Supabase and notify listeners
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
      console.log(`✅ Real-time refresh for ${tableName} (${data.length} items)`)
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
 * Load initial data from Supabase for a table (single source of truth).
 * Returns an empty array when Supabase is unavailable or the request fails.
 */
export const loadInitialData = async (tableName: TableName): Promise<Record<string, unknown>[]> => {
  if (!isSupabaseAvailable || !supabase) {
    console.warn(`⚠️ Supabase not available — cannot load ${tableName}`)
    return []
  }

  const fetchWithTimeout = new Promise<Record<string, unknown>[] | null>((resolve) => {
    const timer = setTimeout(() => {
      console.warn(`⏱️ Supabase fetch timeout for ${tableName}, will retry in background`)
      resolve(null)
    }, 8000)

    void (async () => {
      try {
        const { data, error } = await supabase!
          .from(tableName)
          .select('*')
          .order('created_at', { ascending: false })
        clearTimeout(timer)
        if (error) {
          console.error(`❌ Error loading ${tableName}:`, error)
          resolve(null)
        } else {
          resolve((data as Record<string, unknown>[]) ?? [])
        }
      } catch (err) {
        clearTimeout(timer)
        console.error(`❌ Fetch error for ${tableName}:`, err)
        resolve(null)
      }
    })()
  })

  const result = await fetchWithTimeout

  if (result !== null) {
    console.log(`✅ Loaded ${tableName} from Supabase (${result.length} items)`)
    return result
  }

  scheduleBackgroundRetry(tableName)
  return []
}

/**
 * Retry Supabase fetch in the background after a short delay.
 */
const scheduleBackgroundRetry = (tableName: TableName) => {
  setTimeout(async () => {
    if (!isSupabaseAvailable || !supabase) return
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) {
        console.log(`🔄 Background retry loaded ${tableName} (${data.length} items)`)
        if (tableName === 'vehicles' || tableName === 'parts' || tableName === 'inquiries' || tableName === 'part_orders' || tableName === 'business_settings') {
          dispatchDataChange(tableName, 'update')
        }
      }
    } catch (err) {
      console.warn(`⚠️ Background retry failed for ${tableName}:`, err)
    }
  }, 3000)
}
