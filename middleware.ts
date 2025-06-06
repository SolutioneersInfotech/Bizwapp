// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const cookieHeader = request.headers.get("cookie");
  // console.log("Raw cookie header:", cookieHeader);

  const token = request.cookies.get("token");
  // console.log("Parsed cookie:", token);

  // console.log("request", request);


  const publicPaths = [
    '/login',
    '/signup',
    '/_next',
    '/favicon.ico',
    '/robots.txt',
    '/manifest.json',
    '/images',
    '/fonts',
    '/icons',
  ]

  const path = request.nextUrl.pathname

  // console.log("path", path)

  const isPublicPath = publicPaths.some((publicPath) =>
    path.startsWith(publicPath)
  )

  // console.log("checking", isPublicPath , token)

  // if (!isPublicPath && !token) {
    
  //   const loginUrl = new URL('/login', request.url)
  //   return NextResponse.redirect(loginUrl)
  // }

  return NextResponse.next()
}

export const config = {
  matcher: [   
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|.*\\.svg|.*\\.png).*)',
  ],
}
