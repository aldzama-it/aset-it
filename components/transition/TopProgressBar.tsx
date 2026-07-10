'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

export function TopProgressBar() {
  const [isAnimating, setIsAnimating] = useState(false)
  const pathname = usePathname()

  // Selesaikan animasi ketika rute berubah (navigasi selesai)
  useEffect(() => {
    setIsAnimating(false)
  }, [pathname])

  // Cegat event klik secara global untuk mendeteksi navigasi link
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a')
      if (!target || !target.href) return
      
      const isExternal = target.host !== window.location.host
      const isSamePage = target.pathname === window.location.pathname && target.search === window.location.search
      const isNewTab = target.target === '_blank'

      // Hanya jalankan progress bar untuk navigasi internal ke halaman lain
      if (!isExternal && !isSamePage && !isNewTab) {
        setIsAnimating(true)
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return (
    <AnimatePresence>
      {isAnimating && (
        <motion.div
          className="fixed top-0 left-0 right-0 h-[3px] bg-primary z-[9999]"
          style={{ originX: 0 }}
          initial={{ scaleX: 0, opacity: 1 }}
          animate={{ scaleX: [0, 0.4, 0.8, 0.95], opacity: 1 }}
          exit={{ scaleX: 1, opacity: 0 }}
          transition={{
            scaleX: { duration: 2, ease: [0.22, 1, 0.36, 1] },
            opacity: { duration: 0.2, delay: 0.1 }
          }}
        />
      )}
    </AnimatePresence>
  )
}
