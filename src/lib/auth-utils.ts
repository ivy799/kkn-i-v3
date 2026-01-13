import { cookies } from 'next/headers'
import { verifyToken, JWTPayload } from './jwt'
import { NextResponse } from 'next/server'

/**
 * Get current user from cookies and verify token
 * Throws error if token is invalid
 */
export async function requireAuth(): Promise<JWTPayload> {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('auth_token')?.value

        if (!token) {
            throw new Error('No authentication token found')
        }

        const payload = verifyToken(token)
        return payload
    } catch (error) {
        console.error('Authentication error:', error)
        throw new Error('Unauthorized')
    }
}

/**
 * Verify user is authenticated AND has admin role
 * Returns user payload if admin, throws error otherwise
 */
export async function requireAdmin(): Promise<JWTPayload> {
    const user = await requireAuth()

    if (user.role !== 'ADMIN') {
        throw new Error('Forbidden: Admin access required')
    }

    return user
}

/**
 * Check if current user is admin (boolean check)
 */
export async function isAdmin(): Promise<boolean> {
    try {
        const user = await requireAuth()
        return user.role === 'ADMIN'
    } catch {
        return false
    }
}

/**
 * Create a standardized unauthorized response
 */
export function unauthorizedResponse(message: string = 'Unauthorized') {
    return NextResponse.json(
        { success: false, message },
        { status: 401 }
    )
}

/**
 * Create a standardized forbidden response
 */
export function forbiddenResponse(message: string = 'Forbidden: Admin access required') {
    return NextResponse.json(
        { success: false, message },
        { status: 403 }
    )
}
