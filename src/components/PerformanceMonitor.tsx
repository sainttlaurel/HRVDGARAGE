import { motion } from 'framer-motion'
import { Activity, Zap, AlertCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getPerformanceSummary, assessCoreWebVital } from '../lib/performanceMonitoring'

interface PerformanceMetrics {
  pageLoadTime: number
  ttfb: number
  fcp: number
  lcp: number
  fid: number | null
  cls: number
  timeOnPage: number
  componentsLoadTime: Record<string, number>
}

interface MemoryUsage {
  jsHeapSizeLimit: number
  totalJSHeapSize: number
  usedJSHeapSize: number
}

interface ResourceTiming {
  name: string
  duration: number
  transferSize: number
  decodedBodySize: number
  size_kb?: number
}

const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [memory, setMemory] = useState<MemoryUsage | null>(null)
  const [slowResources, setSlowResources] = useState<ResourceTiming[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const summary = await getPerformanceSummary()
        setMetrics(summary.metrics as PerformanceMetrics)
        setMemory(summary.memory)
        
        // Transform slowResources to include size_kb
        const transformedResources = (summary.slowResources as any[]).map(r => ({
          ...r,
          size_kb: Math.round(r.decodedBodySize / 1024)
        }))
        setSlowResources(transformedResources)
      } catch (error) {
        console.error('Failed to load performance metrics:', error)
      } finally {
        setLoading(false)
      }
    }

    loadMetrics()

    // Refresh metrics every 10 seconds
    const interval = setInterval(loadMetrics, 10000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-6 h-6 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const getMetricColor = (value: number, thresholds: { good: number; poor: number }) => {
    if (value <= thresholds.good) return 'text-green-400'
    if (value <= thresholds.poor) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="space-y-8">
      {/* Core Web Vitals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2">
          <Zap size={20} className="text-motorsport-red" />
          <h3 className="font-serif text-xl">Core Web Vitals</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* LCP */}
          <div className="card-luxury p-6">
            <div className="space-y-3">
              <p className="label-small">Largest Contentful Paint</p>
              <div className={`text-3xl font-bold ${getMetricColor(metrics?.lcp || 0, { good: 2500, poor: 4000 })}`}>
                {metrics?.lcp || '-'}
                <span className="text-sm ml-2 text-foreground">ms</span>
              </div>
              <p className="text-xs text-foreground-muted">
                Assessment: <span className="text-green-400">{assessCoreWebVital('lcp', metrics?.lcp || 0)}</span>
              </p>
              <div className="text-xs text-foreground-muted pt-2">
                <p>Good: ≤ 2500ms</p>
                <p>Needs Improvement: ≤ 4000ms</p>
              </div>
            </div>
          </div>

          {/* FID */}
          <div className="card-luxury p-6">
            <div className="space-y-3">
              <p className="label-small">First Input Delay</p>
              <div className={`text-3xl font-bold ${getMetricColor(metrics?.fid || 0, { good: 100, poor: 300 })}`}>
                {metrics?.fid !== null && metrics?.fid !== undefined ? metrics.fid : '-'}
                <span className="text-sm ml-2 text-foreground">ms</span>
              </div>
              <p className="text-xs text-foreground-muted">
                Assessment: <span className="text-green-400">{assessCoreWebVital('fid', metrics?.fid || 0)}</span>
              </p>
              <div className="text-xs text-foreground-muted pt-2">
                <p>Good: ≤ 100ms</p>
                <p>Needs Improvement: ≤ 300ms</p>
              </div>
            </div>
          </div>

          {/* CLS */}
          <div className="card-luxury p-6">
            <div className="space-y-3">
              <p className="label-small">Cumulative Layout Shift</p>
              <div className={`text-3xl font-bold ${getMetricColor(metrics?.cls || 0, { good: 0.1, poor: 0.25 })}`}>
                {(metrics?.cls || 0).toFixed(3)}
              </div>
              <p className="text-xs text-foreground-muted">
                Assessment: <span className="text-green-400">{assessCoreWebVital('cls', metrics?.cls || 0)}</span>
              </p>
              <div className="text-xs text-foreground-muted pt-2">
                <p>Good: ≤ 0.1</p>
                <p>Needs Improvement: ≤ 0.25</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Page Load Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2">
          <Activity size={20} className="text-motorsport-red" />
          <h3 className="font-serif text-xl">Page Load Metrics</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card-luxury p-6">
            <p className="label-small mb-2">Time to First Byte (TTFB)</p>
            <p className="text-2xl font-bold">{metrics?.ttfb || 0}ms</p>
            <p className="text-xs text-foreground-muted mt-2">Server response time</p>
          </div>

          <div className="card-luxury p-6">
            <p className="label-small mb-2">First Contentful Paint</p>
            <p className="text-2xl font-bold">{metrics?.fcp || 0}ms</p>
            <p className="text-xs text-foreground-muted mt-2">First paint visible to user</p>
          </div>

          <div className="card-luxury p-6">
            <p className="label-small mb-2">Total Page Load Time</p>
            <p className="text-2xl font-bold">{metrics?.pageLoadTime || 0}ms</p>
            <p className="text-xs text-foreground-muted mt-2">Full page load completion</p>
          </div>

          <div className="card-luxury p-6">
            <p className="label-small mb-2">Time on Current Page</p>
            <p className="text-2xl font-bold">{metrics?.timeOnPage || 0}s</p>
            <p className="text-xs text-foreground-muted mt-2">Duration since page load</p>
          </div>
        </div>
      </motion.div>

      {/* Memory Usage */}
      {memory && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2">
            <AlertCircle size={20} className="text-motorsport-red" />
            <h3 className="font-serif text-xl">Memory Usage</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card-luxury p-6">
              <p className="label-small mb-2">Used Heap Size</p>
              <p className={`text-2xl font-bold ${memory.usedJSHeapSize > 50 ? 'text-yellow-400' : 'text-green-400'}`}>
                {memory.usedJSHeapSize}MB
              </p>
              <div className="mt-2 w-full bg-background rounded h-2">
                <div
                  className={`h-full rounded transition-colors ${memory.usedJSHeapSize > 50 ? 'bg-yellow-400' : 'bg-green-400'}`}
                  style={{
                    width: `${Math.min(100, (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100)}%`
                  }}
                />
              </div>
            </div>

            <div className="card-luxury p-6">
              <p className="label-small mb-2">Total Heap Size</p>
              <p className="text-2xl font-bold">{memory.totalJSHeapSize}MB</p>
              <p className="text-xs text-foreground-muted mt-2">Currently allocated</p>
            </div>

            <div className="card-luxury p-6">
              <p className="label-small mb-2">Heap Size Limit</p>
              <p className="text-2xl font-bold">{memory.jsHeapSizeLimit}MB</p>
              <p className="text-xs text-foreground-muted mt-2">Maximum available</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Component Load Times */}
      {Object.keys(metrics?.componentsLoadTime || {}).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <h3 className="font-serif text-xl">Component Load Times</h3>

          <div className="card-luxury p-6">
            <div className="space-y-3">
              {Object.entries(metrics?.componentsLoadTime || {})
                .sort(([, a], [, b]) => b - a)
                .map(([component, time]) => (
                  <div key={component} className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
                    <p className="text-sm">{component}</p>
                    <p className={`font-bold ${time > 1000 ? 'text-yellow-400' : 'text-green-400'}`}>{time}ms</p>
                  </div>
                ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Slow Resources */}
      {slowResources.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2">
            <AlertCircle size={20} className="text-red-400" />
            <h3 className="font-serif text-xl">Slow Resources (Top 10)</h3>
          </div>

          <div className="card-luxury p-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr>
                  <th className="text-left py-2 px-2">Resource</th>
                  <th className="text-left py-2 px-2">Duration</th>
                  <th className="text-left py-2 px-2">Size</th>
                </tr>
              </thead>
              <tbody>
                {slowResources.map((resource, idx) => (
                  <tr key={idx} className="border-b border-border last:border-b-0 hover:bg-background/50">
                    <td className="py-2 px-2 text-foreground-muted truncate">{resource.name}</td>
                    <td className="py-2 px-2 text-red-400 font-bold">{resource.duration}ms</td>
                    <td className="py-2 px-2 text-foreground-muted">{(resource.size_kb || 0)}KB</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Performance Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card-luxury p-6 bg-background/50"
      >
        <h4 className="font-serif text-lg mb-4">Performance Tips</h4>
        <ul className="space-y-2 text-sm text-foreground-muted">
          <li>✓ LCP (Largest Contentful Paint): Aim for ≤ 2.5s for good user experience</li>
          <li>✓ FID (First Input Delay): Aim for ≤ 100ms to ensure responsive interactions</li>
          <li>✓ CLS (Cumulative Layout Shift): Aim for ≤ 0.1 to prevent visual instability</li>
          <li>✓ TTFB: Optimize server response time for faster perceived load</li>
          <li>✓ FCP: Reduce render-blocking resources for faster visual content</li>
        </ul>
      </motion.div>
    </div>
  )
}

export default PerformanceMonitor
