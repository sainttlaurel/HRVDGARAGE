import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Share2, Facebook, Twitter, MessageCircle, Linkedin, Copy, Check } from 'lucide-react'
import { trackEvent } from '../lib/analytics'

interface ShareData { title: string; description: string; url: string }

const shareToFacebook = ({ url }: ShareData) =>
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')

const shareToTwitter = ({ title, url }: ShareData) =>
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank')

const shareToWhatsApp = ({ title, url }: ShareData) =>
  window.open(`https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`, '_blank')

const shareToLinkedIn = ({ url }: ShareData) =>
  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank')

const nativeShare = async (data: ShareData) => {
  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try { await navigator.share({ title: data.title, text: data.description, url: data.url }); return true }
    catch { return false }
  }
  return false
}

const copyShareLink = async (url: string) => {
  try { await navigator.clipboard.writeText(url); return true }
  catch { return false }
}

const trackSocialShare = (platform: string, itemType: string, itemId: string, itemName: string) =>
  trackEvent('social_share', { platform, item_type: itemType, item_id: itemId, item_name: itemName })

interface SocialShareButtonProps {
  title: string
  description: string
  url: string
  itemType: 'vehicle' | 'part'
  itemId: string
  itemName: string
}

const SocialShareButton = ({
  title,
  description,
  url,
  itemType,
  itemId,
  itemName,
}: SocialShareButtonProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const shareData = { title, description, url }

  const handleShare = async (platform: string, shareFn: () => void) => {
    trackSocialShare(platform, itemType, itemId, itemName)
    shareFn()
    setIsOpen(false)
  }

  const handleCopyLink = async () => {
    const success = await copyShareLink(url)
    if (success) {
      setCopied(true)
      trackSocialShare('copy', itemType, itemId, itemName)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleNativeShare = async () => {
    const shared = await nativeShare(shareData)
    if (shared) {
      trackSocialShare('native', itemType, itemId, itemName)
      setIsOpen(false)
    }
  }

  return (
    <div className="relative">
      {/* Share Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-background-soft transition-colors"
        aria-label="Share"
      >
        <Share2 size={18} />
        <span className="text-sm font-medium">Share</span>
      </motion.button>

      {/* Share Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute right-0 mt-2 w-56 bg-background border border-border rounded-lg shadow-lg z-50"
          >
            <div className="p-4 space-y-2">
              {/* Facebook */}
              <motion.button
                onClick={() => handleShare('facebook', () => shareToFacebook(shareData))}
                whileHover={{ x: 4 }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-background-soft transition-colors text-left"
              >
                <Facebook size={20} className="text-[#1877F2]" />
                <span className="text-sm font-medium">Facebook</span>
              </motion.button>

              {/* Twitter */}
              <motion.button
                onClick={() => handleShare('twitter', () => shareToTwitter(shareData))}
                whileHover={{ x: 4 }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-background-soft transition-colors text-left"
              >
                <Twitter size={20} className="text-[#1DA1F2]" />
                <span className="text-sm font-medium">Twitter</span>
              </motion.button>

              {/* WhatsApp */}
              <motion.button
                onClick={() => handleShare('whatsapp', () => shareToWhatsApp(shareData))}
                whileHover={{ x: 4 }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-background-soft transition-colors text-left"
              >
                <MessageCircle size={20} className="text-[#25D366]" />
                <span className="text-sm font-medium">WhatsApp</span>
              </motion.button>

              {/* LinkedIn */}
              <motion.button
                onClick={() => handleShare('linkedin', () => shareToLinkedIn(shareData))}
                whileHover={{ x: 4 }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-background-soft transition-colors text-left"
              >
                <Linkedin size={20} className="text-[#0A66C2]" />
                <span className="text-sm font-medium">LinkedIn</span>
              </motion.button>

              {/* Native Share (if available) */}
              {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
                <>
                  <div className="my-2 border-t border-border" />
                  <motion.button
                    onClick={handleNativeShare}
                    whileHover={{ x: 4 }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-background-soft transition-colors text-left"
                  >
                    <Share2 size={20} />
                    <span className="text-sm font-medium">More Options</span>
                  </motion.button>
                </>
              )}

              {/* Copy Link */}
              <div className="my-2 border-t border-border" />
              <motion.button
                onClick={handleCopyLink}
                whileHover={{ x: 4 }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-background-soft transition-colors text-left"
              >
                {copied ? (
                  <>
                    <Check size={20} className="text-motorsport-red" />
                    <span className="text-sm font-medium">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={20} />
                    <span className="text-sm font-medium">Copy Link</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop to close menu */}
      <AnimatePresence>
        {isOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default SocialShareButton
