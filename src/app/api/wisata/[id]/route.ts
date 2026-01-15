import { getPrisma } from '@/lib/prismaClient';
import { NextResponse, NextRequest } from 'next/server';
import { deleteFile, extractFilePathFromUrl } from '@/lib/storageUtils';

export async function PUT(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await ctx.params;

        const find_data = await getPrisma.tourismSpot.findUnique({
            where: { id: parseInt(id) }
        });

        if (!find_data) {
            return NextResponse.json(
                { message: 'Tourism spot not found' },
                { status: 404 }
            );
        }

        const body = await request.json();
        const {
            name,
            description,
            address,
            mapUrl,
            ticketPrice,
            openingHours,
            closingHours,
            contactPerson,
        } = body;

        const updateData: any = {};

        if (name) updateData.name = name;
        if (description) updateData.description = description;
        if (address) updateData.address = address;
        if (mapUrl !== undefined) updateData.mapUrl = mapUrl || null;
        if (ticketPrice !== undefined) updateData.ticketPrice = ticketPrice ? parseInt(ticketPrice) : null;
        if (openingHours !== undefined) updateData.openingHours = openingHours ? new Date(openingHours) : null;
        if (closingHours !== undefined) updateData.closingHours = closingHours ? new Date(closingHours) : null;
        if (contactPerson !== undefined) updateData.contactPerson = contactPerson || null;

        const update_data = await getPrisma.tourismSpot.update({
            where: { id: parseInt(id) },
            data: updateData
        });

        return NextResponse.json({
            message: 'Tourism spot updated successfully',
            data: update_data,
            success: true
        });

    } catch (error) {
        console.error('Error updating tourism spot:', error);
        return NextResponse.json(
            { message: 'Error updating tourism spot' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await ctx.params;

        console.log(`[DELETE TOURISM] Starting deletion for ID: ${id}`);

        const find_data = await getPrisma.tourismSpot.findUnique({
            where: { id: parseInt(id) },
            include: {
                TourismSpotGallery: true
            }
        });

        if (!find_data) {
            console.log(`[DELETE TOURISM] Tourism spot not found: ${id}`);
            return NextResponse.json(
                { message: 'Tourism spot not found' },
                { status: 404 }
            );
        }

        // Delete all gallery images from Supabase Storage
        const deletionErrors: string[] = [];
        if (find_data.TourismSpotGallery && find_data.TourismSpotGallery.length > 0) {
            console.log(`[DELETE TOURISM] Found ${find_data.TourismSpotGallery.length} gallery images to delete`);

            for (const gallery of find_data.TourismSpotGallery) {
                if (gallery.media) {
                    console.log(`[DELETE TOURISM] Processing gallery image: ${gallery.media}`);
                    const filePath = extractFilePathFromUrl(gallery.media, 'tourism');

                    if (filePath) {
                        const deleteResult = await deleteFile('tourism', filePath);
                        if (!deleteResult.success) {
                            const errorMsg = `Failed to delete image ${gallery.media}: ${deleteResult.error}`;
                            console.error(`[DELETE TOURISM]`, errorMsg);
                            deletionErrors.push(errorMsg);
                        }
                    } else {
                        const errorMsg = `Could not extract file path from URL: ${gallery.media}`;
                        console.error(`[DELETE TOURISM]`, errorMsg);
                        deletionErrors.push(errorMsg);
                    }
                }
            }
        }

        // Delete the tourism spot (cascade will delete gallery entries and facilities)
        const delete_data = await getPrisma.tourismSpot.delete({
            where: { id: parseInt(id) }
        });

        console.log(`[DELETE TOURISM] Successfully deleted tourism spot: ${id}`);

        // Return response with warnings if some files couldn't be deleted
        if (deletionErrors.length > 0) {
            console.warn(`[DELETE TOURISM] Completed with ${deletionErrors.length} file deletion errors`);
            return NextResponse.json({
                message: 'Tourism spot deleted but some images could not be removed from storage',
                data: delete_data,
                success: true,
                warnings: deletionErrors
            });
        }

        return NextResponse.json({
            message: 'Tourism spot deleted successfully',
            data: delete_data,
            success: true
        });

    } catch (error) {
        console.error('[DELETE TOURISM ERROR]', error);
        return NextResponse.json(
            { message: 'Error deleting tourism spot' },
            { status: 500 }
        );
    }
}

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await ctx.params;

        const tourismSpot = await getPrisma.tourismSpot.findUnique({
            where: { id: parseInt(id) },
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
                        title: true,
                        description: true,
                        media: true,
                        createdAt: true,
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                },
                TourismSpotFacility: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        createdAt: true,
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        });

        if (!tourismSpot) {
            return NextResponse.json(
                { success: false, message: 'Tourism spot not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: tourismSpot
        });
    } catch (error) {
        console.error('Error getting tourism spot:', error);
        return NextResponse.json(
            { success: false, message: 'Server error' },
            { status: 500 }
        );
    }
}