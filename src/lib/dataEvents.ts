/**
 * Data Events System
 * Provides a custom event bus for real-time data synchronization
 * between admin panel and public-facing pages.
 * 
 * When admin adds/edits/deletes vehicles or parts, this system
 * dispatches custom events that the public components listen for,
 * ensuring the website always reflects the latest data.
 */

export type DataEventType = 'vehicles' | 'parts' | 'inquiries' | 'part_orders' | 'business_settings'

interface DataChangeEvent {
  type: DataEventType
  action: 'create' | 'update' | 'delete'
  timestamp: number
}

const DATA_CHANGE_EVENT = 'sacredgarage:data-change'

/**
 * Dispatch a data change event to notify all listeners
 * This is called from admin components after CRUD operations
 */
export const dispatchDataChange = (type: DataEventType, action: DataChangeEvent['action'] = 'update') => {
  const event = new CustomEvent<DataChangeEvent>(DATA_CHANGE_EVENT, {
    detail: {
      type,
      action,
      timestamp: Date.now()
    }
  })
  window.dispatchEvent(event)
  console.log(`📢 Data change dispatched: ${type} (${action})`)
}

/**
 * Subscribe to data change events for a specific data type
 * Returns a cleanup function to unsubscribe
 */
export const onDataChange = (
  type: DataEventType,
  callback: (action: DataChangeEvent['action']) => void
): (() => void) => {
  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<DataChangeEvent>
    if (customEvent.detail.type === type) {
      callback(customEvent.detail.action)
    }
  }

  window.addEventListener(DATA_CHANGE_EVENT, handler)
  
  return () => {
    window.removeEventListener(DATA_CHANGE_EVENT, handler)
  }
}
