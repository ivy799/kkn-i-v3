import { getPrisma } from '@/lib/prismaClient';
import { NextResponse, NextRequest } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function PUT(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await ctx.params;

        const find_data = await getPrisma.event.findUnique({
            where: { id: parseInt(id) }
        })

        if (!find_data) {
            return NextResponse.json(
                { message: 'Event not found' },
                { status: 404 }
            );
        }

        const formData = await request.formData();
        const title = formData.get("title") as string;
        const slug = formData.get("slug") as string;
        const description = formData.get("description") as string;
        const location = formData.get("location") as string;
        const startDate = formData.get("startDate") as string;
        const endDate = formData.get("endDate") as string;
        const status = formData.get("status") as string;
        const file = formData.get("image") as File | null;

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

        const updateData: any = {
            title,
            slug: slug || null,
            description,
            location,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : null,
            status: status as any,
        };

        if (imagePath) {
            updateData.image = imagePath;
        }

        const update_data = await getPrisma.event.update({
            where: { id: parseInt(id) },
            data: updateData
        })

        return NextResponse.json({
            message: 'Event updated successfully',
            data: update_data,
            success: true
        })

    } catch (error) {
        console.error('Error updating event:', error);
        return NextResponse.json(
            { message: 'Error updating event' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await ctx.params;

        const find_data = await getPrisma.event.findUnique({
            where: { id: parseInt(id) }
        })

        if (!find_data) {
            return NextResponse.json(
                { message: 'Event not found' },
                { status: 404 }
            );
        }

        const delete_data = await getPrisma.event.delete({
            where: { id: parseInt(id) }
        })

        return NextResponse.json({
            message: 'Event deleted successfully',
            data: delete_data,
            success: true
        })

    } catch (error) {
        console.error('Error deleting event:', error);
        return NextResponse.json(
            { message: 'Error deleting event' },
            { status: 500 }
        );
    }
}

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await ctx.params;
        
        const event = await getPrisma.event.findUnique({
            where: { id: parseInt(id) },
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
            }
        })

        if (!event) {
            return NextResponse.json(
                { success: false, message: 'Event not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            data: event
        })
    } catch (error) {
        console.error('Error getting event:', error);
        return NextResponse.json(
            { success: false, message: 'Server error' },
            { status: 500 }
        )
    }
}