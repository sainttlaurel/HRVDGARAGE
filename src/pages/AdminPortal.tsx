import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LogOut, Menu, X, Package, MessageSquare, Settings, Wrench, ShoppingCart, RefreshCw, Activity } from 'lucide-react'
import AdminInquiries from '../components/admin/AdminInquiries'
import AdminInventory from '../components/admin/AdminInventory'
import AdminParts from '../components/admin/AdminParts'
import AdminPartOrders from '../components/admin/AdminPartOrders'
import AdminSettings from '../components/admin/AdminSettings'
import PerformanceMonitor from '../components/PerformanceMonitor'
import Toast from '../components/Toast'
import { supabase } from '../lib/supabase'
import { loadFromSupabaseToLocalStorage, syncLocalStorageToSupabase } from '../lib/syncToSupabase'
import { trackAdminLogin } from '../lib/analytics'

interface AdminPortalProps {
  onNavigateHome: () => void
}

const AdminPortal = ({ onNavigateHome }: AdminPortalProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState<'inquiries' | 'inventory' | 'parts' | 'orders' | 'settings' | 'performance'>('inquiries')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')
  const [showToast, setShowToast] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      if (!supabase) {
        console.log('Supabase not initialized')
        return
      }
      
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.warn('Session check error:', error)
          return
        }
        if (session?.user) {
          console.log('User already logged in:', session.user.email)
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.warn('Auth check error:', error)
      }
    }

    checkAuth()

    // Listen for auth changes
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: {user?: {email?: string}} | null) => {
        console.log('Auth state changed:', _event, session?.user?.email)
        setIsAuthenticated(!!session?.user)
      })

      return () => subscription?.unsubscribe()
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      setToastMessage('Please enter both email and password.')
      setToastType('error')
      setShowToast(true)
      return
    }

    if (!supabase) {
      setToastMessage('Supabase not configured. Check your environment variables (VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY).')
      setToastType('error')
      setShowToast(true)
      console.error('Supabase client is null. Environment variables may not be loaded.')
      return
    }

    setIsLoading(true)
    try {
      console.log('Attempting login with email:', email)
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      })

      if (error) {
        console.error('Login error:', error.message)
        setToastMessage(error.message || 'Invalid email or password.')
        setToastType('error')
        setShowToast(true)
      } else {
        console.log('Login successful:', data.user?.email)
        // Track admin login
        if (data.user?.id) {
          trackAdminLogin(true)
        }
        setEmail('')
        setPassword('')
        setToastMessage('Login successful!')
        setToastType('success')
        setShowToast(true)
      }
    } catch (error) {
      console.error('Login exception:', error)
      setToastMessage('An error occurred during login.')
      setToastType('error')
      setShowToast(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    if (!supabase) return

    try {
      await supabase.auth.signOut()
      setEmail('')
      setPassword('')
      setToastMessage('Logged out successfully')
      setToastType('success')
      setShowToast(true)
      onNavigateHome()
    } catch (error) {
      console.error('Logout error:', error)
      setToastMessage('Error logging out')
      setToastType('error')
      setShowToast(true)
    }
  }

  const handleSync = async () => {
    setSyncing(true)
    try {
      await loadFromSupabaseToLocalStorage()
      await syncLocalStorageToSupabase()
      setToastMessage('Data synchronized successfully')
      setToastType('success')
      setShowToast(true)
    } catch (error) {
      setToastMessage('Synchronization failed. Please try again.')
      setToastType('error')
      setShowToast(true)
      console.error('Sync error:', error)
    } finally {
      setSyncing(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="grain" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md card-luxury p-8 relative z-10"
        >
          <h1 className="font-serif text-4xl mb-2">Admin Portal</h1>
          <p className="text-foreground-muted mb-8">Sign in with your Supabase account</p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="label-small block mb-3">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-background border border-border px-4 py-3 focus:outline-none focus:border-foreground transition-colors"
                placeholder="admin@sacredgarage.com"
                required
              />
            </div>

            <div>
              <label className="label-small block mb-3">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background border border-border px-4 py-3 focus:outline-none focus:border-foreground transition-colors"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full text-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <button
            onClick={onNavigateHome}
            className="w-full mt-4 text-xs opacity-60 hover:opacity-100 transition-opacity"
          >
            ← Back to Website
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="grain" />

      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-40 backdrop-blur-xl bg-background/80 border-b border-border"
      >
        <div className="container-luxury flex items-center justify-between h-20">
          <h1 className="font-serif text-2xl">HRVD Admin</h1>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={handleSync}
              disabled={syncing}
              className="flex items-center gap-2 label-small opacity-60 hover:opacity-100 transition-opacity disabled:opacity-30"
              title="Sync data with Supabase"
            >
              <RefreshCw size={18} className={syncing ? 'animate-spin' : ''} />
              {syncing ? 'Syncing...' : 'Sync'}
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`flex items-center gap-2 label-small transition-opacity ${
                activeTab === 'inquiries' ? 'opacity-100' : 'opacity-60 hover:opacity-100'
              }`}
            >
              <MessageSquare size={18} />
              Inquiries
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`flex items-center gap-2 label-small transition-opacity ${
                activeTab === 'inventory' ? 'opacity-100' : 'opacity-60 hover:opacity-100'
              }`}
            >
              <Package size={18} />
              Vehicles
            </button>
            <button
              onClick={() => setActiveTab('parts')}
              className={`flex items-center gap-2 label-small transition-opacity ${
                activeTab === 'parts' ? 'opacity-100' : 'opacity-60 hover:opacity-100'
              }`}
            >
              <Wrench size={18} />
              Parts
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 label-small transition-opacity ${
                activeTab === 'orders' ? 'opacity-100' : 'opacity-60 hover:opacity-100'
              }`}
            >
              <ShoppingCart size={18} />
              Orders
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 label-small transition-opacity ${
                activeTab === 'settings' ? 'opacity-100' : 'opacity-60 hover:opacity-100'
              }`}
            >
              <Settings size={18} />
              Settings
            </button>

            <button
              onClick={() => setActiveTab('performance')}
              className={`flex items-center gap-2 label-small transition-opacity ${
                activeTab === 'performance' ? 'opacity-100' : 'opacity-60 hover:opacity-100'
              }`}
            >
              <Activity size={18} />
              Performance
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 label-small opacity-60 hover:opacity-100 transition-opacity"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden border-t border-border bg-background/95 backdrop-blur-sm"
          >
            <div className="container-luxury py-4 space-y-4">
              <button
                onClick={handleSync}
                disabled={syncing}
                className="block w-full text-left label-small opacity-60 hover:opacity-100 disabled:opacity-30"
              >
                {syncing ? '🔄 Syncing...' : '🔄 Sync Data'}
              </button>
              <button
                onClick={() => {
                  setActiveTab('inquiries')
                  setMobileMenuOpen(false)
                }}
                className="block w-full text-left label-small opacity-60 hover:opacity-100"
              >
                Inquiries
              </button>
              <button
                onClick={() => {
                  setActiveTab('inventory')
                  setMobileMenuOpen(false)
                }}
                className="block w-full text-left label-small opacity-60 hover:opacity-100"
              >
                Vehicles
              </button>
              <button
                onClick={() => {
                  setActiveTab('parts')
                  setMobileMenuOpen(false)
                }}
                className="block w-full text-left label-small opacity-60 hover:opacity-100"
              >
                Parts
              </button>
              <button
                onClick={() => {
                  setActiveTab('orders')
                  setMobileMenuOpen(false)
                }}
                className="block w-full text-left label-small opacity-60 hover:opacity-100"
              >
                Orders
              </button>
              <button
                onClick={() => {
                  setActiveTab('settings')
                  setMobileMenuOpen(false)
                }}
                className="block w-full text-left label-small opacity-60 hover:opacity-100"
              >
                Settings
              </button>
              <button
                onClick={() => {
                  setActiveTab('performance')
                  setMobileMenuOpen(false)
                }}
                className="block w-full text-left label-small opacity-60 hover:opacity-100"
              >
                Performance
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left label-small opacity-60 hover:opacity-100"
              >
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </motion.header>

      {/* Main Content */}
      <main className="pt-24 pb-12 relative z-10">
        <div className="container-luxury">
          {activeTab === 'inquiries' && <AdminInquiries />}
          {activeTab === 'inventory' && <AdminInventory />}
          {activeTab === 'parts' && <AdminParts />}
          {activeTab === 'orders' && <AdminPartOrders />}
          {activeTab === 'settings' && <AdminSettings />}
          {activeTab === 'performance' && <PerformanceMonitor />}
        </div>
      </main>

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        type={toastType}
        isOpen={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  )
}

export default AdminPortal
