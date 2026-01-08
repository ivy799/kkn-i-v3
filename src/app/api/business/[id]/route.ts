import { getPrisma } from '@/lib/prismaClient';
import { NextResponse, NextRequest } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function PUT(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await ctx.params;

        const find_data = await getPrisma.business.findUnique({
            where: { id: parseInt(id) }
        });

        if (!find_data) {
            return NextResponse.json(
                { message: 'Business not found' },
                { status: 404 }
            );
        }

        const formData = await request.formData();
        const type = formData.get("type") as string;
        const name = formData.get("name") as string;
        const slug = formData.get("slug") as string;
        const ownerName = formData.get("ownerName") as string;
        const phoneNumber = formData.get("phoneNumber") as string;
        const description = formData.get("description") as string;
        const minimumPrice = formData.get("minimumPrice") as string;
        const maximumPrice = formData.get("maximumPrice") as string;
        const address = formData.get("address") as string;
        const status = formData.get("status") as string;
        const rejectionReason = formData.get("rejectionReason") as string;
        const file = formData.get("productsImage") as File | null;

        // Validasi status enum
        const validStatuses = ['PENDING', 'APPROVED', 'REJECTED'];
        if (status && !validStatuses.includes(status)) {
            return NextResponse.json(
                { message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
                { status: 400 }
            );
        }

        let imagePath: string | null = null;

        if (file && file.size > 0) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadDir = path.join(process.cwd(), "public", "uploads", "businesses");
            await mkdir(uploadDir, { recursive: true });

            const fileName = `${Date.now()}-${file.name}`;
            const filePath = path.join(uploadDir, fileName);

            await writeFile(filePath, buffer);
            imagePath = `/uploads/businesses/${fileName}`;
        }

        const updateData: any = {};

        // Hanya update field yang dikirim
        if (type) updateData.type = type;
        if (name) updateData.name = name;
        if (slug !== undefined) updateData.slug = slug || null;
        if (ownerName) updateData.ownerName = ownerName;
        if (phoneNumber) updateData.phoneNumber = phoneNumber;
        if (description) updateData.description = description;
        if (minimumPrice !== undefined) updateData.minimumPrice = minimumPrice || null;
        if (maximumPrice !== undefined) updateData.maximumPrice = maximumPrice || null;
        if (address) updateData.address = address;
        if (status) updateData.status = status;
        if (rejectionReason !== undefined) updateData.rejectionReason = rejectionReason || null;
        if (imagePath) updateData.productsImage = imagePath;

        const update_data = await getPrisma.business.update({
            where: { id: parseInt(id) },
            data: updateData
        });

        return NextResponse.json({
            message: 'Business updated successfully',
            data: update_data,
            success: true
        });

    } catch (error) {
        console.error('Error updating business:', error);
        return NextResponse.json(
            { message: 'Error updating business' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await ctx.params;

        const find_data = await getPrisma.business.findUnique({
            where: { id: parseInt(id) }
        });

        if (!find_data) {
            return NextResponse.json(
                { message: 'Business not found' },
                { status: 404 }
            );
        }

        const delete_data = await getPrisma.business.delete({
            where: { id: parseInt(id) }
        });

        return NextResponse.json({
            message: 'Business deleted successfully',
            data: delete_data,
            success: true
        });

    } catch (error) {
        console.error('Error deleting business:', error);
        return NextResponse.json(
            { message: 'Error deleting business' },
            { status: 500 }
        );
    }
}

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await ctx.params;
        
        const business = await getPrisma.business.findUnique({
            where: { id: parseInt(id) },
            select: {
                id: true,
                type: true,
                status: true,
                name: true,
                slug: true,
                ownerName: true,
                phoneNumber: true,
                description: true,
                minimumPrice: true,
                maximumPrice: true,
                address: true,
                productsImage: true,
                rejectionReason: true,
                createdAt: true,
            }
        });

        if (!business) {
            return NextResponse.json(
                { success: false, message: 'Business not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: business
        });
    } catch (error) {
        console.error('Error getting business:', error);
        return NextResponse.json(
            { success: false, message: 'Server error' },
            { status: 500 }
        );
    }
}