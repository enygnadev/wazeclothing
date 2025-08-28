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

  // Para rotas admin - verificação mais simples
  if (pathname.startsWith('/admin')) {
    // Se tem algum token, deixar o componente decidir
    // Isso evita loops de redirecionamento
    if (authToken && authToken !== 'undefined' && authToken !== 'null' && authToken.length > 10) {
      console.log("🔐 Admin token found, allowing access to:", pathname)
      return NextResponse.next()
    }
    
    // Só redirecionar se realmente não tem token
    console.log("🚫 No valid admin token, redirecting from:", pathname)
    const url = new URL('/auth', request.url)
    url.searchParams.set('returnUrl', pathname)
    url.searchParams.set('type', 'admin')
    return NextResponse.redirect(url)
  }

  // Se tem token válido, deixar passar
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|.*\\.png$|.*\\.jpg$|.*\\.svg$|.*\\.gif$).*)',
  ],
}