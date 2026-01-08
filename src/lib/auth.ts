import { cookies } from 'next/headers'
import { verifyToken } from './jwt'

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value

    if (!token) {
      return null
    }

    const payload = verifyToken(token)
    return payload
  } catch (error) {
    console.error('Get current user error:', error)
    return null
  }
}