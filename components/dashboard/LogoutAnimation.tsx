'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export function LogoutAnimation() {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Start animation shortly after mount to allow CSS transition to catch
    const t1 = setTimeout(() => setIsAnimating(true), 50)
    return () => clearTimeout(t1)
  }, [])

  return (
    <div 
      className={`fixed inset-0 z-[100] bg-gradient-to-br from-blue-900 via-primary to-primary/90 flex items-center justify-center pointer-events-auto transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${isAnimating ? 'translate-y-0' : '-translate-y-full'}`}
    >
       <div className={`transition-opacity duration-700 delay-300 flex flex-col items-center gap-4 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}>
          <Image 
            src="/logo-white.png" 
            alt="Logo" 
            width={120} 
            height={120} 
            className="object-contain drop-shadow-lg" 
            priority 
          />
          <h1 className="text-white font-bold text-2xl font-sans tracking-tight drop-shadow-md">
            Logging out...
          </h1>
       </div>
    </div>
  )
}
