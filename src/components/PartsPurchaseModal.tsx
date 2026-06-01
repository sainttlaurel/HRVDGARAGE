import { motion, AnimatePresence } from 'framer-motion'
import { X, Send } from 'lucide-react'
import { useState } from 'react'
import { partOrdersService, Part } from '../lib/supabase'
import { validatePartOrderForm, ValidationError, getFieldError } from '../lib/validation'
import { sendNewPartOrderNotification } from '../lib/emailService'
import { trackPartPurchase } from '../lib/analytics'

interface PartsPurchaseModalProps {
  isOpen: boolean
  onClose: () => void
  part: Part | null
}

const PartsPurchaseModal = ({ isOpen, onClose, part }: PartsPurchaseModalProps) => {
  if (!part) return null
  const [formData, setFormData] = useState({
    quantity: 1,
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerCar: '',
    address: '',
    paymentMethod: 'cash',
    deliveryOption: 'pickup',
    facebookProfile: '',
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<ValidationError[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) : value
    }))
    // Clear error for this field when user starts typing
    setErrors(prev => prev.filter(err => err.field !== name))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors([])

    // Validate form
    const validationErrors = validatePartOrderForm(formData)
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      setLoading(false)
      return
    }

    try {
      // Create order in database
      await partOrdersService.create({
        partId: part.id,
        partName: part.name,
        partBrand: part.brand,
        partPrice: part.price,
        quantity: formData.quantity,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        customerCar: formData.customerCar,
        address: formData.address,
        paymentMethod: formData.paymentMethod,
        deliveryOption: formData.deliveryOption,
        facebookProfile: formData.facebookProfile,
        notes: formData.notes,
        status: 'new'
      })

      // Track part purchase
      trackPartPurchase(part.id, part.name, formData.quantity, part.price)

      // Send email notification to admin
      const emailSent = await sendNewPartOrderNotification({
        partName: part.name,
        partBrand: part.brand,
        partPrice: part.price,
        quantity: formData.quantity,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        deliveryOption: formData.deliveryOption
      })

      if (emailSent) {
        console.log('✅ Admin notification email sent')
      } else {
        console.warn('⚠️ Email notification failed, but order was saved')
      }

      setSubmitted(true)
      setTimeout(() => {
        onClose()
        setSubmitted(false)
        setFormData({
          quantity: 1,
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          customerCar: '',
          address: '',
          paymentMethod: 'cash',
          deliveryOption: 'pickup',
          facebookProfile: '',
          notes: ''
        })
      }, 2000)
    } catch (err) {
      setErrors([{ field: 'submit', message: 'Failed to submit order. Please try again.' }])
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="fixed inset-4 md:inset-8 lg:inset-20 z-[61] flex items-center justify-center"
          >
            <div className="bg-background border border-border rounded-sm max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border p-6 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl">{part.brand} {part.name}</h2>
            <p className="text-sm text-foreground-muted">{part.price}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-foreground-faint/20 rounded transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-green-500/20 text-green-400 rounded-sm text-sm"
            >
              ✓ Order submitted successfully! We'll contact you soon.
            </motion.div>
          )}

          {errors.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-motorsport-red/20 text-motorsport-red rounded-sm text-sm space-y-2"
            >
              {errors.map((error, idx) => (
                <div key={idx}>✗ {error.message}</div>
              ))}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Quantity */}
            <div>
              <label className="label-small block mb-3">Quantity *</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                max="100"
                required
                disabled={loading}
                className={`w-full bg-background border px-4 py-3 focus:outline-none transition-colors disabled:opacity-50 ${
                  getFieldError(errors, 'quantity') ? 'border-motorsport-red' : 'border-border focus:border-foreground'
                }`}
              />
              {getFieldError(errors, 'quantity') && (
                <p className="text-motorsport-red text-xs mt-1">{getFieldError(errors, 'quantity')}</p>
              )}
            </div>

            {/* Customer Info */}
            <div className="space-y-4">
              <h3 className="font-medium text-sm">Customer Information</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-small block mb-3">Full Name *</label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className={`w-full bg-background border px-4 py-3 focus:outline-none transition-colors disabled:opacity-50 ${
                      getFieldError(errors, 'customerName') ? 'border-motorsport-red' : 'border-border focus:border-foreground'
                    }`}
                    placeholder="John Doe"
                  />
                  {getFieldError(errors, 'customerName') && (
                    <p className="text-motorsport-red text-xs mt-1">{getFieldError(errors, 'customerName')}</p>
                  )}
                </div>
                <div>
                  <label className="label-small block mb-3">Email *</label>
                  <input
                    type="email"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className={`w-full bg-background border px-4 py-3 focus:outline-none transition-colors disabled:opacity-50 ${
                      getFieldError(errors, 'customerEmail') ? 'border-motorsport-red' : 'border-border focus:border-foreground'
                    }`}
                    placeholder="john@example.com"
                  />
                  {getFieldError(errors, 'customerEmail') && (
                    <p className="text-motorsport-red text-xs mt-1">{getFieldError(errors, 'customerEmail')}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-small block mb-3">Phone Number *</label>
                  <input
                    type="tel"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className={`w-full bg-background border px-4 py-3 focus:outline-none transition-colors disabled:opacity-50 ${
                      getFieldError(errors, 'customerPhone') ? 'border-motorsport-red' : 'border-border focus:border-foreground'
                    }`}
                    placeholder="+63 912 345 6789"
                  />
                  {getFieldError(errors, 'customerPhone') && (
                    <p className="text-motorsport-red text-xs mt-1">{getFieldError(errors, 'customerPhone')}</p>
                  )}
                </div>
                <div>
                  <label className="label-small block mb-3">Facebook Profile (Optional)</label>
                  <input
                    type="text"
                    name="facebookProfile"
                    value={formData.facebookProfile}
                    onChange={handleChange}
                    disabled={loading}
                    className={`w-full bg-background border px-4 py-3 focus:outline-none transition-colors disabled:opacity-50 ${
                      getFieldError(errors, 'facebookProfile') ? 'border-motorsport-red' : 'border-border focus:border-foreground'
                    }`}
                    placeholder="facebook.com/yourprofile"
                  />
                  {getFieldError(errors, 'facebookProfile') && (
                    <p className="text-motorsport-red text-xs mt-1">{getFieldError(errors, 'facebookProfile')}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Vehicle & Delivery Info */}
            <div className="space-y-4">
              <h3 className="font-medium text-sm">Vehicle & Delivery</h3>
              
              <div>
                <label className="label-small block mb-3">What Car Do You Have? (Optional)</label>
                <input
                  type="text"
                  name="customerCar"
                  value={formData.customerCar}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full bg-background border border-border px-4 py-3 focus:outline-none focus:border-foreground transition-colors disabled:opacity-50"
                  placeholder="e.g., Honda Civic 2020"
                />
              </div>

              <div>
                <label className="label-small block mb-3">Delivery Address *</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  rows={3}
                  className={`w-full bg-background border px-4 py-3 focus:outline-none transition-colors resize-none disabled:opacity-50 ${
                    getFieldError(errors, 'address') ? 'border-motorsport-red' : 'border-border focus:border-foreground'
                  }`}
                  placeholder="Street address, city, postal code"
                />
                {getFieldError(errors, 'address') && (
                  <p className="text-motorsport-red text-xs mt-1">{getFieldError(errors, 'address')}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-small block mb-3">Payment Method</label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full bg-background border border-border px-4 py-3 focus:outline-none focus:border-foreground transition-colors disabled:opacity-50"
                  >
                    <option value="cash">Cash on Delivery</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="gcash">GCash</option>
                    <option value="paypal">PayPal</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="label-small block mb-3">Delivery Option</label>
                  <select
                    name="deliveryOption"
                    value={formData.deliveryOption}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full bg-background border border-border px-4 py-3 focus:outline-none focus:border-foreground transition-colors disabled:opacity-50"
                  >
                    <option value="pickup">Pickup</option>
                    <option value="delivery">Delivery</option>
                    <option value="shipping">Shipping</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <label className="label-small block mb-3">Additional Notes (Optional)</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                disabled={loading}
                rows={3}
                className="w-full bg-background border border-border px-4 py-3 focus:outline-none focus:border-foreground transition-colors resize-none disabled:opacity-50"
                placeholder="Any special requests or questions?"
              />
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Send size={18} />
              {loading ? 'Submitting...' : 'Submit Order'}
            </motion.button>
          </form>

          <p className="text-xs text-foreground-faint text-center">
            * Required fields. We'll contact you to confirm your order.
          </p>
        </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default PartsPurchaseModal
