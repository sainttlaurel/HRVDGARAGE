import { Wifi, WifiOff, Loader2, AlertTriangle } from 'lucide-react'
import { useSupabaseConnection, type SupabaseConnectionStatus } from '../../lib/supabaseConnection'

const statusConfig: Record<
  SupabaseConnectionStatus,
  { label: string; className: string; Icon: typeof Wifi }
> = {
  checking: {
    label: 'Checking…',
    className: 'text-foreground-muted',
    Icon: Loader2,
  },
  connected: {
    label: 'Supabase connected',
    className: 'text-green-500',
    Icon: Wifi,
  },
  disconnected: {
    label: 'Supabase unreachable',
    className: 'text-amber-500',
    Icon: WifiOff,
  },
  unconfigured: {
    label: 'Supabase not configured',
    className: 'text-red-400',
    Icon: AlertTriangle,
  },
}

const SupabaseConnectionIndicator = () => {
  const { status } = useSupabaseConnection()
  const { label, className, Icon } = statusConfig[status]

  return (
    <div
      className={`flex items-center gap-2 label-small ${className}`}
      title={label}
      role="status"
      aria-live="polite"
    >
      <Icon size={16} className={status === 'checking' ? 'animate-spin' : ''} />
      <span className="hidden lg:inline">{label}</span>
    </div>
  )
}

export default SupabaseConnectionIndicator
