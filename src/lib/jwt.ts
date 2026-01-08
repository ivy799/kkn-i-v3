import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET_KEY!

export function signToken(payload: { userId: number; username: string; role: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number; username: string; role: string }
  } catch (error) {
    throw new Error('Invalid token')
  }
}
