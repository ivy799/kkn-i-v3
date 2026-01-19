import { jwtVerify, SignJWT } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET_KEY || 'your-secret-key-please-change-this-in-production'

export interface JWTPayload {
  userId: number
  username: string
  role: 'ADMIN' | 'USER'
}

// Convert string secret to Uint8Array for jose library
function getSecretKey(): Uint8Array {
  return new TextEncoder().encode(JWT_SECRET)
}

export async function signToken(payload: JWTPayload): Promise<string> {
  console.log('🔐 Signing token with secret:', JWT_SECRET.substring(0, 5) + '...')
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(getSecretKey())
  return token
}

export async function verifyToken(token: string): Promise<JWTPayload> {
  try {
    console.log('🔐 Verifying token with secret:', JWT_SECRET.substring(0, 5) + '...')
    const { payload } = await jwtVerify(token, getSecretKey())
    console.log('✅ Token decoded successfully:', { userId: payload.userId, role: payload.role })
    return {
      userId: payload.userId as number,
      username: payload.username as string,
      role: payload.role as 'ADMIN' | 'USER',
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('❌ JWT verification error:', message)
    throw new Error('Invalid token')
  }
}
