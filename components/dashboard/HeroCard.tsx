'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar } from 'lucide-react'

const AnimatedIcon = () => {
  const [frame, setFrame] = useState(1)
  
  useEffect(() => {
    // Ambil frame terakhir dari sessionStorage (default ke 1 jika belum ada)
    const currentFrame = parseInt(sessionStorage.getItem('dashboard-icon-frame') || '1')
    setFrame(currentFrame)
    
    // Siapkan frame berikutnya untuk kunjungan dashboard selanjutnya
    const nextFrame = currentFrame < 4 ? currentFrame + 1 : 1
    sessionStorage.setItem('dashboard-icon-frame', nextFrame.toString())
  }, [])

  return (
    <img 
      src={`/animated-icon/frame-${frame}.png`} 
      alt="Animated Icon" 
      className="w-[350px] h-[350px] object-contain drop-shadow-2xl" 
    />
  )
}

export function HeroCard({ total }: { total: number }) {
  return (
    <Card className="bg-gradient-to-br from-primary/90 via-primary to-blue-900 text-white border-transparent shadow-md overflow-hidden relative mb-6">
      <div className="absolute right-0 top-0 w-48 h-48 bg-white/10 rounded-full blur-2xl translate-x-1/4 -translate-y-1/4 pointer-events-none"></div>
      <CardContent className="p-5 md:p-6 h-full flex flex-col justify-end relative z-10 min-h-[160px]">
        <p className="absolute top-5 left-5 md:top-6 md:left-6 text-white/80 text-sm md:text-base font-medium tracking-wide flex items-center gap-2" suppressHydrationWarning>
          <Calendar className="w-4 h-4" />
          {new Date().toLocaleDateString('id-ID', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
        
        <div className="relative z-10 mt-10 md:mt-12 w-2/3">
          <p className="text-white/90 text-lg md:text-xl font-medium mb-1">Total Aset Terdaftar</p>
          <div className="flex items-baseline gap-2">
            <p className="text-5xl md:text-6xl font-bold font-poppins tracking-tight">{total.toLocaleString()}</p>
            <p className="text-base text-white/80 font-medium">Unit</p>
          </div>
        </div>

        <div className="hidden sm:block pointer-events-none absolute right-[-40px] md:right-[-20px] top-1/2 -translate-y-1/2 z-0 opacity-100">
          <AnimatedIcon />
        </div>
      </CardContent>
    </Card>
  )
}
