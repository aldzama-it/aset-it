'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Network, Printer, Camera, Laptop,
  Package, Radio, Tablet, Satellite, Car, History,
  ChevronLeft, Menu, LogOut, Settings, Box
} from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import { logout } from '@/app/login/actions'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

const defaultMenuItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/network', icon: Network, label: 'Jaringan' },
  { href: '/printers', icon: Printer, label: 'Printer' },
  { href: '/cctv', icon: Camera, label: 'CCTV' },
  { href: '/laptops', icon: Laptop, label: 'Laptop' },
  { href: '/general-inventory', icon: Box, label: 'Inventaris Umum' },
  { href: '/ht', icon: Radio, label: 'HT (Handy Talky)' },
  { href: '/tablets', icon: Tablet, label: 'Tablet' },
  { href: '/cameras', icon: Camera, label: 'Kamera' },
  { href: '/starlinks', icon: Satellite, label: 'Starlink' },
  { href: '/dashcams', icon: Car, label: 'Dashcam' },
]

const bottomMenuItems = [
  { divider: true as any },
  { href: '/history', icon: History, label: 'Riwayat Aset' },
  { href: '/settings/categories', icon: Settings, label: 'Pengaturan' },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [dynamicCategories, setDynamicCategories] = useState<any[]>([])

  const fetchCategories = () => {
    fetch('/api/settings/categories')
      .then(r => r.json())
      .then(res => {
        if (res.success) {
          setDynamicCategories(res.data)
        }
      })
      .catch(() => {})
  }

  useEffect(() => {
    fetchCategories()
    window.addEventListener('category-updated', fetchCategories)
    return () => window.removeEventListener('category-updated', fetchCategories)
  }, [])

  const dynamicMenuItems = dynamicCategories.map(cat => {
    const Icon = (LucideIcons as any)[cat.icon || 'Box'] || Box
    return { href: `/assets/${cat.id}`, icon: Icon, label: cat.name }
  })

  const menuItems = [...defaultMenuItems, ...dynamicMenuItems, ...bottomMenuItems]

  return (
    <aside 
      className={cn(
        "bg-[#334585] text-white border-r-0 flex-shrink-0 min-h-screen font-sans transition-all duration-300 ease-in-out relative z-20",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="px-4 font-bold text-xl border-b border-white/10 h-16 flex items-center justify-between overflow-hidden">
        <div className={cn(
          "flex items-center gap-2 transition-all duration-300 whitespace-nowrap",
          isCollapsed ? "opacity-0 w-0 hidden" : "opacity-100 w-auto flex"
        )}>
          <Image src="/logo-white.png" alt="Logo" width={60} height={60} className="object-contain shrink-0" />
          <span className="text-white tracking-tight font-sans text-sm font-semibold leading-tight">
            Asset IT & System
          </span>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn("h-8 w-8 text-white hover:bg-white/10 hover:text-white", isCollapsed ? "mx-auto" : "")} 
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <Menu className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>
      <nav className="pl-3 py-3 pr-0 space-y-1 overflow-y-auto max-h-[calc(100vh-3.5rem)] scrollbar-hide pb-20">
        {menuItems.map((item, i) => {
          if ((item as any).divider) {
            return <div key={i} className="my-2 border-t border-white/10 pr-3" />
          }
          const isActive = pathname === item.href || (item.href?.startsWith('/settings') && pathname.startsWith('/settings'))
          const Icon = item.icon!
          
          const content = (
            <Link
              key={i}
              href={item.href!}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-[13px] transition-all duration-200 group relative",
                isActive ? "bg-background text-primary font-bold shadow-none" : "text-white/70 font-medium hover:bg-white/10 hover:text-white",
                isCollapsed ? "justify-center px-0 rounded-xl mx-2" : "rounded-l-full rounded-r-none"
              )}
            >
              <Icon className={cn("w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110", isActive ? "text-primary" : "")} />
              
              {!isCollapsed && (
                <span className="truncate transition-opacity duration-300">
                  {item.label}
                </span>
              )}
            </Link>
          )

          if (isCollapsed && !(item as any).divider) {
            return (
              <Tooltip key={i} delayDuration={0}>
                <TooltipTrigger asChild>
                  {content}
                </TooltipTrigger>
                <TooltipContent side="right" className="font-medium bg-white text-primary border-border">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            )
          }

          return content
        })}
      </nav>

      {/* Logout Button at bottom */}
      <div className="absolute bottom-0 left-0 w-full px-3 bg-[#334585] border-t border-white/10 pt-3 pb-4">
        <form action={logout}>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <button 
                type="submit"
                className={cn(
                  "flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 group relative overflow-hidden text-red-200 hover:bg-red-500/20 hover:text-white",
                  isCollapsed && "justify-center px-0"
                )}
              >
                <LogOut className="w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110" />
                {!isCollapsed && (
                  <span className="truncate transition-opacity duration-300">
                    Logout
                  </span>
                )}
              </button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right" className="font-medium text-red-500 bg-white border-red-200">
                Logout
              </TooltipContent>
            )}
          </Tooltip>
        </form>
      </div>
    </aside>
  )
}
