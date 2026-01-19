import { NextRequest, NextResponse } from 'next/server'
import { getPrisma } from '@/lib/prismaClient'
import { hashPassword } from '@/lib/password'
import { signToken } from '@/lib/jwt'
import { setAuthCookie } from '@/lib/cookies'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password, confirmPassword } = body

    // Validasi input
    if (!username || !password || !confirmPassword) {
      return NextResponse.json(
        { error: 'Username, password, dan konfirmasi password wajib diisi' },
        { status: 400 }
      )
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Password dan konfirmasi password tidak cocok' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password minimal 6 karakter' },
        { status: 400 }
      )
    }

    if (username.length < 3) {
      return NextResponse.json(
        { error: 'Username minimal 3 karakter' },
        { status: 400 }
      )
    }

    // Cek apakah username sudah ada
    const existingUser = await getPrisma.user.findUnique({
      where: { username },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username sudah digunakan' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Buat user baru
    const user = await getPrisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role: 'USER',
      },
    })

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
        message: 'Registrasi berhasil',
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('SignUp error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat registrasi' },
      { status: 500 }
    )
  }
}