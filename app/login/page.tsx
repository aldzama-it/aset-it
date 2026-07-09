'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence } from 'framer-motion'
import { LoginForm } from '@/components/login/LoginForm'
import { SplashScreen } from '@/components/login/SplashScreen'

export default function LoginPage() {
  const [showSplash, setShowSplash] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // We don't need the session logic here anymore because the splash screen
    // is now triggered on successful login explicitly.
    sessionStorage.removeItem('hasSeenCurtain')
  }, [])

  const handleLoginSuccess = () => {
    setShowSplash(true)
  }

  const handleSplashComplete = () => {
    router.push('/dashboard')
  }

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <SplashScreen onComplete={handleSplashComplete} />
        )}
      </AnimatePresence>

      <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4 sm:p-8">
        <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
          
          {/* Left Side - Decorative */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-primary/80 via-primary to-blue-900">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent opacity-50 mix-blend-overlay"></div>
            <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-blue-400/20 via-transparent to-transparent opacity-60 mix-blend-overlay"></div>
            
            <div className="relative z-10">
              <div className="text-white">
                <Image src="/logo-white.png" alt="Logo" width={160} height={48} className="h-12 w-auto object-contain" priority />
              </div>
            </div>
            
            <div className="relative z-10 mt-20 md:mt-0 text-white">
              <p className="text-white/80 font-medium mb-3 text-sm md:text-base">Inventaris IT</p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
                Manage your IT assets for clarity and productivity
              </h1>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
            <LoginForm onSuccess={handleLoginSuccess} />
          </div>
        </div>
      </div>
    </>
  )
}
