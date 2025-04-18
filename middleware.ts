// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

const PUBLIC_PATHS = ['/', '/sign-in', "/sign-up"]

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request })

    const path = request.nextUrl.pathname

    if (token && PUBLIC_PATHS.includes(path)) {
        return NextResponse.redirect(new URL('/home', request.url))
    }


    if (!token && !PUBLIC_PATHS.includes(path)) {
        return NextResponse.redirect(new URL('/sign-in', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!_next|api|favicon.ico).*)'],
}
