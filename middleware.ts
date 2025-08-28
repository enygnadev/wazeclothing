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

  // Lista de tokens inválidos
  const invalidTokens = ['', 'undefined', 'null', undefined, null]
  
  // Se não tem token válido, redirecionar para login
  if (!authToken || invalidTokens.includes(authToken) || authToken.length < 10) {
    console.log("🚫 Token inválido ou ausente:", { 
      authToken: authToken ? authToken.substring(0, 10) + '...' : 'null',
      pathname,
      hasToken: !!authToken,
      tokenLength: authToken?.length || 0
    })
    
    const loginUrl = new URL('/auth', request.url)
    loginUrl.searchParams.set('returnUrl', pathname)

    if (pathname.startsWith('/admin')) {
      loginUrl.searchParams.set('type', 'admin')
    }

    return NextResponse.redirect(loginUrl)
  }

  // Para rotas admin - verificação do token
  if (pathname.startsWith('/admin')) {
    // Token existe e parece válido, deixar componente fazer verificação mais detalhada
    console.log("🔐 Admin route access:", { 
      pathname, 
      hasToken: !!authToken, 
      tokenLength: authToken?.length || 0,
      tokenPreview: authToken ? authToken.substring(0, 20) + '...' : 'none'
    })
    return NextResponse.next()
  }

  // Se tem token válido, deixar passar
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|.*\\.png$|.*\\.jpg$|.*\\.svg$|.*\\.gif$).*)',
  ],
}