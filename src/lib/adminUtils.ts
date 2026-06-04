/**
 * Admin utilities for search, filter, sort, and export
 */

import { Inquiry, Vehicle, Part, PartOrder } from './supabase'

export interface FilterOptions {
  searchTerm: string
  status?: string
  available?: boolean
  sortBy: 'date' | 'name' | 'price'
  sortOrder: 'asc' | 'desc'
}

/**
 * Search inquiries by name, email, or message
 */
export function searchInquiries(inquiries: Inquiry[], searchTerm: string): Inquiry[] {
  if (!searchTerm.trim()) return inquiries

  const term = searchTerm.toLowerCase()
  return inquiries.filter(
    (inq) =>
      inq.firstname.toLowerCase().includes(term) ||
      inq.lastname.toLowerCase().includes(term) ||
      inq.email.toLowerCase().includes(term) ||
      inq.phone.includes(term) ||
      inq.message.toLowerCase().includes(term)
  )
}

/**
 * Filter inquiries by status
 */
export function filterInquiries(
  inquiries: Inquiry[],
  options: Partial<FilterOptions>
): Inquiry[] {
  let filtered = inquiries

  if (options.status && options.status !== 'all') {
    filtered = filtered.filter((inq) => inq.status === options.status)
  }

  if (options.searchTerm) {
    filtered = searchInquiries(filtered, options.searchTerm)
  }

  return sortInquiries(filtered, options.sortBy || 'date', options.sortOrder || 'desc')
}

/**
 * Sort inquiries
 */
export function sortInquiries(
  inquiries: Inquiry[],
  sortBy: 'date' | 'name' | 'price' = 'date',
  sortOrder: 'asc' | 'desc' = 'desc'
): Inquiry[] {
  const sorted = [...inquiries].sort((a, b) => {
    let compareA: string | number
    let compareB: string | number

    switch (sortBy) {
      case 'name':
        compareA = `${a.firstname} ${a.lastname}`.toLowerCase()
        compareB = `${b.firstname} ${b.lastname}`.toLowerCase()
        break
      case 'date':
      default:
        compareA = new Date(a.createdat).getTime()
        compareB = new Date(b.createdat).getTime()
    }

    if (compareA < compareB) return sortOrder === 'asc' ? -1 : 1
    if (compareA > compareB) return sortOrder === 'asc' ? 1 : -1
    return 0
  })

  return sorted
}

/**
 * Search vehicles by brand, model, or description
 */
export function searchVehicles(vehicles: Vehicle[], searchTerm: string): Vehicle[] {
  if (!searchTerm.trim()) return vehicles

  const term = searchTerm.toLowerCase()
  return vehicles.filter(
    (v) =>
      v.brand.toLowerCase().includes(term) ||
      v.model.toLowerCase().includes(term) ||
      v.description.toLowerCase().includes(term) ||
      v.location.toLowerCase().includes(term)
  )
}

/**
 * Filter vehicles by availability and search
 */
export function filterVehicles(
  vehicles: Vehicle[],
  options: Partial<FilterOptions>
): Vehicle[] {
  let filtered = vehicles

  if (options.available !== undefined) {
    filtered = filtered.filter((v) => v.available === options.available)
  }

  if (options.searchTerm) {
    filtered = searchVehicles(filtered, options.searchTerm)
  }

  return sortVehicles(filtered, options.sortBy || 'date', options.sortOrder || 'desc')
}

/**
 * Sort vehicles
 */
export function sortVehicles(
  vehicles: Vehicle[],
  sortBy: 'date' | 'name' | 'price' = 'date',
  sortOrder: 'asc' | 'desc' = 'desc'
): Vehicle[] {
  const sorted = [...vehicles].sort((a, b) => {
    let compareA: string | number
    let compareB: string | number

    switch (sortBy) {
      case 'name':
        compareA = `${a.brand} ${a.model}`.toLowerCase()
        compareB = `${b.brand} ${b.model}`.toLowerCase()
        break
      case 'price':
        compareA = parseInt(a.price.replace(/\D/g, '')) || 0
        compareB = parseInt(b.price.replace(/\D/g, '')) || 0
        break
      case 'date':
      default:
        compareA = new Date(a.createdat).getTime()
        compareB = new Date(b.createdat).getTime()
    }

    if (compareA < compareB) return sortOrder === 'asc' ? -1 : 1
    if (compareA > compareB) return sortOrder === 'asc' ? 1 : -1
    return 0
  })

  return sorted
}

/**
 * Search parts by name, brand, or category
 */
export function searchParts(parts: Part[], searchTerm: string): Part[] {
  if (!searchTerm.trim()) return parts

  const term = searchTerm.toLowerCase()
  return parts.filter(
    (p) =>
      p.name.toLowerCase().includes(term) ||
      p.brand.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term)
  )
}

/**
 * Filter parts by availability and search
 */
