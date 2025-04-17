import { NextRequest, NextResponse } from "next/server";

export function middleware (request : NextRequest){
    const token = request.cookies.get('token')?.value;

    const isAuthenticated = !!token;

    const { pathname } = request.nextUrl;

    

    if (isAuthenticated && (pathname === '/login' || pathname === 'signup')){
        return NextResponse.redirect( new URL ('/', request.url))
    }


    return NextResponse.next();
}