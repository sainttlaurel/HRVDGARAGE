/**
 * Real-Time Subscriptions — disabled (Supabase Realtime not needed for this project)
 * Components use direct fetches instead.
 */

export type TableName = 'vehicles' | 'parts' | 'inquiries' | 'part_orders' | 'vehicle_inquiries' | 'business_settings'

interface SubscriptionCallback {
  (data: Record<string, unknown>[]): void
}

interface SubscriptionManager {
  unsubscribe: () => void
}

const noopSubscription: SubscriptionManager = { unsubscribe: () => {} }

export const subscribeToTable = (
  _tableName: TableName,
  _onDataChange: SubscriptionCallback
): SubscriptionManager | null => {
  return noopSubscription
}

export const initializeRealtimeSubscriptions = (
  _tables: Array<{ name: TableName; callback: SubscriptionCallback }>
): (() => void) => {
  return () => {}
}

export const loadInitialData = async (_tableName: TableName): Promise<Record<string, unknown>[]> => {
  return []
}
