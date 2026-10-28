import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/session'
import { cookies } from 'next/headers'
import { getMenuKeyByPath } from '@/lib/rbac/permissions-config'

// Daftar awalan rute yang dilindungi
const protectedRoutePrefixes = [
  '/dashboard',
  '/ticketing',
  '/network-analyzer',
  '/digital-assets',
  '/network',
  '/printers',
  '/cctv',
  '/laptops',
  '/laptop-accessories',
  '/general-inventory',
  '/ht',
  '/tablets',
  '/cameras',
  '/starlinks',
  '/dashcams',
  '/assets',
  '/history',
  '/settings',
]

const publicRoutes = ['/login']

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isProtectedRoute = path === '/' || protectedRoutePrefixes.some(route => path === route || path.startsWith(`${route}/`))
  const isPublicRoute = publicRoutes.includes(path)

  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)

  // 1. Redirect to /login if user is not authenticated
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  // 2. Redirect to /dashboard if user is already authenticated and visits /login
  if (isPublicRoute && session?.userId) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
  }

  // 3. RBAC Route Guarding: Cek hak akses menu jika user sudah login dan mengakses rute terproteksi
  if (session?.userId && isProtectedRoute && path !== '/') {
    const isSuperAdmin = session.roleName === 'SUPER_ADMIN'
    
    // Super admin selalu diizinkan ke semua rute
    if (!isSuperAdmin) {
      const requiredMenuKey = getMenuKeyByPath(path)
      
      // Jika rute ini terikat dengan suatu izin menu spesifik
      if (requiredMenuKey) {
        const userPermissions: string[] = session.permissions || []
        const hasAccess = userPermissions.includes(requiredMenuKey)

        if (!hasAccess) {
          // Jangan redirect ke /dashboard jika URL saat ini sudah /dashboard (mencegah redirect loop)
          if (path !== '/dashboard') {
            return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
          }
        }
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
