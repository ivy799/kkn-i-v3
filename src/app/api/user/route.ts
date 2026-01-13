import { getPrisma } from '@/lib/prismaClient';
import { NextResponse, NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { username, password, role } = body;

        if (!username || !password) {
            return NextResponse.json(
                { message: "Username and password are required" },
                { status: 400 }
            );
        }

        // Check if username already exists
        const existingUser = await getPrisma.user.findUnique({
            where: { username }
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "Username already exists" },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await getPrisma.user.create({
            data: {
                username,
                password: hashedPassword,
                role: role || 'USER',
            },
            select: {
                id: true,
                username: true,
                role: true,
                createdAt: true
            }
        });

        return NextResponse.json({
            message: "User created successfully",
            data: newUser,
            success: true,
        });

    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json(
            { message: "Error creating user" },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const users = await getPrisma.user.findMany({
            select: {
                id: true,
                username: true,
                role: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json({
            message: 'Users acquired successfully',
            data: users,
            success: true
        });

    } catch (error) {
        console.error("Error getting users:", error);
        return NextResponse.json(
            { message: 'Error getting users' },
            { status: 500 }
        );
    }
}
