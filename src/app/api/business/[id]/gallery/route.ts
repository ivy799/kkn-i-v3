import { getPrisma } from '@/lib/prismaClient';
import { NextResponse, NextRequest } from 'next/server';
import { uploadFile } from '@/lib/storageUtils';

export async function POST(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await ctx.params;

        const business = await getPrisma.business.findUnique({
            where: { id: parseInt(id) }
        });

        if (!business) {
            return NextResponse.json(
                { message: 'Business not found' },
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

        // Upload file ke Supabase Storage
        const uploadResult = await uploadFile('businesses', file);

        if (!uploadResult.success) {
            return NextResponse.json(
                { message: `Error uploading media: ${uploadResult.error}` },
                { status: 500 }
            );
        }

        const mediaUrl = uploadResult.publicUrl || null;

        const newGallery = await getPrisma.businessGallery.create({
            data: {
                businessId: parseInt(id),
                title: title || null,
                description: description || null,
                media: mediaUrl,
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

        const galleries = await getPrisma.businessGallery.findMany({
            where: { businessId: parseInt(id) },
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