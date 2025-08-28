import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()

  // Rotas públicas que não precisam de autenticação
  const publicRoutes = [
    '/',
    '/auth',
    '/products',
    '/categories',
    '/contato',
    '/cliente',
    '/checkout',
    '/api/products',
    '/api/chat',
    '/api/cart'
  ]

  // If the current path is in publicRoutes, allow it to proceed
  if (publicRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
    // Security headers for LGPD compliance
    const response = NextResponse.next()
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
    return response
  }

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Check if user has admin session (simplified check)
    const hasAdminAccess = request.cookies.get('admin-session')

    if (!hasAdminAccess) {
      // Redirect to login with return URL
      url.pathname = '/auth'
      url.searchParams.set('returnUrl', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
  }

  // Protect client area
  if (request.nextUrl.pathname.startsWith('/cliente')) {
    const hasUserSession = request.cookies.get('user-session')

    if (!hasUserSession) {
      url.pathname = '/auth'
      url.searchParams.set('returnUrl', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
  }

  // Security headers for LGPD compliance for protected routes
  const response = NextResponse.next()
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  return response
}

export const config = {
  // Protect admin and client routes, but allow public routes to pass through the checks above
  matcher: ['/admin/:path*', '/cliente/:path*']
}