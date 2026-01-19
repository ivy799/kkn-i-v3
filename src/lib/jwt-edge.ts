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

export async function signTokenEdge(payload: JWTPayload): Promise<string> {
    const token = await new SignJWT({ ...payload })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('7d')
        .sign(getSecretKey())
    return token
}

export async function verifyTokenEdge(token: string): Promise<JWTPayload> {
    try {
        const { payload } = await jwtVerify(token, getSecretKey())
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
