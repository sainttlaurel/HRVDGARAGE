import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { useState, useEffect } from 'react'

const heroImages = [
  '/image/bg1.jpg',
  '/cars/15.jpg',
  '/cars/20.jpg',
  '/cars/8.jpg',
  '/cars/25.jpg'
]

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image Carousel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImageIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background z-10" />
          <img
            src={heroImages[currentImageIndex]}
            alt="Premium Modified Vehicle"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Image Indicators */}
      <div className="absolute bottom-8 sm:bottom-32 right-4 sm:right-8 z-20 flex flex-col gap-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-1 h-6 sm:h-8 rounded-full transition-all ${
              index === currentImageIndex
                ? 'bg-motorsport-red'
                : 'bg-foreground-faint hover:bg-foreground-muted'
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="container-luxury relative z-20 pt-12 sm:pt-20">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="space-y-4 sm:space-y-6"
          >
            <p className="label-small">Premium Pre-Owned Vehicles & Performance Parts</p>
            
            <h1 className="heading-display text-balance">
              Built Different, Driven Better
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-foreground-muted max-w-2xl">
              Curated collection of modified vehicles and performance parts. 
              From daily drivers to off-road beasts – all verified, all exceptional.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 sm:pt-8">
              <a href="#inventory" className="btn-primary group text-xs sm:text-sm">
                Explore Inventory
                <ArrowUpRight className="inline-block ml-1 sm:ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform sm:hidden" size={16} />
                <ArrowUpRight className="hidden sm:inline-block ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={18} />
              </a>
              <a href="#parts" className="btn-secondary text-xs sm:text-sm">
                Browse Parts
              </a>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-4 sm:bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-px h-12 sm:h-16 bg-gradient-to-b from-transparent via-foreground to-transparent"
          />
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
