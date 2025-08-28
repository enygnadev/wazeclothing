
import { NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next()
  }

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/auth', '/products', '/categories', '/contato']
  
  // Check if it's a public route or exact match
  const isPublicRoute = publicRoutes.some(route => {
    if (route === '/') return pathname === '/'
    return pathname.startsWith(route)
  })

  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Protected routes
  const isAdminRoute = pathname.startsWith('/admin')
  const isClientRoute = pathname.startsWith('/cliente') || pathname.startsWith('/checkout')
  
  // Get token from cookie
  const token = request.cookies.get('auth-token')?.value

  // If no token for protected routes, redirect to auth
  if (!token && (isAdminRoute || isClientRoute)) {
    const url = new URL('/auth', request.url)
    url.searchParams.set('returnUrl', pathname)
    
    if (isAdminRoute) {
      url.searchParams.set('type', 'admin')
    }
    
    return NextResponse.redirect(url)
  }

  // For admin routes, additional verification happens on the client side
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
