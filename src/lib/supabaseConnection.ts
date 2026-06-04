import { useCallback, useEffect, useState } from 'react'
import { isSupabaseAvailable, supabase } from './supabase'

export type SupabaseConnectionStatus =
  | 'checking'
  | 'connected'
  | 'disconnected'
  | 'unconfigured'

/**
 * Ping Supabase with a minimal query to verify connectivity.
 */
export const checkSupabaseConnection = async (): Promise<SupabaseConnectionStatus> => {
  if (!isSupabaseAvailable || !supabase) {
    return 'unconfigured'
  }

  try {
    const { error } = await supabase.from('business_settings').select('id').limit(1)
    return error ? 'disconnected' : 'connected'
  } catch {
    return 'disconnected'
  }
}

export const useSupabaseConnection = (pollIntervalMs = 30_000) => {
  const [status, setStatus] = useState<SupabaseConnectionStatus>('checking')

  const refresh = useCallback(async () => {
    setStatus('checking')
    setStatus(await checkSupabaseConnection())
  }, [])

  useEffect(() => {
    let cancelled = false

    const runCheck = async () => {
      const next = await checkSupabaseConnection()
      if (!cancelled) setStatus(next)
    }

    runCheck()
    const intervalId = window.setInterval(runCheck, pollIntervalMs)

    return () => {
      cancelled = true
      window.clearInterval(intervalId)
    }
  }, [pollIntervalMs])

  return { status, refresh }
}
