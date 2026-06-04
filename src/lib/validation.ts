/**
 * Form Validation Utilities
 * Provides validation functions for common form fields
 */

export interface ValidationError {
  field: string
  message: string
}

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate phone number (basic international format)
 * Accepts formats like: +63 912 345 6789, 09123456789, +1-234-567-8900
 */
export const validatePhone = (phone: string): boolean => {
  // Remove common separators
  const cleaned = phone.replace(/[\s\-().]/g, '')
  // Must be at least 7 digits and at most 15 digits (E.164 standard)
  return /^\+?[0-9]{7,15}$/.test(cleaned)
}

/**
 * Validate name (at least 2 characters, letters and spaces only)
 */
export const validateName = (name: string): boolean => {
  const nameRegex = /^[a-zA-Z\s]{2,}$/
  return nameRegex.test(name.trim())
}

/**
 * Validate address (at least 5 characters)
 */
export const validateAddress = (address: string): boolean => {
  return address.trim().length >= 5
}

/**
 * Validate message (at least 10 characters)
 */
export const validateMessage = (message: string): boolean => {
  return message.trim().length >= 10
}

/**
 * Validate quantity (must be positive integer)
 */
export const validateQuantity = (quantity: number): boolean => {
  return Number.isInteger(quantity) && quantity > 0 && quantity <= 100
}

/**
 * Validate price format (must be valid number)
 */
export const validatePrice = (price: string): boolean => {
  const priceRegex = /^\d+(\.\d{1,2})?$/
  return priceRegex.test(price.trim())
}

/**
 * Validate URL format
 */
export const validateUrl = (url: string): boolean => {
  if (!url) return true // Optional field
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Validate contact form data
 */
export interface ContactFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  message: string
}

export const validateContactForm = (data: ContactFormData): ValidationError[] => {
  const errors: ValidationError[] = []

  if (!data.firstName.trim()) {
    errors.push({ field: 'firstName', message: 'First name is required' })
  } else if (!validateName(data.firstName)) {
    errors.push({ field: 'firstName', message: 'First name must be at least 2 letters' })
  }

  if (!data.lastName.trim()) {
    errors.push({ field: 'lastName', message: 'Last name is required' })
  } else if (!validateName(data.lastName)) {
    errors.push({ field: 'lastName', message: 'Last name must be at least 2 letters' })
  }

  if (!data.email.trim()) {
    errors.push({ field: 'email', message: 'Email is required' })
  } else if (!validateEmail(data.email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' })
  }

  if (!data.phone.trim()) {
    errors.push({ field: 'phone', message: 'Phone number is required' })
  } else if (!validatePhone(data.phone)) {
    errors.push({ field: 'phone', message: 'Please enter a valid phone number' })
  }

  if (!data.message.trim()) {
    errors.push({ field: 'message', message: 'Message is required' })
  } else if (!validateMessage(data.message)) {
    errors.push({ field: 'message', message: 'Message must be at least 10 characters' })
  }

  return errors
}

/**
 * Validate part order form data
 */
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

export const validatePartOrderForm = (data: PartOrderFormData): ValidationError[] => {
  const errors: ValidationError[] = []

  if (!validateQuantity(data.quantity)) {
    errors.push({ field: 'quantity', message: 'Quantity must be between 1 and 100' })
  }

  if (!data.customerName.trim()) {
    errors.push({ field: 'customerName', message: 'Full name is required' })
  } else if (!validateName(data.customerName)) {
    errors.push({ field: 'customerName', message: 'Name must be at least 2 letters' })
  }

  if (!data.customerEmail.trim()) {
    errors.push({ field: 'customerEmail', message: 'Email is required' })
  } else if (!validateEmail(data.customerEmail)) {
    errors.push({ field: 'customerEmail', message: 'Please enter a valid email address' })
  }

  if (!data.customerPhone.trim()) {
    errors.push({ field: 'customerPhone', message: 'Phone number is required' })
  } else if (!validatePhone(data.customerPhone)) {
    errors.push({ field: 'customerPhone', message: 'Please enter a valid phone number' })
  }

  if (!data.address.trim()) {
    errors.push({ field: 'address', message: 'Delivery address is required' })
  } else if (!validateAddress(data.address)) {
    errors.push({ field: 'address', message: 'Address must be at least 5 characters' })
  }

  // Facebook profile is optional, but validate if provided
  if (data.facebookProfile && !validateUrl(data.facebookProfile)) {
    errors.push({ field: 'facebookProfile', message: 'Please enter a valid Facebook URL' })
  }

  return errors
}

/**
 * Get error message for a specific field
 */
export const getFieldError = (errors: ValidationError[], field: string): string | null => {
  const error = errors.find(e => e.field === field)
  return error ? error.message : null
}

/**
 * Check if field has error
 */
export const hasFieldError = (errors: ValidationError[], field: string): boolean => {
  return errors.some(e => e.field === field)
}
