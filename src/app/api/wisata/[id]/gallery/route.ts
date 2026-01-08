import { getPrisma } from '@/lib/prismaClient';
import { NextResponse, NextRequest } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

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

        const formData = await request.formData();
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const file = formData.get("media") as File | null;

        if (!file || file.size === 0) {
            return NextResponse.json(
                { message: "Media file is required" },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadDir = path.join(process.cwd(), "public", "uploads", "tourism");
        await mkdir(uploadDir, { recursive: true });

        const fileName = `${Date.now()}-${file.name}`;
        const filePath = path.join(uploadDir, fileName);

        await writeFile(filePath, buffer);
        const mediaPath = `/uploads/tourism/${fileName}`;

        const newGallery = await getPrisma.tourismSpotGallery.create({
            data: {
                tourismSpotId: parseInt(id),
                title: title || null,
                description: description || null,
                media: mediaPath,
            },
        });

        return NextResponse.json({
            message: "Gallery added successfully",
            data: newGallery,
            success: true,
        });

    } catch (error) {
        console.error("Error adding gallery:", error);
        return NextResponse.json(
            { message: "Error adding gallery" },
            { status: 500 }
        );
    }
}

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await ctx.params;

        const galleries = await getPrisma.tourismSpotGallery.findMany({
            where: { tourismSpotId: parseInt(id) },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({
            message: 'Galleries acquired successfully',
            data: galleries,
            success: true
        });

    } catch (error) {
        console.error("Error getting galleries:", error);
        return NextResponse.json(
            { message: 'Error getting galleries' },
            { status: 500 }
        );
    }
}