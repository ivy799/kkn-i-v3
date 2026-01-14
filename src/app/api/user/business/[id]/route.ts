import { getPrisma } from '@/lib/prismaClient';
import { NextResponse, NextRequest } from 'next/server';
import { deleteFile, extractFilePathFromUrl } from '@/lib/storageUtils';

// DELETE - Delete user's own business (only PENDING or REJECTED)
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const userId = request.headers.get('x-user-id');
        const { id } = await params;
        const businessId = parseInt(id);

        if (!userId) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Find the business and verify ownership
        const business = await getPrisma.business.findUnique({
            where: { id: businessId },
            include: {
                BusinessGallery: true,
            }
        });

        if (!business) {
            return NextResponse.json(
                { success: false, message: 'Bisnis tidak ditemukan' },
                { status: 404 }
            );
        }

        // Check if user owns this business
        // @ts-ignore - userId will exist after prisma generate
        if (business.userId !== parseInt(userId)) {
            return NextResponse.json(
                { success: false, message: 'Anda tidak memiliki akses untuk menghapus bisnis ini' },
                { status: 403 }
            );
        }

        // Only allow deletion of PENDING or REJECTED businesses
        if (business.status === 'APPROVED') {
            return NextResponse.json(
                { success: false, message: 'Bisnis yang sudah disetujui tidak dapat dihapus' },
                { status: 400 }
            );
        }

        // Delete images from storage
        for (const gallery of business.BusinessGallery) {
            if (gallery.media) {
                const filePath = extractFilePathFromUrl(gallery.media, 'businesses');
                if (filePath) {
                    await deleteFile('businesses', filePath);
                }
            }
        }

        // Delete the business (cascade will delete gallery entries)
        await getPrisma.business.delete({
            where: { id: businessId }
        });

        return NextResponse.json({
            success: true,
            message: 'Bisnis berhasil dihapus'
        });

    } catch (error) {
        console.error("Error deleting user business:", error);
        return NextResponse.json(
            { success: false, message: 'Error deleting business' },
            { status: 500 }
        );
    }
}
