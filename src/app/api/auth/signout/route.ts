import { NextResponse } from 'next/server'
import { removeAuthCookie } from '@/lib/cookies'

export async function POST() {
  try {
    // Hapus cookie auth
    await removeAuthCookie()

    return NextResponse.json(
      { message: 'Logout berhasil' },
      { status: 200 }
    )
  } catch (error) {
    console.error('SignOut error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat logout' },
      { status: 500 }
    )
  }
}
