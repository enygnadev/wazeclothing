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

  // Admin route protection
  if (pathname.startsWith('/admin')) {
    if (!authToken) {
      const url = new URL('/auth', request.url)
      url.searchParams.set('returnUrl', pathname)
      url.searchParams.set('type', 'admin')
      return NextResponse.redirect(url)
    }

    try {
      const decodedToken = await adminAuth.verifyIdToken(authToken)

      // Check if user is admin in Firestore
      const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get()
      const userData = userDoc.data()

      if (!userData?.isAdmin) {
        console.log('User is not admin:', userData)
        return NextResponse.redirect(new URL('/', request.url))
      }

      console.log('Admin access granted for user:', decodedToken.uid)
    } catch (error) {
      console.error('Admin verification error:', error)
      const url = new URL('/auth', request.url)
      url.searchParams.set('returnUrl', pathname)
      url.searchParams.set('type', 'admin')
      return NextResponse.redirect(url)
    }
  }

  // Se tem token válido, deixar passar - a verificação de admin será feita no componente
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|.*\\.png$|.*\\.jpg$|.*\\.svg$|.*\\.gif$).*)',
  ],
}