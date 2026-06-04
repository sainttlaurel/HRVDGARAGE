import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Edit2, Trash2, Plus, Save, X, Download, Search } from 'lucide-react'
import { partsService, Part } from '../../lib/supabase'
import {
  filterParts,
  exportParts,
  getPartStats,
} from '../../lib/adminUtils'
import { dispatchDataChange } from '../../lib/dataEvents'

const AdminParts = () => {
  const [parts, setParts] = useState<Part[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Part>>({})
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterAvailable, setFilterAvailable] = useState<boolean | undefined>(undefined)
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'price'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [stats, setStats] = useState({ total: 0, available: 0, sold: 0 })
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [newPart, setNewPart] = useState<Partial<Part>>({
    image: '',
    category: '',
    name: '',
    brand: '',
    price: '',
    condition: 'Brand New',
    description: '',
    available: true
  })

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    loadParts()
  }, [])

  const loadParts = async () => {
    try {
      const data = await partsService.getAll()
      setParts(data)
      setStats(getPartStats(data))
    } catch (error) {
      console.error('Error loading parts:', error)
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (part: Part) => {
    setEditingId(part.id)
    setEditForm(part)
  }

  const saveEdit = async () => {
    if (editingId && editForm.id) {
      try {
        await partsService.update(editingId, editForm)
        const updated = parts.map(p =>
          p.id === editingId ? { ...p, ...editForm } : p
        )
        setParts(updated)
        setEditingId(null)
        setEditForm({})
        dispatchDataChange('parts', 'update')
      } catch (error) {
        console.error('Error saving part:', error)
      }
    }
  }

  const deletePart = async (id: string) => {
    if (confirm('Are you sure you want to delete this part?')) {
      try {
        await partsService.delete(id)
        const updated = parts.filter(p => p.id !== id)
        setParts(updated)
        dispatchDataChange('parts', 'delete')
      } catch (error) {
        console.error('Error deleting part:', error)
      }
    }
  }

  const toggleAvailability = async (id: string) => {
    try {
      const part = parts.find(p => p.id === id)
      if (part) {
        await partsService.update(id, { available: !part.available })
        const updated = parts.map(p =>
          p.id === id ? { ...p, available: !p.available } : p
        )
        setParts(updated)
        dispatchDataChange('parts', 'update')
      }
    } catch (error) {
      console.error('Error toggling availability:', error)
    }
  }

  const addNewPart = async () => {
    if (!newPart.name || !newPart.category || !newPart.price) {
      alert('Please fill in all required fields')
      return
    }

    try {
      const created = await partsService.create({
        image: newPart.image || '/image/parts/sample-part.jpg',
        category: newPart.category || '',
        name: newPart.name || '',
        brand: newPart.brand || '',
        price: newPart.price || '',
        condition: newPart.condition || 'Brand New',
        description: newPart.description || '',
        available: newPart.available !== false
      })
      setParts([created, ...parts])
      setNewPart({
        image: '',
        category: '',
        name: '',
        brand: '',
        price: '',
        condition: 'Brand New',
        description: '',
        available: true
      })
      setShowAddForm(false)
      dispatchDataChange('parts', 'create')
    } catch (error) {
      console.error('Error adding part:', error)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading parts...</div>
  }

  // Calculate filtered parts
  const filteredParts = filterParts(parts, {
    searchTerm,
    available: filterAvailable,
    sortBy,
    sortOrder,
  })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-6">
        <h2 className="heading-section">Parts Inventory</h2>
        <div className="flex gap-2">
          <button
            onClick={() => exportParts(filteredParts)}
            className="flex items-center gap-2 px-3 py-2 bg-green-500/20 text-green-400 rounded-sm hover:bg-green-500/30 text-sm"
            title="Export to CSV"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn-secondary flex items-center gap-2"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Add Part</span>
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
            placeholder="Search by name, brand, category..."
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

      {/* Add New Part Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-luxury p-6 space-y-4"
        >
          <h3 className="font-serif text-xl mb-4">Add New Part</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-small block mb-2">Part Name *</label>
              <input
                type="text"
                value={newPart.name || ''}
                onChange={(e) => setNewPart({ ...newPart, name: e.target.value })}
                className="w-full bg-background border border-border px-3 py-2 text-sm"
                placeholder="e.g., Coilover Kit"
              />
            </div>

            <div>
              <label className="label-small block mb-2">Brand</label>
              <input
                type="text"
                value={newPart.brand || ''}
                onChange={(e) => setNewPart({ ...newPart, brand: e.target.value })}
                className="w-full bg-background border border-border px-3 py-2 text-sm"
                placeholder="e.g., BC Racing"
              />
            </div>

            <div>
              <label className="label-small block mb-2">Category *</label>
              <select
                value={newPart.category || ''}
                onChange={(e) => setNewPart({ ...newPart, category: e.target.value })}
                className="w-full bg-background border border-border px-3 py-2 text-sm"
              >
                <option value="">Select Category</option>
                <option value="Suspension">Suspension</option>
                <option value="Exhaust">Exhaust</option>
                <option value="Wheels">Wheels</option>
                <option value="Engine">Engine</option>
                <option value="Interior">Interior</option>
                <option value="Electronics">Electronics</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="label-small block mb-2">Price *</label>
              <input
                type="text"
                value={newPart.price || ''}
                onChange={(e) => setNewPart({ ...newPart, price: e.target.value })}
                className="w-full bg-background border border-border px-3 py-2 text-sm"
                placeholder="₱45,000"
              />
            </div>

            <div>
              <label className="label-small block mb-2">Condition</label>
              <select
                value={newPart.condition || 'Brand New'}
                onChange={(e) => setNewPart({ ...newPart, condition: e.target.value })}
                className="w-full bg-background border border-border px-3 py-2 text-sm"
              >
                <option value="Brand New">Brand New</option>
                <option value="Used - Excellent">Used - Excellent</option>
                <option value="Used - Good">Used - Good</option>
                <option value="Used - Fair">Used - Fair</option>
              </select>
            </div>

            <div>
              <label className="label-small block mb-2">Image URL</label>
              <input
                type="text"
                value={newPart.image || ''}
                onChange={(e) => setNewPart({ ...newPart, image: e.target.value })}
                className="w-full bg-background border border-border px-3 py-2 text-sm"
                placeholder="/image/parts/sample-part.jpg"
              />
            </div>
          </div>

          <div>
            <label className="label-small block mb-2">Description</label>
            <textarea
              value={newPart.description || ''}
              onChange={(e) => setNewPart({ ...newPart, description: e.target.value })}
              className="w-full bg-background border border-border px-3 py-2 text-sm resize-none"
              rows={3}
              placeholder="Part description..."
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={addNewPart}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-sm hover:bg-green-500/30"
            >
              <Save size={18} />
              Add Part
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-foreground-faint/20 text-foreground-muted rounded-sm hover:bg-foreground-faint/30"
            >
              <X size={18} />
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Parts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredParts.length === 0 ? (
          <div className="col-span-full text-center py-12 text-foreground-muted">
            No parts found
          </div>
        ) : (
          filteredParts.map((part, index) => (
          <motion.div
            key={part.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="card-luxury overflow-hidden"
          >
            {editingId === part.id ? (
              // Edit Mode
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-small block mb-2">Name</label>
                    <input
                      type="text"
                      value={editForm.name || ''}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full bg-background border border-border px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="label-small block mb-2">Brand</label>
                    <input
                      type="text"
                      value={editForm.brand || ''}
                      onChange={(e) => setEditForm({ ...editForm, brand: e.target.value })}
                      className="w-full bg-background border border-border px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-small block mb-2">Category</label>
                    <select
                      value={editForm.category || ''}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      className="w-full bg-background border border-border px-3 py-2 text-sm"
                    >
                      <option value="Suspension">Suspension</option>
                      <option value="Exhaust">Exhaust</option>
                      <option value="Wheels">Wheels</option>
                      <option value="Engine">Engine</option>
                      <option value="Interior">Interior</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Other">Other</option>
                    </select>
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
                  <label className="label-small block mb-2">Condition</label>
                  <select
                    value={editForm.condition || ''}
                    onChange={(e) => setEditForm({ ...editForm, condition: e.target.value })}
                    className="w-full bg-background border border-border px-3 py-2 text-sm"
                  >
                    <option value="Brand New">Brand New</option>
                    <option value="Used - Excellent">Used - Excellent</option>
                    <option value="Used - Good">Used - Good</option>
                    <option value="Used - Fair">Used - Fair</option>
                  </select>
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

                <div className="flex gap-2">
                  <button
                    onClick={saveEdit}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-sm hover:bg-green-500/30"
                  >
                    <Save size={18} />
                    Save
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
            ) : (
              // View Mode
              <>
                <div className="relative aspect-[16/10] overflow-hidden bg-background">
                  <img
                    src={part.image}
                    alt={part.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/image/parts/sample-part.jpg'
                    }}
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <span className={`px-3 py-1 rounded-sm text-xs font-medium ${
                      part.available
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-motorsport-red/20 text-motorsport-red'
                    }`}>
                      {part.available ? 'Available' : 'Sold'}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-serif text-xl">
                      {part.name}
                    </h3>
                    <p className="text-sm text-foreground-muted">
                      {part.brand} • {part.category}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-lg font-medium">{part.price}</p>
                    <span className="text-xs px-2 py-1 bg-foreground-faint/20 text-foreground-muted rounded-sm">
                      {part.condition}
                    </span>
                  </div>

                  <p className="text-sm line-clamp-2">{part.description}</p>

                  <div className="flex gap-2 pt-4 border-t border-border">
                    <button
                      onClick={() => startEdit(part)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-sm hover:bg-blue-500/30"
                    >
                      <Edit2 size={18} />
                      Edit
                    </button>
                    <button
                      onClick={() => toggleAvailability(part.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-foreground-faint/20 text-foreground-muted rounded-sm hover:bg-foreground-faint/30"
                    >
                      {part.available ? 'Mark Sold' : 'Mark Available'}
                    </button>
                    <button
                      onClick={() => deletePart(part.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-motorsport-red/20 text-motorsport-red rounded-sm hover:bg-motorsport-red/30"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        ))
        )}
      </div>

      {parts.length === 0 && (
        <div className="text-center py-12 text-foreground-muted">
          No parts in inventory. Add one to get started!
        </div>
      )}
    </div>
  )
}

export default AdminParts
