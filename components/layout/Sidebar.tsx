'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Network, Printer, Camera, Laptop,
  Package, Radio, Tablet, Satellite, Car, Users, MapPin, History,
  ChevronLeft, ChevronRight, Menu
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

const menuItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/network', icon: Network, label: 'Jaringan' },
  { href: '/printers', icon: Printer, label: 'Printer' },
  { href: '/cctv', icon: Camera, label: 'CCTV' },
  { href: '/laptops', icon: Laptop, label: 'Laptop' },
  { href: '/laptop-accessories', icon: Package, label: 'Aksesoris Laptop' },
  { href: '/ht', icon: Radio, label: 'HT (Handy Talky)' },
  { href: '/tablets', icon: Tablet, label: 'Tablet' },
  { href: '/cameras', icon: Camera, label: 'Kamera' },
  { href: '/starlinks', icon: Satellite, label: 'Starlink' },
  { href: '/dashcams', icon: Car, label: 'Dashcam' },
  { divider: true },
  { href: '/history', icon: History, label: 'Riwayat Aset' },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <aside 
      className={cn(
        "bg-background text-foreground border-r flex-shrink-0 min-h-screen font-sans transition-all duration-300 ease-in-out relative",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="p-4 font-bold text-xl border-b h-14 flex items-center justify-between overflow-hidden">
        <span className={cn(
          "text-primary tracking-tight font-poppins transition-all duration-300 whitespace-nowrap",
          isCollapsed ? "opacity-0 w-0 hidden" : "opacity-100 w-auto block"
        )}>
          Aldzama IT
        </span>
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn("h-8 w-8", isCollapsed ? "mx-auto" : "")} 
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <Menu className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>
      <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-3.5rem)] scrollbar-hide">
        {menuItems.map((item, i) => {
          if (item.divider) {
            return <div key={i} className="my-2 border-t border-border" />
          }
          const isActive = pathname === item.href
          const Icon = item.icon!
          
          const content = (
            <Link
              key={i}
              href={item.href!}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                isCollapsed && "justify-center px-0"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-primary rounded-r-full" />
              )}
              <Icon className={cn("w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110", isActive ? "text-primary" : "")} />
              
              {!isCollapsed && (
                <span className="truncate transition-opacity duration-300">
                  {item.label}
                </span>
              )}
            </Link>
          )

          if (isCollapsed && !item.divider) {
            return (
              <Tooltip key={i} delayDuration={0}>
                <TooltipTrigger asChild>
                  {content}
                </TooltipTrigger>
                <TooltipContent side="right" className="font-medium">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            )
          }

          return content
        })}
      </nav>
    </aside>
  )
}
