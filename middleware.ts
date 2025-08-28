import { NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Lista de rotas protegidas
  const protectedRoutes = ['/admin', '/cliente', '/checkout']

  // Verificar se é uma rota protegida
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  )

  // Se não for rota protegida, permitir acesso
  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  // Verificar token de autenticação no cookie
  const authToken = request.cookies.get('auth-token')?.value

  // Se não tem token, redirecionar para login
  if (!authToken || authToken === 'undefined' || authToken === '') {
    const loginUrl = new URL('/auth', request.url)
    loginUrl.searchParams.set('returnUrl', pathname)

    if (pathname.startsWith('/admin')) {
      loginUrl.searchParams.set('type', 'admin')
    }

    return NextResponse.redirect(loginUrl)
  }

  // Para rotas admin, apenas verificar se tem token
  // A verificação de admin será feita no componente
  if (pathname.startsWith('/admin')) {
    if (!authToken) {
      const url = new URL('/auth', request.url)
      url.searchParams.set('returnUrl', pathname)
      url.searchParams.set('type', 'admin')
      return NextResponse.redirect(url)
    }
  }

  // Se tem token válido, deixar passar
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|.*\\.png$|.*\\.jpg$|.*\\.svg$|.*\\.gif$).*)',
  ],
}