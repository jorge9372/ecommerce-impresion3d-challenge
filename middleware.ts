import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Verificar si la ruta actual es una ruta de admin
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')

  // Si es una ruta de admin, añadir un header personalizado
  if (isAdminRoute) {
    const response = NextResponse.next()
    response.headers.set('x-is-admin-route', 'true')
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/:path*',
} 