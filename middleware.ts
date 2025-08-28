import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const pathname = request.nextUrl.pathname

  // Rotas públicas que não precisam de autenticação
  const publicRoutes = [
    '/',
    '/auth',
    '/products',
    '/categories',
    '/contato',
    '/checkout',
    '/not-found'
  ]

  // Rotas de API públicas
  const publicApiRoutes = [
    '/api/products',
    '/api/chat',
    '/api/cart'
  ]

  // Se é rota pública, permite acesso
  if (publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/')) ||
      publicApiRoutes.some(route => pathname.startsWith(route))) {
    const response = NextResponse.next()
    // Headers de segurança LGPD
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
    return response
  }

  // Proteção para rotas admin
  if (pathname.startsWith('/admin')) {
    const hasAdminAccess = request.cookies.get('admin-session')?.value === 'true'

    if (!hasAdminAccess) {
      url.pathname = '/auth'
      url.searchParams.set('returnUrl', pathname)
      url.searchParams.set('type', 'admin')
      return NextResponse.redirect(url)
    }
  }

  // Proteção para área cliente
  if (pathname.startsWith('/cliente')) {
    const hasUserSession = request.cookies.get('user-session')?.value === 'true'

    if (!hasUserSession) {
      url.pathname = '/auth'
      url.searchParams.set('returnUrl', pathname)
      return NextResponse.redirect(url)
    }
  }

  // Headers de segurança para rotas protegidas
  const response = NextResponse.next()
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  return response
}

export const config = {
  matcher: [
    // Aplica middleware em todas as rotas exceto arquivos estáticos
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ]
}