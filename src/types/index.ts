/**
 * Global TypeScript Type Definitions
 * Replaces all 'any' types with proper interfaces
 */

// ============================================
// VEHICLE TYPES
// ============================================

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
  created_at?: string
  updated_at?: string
}

export interface VehicleFormData {
  brand: string
  model: string
  year: number
  price: string
  location: string
  description: string
  specs: Record<string, string>
  image: string
  images: string[]
}

// ============================================
// PART TYPES
// ============================================

export interface Part {
  id: string
  brand: string
  name: string
  price: number
  image: string
  description: string
  category: string
  created_at?: string
  updated_at?: string
}

export interface PartFormData {
  brand: string
  name: string
  price: number
  image: string
  description: string
  category: string
}

// ============================================
// INQUIRY TYPES
// ============================================

export interface Inquiry {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  message: string
  status: 'new' | 'responded' | 'closed'
  created_at?: string
  updated_at?: string
}

export interface InquiryFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  message: string
}

// ============================================
// PART ORDER TYPES
// ============================================

export interface PartOrder {
  id: string
  partId: string
  partName: string
  partBrand: string
  partPrice: number
  quantity: number
  customerName: string
  customerEmail: string
  customerPhone: string
  customerCar: string
  address: string
  paymentMethod: string
  deliveryOption: string
  facebookProfile: string
  notes: string
  status: 'new' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  created_at?: string
  updated_at?: string
}

export interface PartOrderFormData {
  quantity: number
  customerName: string
  customerEmail: string
  customerPhone: string
  customerCar: string
  address: string
  paymentMethod: string
  deliveryOption: string
  facebookProfile: string
  notes: string
}

// ============================================
// VEHICLE INQUIRY TYPES
// ============================================

export interface VehicleInquiry {
  id: string
  vehicleId: string
  vehicleBrand: string
  vehicleModel: string
  customerName: string
  customerEmail: string
  customerPhone: string
  message: string
  status: 'new' | 'responded' | 'closed'
  created_at?: string
  updated_at?: string
}

export interface VehicleInquiryFormData {
  customerName: string
  customerEmail: string
  customerPhone: string
  message: string
}

// ============================================
// REVIEW TYPES
// ============================================

export interface Review {
  id: string
  itemType: 'vehicle' | 'part' | 'service'
  itemId: string
  rating: number
  title: string
  comment: string
  customerName: string
  verified: boolean
  helpful: number
  unhelpful: number
  status: 'pending' | 'approved' | 'rejected'
  created_at?: string
  updated_at?: string
}

export interface ReviewFormData {
  itemType: 'vehicle' | 'part' | 'service'
  itemId: string
  rating: number
  title: string
  comment: string
  customerName: string
}

// ============================================
// VALIDATION ERROR TYPES
// ============================================

export interface ValidationError {
  field: string
  message: string
}

// ============================================
// ADMIN SETTINGS TYPES
// ============================================

export interface BusinessSettings {
  id?: string
  companyName: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  website: string
  currency: string
  timezone: string
  updated_at?: string
}

// ============================================
// ANALYTICS TYPES
// ============================================

export interface AnalyticsEvent {
  name: string
  properties?: Record<string, unknown>
  timestamp: number
}

export interface PerformanceMetrics {
  pageLoad: number
  ttfb: number
  fcp: number
  lcp: number
  cls: number
  fid: number
}

export interface ResourceTiming {
  name: string
  duration: number
  size: number
  type: string
}

// ============================================
// BACKUP & EXPORT TYPES
// ============================================

export interface BackupData {
  vehicles: Vehicle[]
  parts: Part[]
  inquiries: Inquiry[]
  partOrders: PartOrder[]
  vehicleInquiries: VehicleInquiry[]
  reviews: Review[]
  timestamp: number
  version: string
}

export interface ExportFormat {
  format: 'csv' | 'json'
  data: Vehicle[] | Part[] | Inquiry[] | PartOrder[] | VehicleInquiry[] | Review[] | BackupData
  timestamp: number
}

// ============================================
// THEME TYPES
// ============================================

export type ThemeMode = 'light' | 'dark'

export interface ThemeConfig {
  mode: ThemeMode
  primaryColor: string
  accentColor: string
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

// ============================================
// UTILITY TYPES
// ============================================

export type Record<K extends string | number | symbol, T> = {
  [P in K]: T
}

export type Partial<T> = {
  [P in keyof T]?: T[P]
}

export type Optional<T> = T | null | undefined
