import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/jwt'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('auth_token')?.value

  // 1. PRIORITAS UTAMA: Jalur Publik (Tanpa Token)
  const publicPaths = ['/api/auth/signin', '/api/auth/signup', '/api/auth/signout']
  if (publicPaths.some(path => pathname === path || pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // 2. PROTEKSI DASHBOARD (Redirect ke Login)
  if (pathname.startsWith('/dashboard')) {
    if (!token) return NextResponse.redirect(new URL('/auth/signin', request.url))

    try {
      const payload = verifyToken(token)
      if (payload.role !== 'ADMIN') return NextResponse.redirect(new URL('/', request.url))
    } catch (error) {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }
  }

  // // 3. PROTEKSI API (Kembalikan JSON 401)
  // // Pastikan rute auth sudah di-handle di poin 1 agar tidak masuk ke sini
  // if (pathname.startsWith('/api/')) {
  //   if (!token) {
  //     return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  //   }

  //   try {
  //     const payload = verifyToken(token)
  //     // Logika role admin jika memang semua API wajib admin
  //     if (payload.role !== 'ADMIN') {
  //       return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
  //     }

  //     const requestHeaders = new Headers(request.headers)
  //     requestHeaders.set('x-user-id', payload.userId.toString())
  //     requestHeaders.set('x-user-role', payload.role)

  //     return NextResponse.next({ request: { headers: requestHeaders } })
  //   } catch (error) {
  //     return NextResponse.json({ success: false, message: 'Invalid Token' }, { status: 401 })
  //   }
  // }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}