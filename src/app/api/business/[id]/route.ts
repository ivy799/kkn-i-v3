import { getPrisma } from '@/lib/prismaClient';
import { NextResponse, NextRequest } from 'next/server';

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

        const validStatuses = ['PENDING', 'APPROVED', 'REJECTED'];
        if (status && !validStatuses.includes(status)) {
            return NextResponse.json(
                { message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
                { status: 400 }
            );
        }

        const updateData: any = {};

        if (type) updateData.type = type;
        if (name) updateData.name = name;
        if (slug !== undefined) updateData.slug = slug || null;
        if (ownerName) updateData.ownerName = ownerName;
        if (phoneNumber) updateData.phoneNumber = phoneNumber;
        if (description) updateData.description = description;
        if (minimumPrice !== undefined) updateData.minimumPrice = minimumPrice ? parseInt(minimumPrice) : null;
        if (maximumPrice !== undefined) updateData.maximumPrice = maximumPrice ? parseInt(maximumPrice) : null;
        if (address) updateData.address = address;
        if (status) updateData.status = status;
        if (rejectionReason !== undefined) updateData.rejectionReason = rejectionReason || null;

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
                rejectionReason: true,
                createdAt: true,
                // BusinessGallery: {
                //     select: {
                //         id: true,
                //         title: true,
                //         description: true,
                //         media: true,
                //         createdAt: true,
                //     },
                //     orderBy: {
                //         createdAt: 'desc'
                //     }
                // }
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