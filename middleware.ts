// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  console.log('Token:', token)

  const publicPaths = [
    '/login',
    '/signup',
    '/api',
    '/_next',
    '/favicon.ico',
    '/robots.txt',
    '/manifest.json',
    '/images',
    '/fonts',
    '/icons',
  ]

  const path = request.nextUrl.pathname

  const isPublicPath = publicPaths.some((publicPath) =>
    path.startsWith(publicPath)
  )

  if (!isPublicPath && !token) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - static files (/_next/, /favicon.ico, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|.*\\.svg|.*\\.png).*)',
  ],
}
