import { getPrisma } from '@/lib/prismaClient';
import { NextResponse, NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await ctx.params;

        const user = await getPrisma.user.findUnique({
            where: { id: parseInt(id) },
            select: {
                id: true,
                username: true,
                role: true,
                createdAt: true,
            }
        });

        if (!user) {
            return NextResponse.json(
                { success: false, message: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Error getting user:', error);
        return NextResponse.json(
            { success: false, message: 'Server error' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await ctx.params;

        const findData = await getPrisma.user.findUnique({
            where: { id: parseInt(id) }
        });

        if (!findData) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        const body = await request.json();
        const { username, password, role } = body;

        // Check if username already exists (for other user)
        if (username && username !== findData.username) {
            const existingUser = await getPrisma.user.findUnique({
                where: { username }
            });

            if (existingUser) {
                return NextResponse.json(
                    { message: "Username already exists" },
                    { status: 400 }
                );
            }
        }

        const updateData: any = {};

        if (username) updateData.username = username;
        if (role) updateData.role = role;

        // Hash new password if provided
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await getPrisma.user.update({
            where: { id: parseInt(id) },
            data: updateData,
            select: {
                id: true,
                username: true,
                role: true,
                createdAt: true
            }
        });

        return NextResponse.json({
            message: 'User updated successfully',
            data: updatedUser,
            success: true
        });

    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json(
            { message: 'Error updating user' },
            { status: 500 }
        );
    }
}

export async function DELETE(_request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await ctx.params;

        const findData = await getPrisma.user.findUnique({
            where: { id: parseInt(id) }
        });

        if (!findData) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        await getPrisma.user.delete({
            where: { id: parseInt(id) }
        });

        return NextResponse.json({
            message: 'User deleted successfully',
            success: true
        });

    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json(
            { message: 'Error deleting user' },
            { status: 500 }
        );
    }
}
