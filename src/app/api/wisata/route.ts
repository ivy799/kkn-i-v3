import { getPrisma } from '@/lib/prismaClient';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const {
            name,
            description,
            address,
            mapUrl,
            ticketPrice,
            openingHours,
            closingHours,
            contactPerson
        } = body;

        if (!name || !description || !address) {
            return NextResponse.json(
                { message: "Name, description, and address are required" },
                { status: 400 }
            );
        }

        const existingSpot = await getPrisma.tourismSpot.findFirst({
            where: { name }
        });

        if (existingSpot) {
            return NextResponse.json(
                { message: "A tourism spot with this name already exists" },
                { status: 400 }
            );
        }

        const newTourismSpot = await getPrisma.tourismSpot.create({
            data: {
                name,
                description,
                address,
                mapUrl: mapUrl || null,
                ticketPrice: ticketPrice ? parseInt(ticketPrice) : null,
                openingHours: openingHours || null,
                closingHours: closingHours || null,
                contactPerson: contactPerson || null,
            },
        });

        return NextResponse.json({
            message: "Tourism spot created successfully",
            data: newTourismSpot,
            success: true,
        });

    } catch (error) {
        console.error("Error creating tourism spot:", error);
        return NextResponse.json(
            { message: "Error creating tourism spot" },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const tourismSpots = await getPrisma.tourismSpot.findMany({
            select: {
                id: true,
                name: true,
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
                    }
                },
                TourismSpotFacility: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        createdAt: true,
                    }
                }
            },
            orderBy: {
                name: 'asc'
            }
        });

        return NextResponse.json({
            message: 'Tourism spots acquired successfully',
            data: tourismSpots,
            success: true
        });

    } catch (error) {
        console.error("Error getting tourism spots:", error);
        return NextResponse.json(
            { message: 'Error getting tourism spots' },
            { status: 500 }
        );
    }
}