export function filterParts(parts: Part[], options: Partial<FilterOptions>): Part[] {
  let filtered = parts

  if (options.available !== undefined) {
    filtered = filtered.filter((p) => p.available === options.available)
  }

  if (options.searchTerm) {
    filtered = searchParts(filtered, options.searchTerm)
  }

  return sortParts(filtered, options.sortBy || 'date', options.sortOrder || 'desc')
}

/**
 * Sort parts
 */
export function sortParts(
  parts: Part[],
  sortBy: 'date' | 'name' | 'price' = 'date',
  sortOrder: 'asc' | 'desc' = 'desc'
): Part[] {
  const sorted = [...parts].sort((a, b) => {
    let compareA: string | number
    let compareB: string | number

    switch (sortBy) {
      case 'name':
        compareA = a.name.toLowerCase()
        compareB = b.name.toLowerCase()
        break
      case 'price':
        compareA = parseInt(a.price.replace(/\D/g, '')) || 0
        compareB = parseInt(b.price.replace(/\D/g, '')) || 0
        break
      case 'date':
      default:
        compareA = new Date(a.createdat).getTime()
        compareB = new Date(b.createdat).getTime()
    }

    if (compareA < compareB) return sortOrder === 'asc' ? -1 : 1
    if (compareA > compareB) return sortOrder === 'asc' ? 1 : -1
    return 0
  })

  return sorted
}

/**
 * Export data to CSV
 */
export function exportToCSV(data: Record<string, unknown>[], filename: string) {
  if (data.length === 0) {
    alert('No data to export')
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
    ),
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
 * Export inquiries to CSV
 */
export function exportInquiries(inquiries: Inquiry[]) {
  const data = inquiries.map((inq) => ({
    'First Name': inq.firstname,
    'Last Name': inq.lastname,
    Email: inq.email,
    Phone: inq.phone,
    Message: inq.message,
    Status: inq.status,
    'Created At': new Date(inq.createdat).toLocaleDateString(),
  }))

  exportToCSV(data, 'inquiries')
}

/**
 * Export vehicles to CSV
 */
export function exportVehicles(vehicles: Vehicle[]) {
  const data = vehicles.map((v) => ({
    Brand: v.brand,
    Model: v.model,
    Year: v.year,
    Price: v.price,
    Location: v.location,
    Available: v.available ? 'Yes' : 'No',
    Description: v.description,
    'Created At': new Date(v.createdat).toLocaleDateString(),
  }))

  exportToCSV(data, 'vehicles')
}

/**
 * Export parts to CSV
 */
export function exportParts(parts: Part[]) {
  const data = parts.map((p) => ({
    Category: p.category,
    Name: p.name,
    Brand: p.brand,
    Price: p.price,
    Condition: p.condition,
    Available: p.available ? 'Yes' : 'No',
    Description: p.description,
    'Created At': new Date(p.createdat).toLocaleDateString(),
  }))

  exportToCSV(data, 'parts')
}

/**
 * Export part orders to CSV
 */
export function exportPartOrders(orders: PartOrder[]) {
  const data = orders.map((o) => ({
    'Part Name': o.partname,
    Quantity: o.quantity,
    'Customer Name': o.customername,
    'Customer Email': o.customeremail,
    'Customer Phone': o.customerPhone,
    'Delivery Option': o.deliveryoption,
    Status: o.status,
    'Created At': new Date(o.createdat).toLocaleDateString(),
  }))

  exportToCSV(data, 'part-orders')
}

/**
 * Bulk update status for multiple items
 */
export function bulkUpdateStatus<T extends { id: string; status: string }>(
  items: T[],
  selectedIds: Set<string>,
  newStatus: string
): T[] {
  return items.map((item) =>
    selectedIds.has(item.id) ? { ...item, status: newStatus } : item
  )
}

/**
 * Bulk delete items
 */
export function bulkDelete<T extends { id: string }>(
  items: T[],
  selectedIds: Set<string>
): T[] {
  return items.filter((item) => !selectedIds.has(item.id))
}

/**
 * Get statistics for dashboard
 */
export function getInquiryStats(inquiries: Inquiry[]) {
  return {
    total: inquiries.length,
    new: inquiries.filter((i) => i.status === 'new').length,
    read: inquiries.filter((i) => i.status === 'read').length,
    responded: inquiries.filter((i) => i.status === 'responded').length,
  }
}

/**
 * Get vehicle statistics
 */
export function getVehicleStats(vehicles: Vehicle[]) {
  return {
    total: vehicles.length,
    available: vehicles.filter((v) => v.available).length,
    sold: vehicles.filter((v) => !v.available).length,
  }
}

/**
 * Get parts statistics
 */
export function getPartStats(parts: Part[]) {
  return {
    total: parts.length,
    available: parts.filter((p) => p.available).length,
    sold: parts.filter((p) => !p.available).length,
  }
}
