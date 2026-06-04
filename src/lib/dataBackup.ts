/**
 * Data Backup & Import Utilities
 * Handles CSV export and import for data backup
 */

import { Vehicle, Part, Inquiry, PartOrder } from './supabase'

/**
 * Export data to CSV
 */
export const exportToCSV = (data: Record<string, unknown>[], filename: string) => {
  if (!data || data.length === 0) {
    console.warn('No data to export')
    return
  }

  // Get headers from first object
  const headers = Object.keys(data[0])

  // Create CSV content
  const csvContent = [
    headers.join(','),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header]
          // Escape quotes and wrap in quotes if contains comma
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`
          }
          return value
        })
        .join(',')
    )
  ].join('\n')

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Import CSV file
 */
export const importFromCSV = (file: File): Promise<Record<string, unknown>[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string
        const lines = csv.split('\n').filter((line) => line.trim())

        if (lines.length < 2) {
          reject(new Error('CSV file must contain headers and at least one data row'))
          return
        }

        // Parse headers
        const headers = parseCSVLine(lines[0])

        // Parse data rows
        const data = lines.slice(1).map((line) => {
          const values = parseCSVLine(line)
          const row: Record<string, unknown> = {}

          headers.forEach((header, index) => {
            row[header] = values[index] || ''
          })

          return row
        })

        resolve(data)
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    reader.readAsText(file)
  })
}

/**
 * Parse CSV line handling quoted values
 */
const parseCSVLine = (line: string): string[] => {
  const result: string[] = []
  let current = ''
  let insideQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    const nextChar = line[i + 1]

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        // Escaped quote
        current += '"'
        i++ // Skip next quote
      } else {
        // Toggle quote state
        insideQuotes = !insideQuotes
      }
    } else if (char === ',' && !insideQuotes) {
      // End of field
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }

  // Add last field
  result.push(current.trim())

  return result
}

/**
 * Export vehicles to CSV
 */
export const exportVehicles = (vehicles: Vehicle[]) => {
  const data = vehicles.map((v) => ({
    id: v.id,
    brand: v.brand,
    model: v.model,
    year: v.year,
    price: v.price,
    location: v.location,
    description: v.description,
    available: v.available,
    createdat: v.createdat
  }))

  exportToCSV(data, 'vehicles-backup')
}

/**
 * Export parts to CSV
 */
export const exportParts = (parts: Part[]) => {
  const data = parts.map((p) => ({
    id: p.id,
    name: p.name,
    brand: p.brand,
    category: p.category,
    price: p.price,
    condition: p.condition,
    description: p.description,
    available: p.available,
    createdat: p.createdat
  }))

  exportToCSV(data, 'parts-backup')
}

/**
 * Export inquiries to CSV
 */
export const exportInquiries = (inquiries: Inquiry[]) => {
  const data = inquiries.map((i) => ({
    id: i.id,
    firstname: i.firstname,
    lastname: i.lastname,
    email: i.email,
    phone: i.phone,
    message: i.message,
    status: i.status,
    createdat: i.createdat
  }))

  exportToCSV(data, 'inquiries-backup')
}

/**
 * Export part orders to CSV
 */
export const exportPartOrders = (orders: PartOrder[]) => {
  const data = orders.map((o) => ({
    id: o.id,
    partId: o.partid,
    partName: o.partname,
    quantity: o.quantity,
    customerName: o.customername,
    customerEmail: o.customeremail,
    status: o.status,
    createdat: o.createdat
  }))

  exportToCSV(data, 'part-orders-backup')
}

/**
 * Create backup of all data
 */
export const createFullBackup = (allData: { vehicles: Vehicle[]; parts: Part[]; inquiries: Inquiry[]; orders: PartOrder[] }) => {
  const backupData = {
    timestamp: new Date().toISOString(),
    vehicles: allData.vehicles,
    parts: allData.parts,
    inquiries: allData.inquiries,
    orders: allData.orders
  }

  const json = JSON.stringify(backupData, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', `full-backup-${new Date().toISOString().split('T')[0]}.json`)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Restore from JSON backup
 */
export const restoreFromBackup = (file: File): Promise<Record<string, unknown>> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const json = e.target?.result as string
        const data = JSON.parse(json)
        resolve(data)
      } catch (error) {
        reject(new Error('Invalid backup file format'))
      }
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    reader.readAsText(file)
  })
}

/**
 * Validate imported data
 */
export const validateImportedData = (data: Record<string, unknown>[], expectedFields: string[]): boolean => {
  if (!Array.isArray(data) || data.length === 0) {
    return false
  }

  // Check if all expected fields are present in first row
  const firstRow = data[0]
  return expectedFields.every((field) => field in firstRow)
}
