import { getPrisma } from '@/lib/prismaClient';
import { NextResponse, NextRequest } from 'next/server';

export async function PUT(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await ctx.params;

        const find_data = await getPrisma.tourismSpot.findUnique({
            where: { id: parseInt(id) }
        });

        if (!find_data) {
            return NextResponse.json(
                { message: 'Tourism spot not found' },
                { status: 404 }
            );
        }

        const formData = await request.formData();
        const name = formData.get("name") as string;
        const slug = formData.get("slug") as string;
        const description = formData.get("description") as string;
        const address = formData.get("address") as string;
        const mapUrl = formData.get("mapUrl") as string;
        const ticketPrice = formData.get("ticketPrice") as string;
        const openingHours = formData.get("openingHours") as string;
        const closingHours = formData.get("closingHours") as string;
        const contactPerson = formData.get("contactPerson") as string;

        const updateData: any = {};

        if (name) updateData.name = name;
        if (slug !== undefined) updateData.slug = slug || null;
        if (description) updateData.description = description;
        if (address) updateData.address = address;
        if (mapUrl !== undefined) updateData.mapUrl = mapUrl || null;
        if (ticketPrice !== undefined) updateData.ticketPrice = ticketPrice || null;
        if (openingHours !== undefined) updateData.openingHours = openingHours ? parseInt(openingHours) : null;
        if (closingHours !== undefined) updateData.closingHours = closingHours ? parseInt(closingHours) : null;
        if (contactPerson !== undefined) updateData.contactPerson = contactPerson || null;

        const update_data = await getPrisma.tourismSpot.update({
            where: { id: parseInt(id) },
            data: updateData
        });

        return NextResponse.json({
            message: 'Tourism spot updated successfully',
            data: update_data,
            success: true
        });

    } catch (error) {
        console.error('Error updating tourism spot:', error);
        return NextResponse.json(
            { message: 'Error updating tourism spot' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await ctx.params;

        const find_data = await getPrisma.tourismSpot.findUnique({
            where: { id: parseInt(id) }
        });

        if (!find_data) {
            return NextResponse.json(
                { message: 'Tourism spot not found' },
                { status: 404 }
            );
        }

        const delete_data = await getPrisma.tourismSpot.delete({
            where: { id: parseInt(id) }
        });

        return NextResponse.json({
            message: 'Tourism spot deleted successfully',
            data: delete_data,
            success: true
        });

    } catch (error) {
        console.error('Error deleting tourism spot:', error);
        return NextResponse.json(
            { message: 'Error deleting tourism spot' },
            { status: 500 }
        );
    }
}

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await ctx.params;
        
        const tourismSpot = await getPrisma.tourismSpot.findUnique({
            where: { id: parseInt(id) },
            select: {
                id: true,
                name: true,
                slug: true,
                description: true,
                address: true,
                mapUrl: true,
                ticketPrice: true,
                openingHours: true,
                closingHours: true,
                contactPerson: true,
                TourismSpotGallery: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        media: true,
                        createdAt: true,
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                },
                TourismSpotFacility: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        createdAt: true,
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        });

        if (!tourismSpot) {
            return NextResponse.json(
                { success: false, message: 'Tourism spot not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: tourismSpot
        });
    } catch (error) {
        console.error('Error getting tourism spot:', error);
        return NextResponse.json(
            { success: false, message: 'Server error' },
            { status: 500 }
        );
    }
}