import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/session'
import { cookies } from 'next/headers'

// Rute yang memerlukan autentikasi
const protectedRoutes = ['/', '/dashboard', '/cameras', '/cctv', '/dashcams', '/history', '/ht', '/laptop-accessories', '/laptops', '/network', '/printers', '/starlinks', '/tablets']
const publicRoutes = ['/login']

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.some(route => path === route || path.startsWith(`${route}/`) && route !== '/')
  const isPublicRoute = publicRoutes.includes(path)

  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)

  // Redirect to /login if the user is not authenticated
  if ((isProtectedRoute || path === '/') && !session?.userId) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  // Redirect to /dashboard if the user is already authenticated
  if (isPublicRoute && session?.userId) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
