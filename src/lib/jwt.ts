import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET_KEY || 'your-secret-key-please-change-this-in-production'

export interface JWTPayload {
  userId: number
  username: string
  role: 'ADMIN' | 'USER'
}

export function signToken(payload: JWTPayload): string {
  console.log('🔐 Signing token with secret:', JWT_SECRET.substring(0, 5) + '...')
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): JWTPayload {
  try {
    console.log('🔐 Verifying token with secret:', JWT_SECRET.substring(0, 5) + '...')
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload
    console.log('✅ Token decoded successfully:', { userId: decoded.userId, role: decoded.role })
    return decoded
  } catch (error: any) {
    console.error('❌ JWT verification error:', error.message)
    throw new Error('Invalid token')
  }
}
