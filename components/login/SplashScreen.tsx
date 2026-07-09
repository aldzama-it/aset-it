'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useEffect } from 'react'

interface SplashScreenProps {
  onComplete: () => void
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    // Wait for the splash screen duration (1.5s) then call onComplete
    const timer = setTimeout(() => {
      onComplete()
    }, 1500)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="fixed inset-0 z-[100] bg-gradient-to-br from-primary/95 via-primary to-blue-900 flex items-center justify-center pointer-events-none"
    >
      <div className="flex flex-col items-center justify-center gap-6">
        <motion.div
          initial={{ scale: 0.9, y: 0 }}
          animate={{ 
            scale: 1, 
            y: [-5, 5, -5] 
          }}
          transition={{ 
            scale: { duration: 0.5, ease: 'easeOut' },
            y: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
          }}
        >
          <Image 
            src="/logo-white.png" 
            alt="Logo" 
            width={140} 
            height={140} 
            className="object-contain drop-shadow-2xl" 
            priority 
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
          className="flex flex-col items-center gap-4"
        >
          <h1 className="text-white font-bold text-3xl font-poppins tracking-tight drop-shadow-md">
            Asset IT & System
          </h1>
          
          {/* Minimalist Loading Indicator (3 dots) */}
          <div className="flex items-center justify-center gap-1.5 h-6 mt-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-white/80 rounded-full"
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
