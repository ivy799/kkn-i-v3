import { getPrisma } from '@/lib/prismaClient';
import { NextResponse, NextRequest } from 'next/server';
import { deleteFile, extractFilePathFromUrl } from '@/lib/storageUtils';

export async function PUT(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await ctx.params;

        const find_data = await getPrisma.business.findUnique({
            where: { id: parseInt(id) }
        });

        if (!find_data) {
            return NextResponse.json(
                { message: 'Business not found' },
                { status: 404 }
            );
        }

        const body = await request.json();
        const {
            type,
            status,
            name,
            ownerName,
            phoneNumber,
            description,
            minimumPrice,
            maximumPrice,
            address,
            rejectionReason,
        } = body;

        const validStatuses = ['PENDING', 'APPROVED', 'REJECTED'];
        if (status && !validStatuses.includes(status)) {
            return NextResponse.json(
                { message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
                { status: 400 }
            );
        }

        const updateData: any = {};

        if (type) updateData.type = type;
        if (name) updateData.name = name;
        if (ownerName) updateData.ownerName = ownerName;
        if (phoneNumber) updateData.phoneNumber = phoneNumber;
        if (description) updateData.description = description;
        if (minimumPrice !== undefined) updateData.minimumPrice = minimumPrice ? parseInt(minimumPrice) : null;
        if (maximumPrice !== undefined) updateData.maximumPrice = maximumPrice ? parseInt(maximumPrice) : null;
        if (address) updateData.address = address;
        if (status) updateData.status = status;
        if (rejectionReason !== undefined) updateData.rejectionReason = rejectionReason || null;

        const update_data = await getPrisma.business.update({
            where: { id: parseInt(id) },
            data: updateData
        });

        return NextResponse.json({
            message: 'Business updated successfully',
            data: update_data,
            success: true
        });

    } catch (error) {
        console.error('Error updating business:', error);
        return NextResponse.json(
            { message: 'Error updating business' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await ctx.params;

        console.log(`[DELETE BUSINESS] Starting deletion for ID: ${id}`);

        const find_data = await getPrisma.business.findUnique({
            where: { id: parseInt(id) },
            include: {
                BusinessGallery: true
            }
        });

        if (!find_data) {
            console.log(`[DELETE BUSINESS] Business not found: ${id}`);
            return NextResponse.json(
                { message: 'Business not found' },
                { status: 404 }
            );
        }

        // Delete all gallery images from Supabase Storage
        const deletionErrors: string[] = [];
        if (find_data.BusinessGallery && find_data.BusinessGallery.length > 0) {
            console.log(`[DELETE BUSINESS] Found ${find_data.BusinessGallery.length} gallery images to delete`);

            for (const gallery of find_data.BusinessGallery) {
                if (gallery.media) {
                    console.log(`[DELETE BUSINESS] Processing gallery image: ${gallery.media}`);
                    const filePath = extractFilePathFromUrl(gallery.media, 'businesses');

                    if (filePath) {
                        const deleteResult = await deleteFile('businesses', filePath);
                        if (!deleteResult.success) {
                            const errorMsg = `Failed to delete image ${gallery.media}: ${deleteResult.error}`;
                            console.error(`[DELETE BUSINESS]`, errorMsg);
                            deletionErrors.push(errorMsg);
                        }
                    } else {
                        const errorMsg = `Could not extract file path from URL: ${gallery.media}`;
                        console.error(`[DELETE BUSINESS]`, errorMsg);
                        deletionErrors.push(errorMsg);
                    }
                }
            }
        }

        // Delete the business (cascade will delete gallery entries)
        const delete_data = await getPrisma.business.delete({
            where: { id: parseInt(id) }
        });

        console.log(`[DELETE BUSINESS] Successfully deleted business: ${id}`);

        // Return response with warnings if some files couldn't be deleted
        if (deletionErrors.length > 0) {
            console.warn(`[DELETE BUSINESS] Completed with ${deletionErrors.length} file deletion errors`);
            return NextResponse.json({
                message: 'Business deleted but some images could not be removed from storage',
                data: delete_data,
                success: true,
                warnings: deletionErrors
            });
        }

        return NextResponse.json({
            message: 'Business deleted successfully',
            data: delete_data,
            success: true
        });

    } catch (error) {
        console.error('[DELETE BUSINESS ERROR]', error);
        return NextResponse.json(
            { message: 'Error deleting business' },
            { status: 500 }
        );
    }
}

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await ctx.params;

        const business = await getPrisma.business.findUnique({
            where: { id: parseInt(id) },
            select: {
                id: true,
                type: true,
                status: true,
                name: true,
                ownerName: true,
                phoneNumber: true,
                description: true,
                minimumPrice: true,
                maximumPrice: true,
                address: true,
                rejectionReason: true,
                createdAt: true,
                BusinessGallery: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        media: true,
                        createdAt: true,
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        });

        if (!business) {
            return NextResponse.json(
                { success: false, message: 'Business not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: business
        });
    } catch (error) {
        console.error('Error getting business:', error);
        return NextResponse.json(
            { success: false, message: 'Server error' },
            { status: 500 }
        );
    }
}