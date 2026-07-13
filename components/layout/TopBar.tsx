'use client'

import { usePathname } from 'next/navigation'
import { Bell, UserCircle, Menu, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { logout } from '@/app/login/actions'
import { LogoutAnimation } from '@/components/dashboard/LogoutAnimation'
import { useState, useRef } from 'react'

export function TopBar() {
  const pathname = usePathname()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  
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
    <>
      <header className="h-16 border-b border-border/40 bg-background/60 backdrop-blur-md supports-[backdrop-filter]:bg-background/40 flex items-center px-4 md:px-8 sticky top-0 z-10 shadow-sm transition-all">
        <div className="flex items-center flex-1 gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden text-muted-foreground hover:text-foreground"
            onClick={() => window.dispatchEvent(new CustomEvent('toggle-mobile-sidebar'))}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <h2 className="font-semibold text-lg text-foreground tracking-tight font-poppins">
            {getPageTitle()}
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground">
            <Bell className="w-5 h-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 border-l pl-4 py-1 cursor-pointer hover:opacity-80 transition-opacity">
                <UserCircle className="w-8 h-8 text-muted-foreground" />
                <div className="flex flex-col text-sm text-left">
                  <span className="font-medium text-foreground font-poppins">Admin</span>
                  <span className="text-xs text-muted-foreground">IT Support</span>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem 
                className="text-red-600 cursor-pointer focus:bg-red-50 focus:text-red-700"
                onClick={() => {
                  setIsLoggingOut(true)
                  setTimeout(() => {
                    formRef.current?.requestSubmit()
                  }, 1200)
                }}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Keluar (Logout)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <form action={logout} ref={formRef} className="hidden" />
      {isLoggingOut && <LogoutAnimation />}
    </>
  )
}

