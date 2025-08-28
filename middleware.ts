import { NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Lista de rotas protegidas
  const protectedRoutes = ['/admin', '/cliente', '/checkout']
  const adminRoutes = ['/admin']

  // Verificar se é uma rota protegida
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )

  const isAdminRoute = adminRoutes.some(route => 
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

    if (isAdminRoute) {
      loginUrl.searchParams.set('type', 'admin')
    }

    return NextResponse.redirect(loginUrl)
  }

  // Para rotas admin, vamos deixar o componente verificar as permissões
  // pois o middleware não tem acesso direto ao Firestore
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|.*\\.png$|.*\\.jpg$|.*\\.svg$|.*\\.gif$).*)',
  ],
}