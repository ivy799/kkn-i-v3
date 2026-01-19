import { NextRequest, NextResponse } from 'next/server'
import { getPrisma } from '@/lib/prismaClient'
import { comparePassword } from '@/lib/password'
import { signToken } from '@/lib/jwt'
import { setAuthCookie } from '@/lib/cookies'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    // Validasi input
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username dan password wajib diisi' },
        { status: 400 }
      )
    }

    // Cari user berdasarkan username
    const user = await getPrisma.user.findUnique({
      where: { username },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Username atau password salah' },
        { status: 401 }
      )
    }

    // Verifikasi password
    const isPasswordValid = await comparePassword(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Username atau password salah' },
        { status: 401 }
      )
    }

    // Buat token JWT
    const token = await signToken({
      userId: user.id,
      username: user.username,
      role: user.role,
    })

    // Set cookie
    await setAuthCookie(token)

    return NextResponse.json(
      {
        message: 'Login berhasil',
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('SignIn error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat login' },
      { status: 500 }
    )
  }
}