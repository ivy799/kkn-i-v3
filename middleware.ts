import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/jwt'

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const token = request.cookies.get('auth_token')?.value

    console.log('🔒 Middleware executing for:', pathname, 'Token:', token ? 'exists' : 'missing')

    // 1. Bypass public paths and GET requests to API
    const publicPaths = ['/api/auth/signin', '/api/auth/signup', '/api/auth/signout']
    if (publicPaths.some(path => pathname.startsWith(path))) {
        return NextResponse.next()
    }

    // 2. Proteksi Halaman Dashboard (Hanya ADMIN)
    if (pathname.startsWith('/dashboard')) {
        console.log('🔒 Dashboard access attempt - Token:', token ? 'exists' : 'missing')

        if (!token) {
            console.log('❌ No token - redirecting to signin')
            return NextResponse.redirect(new URL('/auth/signin', request.url))
        }

        try {
            const payload = verifyToken(token)
            console.log('✅ Token verified - Role:', payload.role)

            if (payload.role !== 'ADMIN') {
                console.log('❌ Not admin - redirecting to home')
                // Jika bukan admin, arahkan ke halaman home
                return NextResponse.redirect(new URL('/', request.url))
            }

            console.log('✅ Admin access granted')
        } catch (error) {
            console.log('❌ Token invalid - redirecting to signin')
            return NextResponse.redirect(new URL('/auth/signin', request.url))
        }
    }

    // 3. Proteksi API Routes (Hanya untuk CUD operations - POST, PUT, PATCH, DELETE)
    if (pathname.startsWith('/api/')) {
        const method = request.method
        const isCUDOperation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)

        // Allow GET requests (read operations) to pass through
        if (!isCUDOperation) {
            return NextResponse.next()
        }

        try {
            if (!token) {
                return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
            }

            const payload = verifyToken(token)

            if (payload.role !== 'ADMIN') {
                return NextResponse.json({ success: false, message: 'Forbidden: Admin access required' }, { status: 403 })
            }

            const requestHeaders = new Headers(request.headers)
            requestHeaders.set('x-user-id', payload.userId.toString())
            requestHeaders.set('x-user-role', payload.role)

            return NextResponse.next({
                request: { headers: requestHeaders },
            })
        } catch (error) {
            return NextResponse.json({ success: false, message: 'Invalid Token' }, { status: 401 })
        }
    }

    // Add pathname header for layout
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-pathname', pathname)

    return NextResponse.next({
        request: { headers: requestHeaders },
    })
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
