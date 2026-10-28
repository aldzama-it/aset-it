'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Box, Shield, Users } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export function SettingsNavigation() {
  const pathname = usePathname()
  const { hasPermission } = useAuth()

  const tabs = [
    {
      href: '/settings/categories',
      label: 'Kategori Aset',
      icon: Box,
      permission: 'settings.categories',
    },
    {
      href: '/settings/roles',
      label: 'Role & Hak Akses',
      icon: Shield,
      permission: 'settings.roles',
    },
    {
      href: '/settings/users',
      label: 'Manajemen Pengguna',
      icon: Users,
      permission: 'settings.users',
    },
  ]

  const visibleTabs = tabs.filter(tab => hasPermission(tab.permission))

  if (visibleTabs.length <= 1) return null

  return (
    <div className="flex border-b border-border/60 mb-6 gap-2">
      {visibleTabs.map((tab) => {
        const Icon = tab.icon
        const isActive = pathname.startsWith(tab.href)
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all -mb-[1px]",
              isActive
                ? "border-primary text-primary font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            )}
          >
            <Icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </Link>
        )
      })}
    </div>
  )
}

