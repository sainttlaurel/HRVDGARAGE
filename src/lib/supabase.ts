import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { showSuccess, showError } from './notifications'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let supabase: SupabaseClient<any> | null = null
let supabaseError: Error | null = null
let isSupabaseAvailable = false

try {
  if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️ Supabase environment variables not set.')
    supabaseError = new Error('Missing Supabase environment variables')
  } else {
    supabase = createClient(supabaseUrl, supabaseKey)
    isSupabaseAvailable = true
    console.log('✅ Supabase initialized successfully')
  }
} catch (error) {
  supabaseError = error as Error
  console.error('❌ Supabase initialization error:', supabaseError)
  isSupabaseAvailable = false
}

export { supabase, supabaseError, isSupabaseAvailable }

// DB uses lowercase column names: createdat, updatedat
const now = () => new Date().toISOString()

/** Supabase-only reads */
async function fetchAllRows<T>(table: string): Promise<T[]> {
  if (!isSupabaseAvailable || !supabase) return []
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .order('createdat', { ascending: false })
  if (error) throw error
  return (data as T[]) ?? []
}

async function fetchRowById<T>(table: string, id: string): Promise<T | undefined> {
  if (!isSupabaseAvailable || !supabase) return undefined
  const { data, error } = await supabase.from(table).select('*').eq('id', id).single()
  if (error) {
    if (error.code === 'PGRST116') return undefined
    throw error
  }
  return data as T
}

