import { motion } from 'framer-motion'
import { Download, Upload, Database } from 'lucide-react'
import { useState } from 'react'
import { exportVehicles, exportParts, exportInquiries, exportPartOrders, createFullBackup, importFromCSV, restoreFromBackup } from '../../lib/dataBackup'

interface AdminBackupProps {
  vehicles: any[]
  parts: any[]
  inquiries: any[]
  orders: any[]
}

const AdminBackup = ({ vehicles, parts, inquiries, orders }: AdminBackupProps) => {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')

  const handleExportVehicles = () => {
    try {
      exportVehicles(vehicles)
      setMessage('Vehicles exported successfully')
      setMessageType('success')
    } catch (err) {
      setMessage('Failed to export vehicles')
      setMessageType('error')
    }
  }

  const handleExportParts = () => {
    try {
      exportParts(parts)
      setMessage('Parts exported successfully')
      setMessageType('success')
    } catch (err) {
      setMessage('Failed to export parts')
      setMessageType('error')
    }
  }

  const handleExportInquiries = () => {
    try {
      exportInquiries(inquiries)
      setMessage('Inquiries exported successfully')
      setMessageType('success')
    } catch (err) {
      setMessage('Failed to export inquiries')
      setMessageType('error')
    }
  }

  const handleExportOrders = () => {
    try {
      exportPartOrders(orders)
      setMessage('Orders exported successfully')
      setMessageType('success')
    } catch (err) {
      setMessage('Failed to export orders')
      setMessageType('error')
    }
  }

  const handleFullBackup = () => {
    try {
      createFullBackup({ vehicles, parts, inquiries, orders })
      setMessage('Full backup created successfully')
      setMessageType('success')
    } catch (err) {
      setMessage('Failed to create backup')
      setMessageType('error')
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'csv' | 'json') => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    try {
      if (type === 'csv') {
        const data = await importFromCSV(file)
        setMessage(`Imported ${data.length} records from CSV`)
        setMessageType('success')
      } else {
        const data = await restoreFromBackup(file)
        setMessage(`Backup file loaded. Contains ${data.vehicles?.length || 0} vehicles, ${data.parts?.length || 0} parts`)
        setMessageType('success')
      }
    } catch (err) {
      setMessage(`Failed to import file: ${err instanceof Error ? err.message : 'Unknown error'}`)
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl mb-4">Data Backup & Import</h2>
        <p className="text-foreground-muted mb-6">
          Export your data for backup or import previously exported data.
        </p>
      </div>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-sm text-sm ${
            messageType === 'success'
              ? 'bg-green-500/20 text-green-400'
              : 'bg-motorsport-red/20 text-motorsport-red'
          }`}
        >
          {messageType === 'success' ? '✓' : '✗'} {message}
        </motion.div>
      )}

      {/* Export Section */}
      <div className="card-luxury p-6">
        <div className="flex items-center gap-3 mb-6">
          <Download size={24} />
          <h3 className="font-serif text-xl">Export Data</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.button
            onClick={handleExportVehicles}
            disabled={loading || vehicles.length === 0}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-secondary disabled:opacity-50"
          >
            Export Vehicles ({vehicles.length})
          </motion.button>

          <motion.button
            onClick={handleExportParts}
            disabled={loading || parts.length === 0}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-secondary disabled:opacity-50"
          >
            Export Parts ({parts.length})
          </motion.button>

          <motion.button
            onClick={handleExportInquiries}
            disabled={loading || inquiries.length === 0}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-secondary disabled:opacity-50"
          >
            Export Inquiries ({inquiries.length})
          </motion.button>

          <motion.button
            onClick={handleExportOrders}
            disabled={loading || orders.length === 0}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-secondary disabled:opacity-50"
          >
            Export Orders ({orders.length})
          </motion.button>
        </div>

        <motion.button
          onClick={handleFullBackup}
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn-primary w-full mt-4 disabled:opacity-50"
        >
          <Database size={18} className="inline-block mr-2" />
          Create Full Backup (JSON)
        </motion.button>
      </div>

      {/* Import Section */}
      <div className="card-luxury p-6">
        <div className="flex items-center gap-3 mb-6">
          <Upload size={24} />
          <h3 className="font-serif text-xl">Import Data</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="label-small block mb-3">Import CSV File</label>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => handleFileUpload(e, 'csv')}
              disabled={loading}
              className="w-full px-4 py-3 border border-border rounded-sm bg-background disabled:opacity-50"
            />
            <p className="text-xs text-foreground-muted mt-2">
              Upload a CSV file exported from this system
            </p>
          </div>

          <div>
            <label className="label-small block mb-3">Restore Full Backup</label>
            <input
              type="file"
              accept=".json"
              onChange={(e) => handleFileUpload(e, 'json')}
              disabled={loading}
              className="w-full px-4 py-3 border border-border rounded-sm bg-background disabled:opacity-50"
            />
            <p className="text-xs text-foreground-muted mt-2">
              Upload a JSON backup file to restore all data
            </p>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="card-luxury p-6 bg-background-soft">
        <h3 className="font-serif text-lg mb-4">Backup Information</h3>
        <ul className="space-y-2 text-sm text-foreground-muted">
          <li>• CSV exports can be opened in Excel or Google Sheets</li>
          <li>• JSON backups contain all data and can be restored later</li>
          <li>• Backups are created with current date in filename</li>
          <li>• Keep regular backups for data safety</li>
          <li>• Imported data will be added to existing records</li>
        </ul>
      </div>
    </div>
  )
}

export default AdminBackup
