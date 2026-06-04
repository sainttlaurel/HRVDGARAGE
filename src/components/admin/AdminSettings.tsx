import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save } from 'lucide-react'

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    businessName: 'HRVD Car Trading',
    email: 'hrvdcartrading@gmail.com',
    phone: '+63 912 345 6789',
    location: 'Quezon City, Metro Manila, Philippines',
    businessHours: 'Mon - Sun: 9:00 AM - 6:00 PM',
  })

  const [saved, setSaved] = useState(false)

  const handleChange = (field: string, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  const handleSave = () => {
    localStorage.setItem('businessSettings', JSON.stringify(settings))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="max-w-2xl">
      <h2 className="heading-section mb-8">Settings</h2>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-luxury p-8 space-y-6"
      >
        {/* Business Information */}
        <div>
          <h3 className="font-serif text-2xl mb-6">Business Information</h3>

          <div className="space-y-6">
            <div>
              <label className="label-small block mb-3">Business Name</label>
              <input
                type="text"
                value={settings.businessName}
                onChange={(e) => handleChange('businessName', e.target.value)}
                className="w-full bg-background border border-border px-4 py-3 focus:outline-none focus:border-foreground transition-colors"
              />
            </div>

            <div>
              <label className="label-small block mb-3">Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full bg-background border border-border px-4 py-3 focus:outline-none focus:border-foreground transition-colors"
              />
            </div>

            <div>
              <label className="label-small block mb-3">Phone</label>
              <input
                type="tel"
                value={settings.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full bg-background border border-border px-4 py-3 focus:outline-none focus:border-foreground transition-colors"
              />
            </div>

            <div>
              <label className="label-small block mb-3">Location</label>
              <input
                type="text"
                value={settings.location}
                onChange={(e) => handleChange('location', e.target.value)}
                className="w-full bg-background border border-border px-4 py-3 focus:outline-none focus:border-foreground transition-colors"
              />
            </div>

            <div>
              <label className="label-small block mb-3">Business Hours</label>
              <input
                type="text"
                value={settings.businessHours}
                onChange={(e) => handleChange('businessHours', e.target.value)}
                className="w-full bg-background border border-border px-4 py-3 focus:outline-none focus:border-foreground transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="border-t border-border pt-8">
          <h3 className="font-serif text-2xl mb-6">Security</h3>

          <div className="space-y-4 p-4 bg-background rounded-sm border border-border">
            <p className="text-sm text-foreground-muted">
              Current admin password: <span className="font-mono">admin123</span>
            </p>
            <p className="text-xs text-foreground-faint">
              ⚠️ In production, implement proper authentication with secure password hashing
            </p>
            <button className="btn-secondary">
              Change Password
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="border-t border-border pt-8">
          <h3 className="font-serif text-2xl mb-6">Statistics</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-background rounded-sm border border-border">
              <p className="label-small mb-2">Total Inquiries</p>
              <p className="text-3xl font-serif">
                {(JSON.parse(localStorage.getItem('inquiries') || '[]') as Record<string, unknown>[]).length}
              </p>
            </div>

            <div className="p-4 bg-background rounded-sm border border-border">
              <p className="label-small mb-2">Vehicles Listed</p>
              <p className="text-3xl font-serif">
                {(JSON.parse(localStorage.getItem('vehicles') || '[]') as Record<string, unknown>[]).length}
              </p>
            </div>

            <div className="p-4 bg-background rounded-sm border border-border">
              <p className="label-small mb-2">New Inquiries</p>
              <p className="text-3xl font-serif">
                {(JSON.parse(localStorage.getItem('inquiries') || '[]') as Record<string, unknown>[]).filter((i: Record<string, unknown>) => i.status === 'new').length}
              </p>
            </div>

            <div className="p-4 bg-background rounded-sm border border-border">
              <p className="label-small mb-2">Available Vehicles</p>
              <p className="text-3xl font-serif">
                {(JSON.parse(localStorage.getItem('vehicles') || '[]') as Record<string, unknown>[]).filter((v: Record<string, unknown>) => v.available).length}
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="border-t border-border pt-8 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: saved ? 1 : 0 }}
            className="text-green-400 text-sm flex items-center gap-2"
          >
            ✓ Settings saved successfully
          </motion.div>

          <button
            onClick={handleSave}
            className="btn-secondary flex items-center gap-2"
          >
            <Save size={18} />
            Save Settings
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default AdminSettings
