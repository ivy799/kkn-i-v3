import { getPrisma } from '@/lib/prismaClient';
import { NextResponse, NextRequest } from 'next/server';

export async function DELETE(
    _req: NextRequest, 
    ctx: { params: Promise<{ id: string; galleryId: string }> }
) {
    try {
        const { id, galleryId } = await ctx.params;

        const gallery = await getPrisma.businessGallery.findFirst({
            where: { 
                id: parseInt(galleryId),
                businessId: parseInt(id)
            }
        });

        if (!gallery) {
            return NextResponse.json(
                { message: 'Gallery not found' },
                { status: 404 }
            );
        }

        await getPrisma.businessGallery.delete({
            where: { id: parseInt(galleryId) }
        });

        return NextResponse.json({
            message: 'Gallery deleted successfully',
            success: true
        });

    } catch (error) {
        console.error('Error deleting gallery:', error);
        return NextResponse.json(
            { message: 'Error deleting gallery' },
            { status: 500 }
        );
    }
}