async function fetchSingleRow<T>(table: string): Promise<T | null> {
  if (!isSupabaseAvailable || !supabase) return null
  const { data, error } = await supabase.from(table).select('*').single()
  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data as T
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Inquiry {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  message: string
  status: 'new' | 'read' | 'responded'
  createdat: string
  updatedat: string
}

export interface Vehicle {
  id: string
  image: string
  images: string[]
  brand: string
  model: string
  year: number
  price: string
  location: string
  description: string
  specs: Record<string, string>
  available: boolean
  createdat: string
  updatedat: string
}

export interface BusinessSettings {
  id: string
  businessName: string
  email: string
  phone: string
  location: string
  businessHours: string
  createdat: string
  updatedat: string
}

export interface Part {
  id: string
  image: string
  category: string
  name: string
  brand: string
  price: string
  condition: string
  description: string
  available: boolean
  createdat: string
  updatedat: string
}

export interface PartOrder {
  id: string
  partId: string
  partName: string
  partBrand: string
  partPrice: string
  quantity: number
  customerName: string
  customerEmail: string
  customerPhone: string
  customerCar: string
  address: string
  paymentMethod: string
  deliveryOption: string
  facebookProfile?: string
  notes?: string
  status: 'new' | 'contacted' | 'confirmed' | 'completed'
  createdat: string
  updatedat: string
}

export interface VehicleInquiry {
  id: string
  vehicleId: string
  vehicleBrand: string
  vehicleModel: string
  vehicleYear: number
  vehiclePrice: string
  customerName: string
  customerEmail: string
  customerPhone: string
  inquiryType: 'purchase' | 'trade-in' | 'financing' | 'other'
  message: string
  facebookProfile?: string
  status: 'new' | 'contacted' | 'confirmed' | 'completed'
  createdat: string
  updatedat: string
}

// ─── Inquiry Service ──────────────────────────────────────────────────────────

export const inquiryService = {
  async getAll() { return fetchAllRows<Inquiry>('inquiries') },
  async getById(id: string) { return fetchRowById<Inquiry>('inquiries', id) },

  async create(inquiry: Omit<Inquiry, 'id' | 'createdat' | 'updatedat'>) {
    const row = { id: Date.now().toString(), ...inquiry, createdat: now(), updatedat: now() }
    if (!isSupabaseAvailable || !supabase) {
      // Fallback for public contact form
      const saved = localStorage.getItem('inquiries')
      const list = saved ? JSON.parse(saved) : []
      list.push(row)
      localStorage.setItem('inquiries', JSON.stringify(list))
      showSuccess('Inquiry saved successfully!')
      return row as Inquiry
    }
    const { data, error } = await supabase.from('inquiries').insert([row]).select().single()
    if (error) { showError('Failed to save inquiry: ' + error.message); throw error }
    showSuccess('Inquiry saved successfully!')
    return data as Inquiry
  },

  async update(id: string, updates: Partial<Inquiry>) {
    const payload = { ...updates, updatedat: now() }
    if (!isSupabaseAvailable || !supabase) throw new Error('Supabase not available')
    const { data, error } = await supabase.from('inquiries').update(payload).eq('id', id).select().single()
    if (error) throw error
    return data as Inquiry
  },

  async delete(id: string) {
    if (!isSupabaseAvailable || !supabase) throw new Error('Supabase not available')
    const { error } = await supabase.from('inquiries').delete().eq('id', id)
    if (error) throw error
  }
}

// ─── Vehicle Service ──────────────────────────────────────────────────────────

export const vehicleService = {
  async getAll() { return fetchAllRows<Vehicle>('vehicles') },
  async getById(id: string) { return fetchRowById<Vehicle>('vehicles', id) },

  async create(vehicle: Omit<Vehicle, 'id' | 'createdat' | 'updatedat'>) {
    if (!isSupabaseAvailable || !supabase) {
      showError('Supabase not configured. Vehicle was not saved.')
      throw new Error('Supabase not available')
    }
    const row = { id: Date.now().toString(), ...vehicle, createdat: now(), updatedat: now() }
    const { data, error } = await supabase.from('vehicles').insert([row]).select().single()
    if (error) { showError('Failed to save vehicle: ' + error.message); throw error }
    showSuccess('Vehicle added successfully!')
    return data as Vehicle
  },

  async update(id: string, updates: Partial<Vehicle>) {
    const payload = { ...updates, updatedat: now() }
    if (!isSupabaseAvailable || !supabase) throw new Error('Supabase not available')
    const { data, error } = await supabase.from('vehicles').update(payload).eq('id', id).select().single()
    if (error) throw error
    return data as Vehicle
  },

  async delete(id: string) {
    if (!isSupabaseAvailable || !supabase) throw new Error('Supabase not available')
    const { error } = await supabase.from('vehicles').delete().eq('id', id)
    if (error) throw error
  }
}

// ─── Settings Service ─────────────────────────────────────────────────────────

export const settingsService = {
  async get() { return fetchSingleRow<BusinessSettings>('business_settings') },

  async update(updates: Partial<BusinessSettings>) {
    if (!isSupabaseAvailable || !supabase) throw new Error('Supabase not available')
    const payload = { ...updates, updatedat: now() }
    const existing = await this.get()
    if (!existing) {
      const row = { id: Date.now().toString(), ...updates, createdat: now(), updatedat: now() }
      const { data, error } = await supabase.from('business_settings').insert([row]).select().single()
      if (error) throw error
      return data as BusinessSettings
    }
    const { data, error } = await supabase.from('business_settings').update(payload).eq('id', existing.id).select().single()
    if (error) throw error
    return data as BusinessSettings
  }
}

// ─── Parts Service ────────────────────────────────────────────────────────────

export const partsService = {
  async getAll() { return fetchAllRows<Part>('parts') },
  async getById(id: string) { return fetchRowById<Part>('parts', id) },

  async create(part: Omit<Part, 'id' | 'createdat' | 'updatedat'>) {
    if (!isSupabaseAvailable || !supabase) {
      showError('Supabase not configured. Part was not saved.')
      throw new Error('Supabase not available')
    }
    const row = { id: Date.now().toString(), ...part, createdat: now(), updatedat: now() }
    const { data, error } = await supabase.from('parts').insert([row]).select().single()
    if (error) { showError('Failed to save part: ' + error.message); throw error }
    showSuccess('Part added successfully!')
    return data as Part
  },

  async update(id: string, updates: Partial<Part>) {
    const payload = { ...updates, updatedat: now() }
    if (!isSupabaseAvailable || !supabase) throw new Error('Supabase not available')
    const { data, error } = await supabase.from('parts').update(payload).eq('id', id).select().single()
    if (error) throw error
    return data as Part
  },

  async delete(id: string) {
    if (!isSupabaseAvailable || !supabase) throw new Error('Supabase not available')
    const { error } = await supabase.from('parts').delete().eq('id', id)
    if (error) throw error
  }
}

// ─── Part Orders Service ──────────────────────────────────────────────────────

export const partOrdersService = {
  async getAll() { return fetchAllRows<PartOrder>('part_orders') },

  async create(order: Omit<PartOrder, 'id' | 'createdat' | 'updatedat'>) {
    const row = { id: Date.now().toString(), ...order, createdat: now(), updatedat: now() }
    if (!isSupabaseAvailable || !supabase) {
      const saved = localStorage.getItem('part_orders')
      const list = saved ? JSON.parse(saved) : []
      list.push(row)
      localStorage.setItem('part_orders', JSON.stringify(list))
      showSuccess('Order placed successfully!')
      return row as PartOrder
    }
    const { data, error } = await supabase.from('part_orders').insert([row]).select().single()
    if (error) { showError('Failed to place order: ' + error.message); throw error }
    showSuccess('Order placed successfully!')
    return data as PartOrder
  },

  async update(id: string, updates: Partial<PartOrder>) {
    const payload = { ...updates, updatedat: now() }
    if (!isSupabaseAvailable || !supabase) throw new Error('Supabase not available')
    const { data, error } = await supabase.from('part_orders').update(payload).eq('id', id).select().single()
    if (error) throw error
    return data as PartOrder
  },

  async delete(id: string) {
    if (!isSupabaseAvailable || !supabase) throw new Error('Supabase not available')
    const { error } = await supabase.from('part_orders').delete().eq('id', id)
    if (error) throw error
  }
}

// ─── Vehicle Inquiry Service ──────────────────────────────────────────────────

export const vehicleInquiryService = {
  async getAll() { return fetchAllRows<VehicleInquiry>('vehicle_inquiries') },

  async create(inquiry: Omit<VehicleInquiry, 'id' | 'createdat' | 'updatedat'>) {
    const row = { id: Date.now().toString(), ...inquiry, createdat: now(), updatedat: now() }
    if (!isSupabaseAvailable || !supabase) {
      const saved = localStorage.getItem('vehicle_inquiries')
      const list = saved ? JSON.parse(saved) : []
      list.push(row)
      localStorage.setItem('vehicle_inquiries', JSON.stringify(list))
      showSuccess('Inquiry sent successfully!')
      return row as VehicleInquiry
    }
    const { data, error } = await supabase.from('vehicle_inquiries').insert([row]).select().single()
    if (error) { showError('Failed to send inquiry: ' + error.message); throw error }
    showSuccess('Inquiry sent successfully!')
    return data as VehicleInquiry
  },

  async update(id: string, updates: Partial<VehicleInquiry>) {
    const payload = { ...updates, updatedat: now() }
    if (!isSupabaseAvailable || !supabase) throw new Error('Supabase not available')
    const { data, error } = await supabase.from('vehicle_inquiries').update(payload).eq('id', id).select().single()
    if (error) throw error
    return data as VehicleInquiry
  },

  async delete(id: string) {
    if (!isSupabaseAvailable || !supabase) throw new Error('Supabase not available')
    const { error } = await supabase.from('vehicle_inquiries').delete().eq('id', id)
    if (error) throw error
  }
}
