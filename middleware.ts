// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  console.log("middlewarekhbkhb");
  
  // const token = request.cookies.get("token")?.value; // cookie से token निकालना

  // console.log("token", token);

  // console.log("All Cookies in middleware:", request.cookies.getAll());
  

  // const publicPaths = [
  //   '/login',
  //   '/signup',
  //   '/_next',
  //   '/favicon.ico',
  //   '/robots.txt',
  //   '/manifest.json',
  //   '/images',
  //   '/fonts',
  //   '/icons',
  // ]

  // const path = request.nextUrl.pathname

  // const isPublicPath = publicPaths.some((publicPath) =>
  //   path.startsWith(publicPath)
  // )

  // // ✅ अगर path private है और token नहीं है → redirect to /login
  // if (!token && !isPublicPath) {
  //   const loginUrl = new URL('/login', request.url) // same domain पर login
  //   return NextResponse.redirect(loginUrl)
  // }

  // // ✅ अगर पहले से logged in है और वो /login या /signup पर जाने की कोशिश कर रहा है → redirect to home/dashboard
  // if (token && (path.startsWith('/login') || path.startsWith('/signup'))) {
  //   const homeUrl = new URL('/', request.url)
  //   return NextResponse.redirect(homeUrl)
  // }

  // return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|.*\\.svg|.*\\.png).*)',
  ],
}
