

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {cookies} from "next/headers";

const PUBLIC_ROUTES=["/login","/signup","/verify"]

export function middleware(request: NextRequest) {
    const token=cookies().get("accessToken")?.value;
    if(!token&&!PUBLIC_ROUTES.includes(request.nextUrl.pathname)){
        return NextResponse.rewrite(new URL('/login', request.url))
    }
    NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',

    ],
}