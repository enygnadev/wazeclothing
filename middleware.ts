import { NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Ignora arquivos estáticos e qualquer requisição de arquivo
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next()
  }

  // Não fazer autenticação no Edge. O /admin, /cliente e /checkout
  // serão verificados no cliente (React) usando useAuth + claims + users/{uid}.isAdmin.
  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/cliente/:path*", "/checkout/:path*"],
}
