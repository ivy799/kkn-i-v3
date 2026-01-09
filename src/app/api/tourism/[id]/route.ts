import { getPrisma } from '@/lib/prismaClient';
import { NextResponse, NextRequest } from 'next/server';

export async function PUT(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await ctx.params;

        const find_data = await getPrisma.tourismSpot.findUnique({
            where: { id: parseInt(id) }
        })

        if (!find_data) {
            return NextResponse.json(
                { message: 'Tourism spot not found' },
                { status: 404 }
            );
        }

        const body = await request.json();

        const {
            name,
            description,
            address,
            mapUrl,
            ticketPrice,
            openingHours,
            closingHours,
            contactPerson,
        } = body;

        const update_data = await getPrisma.tourismSpot.update({
            where: { id: parseInt(id) },
            data: {
                name,
                description,
                address,
                mapUrl: mapUrl || null,
                ticketPrice: ticketPrice ? parseInt(ticketPrice) : null,
                openingHours: openingHours || null,
                closingHours: closingHours || null,
                contactPerson: contactPerson || null,
            }
        })

        return NextResponse.json({
            message: 'Tourism spot updated successfully',
            data: update_data,
            success: true
        })

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
        })

        if (!find_data) {
            return NextResponse.json(
                { message: 'Tourism spot not found' },
                { status: 404 }
            );
        }

        const delete_data = await getPrisma.tourismSpot.delete({
            where: { id: parseInt(id) }
        })

        return NextResponse.json({
            message: 'Tourism spot deleted successfully',
            data: delete_data,
            success: true
        })

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
            include: {
                TourismSpotGallery: true,
                TourismSpotFacility: true,
            }
        })

        if (!tourismSpot) {
            return NextResponse.json(
                { success: false, message: 'Tourism spot not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            data: tourismSpot
        })
    } catch (error) {
        console.error('Error getting tourism spot:', error);
        return NextResponse.json(
            { success: false, message: 'Server error' },
            { status: 500 }
        )
    }
}