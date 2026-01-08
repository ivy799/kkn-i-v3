import { getPrisma } from '@/lib/prismaClient';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await ctx.params;

        const tourismSpot = await getPrisma.tourismSpot.findUnique({
            where: { id: parseInt(id) }
        });

        if (!tourismSpot) {
            return NextResponse.json(
                { message: 'Tourism spot not found' },
                { status: 404 }
            );
        }

        const body = await request.json();
        const { name, description } = body;

        if (!name) {
            return NextResponse.json(
                { message: "Facility name is required" },
                { status: 400 }
            );
        }

        const newFacility = await getPrisma.tourismSpotFacility.create({
            data: {
                tourismSpotId: parseInt(id),
                name,
                description: description || null,
            },
        });

        return NextResponse.json({
            message: "Facility added successfully",
            data: newFacility,
            success: true,
        });

    } catch (error) {
        console.error("Error adding facility:", error);
        return NextResponse.json(
            { message: "Error adding facility" },
            { status: 500 }
        );
    }
}

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await ctx.params;

        const facilities = await getPrisma.tourismSpotFacility.findMany({
            where: { tourismSpotId: parseInt(id) },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({
            message: 'Facilities acquired successfully',
            data: facilities,
            success: true
        });

    } catch (error) {
        console.error("Error getting facilities:", error);
        return NextResponse.json(
            { message: 'Error getting facilities' },
            { status: 500 }
        );
    }
}