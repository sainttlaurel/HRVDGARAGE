import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { showSuccess, showError } from './notifications'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let supabase: SupabaseClient<any> | null = null
let supabaseError: Error | null = null
let isSupabaseAvailable = false

// Debug logging
console.log('Supabase URL available:', !!supabaseUrl)
console.log('Supabase Key available:', !!supabaseKey)

try {
  if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️ Supabase environment variables not set.')
    console.warn('VITE_SUPABASE_URL:', supabaseUrl ? 'SET' : 'NOT SET')
    console.warn('VITE_SUPABASE_PUBLISHABLE_KEY:', supabaseKey ? 'SET' : 'NOT SET')
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

/** Supabase-only reads — no localStorage fallback */
async function fetchAllRows<T>(table: string): Promise<T[]> {
  if (!isSupabaseAvailable || !supabase) return []
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .order('createdAt', { ascending: false })
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

// Types for database tables
export interface Inquiry {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  message: string
  status: 'new' | 'read' | 'responded'
  createdAt: string
  updatedAt: string
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
  createdAt: string
  updatedAt: string
}

export interface BusinessSettings {
  id: string
  businessName: string
  email: string
  phone: string
  location: string
  businessHours: string
  createdAt: string
  updatedAt: string
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
  createdAt: string
  updatedAt: string
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
  createdAt: string
  updatedAt: string
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
  createdAt: string
  updatedAt: string
}

// Inquiry functions
export const inquiryService = {
  async getAll() {
    return fetchAllRows<Inquiry>('inquiries')
  },

  async getById(id: string) {
    return fetchRowById<Inquiry>('inquiries', id)
  },

  async create(inquiry: Omit<Inquiry, 'id' | 'createdAt' | 'updatedAt'>) {
    const newInquiry = {
      id: Date.now().toString(),
      ...inquiry,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    if (!isSupabaseAvailable || !supabase) {
      // Fallback to localStorage
      const saved = localStorage.getItem('inquiries')
      const inquiries = saved ? JSON.parse(saved) : []
      inquiries.push(newInquiry)
      localStorage.setItem('inquiries', JSON.stringify(inquiries))
      showSuccess('Inquiry saved successfully!')
      return newInquiry as Inquiry
    }
    
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .insert([newInquiry])
        .select()
        .single()
      
      if (error) throw error
      showSuccess('Inquiry saved successfully!')
      return data as Inquiry
    } catch (error) {
      console.warn('Error saving to Supabase, using localStorage:', error)
      const saved = localStorage.getItem('inquiries')
      const inquiries = saved ? JSON.parse(saved) : []
      inquiries.push(newInquiry)
      localStorage.setItem('inquiries', JSON.stringify(inquiries))
      showSuccess('Inquiry saved successfully!')
      return newInquiry as Inquiry
    }
  },

  async update(id: string, updates: Partial<Inquiry>) {
    const updatedData = {
      ...updates,
      updatedAt: new Date().toISOString()
    }

    if (!isSupabaseAvailable || !supabase) {
      // Fallback to localStorage
      const saved = localStorage.getItem('inquiries')
      const inquiries = saved ? JSON.parse(saved) : []
      const index = inquiries.findIndex((i: Inquiry) => i.id === id)
      if (index !== -1) {
        inquiries[index] = { ...inquiries[index], ...updatedData }
        localStorage.setItem('inquiries', JSON.stringify(inquiries))
        return inquiries[index]
      }
      throw new Error('Inquiry not found')
    }
    
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .update(updatedData)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data as Inquiry
    } catch (error) {
      console.warn('Error updating in Supabase, using localStorage:', error)
      const saved = localStorage.getItem('inquiries')
      const inquiries = saved ? JSON.parse(saved) : []
      const index = inquiries.findIndex((i: Inquiry) => i.id === id)
      if (index !== -1) {
        inquiries[index] = { ...inquiries[index], ...updatedData }
        localStorage.setItem('inquiries', JSON.stringify(inquiries))
        return inquiries[index]
      }
      throw new Error('Inquiry not found')
    }
  },

  async delete(id: string) {
    if (!isSupabaseAvailable || !supabase) {
      // Fallback to localStorage
      const saved = localStorage.getItem('inquiries')
      const inquiries = saved ? JSON.parse(saved) : []
      const filtered = inquiries.filter((i: Inquiry) => i.id !== id)
      localStorage.setItem('inquiries', JSON.stringify(filtered))
      return
    }
    
    try {
      const { error } = await supabase
        .from('inquiries')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    } catch (error) {
      console.warn('Error deleting from Supabase, using localStorage:', error)
      const saved = localStorage.getItem('inquiries')
      const inquiries = saved ? JSON.parse(saved) : []
      const filtered = inquiries.filter((i: Inquiry) => i.id !== id)
      localStorage.setItem('inquiries', JSON.stringify(filtered))
    }
  }
}

// Vehicle functions
export const vehicleService = {
  async getAll() {
    return fetchAllRows<Vehicle>('vehicles')
  },

  async getById(id: string) {
    return fetchRowById<Vehicle>('vehicles', id)
  },

  async create(vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>) {
    if (!isSupabaseAvailable || !supabase) {
      showError('Supabase not configured. Vehicle was not saved.')
      throw new Error('Supabase not available')
    }

    const newVehicle = {
      id: Date.now().toString(),
      ...vehicle,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('vehicles')
      .insert([newVehicle])
      .select()
      .single()

    if (error) {
      showError('Failed to save vehicle: ' + error.message)
      throw error
    }
    showSuccess('Vehicle added successfully!')
    return data as Vehicle
  },

  async update(id: string, updates: Partial<Vehicle>) {
    const updatedData = {
      ...updates,
      updatedAt: new Date().toISOString()
    }

    if (!isSupabaseAvailable || !supabase) {
      const saved = localStorage.getItem('vehicles')
      const vehicles = saved ? JSON.parse(saved) : []
      const index = vehicles.findIndex((v: Vehicle) => v.id === id)
      if (index !== -1) {
        vehicles[index] = { ...vehicles[index], ...updatedData }
        localStorage.setItem('vehicles', JSON.stringify(vehicles))
        return vehicles[index]
      }
      throw new Error('Vehicle not found')
    }
    
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .update(updatedData)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data as Vehicle
    } catch (error) {
      console.warn('Error updating in Supabase, using localStorage:', error)
      const saved = localStorage.getItem('vehicles')
      const vehicles = saved ? JSON.parse(saved) : []
      const index = vehicles.findIndex((v: Vehicle) => v.id === id)
      if (index !== -1) {
        vehicles[index] = { ...vehicles[index], ...updatedData }
        localStorage.setItem('vehicles', JSON.stringify(vehicles))
        return vehicles[index]
      }
      throw new Error('Vehicle not found')
    }
  },

  async delete(id: string) {
    if (!isSupabaseAvailable || !supabase) {
      const saved = localStorage.getItem('vehicles')
      const vehicles = saved ? JSON.parse(saved) : []
      const filtered = vehicles.filter((v: Vehicle) => v.id !== id)
      localStorage.setItem('vehicles', JSON.stringify(filtered))
      return
    }
    
    try {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    } catch (error) {
      console.warn('Error deleting from Supabase, using localStorage:', error)
      const saved = localStorage.getItem('vehicles')
      const vehicles = saved ? JSON.parse(saved) : []
      const filtered = vehicles.filter((v: Vehicle) => v.id !== id)
      localStorage.setItem('vehicles', JSON.stringify(filtered))
    }
  }
}

// Business Settings functions
export const settingsService = {
  async get() {
    return fetchSingleRow<BusinessSettings>('business_settings')
  },

  async update(updates: Partial<BusinessSettings>) {
    const updatedData = {
      ...updates,
      updatedAt: new Date().toISOString()
    }

    if (!isSupabaseAvailable || !supabase) {
      const existing = localStorage.getItem('business_settings')
      const data = existing ? JSON.parse(existing) : null
      
      if (!data) {
        const newSettings = {
          id: Date.now().toString(),
          ...updates,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        localStorage.setItem('business_settings', JSON.stringify(newSettings))
        return newSettings as BusinessSettings
      }

      const updated = { ...data, ...updatedData }
      localStorage.setItem('business_settings', JSON.stringify(updated))
      return updated as BusinessSettings
    }
    
    try {
      const existing = await this.get()
      
      if (!existing) {
        const newSettings = {
          id: Date.now().toString(),
          ...updates,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        const { data, error } = await supabase
          .from('business_settings')
          .insert([newSettings])
          .select()
          .single()
        
        if (error) throw error
        return data as BusinessSettings
      }

      const { data, error } = await supabase
        .from('business_settings')
        .update(updatedData)
        .eq('id', existing.id)
        .select()
        .single()
      
      if (error) throw error
      return data as BusinessSettings
    } catch (error) {
      console.warn('Error updating in Supabase, using localStorage:', error)
      const existing = localStorage.getItem('business_settings')
      const data = existing ? JSON.parse(existing) : null
      
      if (!data) {
        const newSettings = {
          id: Date.now().toString(),
          ...updates,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        localStorage.setItem('business_settings', JSON.stringify(newSettings))
        return newSettings as BusinessSettings
      }

      const updated = { ...data, ...updatedData }
      localStorage.setItem('business_settings', JSON.stringify(updated))
      return updated as BusinessSettings
    }
  }
}

// Parts functions
export const partsService = {
  async getAll() {
    return fetchAllRows<Part>('parts')
  },

  async getById(id: string) {
    return fetchRowById<Part>('parts', id)
  },

  async create(part: Omit<Part, 'id' | 'createdAt' | 'updatedAt'>) {
    if (!isSupabaseAvailable || !supabase) {
      showError('Supabase not configured. Part was not saved.')
      throw new Error('Supabase not available')
    }

    const newPart = {
      id: Date.now().toString(),
      ...part,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('parts')
      .insert([newPart])
      .select()
      .single()

    if (error) {
      showError('Failed to save part: ' + error.message)
      throw error
    }
    showSuccess('Part added successfully!')
    return data as Part
  },

  async update(id: string, updates: Partial<Part>) {
    const updatedData = {
      ...updates,
      updatedAt: new Date().toISOString()
    }

    if (!isSupabaseAvailable || !supabase) {
      const saved = localStorage.getItem('parts')
      const parts = saved ? JSON.parse(saved) : []
      const index = parts.findIndex((p: Part) => p.id === id)
      if (index !== -1) {
        parts[index] = { ...parts[index], ...updatedData }
        localStorage.setItem('parts', JSON.stringify(parts))
        return parts[index]
      }
      throw new Error('Part not found')
    }
    
    try {
      const { data, error } = await supabase
        .from('parts')
        .update(updatedData)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data as Part
    } catch (error) {
      console.warn('Error updating in Supabase, using localStorage:', error)
      const saved = localStorage.getItem('parts')
      const parts = saved ? JSON.parse(saved) : []
      const index = parts.findIndex((p: Part) => p.id === id)
      if (index !== -1) {
        parts[index] = { ...parts[index], ...updatedData }
        localStorage.setItem('parts', JSON.stringify(parts))
        return parts[index]
      }
      throw new Error('Part not found')
    }
  },

  async delete(id: string) {
    if (!isSupabaseAvailable || !supabase) {
      const saved = localStorage.getItem('parts')
      const parts = saved ? JSON.parse(saved) : []
      const filtered = parts.filter((p: Part) => p.id !== id)
      localStorage.setItem('parts', JSON.stringify(filtered))
      return
    }
    
    try {
      const { error } = await supabase
        .from('parts')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    } catch (error) {
      console.warn('Error deleting from Supabase, using localStorage:', error)
      const saved = localStorage.getItem('parts')
      const parts = saved ? JSON.parse(saved) : []
      const filtered = parts.filter((p: Part) => p.id !== id)
      localStorage.setItem('parts', JSON.stringify(filtered))
    }
  }
}


// Part Orders functions
export const partOrdersService = {
  async getAll() {
    return fetchAllRows<PartOrder>('part_orders')
  },

  async create(order: Omit<PartOrder, 'id' | 'createdAt' | 'updatedAt'>) {
    const newOrder = {
      id: Date.now().toString(),
      ...order,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    if (!isSupabaseAvailable || !supabase) {
      const saved = localStorage.getItem('part_orders')
      const orders = saved ? JSON.parse(saved) : []
      orders.push(newOrder)
      localStorage.setItem('part_orders', JSON.stringify(orders))
      showSuccess('Order placed successfully!')
      return newOrder as PartOrder
    }
    
    try {
      const { data, error } = await supabase
        .from('part_orders')
        .insert([newOrder])
        .select()
        .single()
      
      if (error) throw error
      showSuccess('Order placed successfully!')
      return data as PartOrder
    } catch (error) {
      console.warn('Error saving to Supabase, using localStorage:', error)
      const saved = localStorage.getItem('part_orders')
      const orders = saved ? JSON.parse(saved) : []
      orders.push(newOrder)
      localStorage.setItem('part_orders', JSON.stringify(orders))
      showSuccess('Order placed successfully!')
      return newOrder as PartOrder
    }
  },

  async update(id: string, updates: Partial<PartOrder>) {
    const updatedData = {
      ...updates,
      updatedAt: new Date().toISOString()
    }

    if (!isSupabaseAvailable || !supabase) {
      const saved = localStorage.getItem('part_orders')
      const orders = saved ? JSON.parse(saved) : []
      const index = orders.findIndex((o: PartOrder) => o.id === id)
      if (index !== -1) {
        orders[index] = { ...orders[index], ...updatedData }
        localStorage.setItem('part_orders', JSON.stringify(orders))
        return orders[index]
      }
      throw new Error('Order not found')
    }
    
    try {
      const { data, error } = await supabase
        .from('part_orders')
        .update(updatedData)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data as PartOrder
    } catch (error) {
      console.warn('Error updating in Supabase, using localStorage:', error)
      const saved = localStorage.getItem('part_orders')
      const orders = saved ? JSON.parse(saved) : []
      const index = orders.findIndex((o: PartOrder) => o.id === id)
      if (index !== -1) {
        orders[index] = { ...orders[index], ...updatedData }
        localStorage.setItem('part_orders', JSON.stringify(orders))
        return orders[index]
      }
      throw new Error('Order not found')
    }
  },

  async delete(id: string) {
    if (!isSupabaseAvailable || !supabase) {
      const saved = localStorage.getItem('part_orders')
      const orders = saved ? JSON.parse(saved) : []
      const filtered = orders.filter((o: PartOrder) => o.id !== id)
      localStorage.setItem('part_orders', JSON.stringify(filtered))
      return
    }
    
    try {
      const { error } = await supabase
        .from('part_orders')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    } catch (error) {
      console.warn('Error deleting from Supabase, using localStorage:', error)
      const saved = localStorage.getItem('part_orders')
      const orders = saved ? JSON.parse(saved) : []
      const filtered = orders.filter((o: PartOrder) => o.id !== id)
      localStorage.setItem('part_orders', JSON.stringify(filtered))
    }
  }
}


// Vehicle Inquiries functions
export const vehicleInquiryService = {
  async getAll() {
    return fetchAllRows<VehicleInquiry>('vehicle_inquiries')
  },

  async create(inquiry: Omit<VehicleInquiry, 'id' | 'createdAt' | 'updatedAt'>) {
    const newInquiry = {
      id: Date.now().toString(),
      ...inquiry,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    if (!isSupabaseAvailable || !supabase) {
      const saved = localStorage.getItem('vehicle_inquiries')
      const inquiries = saved ? JSON.parse(saved) : []
      inquiries.push(newInquiry)
      localStorage.setItem('vehicle_inquiries', JSON.stringify(inquiries))
      showSuccess('Inquiry sent successfully!')
      return newInquiry as VehicleInquiry
    }
    
    try {
      const { data, error } = await supabase
        .from('vehicle_inquiries')
        .insert([newInquiry])
        .select()
        .single()
      
      if (error) throw error
      showSuccess('Inquiry sent successfully!')
      return data as VehicleInquiry
    } catch (error) {
      console.warn('Error saving to Supabase, using localStorage:', error)
      const saved = localStorage.getItem('vehicle_inquiries')
      const inquiries = saved ? JSON.parse(saved) : []
      inquiries.push(newInquiry)
      localStorage.setItem('vehicle_inquiries', JSON.stringify(inquiries))
      showSuccess('Inquiry sent successfully!')
      return newInquiry as VehicleInquiry
    }
  },

  async update(id: string, updates: Partial<VehicleInquiry>) {
    const updatedData = {
      ...updates,
      updatedAt: new Date().toISOString()
    }

    if (!isSupabaseAvailable || !supabase) {
      const saved = localStorage.getItem('vehicle_inquiries')
      const inquiries = saved ? JSON.parse(saved) : []
      const index = inquiries.findIndex((i: VehicleInquiry) => i.id === id)
      if (index !== -1) {
        inquiries[index] = { ...inquiries[index], ...updatedData }
        localStorage.setItem('vehicle_inquiries', JSON.stringify(inquiries))
        return inquiries[index]
      }
      throw new Error('Inquiry not found')
    }
    
    try {
      const { data, error } = await supabase
        .from('vehicle_inquiries')
        .update(updatedData)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data as VehicleInquiry
    } catch (error) {
      console.warn('Error updating in Supabase, using localStorage:', error)
      const saved = localStorage.getItem('vehicle_inquiries')
      const inquiries = saved ? JSON.parse(saved) : []
      const index = inquiries.findIndex((i: VehicleInquiry) => i.id === id)
      if (index !== -1) {
        inquiries[index] = { ...inquiries[index], ...updatedData }
        localStorage.setItem('vehicle_inquiries', JSON.stringify(inquiries))
        return inquiries[index]
      }
      throw new Error('Inquiry not found')
    }
  },

  async delete(id: string) {
    if (!isSupabaseAvailable || !supabase) {
      const saved = localStorage.getItem('vehicle_inquiries')
      const inquiries = saved ? JSON.parse(saved) : []
      const filtered = inquiries.filter((i: VehicleInquiry) => i.id !== id)
      localStorage.setItem('vehicle_inquiries', JSON.stringify(filtered))
      return
    }
    
    try {
      const { error } = await supabase
        .from('vehicle_inquiries')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    } catch (error) {
      console.warn('Error deleting from Supabase, using localStorage:', error)
      const saved = localStorage.getItem('vehicle_inquiries')
      const inquiries = saved ? JSON.parse(saved) : []
      const filtered = inquiries.filter((i: VehicleInquiry) => i.id !== id)
      localStorage.setItem('vehicle_inquiries', JSON.stringify(filtered))
    }
  }
}
