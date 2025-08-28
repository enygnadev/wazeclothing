import { NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static files and API routes (except auth-related)
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') ||
    pathname.startsWith('/api/health') ||
    pathname.startsWith('/api/products') ||
    pathname.startsWith('/api/chat')
  ) {
    return NextResponse.next()
  }

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/auth', '/products', '/categories', '/contato']
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Admin routes protection
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      const url = new URL('/auth', request.url)
      url.searchParams.set('returnUrl', pathname)
      url.searchParams.set('type', 'admin')
      return NextResponse.redirect(url)
    }

    return NextResponse.next()
  }

  // Cliente area protection
  if (pathname.startsWith('/cliente') || pathname.startsWith('/checkout')) {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      const url = new URL('/auth', request.url)
      url.searchParams.set('returnUrl', pathname)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}