import { getPrisma } from '@/lib/prismaClient';
import { NextResponse, NextRequest } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const title = formData.get("title") as string;
        const slug = formData.get("slug") as string;
        const description = formData.get("description") as string;
        const location = formData.get("location") as string;
        const startDate = formData.get("startDate") as string;
        const endDate = formData.get("endDate") as string;
        const status = formData.get("status") as string;
        const file = formData.get("image") as File | null;

        if (!title || !description || !location || !startDate) {
            return NextResponse.json(
                { message: "Title, description, location, and start date are required" },
                { status: 400 }
            );
        }

        let imagePath: string | null = null;

        if (file && file.size > 0) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadDir = path.join(process.cwd(), "public", "uploads", "events");
            await mkdir(uploadDir, { recursive: true });

            const fileName = `${Date.now()}-${file.name}`;
            const filePath = path.join(uploadDir, fileName);

            await writeFile(filePath, buffer);
            imagePath = `/uploads/events/${fileName}`;
        }

        const newEvent = await getPrisma.event.create({
            data: {
                title,
                slug: slug || null,
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
                slug: true,
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