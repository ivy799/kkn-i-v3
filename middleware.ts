import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyTokenEdge } from '@/lib/jwt-edge'

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const method = request.method
    const token = request.cookies.get('auth_token')?.value


    // Set pathname header for layout (must be done early for all requests)
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-pathname', pathname)

    // 1. Bypass public paths
    const publicPaths = ['/api/auth/signin', '/api/auth/signup', '/api/auth/signout']
    if (publicPaths.some(path => pathname.startsWith(path))) {
        return NextResponse.next({
            request: { headers: requestHeaders },
        })
    }

    // 2. Proteksi User Dashboard (User yang sudah login - ADMIN atau USER)
    if (pathname.startsWith('/user-dashboard')) {
        if (!token) {
            const response = NextResponse.redirect(new URL('/auth/signin', request.url))
            response.headers.set('x-pathname', pathname)
            return response
        }

        try {
            const payload = await verifyTokenEdge(token)
            requestHeaders.set('x-user-id', payload.userId.toString())
            requestHeaders.set('x-user-role', payload.role)

            return NextResponse.next({
                request: { headers: requestHeaders },
            })
        } catch {
            const response = NextResponse.redirect(new URL('/auth/signin', request.url))
            response.headers.set('x-pathname', pathname)
            return response
        }
    }

    // 3. Proteksi Halaman Admin Dashboard (Hanya ADMIN)
    if (pathname.startsWith('/dashboard')) {
        if (!token) {
            const response = NextResponse.redirect(new URL('/auth/signin', request.url))
            response.headers.set('x-pathname', pathname)
            return response
        }

        try {
            const payload = await verifyTokenEdge(token)

            if (payload.role !== 'ADMIN') {
                const response = NextResponse.redirect(new URL('/user-dashboard', request.url))
                response.headers.set('x-pathname', pathname)
                return response
            }

            requestHeaders.set('x-user-id', payload.userId.toString())
            requestHeaders.set('x-user-role', payload.role)

            return NextResponse.next({
                request: { headers: requestHeaders },
            })
        } catch {
            const response = NextResponse.redirect(new URL('/auth/signin', request.url))
            response.headers.set('x-pathname', pathname)
            return response
        }
    }

    if (pathname.startsWith('/api/user/')) {
        if (!token) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
        }

        try {
            const payload = await verifyTokenEdge(token)
            requestHeaders.set('x-user-id', payload.userId.toString())
            requestHeaders.set('x-user-role', payload.role)

            return NextResponse.next({
                request: { headers: requestHeaders },
            })
        } catch {
            return NextResponse.json({ success: false, message: 'Invalid Token' }, { status: 401 })
        }
    }

    // 5. Proteksi API Routes - Logika Akses CUD
    if (pathname.startsWith('/api/')) {
        const isCUDOperation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)

        // GET requests selalu diizinkan (public read)
        if (!isCUDOperation) {
            return NextResponse.next({
                request: { headers: requestHeaders },
            })
        }

        // Khusus POST ke /api/business - User yang login bisa CREATE
        if (method === 'POST' && pathname.startsWith('/api/business')) {
            if (!token) {
                return NextResponse.json({ success: false, message: 'Unauthorized - Login required' }, { status: 401 })
            }

            try {
                const payload = await verifyTokenEdge(token)
                requestHeaders.set('x-user-id', payload.userId.toString())
                requestHeaders.set('x-user-role', payload.role)

                return NextResponse.next({
                    request: { headers: requestHeaders },
                })
            } catch {
                return NextResponse.json({ success: false, message: 'Invalid Token' }, { status: 401 })
            }
        }

        // Semua CUD operations lainnya - Hanya ADMIN
        if (!token) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
        }

        try {
            const payload = await verifyTokenEdge(token)

            if (payload.role !== 'ADMIN') {
                return NextResponse.json({ success: false, message: 'Forbidden: Admin access required' }, { status: 403 })
            }

            requestHeaders.set('x-user-id', payload.userId.toString())
            requestHeaders.set('x-user-role', payload.role)

            return NextResponse.next({
                request: { headers: requestHeaders },
            })
        } catch {
            return NextResponse.json({ success: false, message: 'Invalid Token' }, { status: 401 })
        }
    }

    // Default: pass through with pathname header
    return NextResponse.next({
        request: { headers: requestHeaders },
    })
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
