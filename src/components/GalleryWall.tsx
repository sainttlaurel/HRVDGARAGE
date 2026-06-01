import { motion } from 'framer-motion'
import { useState } from 'react'
import { X } from 'lucide-react'
import { getWebPUrl } from '../lib/imageUtils'
import { trackGalleryInteraction } from '../lib/analytics'

// All car images from the cars folder
const galleryImages = [
  '/cars/1.jpg', '/cars/2.jpg', '/cars/3.jpg', '/cars/4.jpg', '/cars/5.jpg',
  '/cars/6.jpg', '/cars/7.jpg', '/cars/8.jpg', '/cars/9.jpg', '/cars/10.jpg',
  '/cars/11.jpg', '/cars/12.jpg', '/cars/13.jpg', '/cars/14.jpg', '/cars/15.jpg',
  '/cars/16.jpg', '/cars/17.jpg', '/cars/18.jpg', '/cars/19.jpg', '/cars/20.jpg',
  '/cars/21.jpg', '/cars/22.jpg', '/cars/23.jpg', '/cars/24.jpg', '/cars/25.jpg',
  '/cars/26.jpg', '/cars/27.jpg', '/cars/28.jpg', '/cars/29.jpg', '/cars/30.jpg',
  '/cars/31.jpg', '/cars/32.jpg', '/cars/33.jpg', '/cars/34.jpg', '/cars/35.jpg'
]

const GalleryWall = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [visibleCount, setVisibleCount] = useState(12)

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 12, galleryImages.length))
  }

  const handleImageClick = (image: string, index: number) => {
    // Track gallery interaction
    trackGalleryInteraction('image_click', index)
    setSelectedImage(image)
  }

  return (
    <>
      <section id="gallery" className="py-32 bg-background">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <p className="label-small mb-4">Visual Showcase</p>
            <h2 className="heading-section mb-6">
              Gallery Wall
            </h2>
            <p className="text-lg text-foreground-muted">
              A curated collection of our builds, projects, and inventory. 
              From subtle mods to full transformations – every detail captured.
            </p>
          </motion.div>

          {/* Masonry Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryImages.slice(0, visibleCount).map((image, index) => {
              const webpImage = getWebPUrl(image)
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.02, duration: 0.4 }}
                  className="group relative aspect-square overflow-hidden rounded-sm border border-border cursor-pointer"
                  onClick={() => handleImageClick(image, index)}
                >
                  <picture>
                    <source
                      type="image/webp"
                      srcSet={webpImage}
                    />
                    <img
                      src={image}
                      alt={`Gallery image ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  </picture>
                  <div className="absolute inset-0 bg-background/0 group-hover:bg-background/60 transition-colors duration-300 flex items-center justify-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ opacity: 1, scale: 1 }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <p className="text-sm uppercase tracking-luxury">View</p>
                    </motion.div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Load More Button */}
          {visibleCount < galleryImages.length && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <button onClick={loadMore} className="btn-secondary">
                Load More ({galleryImages.length - visibleCount} remaining)
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center hover:bg-background-soft transition-colors z-10"
          >
            <X size={24} />
          </button>

          <motion.picture
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <source
              type="image/webp"
              srcSet={getWebPUrl(selectedImage)}
            />
            <motion.img
              src={selectedImage}
              alt="Gallery preview"
              className="max-w-full max-h-full object-contain rounded-sm"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.picture>
        </motion.div>
      )}
    </>
  )
}

export default GalleryWall
