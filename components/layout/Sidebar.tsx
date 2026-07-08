'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Network, Printer, Camera, Laptop,
  Radio, Tablet, Satellite, Car, History,
  ChevronLeft, Menu, LogOut, Settings, Box, Cloud, MonitorDot,
  ChevronDown, ChevronRight
} from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import { logout } from '@/app/login/actions'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { digitalAssetsConfig } from '@/lib/digital-assets-config'

const physicalAssetItems = [
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

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [dynamicCategories, setDynamicCategories] = useState<any[]>([])
  
  // State for collapsibles
  const [isDigitalOpen, setIsDigitalOpen] = useState(false)
  const [isPhysicalOpen, setIsPhysicalOpen] = useState(false)

  // Auto open based on current path
  useEffect(() => {
    if (pathname.includes('/digital-assets/')) setIsDigitalOpen(true)
    if (physicalAssetItems.some(i => pathname.includes(i.href)) || pathname.includes('/assets/')) setIsPhysicalOpen(true)
  }, [pathname])

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

  const allPhysicalAssets = [...physicalAssetItems, ...dynamicMenuItems]

  const NavItem = ({ href, icon: Icon, label, isActive }: { href: string, icon: any, label: string, isActive: boolean }) => {
    const content = (
      <Link
        href={href}
        className={cn(
          "flex items-center gap-3 px-3 py-2 text-[13px] transition-all duration-200 group relative",
          isActive ? "bg-background text-primary font-bold shadow-none" : "text-white/70 font-medium hover:bg-white/10 hover:text-white",
          isCollapsed ? "justify-center px-0 rounded-xl mx-2" : "rounded-l-full rounded-r-none"
        )}
      >
        <Icon className={cn("w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110", isActive ? "text-primary" : "")} />
        {!isCollapsed && <span className="truncate transition-opacity duration-300">{label}</span>}
      </Link>
    )

    if (isCollapsed) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right" className="font-medium bg-white text-primary border-border">{label}</TooltipContent>
        </Tooltip>
      )
    }
    return content
  }

  const SubNavItem = ({ href, label, isActive }: { href: string, label: string, isActive: boolean }) => {
    return (
      <Link
        href={href}
        className={cn(
          "flex items-center gap-3 pl-10 pr-3 py-1.5 text-[12px] transition-all duration-200 rounded-l-full relative",
          isActive ? "text-white font-bold bg-white/10" : "text-white/60 hover:text-white hover:bg-white/5",
          isCollapsed && "hidden"
        )}
      >
        <div className={cn("w-1.5 h-1.5 rounded-full absolute left-5", isActive ? "bg-white" : "bg-white/30")} />
        <span className="truncate">{label}</span>
      </Link>
    )
  }

  return (
    <aside 
      className={cn(
        "bg-gradient-to-br from-primary/90 via-primary to-blue-900 text-white border-r-0 flex-shrink-0 min-h-screen font-sans transition-all duration-300 ease-in-out z-50",
        isCollapsed 
          ? "fixed left-0 top-0 bottom-0 w-20 -translate-x-[64px] opacity-0 hover:translate-x-0 hover:opacity-80 cursor-pointer" 
          : "relative w-64 translate-x-0 opacity-100"
      )}
      onClick={(e) => {
        if (isCollapsed) setIsCollapsed(false)
      }}
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
        <NavItem href="/dashboard" icon={LayoutDashboard} label="Dashboard" isActive={pathname === '/dashboard'} />

        {/* Digital Assets Collapsible */}
        <Collapsible open={isDigitalOpen && !isCollapsed} onOpenChange={setIsDigitalOpen} className="mt-1">
          <CollapsibleTrigger className="w-full">
            <div className={cn(
              "flex items-center justify-between px-3 py-2 text-[13px] text-white/70 font-medium hover:bg-white/10 hover:text-white transition-all duration-200",
              isCollapsed ? "justify-center rounded-xl mx-2" : "rounded-l-full"
            )}>
              <div className="flex items-center gap-3">
                <Cloud className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span>Aset Digital</span>}
              </div>
              {!isCollapsed && (isDigitalOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1 mt-1 mb-2">
            {digitalAssetsConfig.map(asset => (
               <SubNavItem 
                 key={asset.id} 
                 href={`/digital-assets/${asset.id}`} 
                 label={asset.title} 
                 isActive={pathname === `/digital-assets/${asset.id}`} 
               />
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Physical Assets Collapsible */}
        <Collapsible open={isPhysicalOpen && !isCollapsed} onOpenChange={setIsPhysicalOpen}>
          <CollapsibleTrigger className="w-full">
            <div className={cn(
              "flex items-center justify-between px-3 py-2 text-[13px] text-white/70 font-medium hover:bg-white/10 hover:text-white transition-all duration-200",
              isCollapsed ? "justify-center rounded-xl mx-2" : "rounded-l-full"
            )}>
              <div className="flex items-center gap-3">
                <MonitorDot className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span>Aset Fisik</span>}
              </div>
              {!isCollapsed && (isPhysicalOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1 mt-1 mb-2">
            {allPhysicalAssets.map(asset => (
               <SubNavItem 
                 key={asset.href} 
                 href={asset.href} 
                 label={asset.label} 
                 isActive={pathname === asset.href} 
               />
            ))}
          </CollapsibleContent>
        </Collapsible>

        <div className="my-2 border-t border-white/10 pr-3" />
        
        <NavItem href="/history" icon={History} label="Riwayat Aset" isActive={pathname === '/history'} />
        <NavItem href="/settings/categories" icon={Settings} label="Pengaturan" isActive={pathname.startsWith('/settings')} />
      </nav>

      <div className="absolute bottom-0 left-0 w-full px-3 bg-transparent border-t border-white/10 pt-3 pb-4">
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
                {!isCollapsed && <span className="truncate transition-opacity duration-300">Logout</span>}
              </button>
            </TooltipTrigger>
            {isCollapsed && <TooltipContent side="right" className="font-medium text-red-500 bg-white border-red-200">Logout</TooltipContent>}
          </Tooltip>
        </form>
      </div>
    </aside>
  )
}
