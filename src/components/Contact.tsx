import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Facebook } from 'lucide-react'
import { useState } from 'react'
import { inquiryService } from '../lib/supabase'
import { validateContactForm, ValidationError, getFieldError } from '../lib/validation'
import { sendNewInquiryNotification } from '../lib/emailService'
import { trackInquirySubmission } from '../lib/analytics'

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<ValidationError[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error for this field when user starts typing
    setErrors(prev => prev.filter(err => err.field !== name))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors([])

    // Validate form
    const validationErrors = validateContactForm(formData)
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      setLoading(false)
      return
    }

    try {
      // Save inquiry to database
      await inquiryService.create({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        status: 'new'
      })

      // Track inquiry submission
      trackInquirySubmission('contact_form')

      // Send email notification to admin
      const emailSent = await sendNewInquiryNotification({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        message: formData.message
      })

      if (emailSent) {
        console.log('✅ Admin notification email sent')
      } else {
        console.warn('⚠️ Email notification failed, but inquiry was saved')
      }

      // Reset form
      setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' })
      setSubmitted(true)

      // Hide success message after 3 seconds
      setTimeout(() => setSubmitted(false), 3000)
    } catch (err) {
      setErrors([{ field: 'submit', message: 'Failed to send inquiry. Please try again.' }])
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="relative py-16 sm:py-24 md:py-32 overflow-hidden">
      {/* Background Image - Using car 9.jpg */}
      <div className="absolute inset-0 opacity-10">
        <img
          src="/cars/9.jpg"
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background-soft via-background-soft/95 to-background-soft" />
      </div>

      <div className="container-luxury relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8 sm:space-y-12"
          >
            <div>
              <p className="label-small mb-4">Get In Touch</p>
              <h2 className="heading-section mb-4 sm:mb-6">
                Let's Talk Cars & Parts
              </h2>
              <p className="text-base sm:text-lg text-foreground-muted">
                Interested in any of our vehicles or parts? Have questions about trade-ins? 
                Send us a message and we'll get back to you ASAP.
              </p>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-border flex items-center justify-center flex-shrink-0">
                  <Phone size={16} className="sm:hidden" />
                  <Phone size={20} className="hidden sm:block" />
                </div>
                <div className="min-w-0">
                  <p className="label-small mb-2">Phone / Viber</p>
                  <a href="tel:+639123456789" className="text-base sm:text-lg hover:text-motorsport-red transition-colors break-all">
                    +63 912 345 6789
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-border flex items-center justify-center flex-shrink-0">
                  <Mail size={16} className="sm:hidden" />
                  <Mail size={20} className="hidden sm:block" />
                </div>
                <div className="min-w-0">
                  <p className="label-small mb-2">Email / Messenger</p>
                  <a href="mailto:hrvdcartrading@gmail.com" className="text-base sm:text-lg hover:text-motorsport-red transition-colors break-all">
                    hrvdcartrading@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-border flex items-center justify-center flex-shrink-0">
                  <Facebook size={16} className="sm:hidden" />
                  <Facebook size={20} className="hidden sm:block" />
                </div>
                <div className="min-w-0">
                  <p className="label-small mb-2">Facebook</p>
                  <a href="https://www.facebook.com/HRVDCarTrading" target="_blank" rel="noopener noreferrer" className="text-base sm:text-lg hover:text-motorsport-red transition-colors break-all">
                    HRVDCarTrading
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-border flex items-center justify-center flex-shrink-0">
                  <MapPin size={16} className="sm:hidden" />
                  <MapPin size={20} className="hidden sm:block" />
                </div>
                <div className="min-w-0">
                  <p className="label-small mb-2">Location</p>
                  <p className="text-base sm:text-lg">
                    Quezon City<br />
                    Metro Manila, Philippines
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="card-luxury p-4 sm:p-6 md:p-8"
          >
            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-3 sm:p-4 bg-green-500/20 text-green-400 rounded-sm text-xs sm:text-sm"
              >
                ✓ Thank you! Your inquiry has been received. We'll get back to you soon.
              </motion.div>
            )}

            {errors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-3 sm:p-4 bg-motorsport-red/20 text-motorsport-red rounded-sm text-xs sm:text-sm space-y-2"
              >
                {errors.map((error, idx) => (
                  <div key={idx}>✗ {error.message}</div>
                ))}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="label-small block mb-2 sm:mb-3">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className={`w-full bg-background border px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none transition-colors disabled:opacity-50 ${
                      getFieldError(errors, 'firstName') ? 'border-motorsport-red' : 'border-border focus:border-foreground'
                    }`}
                    placeholder="John"
                  />
                  {getFieldError(errors, 'firstName') && (
                    <p className="text-motorsport-red text-xs mt-1">{getFieldError(errors, 'firstName')}</p>
                  )}
                </div>
                <div>
                  <label className="label-small block mb-2 sm:mb-3">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className={`w-full bg-background border px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none transition-colors disabled:opacity-50 ${
                      getFieldError(errors, 'lastName') ? 'border-motorsport-red' : 'border-border focus:border-foreground'
                    }`}
                    placeholder="Doe"
                  />
                  {getFieldError(errors, 'lastName') && (
                    <p className="text-motorsport-red text-xs mt-1">{getFieldError(errors, 'lastName')}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="label-small block mb-2 sm:mb-3">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className={`w-full bg-background border px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none transition-colors disabled:opacity-50 ${
                    getFieldError(errors, 'email') ? 'border-motorsport-red' : 'border-border focus:border-foreground'
                  }`}
                  placeholder="john@example.com"
                />
                {getFieldError(errors, 'email') && (
                  <p className="text-motorsport-red text-xs mt-1">{getFieldError(errors, 'email')}</p>
                )}
              </div>

              <div>
                <label className="label-small block mb-2 sm:mb-3">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className={`w-full bg-background border px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none transition-colors disabled:opacity-50 ${
                    getFieldError(errors, 'phone') ? 'border-motorsport-red' : 'border-border focus:border-foreground'
                  }`}
                  placeholder="+1 (234) 567-890"
                />
                {getFieldError(errors, 'phone') && (
                  <p className="text-motorsport-red text-xs mt-1">{getFieldError(errors, 'phone')}</p>
                )}
              </div>

              <div>
                <label className="label-small block mb-2 sm:mb-3">Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  rows={5}
                  className={`w-full bg-background border px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none transition-colors resize-none disabled:opacity-50 ${
                    getFieldError(errors, 'message') ? 'border-motorsport-red' : 'border-border focus:border-foreground'
                  }`}
                  placeholder="Tell us about your dream vehicle or the parts you're looking for..."
                />
                {getFieldError(errors, 'message') && (
                  <p className="text-motorsport-red text-xs mt-1">{getFieldError(errors, 'message')}</p>
                )}
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50 text-xs sm:text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? 'Sending...' : 'Send Inquiry'}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Contact
