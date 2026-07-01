'use client'

import { usePathname } from 'next/navigation'
import { Bell, UserCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function TopBar() {
  const pathname = usePathname()
  
  const getPageTitle = () => {
    if (pathname === '/dashboard') return 'Dashboard'
    if (pathname === '/network') return 'Jaringan'
    if (pathname === '/printers') return 'Printer'
    if (pathname === '/cctv') return 'CCTV'
    if (pathname === '/laptops') return 'Laptop'
    if (pathname === '/general-inventory') return 'Inventaris Umum'
    if (pathname === '/ht') return 'Handy Talky (HT)'
    if (pathname === '/tablets') return 'Tablet'
    if (pathname === '/cameras') return 'Kamera'
    if (pathname === '/starlinks') return 'Starlink'
    if (pathname === '/dashcams') return 'Dashcam'
    if (pathname === '/history') return 'Riwayat Aset'
    return 'Inventaris Aset IT'
  }

  return (
    <header className="h-16 border-b border-border/40 bg-background/60 backdrop-blur-md supports-[backdrop-filter]:bg-background/40 flex items-center px-8 sticky top-0 z-10 shadow-sm transition-all">
      <h2 className="font-semibold text-lg text-foreground tracking-tight font-poppins flex-1">
        {getPageTitle()}
      </h2>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground">
          <Bell className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-2 border-l pl-4 py-1">
          <UserCircle className="w-8 h-8 text-muted-foreground" />
          <div className="flex flex-col text-sm">
            <span className="font-medium text-foreground font-poppins">Admin</span>
            <span className="text-xs text-muted-foreground">IT Support</span>
          </div>
        </div>
      </div>
    </header>
  )
}
