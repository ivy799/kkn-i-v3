import { getPrisma } from '@/lib/prismaClient';
import { NextResponse, NextRequest } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        const {
            title,
            description,
            location,
            startDate,
            endDate,
            image,
            status,
        } = body;

        if (!title || !description || !location || !startDate) {
            return NextResponse.json(
                { message: "Title, description, location, and start date are required" },
                { status: 400 }
            );
        }

        let imagePath: string | null = null;

        if (image && image.size > 0) {
            const bytes = await image.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadDir = path.join(process.cwd(), "public", "uploads", "events");
            await mkdir(uploadDir, { recursive: true });

            const fileName = `${Date.now()}-${image.name}`;
            const filePath = path.join(uploadDir, fileName);

            await writeFile(filePath, buffer);
            imagePath = `/uploads/events/${fileName}`;
        }

        const newEvent = await getPrisma.event.create({
            data: {
                title,
                description,
                location,
                startDate: new Date(startDate),
                endDate: endDate ? new Date(endDate) : null,
                image: imagePath,
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