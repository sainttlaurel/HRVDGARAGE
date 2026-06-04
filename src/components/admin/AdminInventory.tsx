import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Edit2, Trash2, Plus, Save, X, Image as ImageIcon, ChevronLeft, Download, Search } from 'lucide-react'
import { vehicleService, Vehicle } from '../../lib/supabase'
import {
  filterVehicles,
  exportVehicles,
  getVehicleStats,
} from '../../lib/adminUtils'

const AdminInventory = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Vehicle>>({})
  const [loading, setLoading] = useState(true)
  const [showPhotoManager, setShowPhotoManager] = useState(false)
  const [newPhotoUrl, setNewPhotoUrl] = useState('')
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterAvailable, setFilterAvailable] = useState<boolean | undefined>(undefined)
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'price'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [stats, setStats] = useState({ total: 0, available: 0, sold: 0 })

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    loadVehicles()
  }, [])

  const loadVehicles = async () => {
    try {
      const data = await vehicleService.getAll()
      setVehicles(data)
      setStats(getVehicleStats(data))
    } catch (error) {
      console.error('Error loading vehicles:', error)
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (vehicle: Vehicle) => {
    setEditingId(vehicle.id)
    setEditForm(vehicle)
    setShowPhotoManager(false)
  }

  const saveEdit = async () => {
    if (editingId && editForm.id) {
      try {
        await vehicleService.update(editingId, editForm)
        const updated = vehicles.map(v =>
          v.id === editingId ? { ...v, ...editForm } : v
        )
        setVehicles(updated)
        setEditingId(null)
        setEditForm({})
        setShowPhotoManager(false)
      } catch (error) {
        console.error('Error saving vehicle:', error)
      }
    }
  }

  const deleteVehicle = async (id: string) => {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await vehicleService.delete(id)
        const updated = vehicles.filter(v => v.id !== id)
        setVehicles(updated)
      } catch (error) {
        console.error('Error deleting vehicle:', error)
      }
    }
  }

  const toggleAvailability = async (id: string) => {
    try {
      const vehicle = vehicles.find(v => v.id === id)
      if (vehicle) {
        await vehicleService.update(id, { available: !vehicle.available })
        const updated = vehicles.map(v =>
          v.id === id ? { ...v, available: !v.available } : v
        )
        setVehicles(updated)
      }
    } catch (error) {
      console.error('Error toggling availability:', error)
    }
  }

  const addPhoto = () => {
    if (newPhotoUrl.trim() && editForm.images) {
      const updatedImages = [...editForm.images, newPhotoUrl.trim()]
      setEditForm({ ...editForm, images: updatedImages })
      setNewPhotoUrl('')
    }
  }

  const removePhoto = (index: number) => {
    if (editForm.images) {
      const updatedImages = editForm.images.filter((_, i) => i !== index)
      setEditForm({ ...editForm, images: updatedImages })
    }
  }

  const setMainPhoto = (index: number) => {
    if (editForm.images) {
      const mainPhoto = editForm.images[index]
      const updatedImages = [mainPhoto, ...editForm.images.filter((_, i) => i !== index)]
      setEditForm({ ...editForm, images: updatedImages, image: mainPhoto })
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading inventory...</div>
  }

  // Calculate filtered vehicles
  const filteredVehicles = filterVehicles(vehicles, {
    searchTerm,
    available: filterAvailable,
    sortBy,
    sortOrder,
  })

  // Edit mode - full screen on mobile
  if (editingId) {
    return (
      <div className={isMobile ? 'fixed inset-0 bg-background z-50 overflow-y-auto' : ''}>
        <div className={isMobile ? 'p-4' : ''}>
          <div className={isMobile ? 'space-y-4' : 'card-luxury p-6 space-y-4 max-h-[90vh] overflow-y-auto'}>
            <div className="flex items-center justify-between mb-4">
              {isMobile && (
                <button
                  onClick={() => setEditingId(null)}
                  className="flex items-center gap-2 text-sm opacity-60 hover:opacity-100"
                >
                  <ChevronLeft size={18} />
                  Back
                </button>
              )}
              <h3 className="font-serif text-xl">Edit Vehicle</h3>
              {!isMobile && (
                <button
                  onClick={() => setEditingId(null)}
                  className="p-1 hover:bg-foreground-faint/20 rounded"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Form Fields - Stack on mobile */}
            <div className={isMobile ? 'space-y-4' : 'grid grid-cols-2 gap-4'}>
              <div>
                <label className="label-small block mb-2">Brand</label>
                <input
                  type="text"
                  value={editForm.brand || ''}
                  onChange={(e) => setEditForm({ ...editForm, brand: e.target.value })}
                  className="w-full bg-background border border-border px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="label-small block mb-2">Model</label>
                <input
                  type="text"
                  value={editForm.model || ''}
                  onChange={(e) => setEditForm({ ...editForm, model: e.target.value })}
                  className="w-full bg-background border border-border px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className={isMobile ? 'space-y-4' : 'grid grid-cols-2 gap-4'}>
              <div>
                <label className="label-small block mb-2">Year</label>
                <input
                  type="number"
                  value={editForm.year || ''}
                  onChange={(e) => setEditForm({ ...editForm, year: parseInt(e.target.value) })}
                  className="w-full bg-background border border-border px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="label-small block mb-2">Price</label>
                <input
                  type="text"
                  value={editForm.price || ''}
                  onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                  className="w-full bg-background border border-border px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="label-small block mb-2">Description</label>
              <textarea
                value={editForm.description || ''}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="w-full bg-background border border-border px-3 py-2 text-sm resize-none"
                rows={3}
              />
            </div>

            {/* Photo Manager Section - Simplified for mobile */}
            <div className="border-t border-border pt-4">
              <button
                onClick={() => setShowPhotoManager(!showPhotoManager)}
                className="flex items-center gap-2 text-sm font-medium mb-4 hover:opacity-80 transition-opacity w-full"
              >
                <ImageIcon size={18} />
                {showPhotoManager ? 'Hide' : 'Manage'} Photos ({editForm.images?.length || 0})
              </button>

              {showPhotoManager && (
                <div className="space-y-4 bg-background/50 p-4 rounded-sm">
                  <div className="space-y-2">
                    <label className="label-small block">Add Photo URL</label>
                    <div className={isMobile ? 'space-y-2' : 'flex gap-2'}>
                      <input
                        type="text"
                        value={newPhotoUrl}
                        onChange={(e) => setNewPhotoUrl(e.target.value)}
                        placeholder="https://example.com/photo.jpg"
                        className={`${isMobile ? 'w-full' : 'flex-1'} bg-background border border-border px-3 py-2 text-sm`}
                        onKeyPress={(e) => e.key === 'Enter' && addPhoto()}
                      />
                      <button
                        onClick={addPhoto}
                        className={`${isMobile ? 'w-full' : ''} px-3 py-2 bg-green-500/20 text-green-400 rounded-sm hover:bg-green-500/30 text-sm`}
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="label-small block">Photos ({editForm.images?.length || 0})</label>
                    {editForm.images && editForm.images.length > 0 ? (
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {editForm.images.map((photo, idx) => (
                          <div
                            key={idx}
                            className={`flex items-center gap-2 p-2 rounded-sm border transition-all ${
                              idx === 0
                                ? 'border-motorsport-red/50 bg-motorsport-red/10'
                                : 'border-border bg-background'
                            }`}
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-xs truncate">{photo}</p>
                              {idx === 0 && <p className="text-xs text-motorsport-red">Main Photo</p>}
                            </div>

                            <div className={isMobile ? 'flex gap-1 flex-wrap justify-end' : 'flex gap-1 flex-shrink-0'}>
                              {idx !== 0 && (
                                <button
                                  onClick={() => setMainPhoto(idx)}
                                  className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30"
                                  title="Set as main"
                                >
                                  Main
                                </button>
                              )}
                              <button
                                onClick={() => removePhoto(idx)}
                                className="p-1 hover:bg-motorsport-red/20 text-motorsport-red rounded text-xs"
                                title="Remove"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-foreground-muted">No photos added yet</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4 border-t border-border">
              <button
                onClick={saveEdit}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-sm hover:bg-green-500/30"
              >
                <Save size={18} />
                {isMobile ? 'Save' : 'Save Changes'}
              </button>
              <button
                onClick={() => setEditingId(null)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-foreground-faint/20 text-foreground-muted rounded-sm hover:bg-foreground-faint/30"
              >
                <X size={18} />
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-6">
        <h2 className="heading-section">Inventory Management</h2>
        <div className="flex gap-2">
          <button
            onClick={() => exportVehicles(filteredVehicles)}
            className="flex items-center gap-2 px-3 py-2 bg-green-500/20 text-green-400 rounded-sm hover:bg-green-500/30 text-sm"
            title="Export to CSV"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button className="btn-secondary flex items-center gap-2">
            <Plus size={18} />
            <span className="hidden sm:inline">Add Vehicle</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="p-2 bg-background/50 rounded-sm text-center">
          <p className="text-xs text-foreground-muted">Total</p>
          <p className="text-lg font-semibold">{stats.total}</p>
        </div>
        <div className="p-2 bg-green-500/10 rounded-sm text-center">
          <p className="text-xs text-green-400">Available</p>
          <p className="text-lg font-semibold text-green-400">{stats.available}</p>
        </div>
        <div className="p-2 bg-motorsport-red/10 rounded-sm text-center">
          <p className="text-xs text-motorsport-red">Sold</p>
          <p className="text-lg font-semibold text-motorsport-red">{stats.sold}</p>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="space-y-3 mb-4 p-4 bg-background/50 rounded-sm">
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-3 text-foreground-muted" />
          <input
            type="text"
            placeholder="Search by brand, model, location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-background border border-border px-3 py-2 pl-9 text-sm rounded-sm focus:outline-none focus:border-foreground"
          />
        </div>

        {/* Sort Controls */}
        <div className={isMobile ? 'space-y-2' : 'flex gap-2'}>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'name' | 'price')}
            className="flex-1 bg-background border border-border px-3 py-2 text-sm rounded-sm focus:outline-none focus:border-foreground"
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
            className="flex-1 bg-background border border-border px-3 py-2 text-sm rounded-sm focus:outline-none focus:border-foreground"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-1 flex-wrap mb-4">
        <button
          onClick={() => setFilterAvailable(undefined)}
          className={`px-2 sm:px-4 py-2 rounded-sm text-xs sm:text-sm uppercase tracking-luxury transition-all ${
            filterAvailable === undefined
              ? 'bg-foreground text-background'
              : 'bg-card border border-border hover:border-foreground'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilterAvailable(true)}
          className={`px-2 sm:px-4 py-2 rounded-sm text-xs sm:text-sm uppercase tracking-luxury transition-all ${
            filterAvailable === true
              ? 'bg-foreground text-background'
              : 'bg-card border border-border hover:border-foreground'
          }`}
        >
          Available
        </button>
        <button
          onClick={() => setFilterAvailable(false)}
          className={`px-2 sm:px-4 py-2 rounded-sm text-xs sm:text-sm uppercase tracking-luxury transition-all ${
            filterAvailable === false
              ? 'bg-foreground text-background'
              : 'bg-card border border-border hover:border-foreground'
          }`}
        >
          Sold
        </button>
      </div>

      {/* Responsive Grid - 1 col on mobile, 2 on tablet, 3 on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredVehicles.length === 0 ? (
          <div className="col-span-full text-center py-12 text-foreground-muted">
            No vehicles found
          </div>
        ) : (
          filteredVehicles.map((vehicle, index) => (
          <motion.div
            key={vehicle.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="card-luxury overflow-hidden flex flex-col"
          >
            {/* Image */}
            <div className="relative aspect-[16/10] overflow-hidden">
              <img
                src={vehicle.image}
                alt={`${vehicle.brand} ${vehicle.model}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex gap-2 flex-wrap justify-end">
                <span className={`px-2 sm:px-3 py-1 rounded-sm text-xs font-medium ${
                  vehicle.available
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-motorsport-red/20 text-motorsport-red'
                }`}>
                  {vehicle.available ? 'Available' : 'Sold'}
                </span>
                <span className="px-2 sm:px-3 py-1 rounded-sm text-xs font-medium bg-blue-500/20 text-blue-400">
                  {vehicle.images?.length || 0} 📷
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 space-y-4 flex-1 flex flex-col">
              <div>
                <h3 className="font-serif text-lg sm:text-xl">
                  {vehicle.brand} {vehicle.model}
                </h3>
                <p className="text-xs sm:text-sm text-foreground-muted">
                  {vehicle.year} • {vehicle.price}
                </p>
              </div>

              <p className="text-xs sm:text-sm line-clamp-2 flex-1">{vehicle.description}</p>

              {/* Action Buttons - Stack on mobile */}
              <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-border">
                <button
                  onClick={() => startEdit(vehicle)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-blue-500/20 text-blue-400 rounded-sm hover:bg-blue-500/30 text-sm"
                >
                  <Edit2 size={16} />
                  <span className="hidden sm:inline">Edit</span>
                </button>
                <button
                  onClick={() => toggleAvailability(vehicle.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-foreground-faint/20 text-foreground-muted rounded-sm hover:bg-foreground-faint/30 text-sm"
                >
                  {vehicle.available ? '✓ Sold' : '✓ Available'}
                </button>
                <button
                  onClick={() => deleteVehicle(vehicle.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-motorsport-red/20 text-motorsport-red rounded-sm hover:bg-motorsport-red/30 text-sm"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))
        )}
      </div>
    </div>
  )
}

export default AdminInventory
