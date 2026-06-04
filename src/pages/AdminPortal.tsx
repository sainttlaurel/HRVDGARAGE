import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LogOut, Menu, X, Package, MessageSquare, Settings, Wrench, ShoppingCart } from 'lucide-react'
import AdminInquiries from '../components/admin/AdminInquiries'
import AdminInventory from '../components/admin/AdminInventory'
import AdminParts from '../components/admin/AdminParts'
import AdminPartOrders from '../components/admin/AdminPartOrders'
import AdminSettings from '../components/admin/AdminSettings'
import Toast from '../components/Toast'
import { supabase } from '../lib/supabase'
import { trackAdminLogin } from '../lib/analytics'

interface AdminPortalProps {
  onNavigateHome: () => void
}

type AdminTab = 'inquiries' | 'inventory' | 'parts' | 'orders' | 'settings'

const AdminPortal = ({ onNavigateHome }: AdminPortalProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState<AdminTab>('inventory')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')
  const [showToast, setShowToast] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      if (!supabase) return

      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.warn('Session check error:', error)
          return
        }
        if (session?.user) {
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.warn('Auth check error:', error)
      }
    }

    checkAuth()

    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event: string, session: { user?: { email?: string } } | null) => {
          setIsAuthenticated(!!session?.user)
        }
      )
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
      setToastMessage(
        'Supabase not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY on your host.'
      )
      setToastType('error')
      setShowToast(true)
      return
    }

    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (error) {
        setToastMessage(error.message || 'Invalid email or password.')
        setToastType('error')
        setShowToast(true)
      } else {
        if (data.user?.id) {
          trackAdminLogin(true)
        }
        setEmail('')
        setPassword('')
        setToastMessage('Login successful!')
        setToastType('success')
        setShowToast(true)
      }
    } catch {
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
    } catch {
      setToastMessage('Error logging out')
      setToastType('error')
      setShowToast(true)
    }
  }

  const selectTab = (tab: AdminTab) => {
    setActiveTab(tab)
    setMobileMenuOpen(false)
  }

  const navItems: { tab: AdminTab; label: string; icon: typeof Package }[] = [
    { tab: 'inventory', label: 'Vehicles', icon: Package },
    { tab: 'parts', label: 'Parts', icon: Wrench },
    { tab: 'inquiries', label: 'Inquiries', icon: MessageSquare },
    { tab: 'orders', label: 'Orders', icon: ShoppingCart },
    { tab: 'settings', label: 'Settings', icon: Settings },
  ]

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

      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-40 backdrop-blur-xl bg-background/80 border-b border-border"
      >
        <div className="container-luxury flex items-center justify-between h-20">
          <h1 className="font-serif text-2xl">HRVD Admin</h1>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map(({ tab, label, icon: Icon }) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 label-small transition-opacity ${
                  activeTab === tab ? 'opacity-100' : 'opacity-60 hover:opacity-100'
                }`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 label-small opacity-60 hover:opacity-100 transition-opacity"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden border-t border-border bg-background/95 backdrop-blur-sm"
          >
            <div className="container-luxury py-4 space-y-4">
              {navItems.map(({ tab, label }) => (
                <button
                  key={tab}
                  onClick={() => selectTab(tab)}
                  className={`block w-full text-left label-small ${
                    activeTab === tab ? 'opacity-100' : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  {label}
                </button>
              ))}
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

      <main className="pt-24 pb-12 relative z-10">
        <div className="container-luxury">
          {activeTab === 'inquiries' && <AdminInquiries />}
          {activeTab === 'inventory' && <AdminInventory />}
          {activeTab === 'parts' && <AdminParts />}
          {activeTab === 'orders' && <AdminPartOrders />}
          {activeTab === 'settings' && <AdminSettings />}
        </div>
      </main>

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
