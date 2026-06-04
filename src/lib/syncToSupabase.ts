import { supabase, isSupabaseAvailable } from './supabase'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>

/**
 * Sync all localStorage data to Supabase
 * This ensures data persists across browsers and devices
 */
export const syncLocalStorageToSupabase = async () => {
  if (!isSupabaseAvailable || !supabase) {
    console.warn('⚠️ Supabase not available, skipping sync to cloud')
    return
  }

  try {
    console.log('🔄 Starting localStorage to Supabase sync...')

    // Sync inquiries
    const inquiries = localStorage.getItem('inquiries')
    if (inquiries) {
      try {
        const data = JSON.parse(inquiries)
        if (Array.isArray(data) && data.length > 0) {
          console.log(`📤 Syncing ${data.length} inquiries to Supabase...`)
          for (const inquiry of data) {
            try {
              const { error } = await supabase
                .from('inquiries')
                .upsert([inquiry as AnyRecord], { onConflict: 'id' })
              
              if (error) {
                console.error('❌ Error syncing inquiry:', error)
              }
            } catch (error) {
              console.error('❌ Error syncing inquiry:', error)
            }
          }
          console.log('✅ Inquiries synced to Supabase')
        }
      } catch (error) {
        console.warn('Error parsing inquiries:', error)
      }
    }

    // Sync vehicles
    const vehicles = localStorage.getItem('vehicles')
    if (vehicles) {
      try {
        const data = JSON.parse(vehicles)
        if (Array.isArray(data) && data.length > 0) {
          console.log(`📤 Syncing ${data.length} vehicles to Supabase...`)
          for (const vehicle of data) {
            try {
              await supabase
                .from('vehicles')
                .upsert([vehicle as AnyRecord], { onConflict: 'id' })
            } catch (error) {
              console.warn('Error syncing vehicle:', error)
            }
          }
          console.log('✅ Vehicles synced')
        }
      } catch (error) {
        console.warn('Error parsing vehicles:', error)
      }
    }

    // Sync parts
    const parts = localStorage.getItem('parts')
    if (parts) {
      try {
        const data = JSON.parse(parts)
        if (Array.isArray(data) && data.length > 0) {
          console.log(`📤 Syncing ${data.length} parts to Supabase...`)
          for (const part of data) {
            try {
              await supabase
                .from('parts')
                .upsert([part as AnyRecord], { onConflict: 'id' })
            } catch (error) {
              console.warn('Error syncing part:', error)
            }
          }
          console.log('✅ Parts synced')
        }
      } catch (error) {
        console.warn('Error parsing parts:', error)
      }
    }

    // Sync part orders
    const partOrders = localStorage.getItem('part_orders')
    if (partOrders) {
      try {
        const data = JSON.parse(partOrders)
        if (Array.isArray(data) && data.length > 0) {
          console.log(`📤 Syncing ${data.length} part orders to Supabase...`)
          for (const order of data) {
            try {
              await supabase
                .from('part_orders')
                .upsert([order as AnyRecord], { onConflict: 'id' })
            } catch (error) {
              console.warn('Error syncing part order:', error)
            }
          }
          console.log('✅ Part orders synced')
        }
      } catch (error) {
        console.warn('Error parsing part orders:', error)
      }
    }

    // Sync vehicle inquiries
    const vehicleInquiries = localStorage.getItem('vehicle_inquiries')
    if (vehicleInquiries) {
      try {
        const data = JSON.parse(vehicleInquiries)
        if (Array.isArray(data) && data.length > 0) {
          console.log(`📤 Syncing ${data.length} vehicle inquiries to Supabase...`)
          for (const inquiry of data) {
            try {
              await supabase
                .from('vehicle_inquiries')
                .upsert([inquiry as AnyRecord], { onConflict: 'id' })
            } catch (error) {
              console.warn('Error syncing vehicle inquiry:', error)
            }
          }
          console.log('✅ Vehicle inquiries synced')
        }
      } catch (error) {
        console.warn('Error parsing vehicle inquiries:', error)
      }
    }

    // Sync business settings
    const settings = localStorage.getItem('business_settings')
    if (settings) {
      try {
        const data = JSON.parse(settings)
        if (data && data.id) {
          console.log('📤 Syncing business settings to Supabase...')
          try {
            await supabase
              .from('business_settings')
              .upsert([data as AnyRecord], { onConflict: 'id' })
          } catch (error) {
            console.warn('Error syncing settings:', error)
          }
          console.log('✅ Settings synced')
        }
      } catch (error) {
        console.warn('Error parsing settings:', error)
      }
    }

    console.log('✅ Sync complete!')
  } catch (error) {
    console.error('Error during sync:', error)
  }
}

/**
 * Load all data from Supabase and update localStorage
 * This ensures we have the latest data from the cloud
 */
export const loadFromSupabaseToLocalStorage = async () => {
  if (!isSupabaseAvailable || !supabase) {
    console.warn('⚠️ Supabase not available, using localStorage only')
    return
  }

  try {
    console.log('🔄 Loading data from Supabase...')

    // Load inquiries
    try {
      const { data: inquiries, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.warn('⚠️ Could not load inquiries from Supabase:', error.message)
      } else if (inquiries && inquiries.length > 0) {
        localStorage.setItem('inquiries', JSON.stringify(inquiries))
        console.log(`✅ Loaded ${inquiries.length} inquiries from Supabase`)
      }
    } catch (error) {
      console.warn('⚠️ Error loading inquiries:', error)
    }

    // Load vehicles
    try {
      const { data: vehicles, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.warn('⚠️ Could not load vehicles from Supabase:', error.message)
      } else if (vehicles && vehicles.length > 0) {
        localStorage.setItem('vehicles', JSON.stringify(vehicles))
        console.log(`✅ Loaded ${vehicles.length} vehicles from Supabase`)
      }
    } catch (error) {
      console.warn('⚠️ Error loading vehicles:', error)
    }

    // Load parts
    try {
      const { data: parts, error } = await supabase
        .from('parts')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.warn('⚠️ Could not load parts from Supabase:', error.message)
      } else if (parts && parts.length > 0) {
        localStorage.setItem('parts', JSON.stringify(parts))
        console.log(`✅ Loaded ${parts.length} parts from Supabase`)
      }
    } catch (error) {
      console.warn('⚠️ Error loading parts:', error)
    }

    // Load part orders
    try {
      const { data: partOrders, error } = await supabase
        .from('part_orders')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.warn('⚠️ Could not load part orders from Supabase:', error.message)
      } else if (partOrders && partOrders.length > 0) {
        localStorage.setItem('part_orders', JSON.stringify(partOrders))
        console.log(`✅ Loaded ${partOrders.length} part orders from Supabase`)
      }
    } catch (error) {
      console.warn('⚠️ Error loading part orders:', error)
    }

    // Load vehicle inquiries
    try {
      const { data: vehicleInquiries, error } = await supabase
        .from('vehicle_inquiries')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.warn('⚠️ Could not load vehicle inquiries from Supabase:', error.message)
      } else if (vehicleInquiries && vehicleInquiries.length > 0) {
        localStorage.setItem('vehicle_inquiries', JSON.stringify(vehicleInquiries))
        console.log(`✅ Loaded ${vehicleInquiries.length} vehicle inquiries from Supabase`)
      }
    } catch (error) {
      console.warn('⚠️ Error loading vehicle inquiries:', error)
    }

    console.log('✅ Load from Supabase complete!')
  } catch (error) {
    console.warn('⚠️ Error during load:', error)
  }
}
