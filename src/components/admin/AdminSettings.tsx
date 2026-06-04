import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save } from 'lucide-react'
import { settingsService, inquiryService, vehicleService } from '../../lib/supabase'
import { dispatchDataChange } from '../../lib/dataEvents'

const defaultSettings = {
  businessName: 'HRVD Car Trading',
  email: 'hrvdcartrading@gmail.com',
  phone: '+63 912 345 6789',
  location: 'Quezon City, Metro Manila, Philippines',
  businessHours: 'Mon - Sun: 9:00 AM - 6:00 PM',
}

const AdminSettings = () => {
  const [settings, setSettings] = useState(defaultSettings)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    totalInquiries: 0,
    newInquiries: 0,
    vehiclesListed: 0,
    availableVehicles: 0,
  })

  useEffect(() => {
    const load = async () => {
      try {
        const [stored, inquiries, vehicles] = await Promise.all([
          settingsService.get(),
          inquiryService.getAll(),
          vehicleService.getAll(),
        ])

        if (stored) {
          setSettings({
            businessName: stored.businessname,
            email: stored.email,
            phone: stored.phone,
            location: stored.location,
            businessHours: stored.businesshours,
          })
        }

        setStats({
          totalInquiries: inquiries.length,
          newInquiries: inquiries.filter((i) => i.status === 'new').length,
          vehiclesListed: vehicles.length,
          availableVehicles: vehicles.filter((v) => v.available).length,
        })
      } catch (error) {
        console.error('Error loading settings:', error)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const handleChange = (field: string, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
    setSaved(false)
    setSaveError(null)
  }

  const handleSave = async () => {
    setSaveError(null)
    try {
      await settingsService.update({
        businessname: settings.businessName,
        email: settings.email,
        phone: settings.phone,
        location: settings.location,
        businesshours: settings.businessHours,
      })
      dispatchDataChange('business_settings', 'update')
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Error saving settings:', error)
      setSaveError('Failed to save settings. Check Supabase connection.')
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl">
        <h2 className="heading-section mb-8">Settings</h2>
        <p className="text-foreground-muted">Loading settings…</p>
      </div>
    )
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
              Admin access uses Supabase Auth. Manage users in your Supabase dashboard.
            </p>
            <p className="text-xs text-foreground-faint">
              Do not store passwords in the client — use Supabase Auth policies in production.
            </p>
          </div>
        </div>

        {/* Statistics */}
        <div className="border-t border-border pt-8">
          <h3 className="font-serif text-2xl mb-6">Statistics</h3>
          <p className="text-xs text-foreground-faint mb-4">Live counts from Supabase</p>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-background rounded-sm border border-border">
              <p className="label-small mb-2">Total Inquiries</p>
              <p className="text-3xl font-serif">{stats.totalInquiries}</p>
            </div>

            <div className="p-4 bg-background rounded-sm border border-border">
              <p className="label-small mb-2">Vehicles Listed</p>
              <p className="text-3xl font-serif">{stats.vehiclesListed}</p>
            </div>

            <div className="p-4 bg-background rounded-sm border border-border">
              <p className="label-small mb-2">New Inquiries</p>
              <p className="text-3xl font-serif">{stats.newInquiries}</p>
            </div>

            <div className="p-4 bg-background rounded-sm border border-border">
              <p className="label-small mb-2">Available Vehicles</p>
              <p className="text-3xl font-serif">{stats.availableVehicles}</p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="border-t border-border pt-8 flex items-center justify-between">
          <div className="space-y-1">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: saved ? 1 : 0 }}
              className="text-green-400 text-sm flex items-center gap-2"
            >
              ✓ Settings saved to Supabase
            </motion.div>
            {saveError && (
              <p className="text-red-400 text-sm">{saveError}</p>
            )}
          </div>

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
