'use client'

import React, { createContext, useContext, useMemo } from 'react'

export interface AuthUser {
  id: string | number
  name: string
  email: string
  roleId: number | null
  roleName: string
  roleLabel: string
  permissions: string[]
}

interface AuthContextType {
  user: AuthUser | null
  hasPermission: (permissionKey: string) => boolean
  hasAnyPermission: (permissionKeys: string[]) => boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  hasPermission: () => false,
  hasAnyPermission: () => false,
})

export function AuthProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode
  initialUser: AuthUser | null
}) {
  const value = useMemo(() => {
    const isSuperAdmin = initialUser?.roleName === 'SUPER_ADMIN'
    const permissionSet = new Set(initialUser?.permissions || [])

    const hasPermission = (permissionKey: string): boolean => {
      if (isSuperAdmin) return true
      return permissionSet.has(permissionKey)
    }

    const hasAnyPermission = (permissionKeys: string[]): boolean => {
      if (isSuperAdmin) return true
      return permissionKeys.some(key => permissionSet.has(key))
    }

    return {
      user: initialUser,
      hasPermission,
      hasAnyPermission,
    }
  }, [initialUser])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

