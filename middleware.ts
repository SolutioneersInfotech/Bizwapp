import { NextRequest, NextResponse } from "next/server";

export function middleware (request : NextRequest){
    const token = request.cookies.get('token')?.value;

    const isAuthenticated = !!token;

    const { pathname } = request.nextUrl;

    console.log('Middleware triggered:');
    console.log('Token:', token);
    console.log('Is Authenticated:', isAuthenticated);
    console.log('Pathname:', pathname);

    if (isAuthenticated && (pathname === '/login' || pathname === 'signup')){
        return NextResponse.redirect( new URL ('/', request.url))
    }

    if (!isAuthenticated && pathname.startsWith('/dashboard')){
        return NextResponse.redirect( new URL('/login', request.url))
    }

    return NextResponse.next();
}