import { getPrisma } from '@/lib/prismaClient';
import { NextResponse, NextRequest } from 'next/server';
import { uploadFile } from '@/lib/storageUtils';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const location = formData.get('location') as string;
        const startDate = formData.get('startDate') as string;
        const endDate = formData.get('endDate') as string | null;
        const image = formData.get('image') as File | null;
        const status = formData.get('status') as string;

        if (!title || !description || !location || !startDate) {
            return NextResponse.json(
                { message: "Title, description, location, and start date are required" },
                { status: 400 }
            );
        }

        let imageUrl: string | null = null;

        // Upload image ke Supabase Storage jika ada
        if (image && image.size > 0) {
            const uploadResult = await uploadFile('events', image);

            if (!uploadResult.success) {
                return NextResponse.json(
                    { message: `Error uploading image: ${uploadResult.error}` },
                    { status: 500 }
                );
            }

            imageUrl = uploadResult.publicUrl || null;
        }

        const newEvent = await getPrisma.event.create({
            data: {
                title,
                description,
                location,
                startDate: new Date(startDate),
                endDate: endDate ? new Date(endDate) : null,
                image: imageUrl,
                status: status as any || 'UPCOMING',
            },
        });

        return NextResponse.json({
            message: "Event created successfully",
            data: newEvent,
            success: true,
        });

    } catch (error) {
        console.error("Error creating event:", error);
        return NextResponse.json(
            { message: "Error creating event" },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const events = await getPrisma.event.findMany({
            select: {
                id: true,
                title: true,
                description: true,
                location: true,
                startDate: true,
                endDate: true,
                image: true,
                status: true,
            },
            orderBy: {
                startDate: 'desc'
            }
        })

        return NextResponse.json({
            message: 'Events acquired successfully',
            data: events,
            success: true
        })

    } catch (error) {
        console.error("Error getting events:", error);
        return NextResponse.json(
            { message: 'Error getting events' },
            { status: 500 }
        );
    }
}