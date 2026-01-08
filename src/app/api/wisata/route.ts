import { getPrisma } from '@/lib/prismaClient';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    try {
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

        if (!name || !description || !address) {
            return NextResponse.json(
                { message: "Name, description, and address are required" },
                { status: 400 }
            );
        }

        const newTourismSpot = await getPrisma.tourismSpot.create({
            data: {
                name,
                slug: slug || null,
                description,
                address,
                mapUrl: mapUrl || null,
                ticketPrice: ticketPrice || null,
                openingHours: openingHours ? parseInt(openingHours) : null,
                closingHours: closingHours ? parseInt(closingHours) : null,
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