import { getPrisma } from '@/lib/prismaClient';
import { NextResponse, NextRequest } from 'next/server';
import { uploadFile } from '@/lib/storageUtils';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        const name = formData.get("name") as string;
        const description = formData.get("description") as string;
        const address = formData.get("address") as string;
        const mapUrl = formData.get("mapUrl") as string;
        const ticketPrice = formData.get("ticketPrice") as string;
        const openingHours = formData.get("openingHours") as string;
        const closingHours = formData.get("closingHours") as string;
        const contactPerson = formData.get("contactPerson") as string;
        const images = formData.getAll("images") as File[];

        if (!name || !description || !address) {
            return NextResponse.json(
                { message: "Name, description, and address are required" },
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

        // Upload images ke Supabase Storage dan buat gallery entries
        if (images && images.length > 0) {
            for (const image of images) {
                if (image && image.size > 0) {
                    const uploadResult = await uploadFile('tourism', image);

                    if (uploadResult.success && uploadResult.publicUrl) {
                        await getPrisma.tourismSpotGallery.create({
                            data: {
                                tourismSpotId: newTourismSpot.id,
                                media: uploadResult.publicUrl,
                            },
                        });
                    }
                }
            }
        }

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
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        const priceMin = searchParams.get('priceMin');
        const priceMax = searchParams.get('priceMax');
        const facilities = searchParams.get('facilities')?.split(',').filter(Boolean) || [];

        // Build where clause for filtering
        const where: any = {};

        // Search filter (name or description)
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }

        // Price range filter
        if (priceMin || priceMax) {
            where.ticketPrice = {};
            if (priceMin) where.ticketPrice.gte = parseInt(priceMin);
            if (priceMax) where.ticketPrice.lte = parseInt(priceMax);
        }

        // Facilities filter
        if (facilities.length > 0) {
            where.TourismSpotFacility = {
                some: {
                    name: {
                        in: facilities
                    }
                }
            };
        }

        const tourismSpots = await getPrisma.tourismSpot.findMany({
            where,
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
                        media: true,
                        title: true,
                        description: true,
                    },
                    take: 1,
                },
                TourismSpotFacility: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                    },
                },
            },
            orderBy: {
                id: 'desc'
            }
        })

        return NextResponse.json({
            message: 'Tourism spots acquired successfully',
            data: tourismSpots,
            success: true
        })

    } catch (error) {
        console.error("Error getting tourism spots:", error);
        return NextResponse.json(
            { message: 'Error getting tourism spots' },
            { status: 500 }
        );
    }
}