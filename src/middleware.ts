import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/jwt'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('auth_token')?.value

  // 1. Bypass public paths
  const publicPaths = ['/api/auth/signin', '/api/auth/signup', '/api/auth/signout']
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // // 2. Proteksi Halaman Dashboard (Hanya ADMIN)
  // if (pathname.startsWith('/dashboard')) {
  //   if (!token) {
  //     return NextResponse.redirect(new URL('/auth/signin', request.url)) // Redirect ke/auth signin jika tidak ada token
  //   }

  //   try {
  //     const payload = verifyToken(token)
  //     if (payload.role !== 'ADMIN') {
  //       // Jika bukan admin, arahkan ke halaman lain (misal home atau 403)
  //       return NextResponse.redirect(new URL('/', request.url)) 
  //     }
  //   } catch (error) {
  //     return NextResponse.redirect(new URL('/auth/signin', request.url))
  //   }
  // }

  // 3. Proteksi API Routes (Logika lama Anda)
  // if (pathname.startsWith('/api/')) {
  //   try {
  //     if (!token) {
  //       return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  //     }

  //     const payload = verifyToken(token)

  //     if (payload.role !== 'ADMIN') {
  //       return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
  //     }

  //     const requestHeaders = new Headers(request.headers)
  //     requestHeaders.set('x-user-id', payload.userId.toString())
  //     requestHeaders.set('x-user-role', payload.role)

  //     return NextResponse.next({
  //       request: { headers: requestHeaders },
  //     })
  //   } catch (error) {
  //     return NextResponse.json({ success: false, message: 'Invalid Token' }, { status: 401 })
  //   }
  // }

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