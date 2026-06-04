import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trash2, Eye, Check, ChevronLeft, Download, Search } from 'lucide-react'
import { inquiryService, Inquiry } from '../../lib/supabase'
import {
  filterInquiries,
  exportInquiries,
  getInquiryStats,
} from '../../lib/adminUtils'

const AdminInquiries = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
  const [filter, setFilter] = useState<'all' | 'new' | 'read' | 'responded'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'price'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [stats, setStats] = useState({ total: 0, new: 0, read: 0, responded: 0 })

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    loadInquiries()

    // Listen for storage changes (real-time sync)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'inquiries' && e.newValue) {
        try {
          const updatedInquiries = JSON.parse(e.newValue) as Inquiry[]
          setInquiries(updatedInquiries)
          console.log('✅ Inquiries updated from changes')
        } catch (error) {
          console.error('Error parsing updated inquiries:', error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const loadInquiries = async () => {
    try {
      const data = await inquiryService.getAll()
      setInquiries(data)
      setStats(getInquiryStats(data))
    } catch (error) {
      console.error('Error loading inquiries:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: 'new' | 'read' | 'responded') => {
    try {
      await inquiryService.update(id, { status })
      const updated = inquiries.map(inq =>
        inq.id === id ? { ...inq, status } : inq
      )
      setInquiries(updated)
      if (selectedInquiry?.id === id) {
        setSelectedInquiry({ ...selectedInquiry, status })
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const deleteInquiry = async (id: string) => {
    if (confirm('Are you sure you want to delete this inquiry?')) {
      try {
        await inquiryService.delete(id)
        const updated = inquiries.filter(inq => inq.id !== id)
        setInquiries(updated)
        setSelectedInquiry(null)
      } catch (error) {
        console.error('Error deleting inquiry:', error)
      }
    }
  }

  const filteredInquiries = filterInquiries(inquiries, {
    searchTerm,
    status: filter === 'all' ? undefined : filter,
    sortBy,
    sortOrder,
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-motorsport-red/20 text-motorsport-red'
      case 'read':
        return 'bg-blue-500/20 text-blue-400'
      case 'responded':
        return 'bg-green-500/20 text-green-400'
      default:
        return 'bg-foreground-faint/20 text-foreground-muted'
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading inquiries...</div>
  }

  // Mobile: Show details as full-screen modal
  if (isMobile && selectedInquiry) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed inset-0 bg-background z-50 overflow-y-auto"
      >
        <div className="p-4 space-y-4">
          <button
            onClick={() => setSelectedInquiry(null)}
            className="flex items-center gap-2 text-sm opacity-60 hover:opacity-100 mb-4"
          >
            <ChevronLeft size={18} />
            Back to List
          </button>

          <div className="card-luxury p-4 space-y-4">
            <h3 className="font-serif text-xl">Inquiry Details</h3>

            <div className="space-y-3">
              <div>
                <p className="label-small mb-1">Name</p>
                <p className="text-sm">{selectedInquiry.firstname} {selectedInquiry.lastname}</p>
              </div>

              <div>
                <p className="label-small mb-1">Email</p>
                <a href={`mailto:${selectedInquiry.email}`} className="text-motorsport-red hover:underline text-sm">
                  {selectedInquiry.email}
                </a>
              </div>

              <div>
                <p className="label-small mb-1">Phone</p>
                <a href={`tel:${selectedInquiry.phone}`} className="text-motorsport-red hover:underline text-sm">
                  {selectedInquiry.phone}
                </a>
              </div>

              <div>
                <p className="label-small mb-1">Message</p>
                <p className="text-sm leading-relaxed">{selectedInquiry.message}</p>
              </div>

              <div>
                <p className="label-small mb-1">Status</p>
                <span className={`text-xs px-3 py-1 rounded-sm inline-block ${getStatusColor(selectedInquiry.status)}`}>
                  {selectedInquiry.status}
                </span>
              </div>

              <div>
                <p className="label-small mb-1">Date</p>
                <p className="text-xs text-foreground-muted">
                  {new Date(selectedInquiry.createdat).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Actions - Full width on mobile */}
            <div className="space-y-2 border-t border-border pt-4">
              <button
                onClick={() => updateStatus(selectedInquiry.id, 'read')}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-sm hover:bg-blue-500/30 transition-colors text-sm"
              >
                <Check size={16} />
                Mark as Read
              </button>

              <button
                onClick={() => updateStatus(selectedInquiry.id, 'responded')}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-sm hover:bg-green-500/30 transition-colors text-sm"
              >
                <Check size={16} />
                Mark as Responded
              </button>

              <button
                onClick={() => deleteInquiry(selectedInquiry.id)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-motorsport-red/20 text-motorsport-red rounded-sm hover:bg-motorsport-red/30 transition-colors text-sm"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className={isMobile ? 'space-y-4' : 'grid grid-cols-1 lg:grid-cols-3 gap-8'}>
      {/* Inquiries List */}
      <div className={isMobile ? 'space-y-4' : 'lg:col-span-2 space-y-4'}>
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <h2 className="heading-section">Inquiries</h2>
          <button
            onClick={() => exportInquiries(filteredInquiries)}
            className="flex items-center gap-2 px-3 py-2 bg-green-500/20 text-green-400 rounded-sm hover:bg-green-500/30 text-sm"
            title="Export to CSV"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          <div className="p-2 bg-background/50 rounded-sm text-center">
            <p className="text-xs text-foreground-muted">Total</p>
            <p className="text-lg font-semibold">{stats.total}</p>
          </div>
          <div className="p-2 bg-motorsport-red/10 rounded-sm text-center">
            <p className="text-xs text-motorsport-red">New</p>
            <p className="text-lg font-semibold text-motorsport-red">{stats.new}</p>
          </div>
          <div className="p-2 bg-blue-500/10 rounded-sm text-center">
            <p className="text-xs text-blue-400">Read</p>
            <p className="text-lg font-semibold text-blue-400">{stats.read}</p>
          </div>
          <div className="p-2 bg-green-500/10 rounded-sm text-center">
            <p className="text-xs text-green-400">Responded</p>
            <p className="text-lg font-semibold text-green-400">{stats.responded}</p>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="space-y-3 mb-4 p-4 bg-background/50 rounded-sm">
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-3 text-foreground-muted" />
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-background border border-border px-3 py-2 pl-9 text-sm rounded-sm focus:outline-none focus:border-foreground"
            />
          </div>

          {/* Sort Controls */}
          <div className={isMobile ? 'space-y-2' : 'flex gap-2'}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'name')}
              className="flex-1 bg-background border border-border px-3 py-2 text-sm rounded-sm focus:outline-none focus:border-foreground"
            >
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
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
          {(['all', 'new', 'read', 'responded'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-2 sm:px-4 py-2 rounded-sm text-xs sm:text-sm uppercase tracking-luxury transition-all ${
                filter === status
                  ? 'bg-foreground text-background'
                  : 'bg-card border border-border hover:border-foreground'
              }`}
            >
              {status === 'all' ? 'All' : status}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredInquiries.length === 0 ? (
            <div className="text-center py-12 text-foreground-muted">
              No inquiries found
            </div>
          ) : (
            filteredInquiries.map((inquiry, index) => (
              <motion.div
                key={inquiry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedInquiry(inquiry)}
                className={`p-3 sm:p-4 card-luxury cursor-pointer hover:border-foreground transition-all ${
                  selectedInquiry?.id === inquiry.id ? 'border-foreground' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="font-medium text-sm sm:text-base">
                        {inquiry.firstname} {inquiry.lastname}
                      </h3>
                      <span className={`text-xs px-2 py-1 rounded-sm ${getStatusColor(inquiry.status)}`}>
                        {inquiry.status}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-foreground-muted mb-2 truncate">{inquiry.email}</p>
                    <p className="text-xs sm:text-sm line-clamp-2">{inquiry.message}</p>
                    <p className="text-xs text-foreground-faint mt-2">
                      {new Date(inquiry.createdat).toLocaleDateString()}
                    </p>
                  </div>
                  <Eye size={16} className="opacity-60 flex-shrink-0 mt-1" />
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Inquiry Details - Sidebar on desktop only */}
      {!isMobile && selectedInquiry && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card-luxury p-6 h-fit sticky top-24"
        >
          <h3 className="font-serif text-2xl mb-4">Details</h3>

          <div className="space-y-4 mb-6">
            <div>
              <p className="label-small mb-2">Name</p>
              <p>{selectedInquiry.firstname} {selectedInquiry.lastname}</p>
            </div>

            <div>
              <p className="label-small mb-2">Email</p>
              <a href={`mailto:${selectedInquiry.email}`} className="text-motorsport-red hover:underline">
                {selectedInquiry.email}
              </a>
            </div>

            <div>
              <p className="label-small mb-2">Phone</p>
              <a href={`tel:${selectedInquiry.phone}`} className="text-motorsport-red hover:underline">
                {selectedInquiry.phone}
              </a>
            </div>

            <div>
              <p className="label-small mb-2">Message</p>
              <p className="text-sm leading-relaxed">{selectedInquiry.message}</p>
            </div>

            <div>
              <p className="label-small mb-2">Status</p>
              <span className={`text-xs px-3 py-1 rounded-sm ${getStatusColor(selectedInquiry.status)}`}>
                {selectedInquiry.status}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2 border-t border-border pt-6">
            <button
              onClick={() => updateStatus(selectedInquiry.id, 'read')}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-sm hover:bg-blue-500/30 transition-colors"
            >
              <Check size={18} />
              Mark as Read
            </button>

            <button
              onClick={() => updateStatus(selectedInquiry.id, 'responded')}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-sm hover:bg-green-500/30 transition-colors"
            >
              <Check size={18} />
              Mark as Responded
            </button>

            <button
              onClick={() => deleteInquiry(selectedInquiry.id)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-motorsport-red/20 text-motorsport-red rounded-sm hover:bg-motorsport-red/30 transition-colors"
            >
              <Trash2 size={18} />
              Delete
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default AdminInquiries
