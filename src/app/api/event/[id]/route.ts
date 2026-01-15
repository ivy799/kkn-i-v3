import { getPrisma } from '@/lib/prismaClient';
import { NextResponse, NextRequest } from 'next/server';
import { uploadFile, deleteFile, extractFilePathFromUrl } from '@/lib/storageUtils';

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

        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const location = formData.get('location') as string;
        const startDate = formData.get('startDate') as string;
        const endDate = formData.get('endDate') as string | null;
        const image = formData.get('image') as File | null;
        const status = formData.get('status') as string;

        let imageUrl: string | null = null;

        // Upload image baru ke Supabase Storage jika ada
        if (image && image.size > 0) {
            // Hapus gambar lama jika ada
            if (find_data.image) {
                const oldFilePath = extractFilePathFromUrl(find_data.image, 'events');
                if (oldFilePath) {
                    await deleteFile('events', oldFilePath);
                }
            }

            // Upload gambar baru
            const uploadResult = await uploadFile('events', image);

            if (!uploadResult.success) {
                return NextResponse.json(
                    { message: `Error uploading image: ${uploadResult.error}` },
                    { status: 500 }
                );
            }

            imageUrl = uploadResult.publicUrl || null;
        }

        const updateData: any = {
            title,
            description,
            location,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : null,
            status: status as any,
        };

        if (imageUrl) {
            updateData.image = imageUrl;
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

        console.log(`[DELETE EVENT] Starting deletion for ID: ${id}`);

        const find_data = await getPrisma.event.findUnique({
            where: { id: parseInt(id) }
        })

        if (!find_data) {
            console.log(`[DELETE EVENT] Event not found: ${id}`);
            return NextResponse.json(
                { message: 'Event not found' },
                { status: 404 }
            );
        }

        // Hapus gambar dari Supabase Storage jika ada
        let deletionError: string | null = null;
        if (find_data.image) {
            console.log(`[DELETE EVENT] Processing image: ${find_data.image}`);
            const filePath = extractFilePathFromUrl(find_data.image, 'events');

            if (filePath) {
                const deleteResult = await deleteFile('events', filePath);
                if (!deleteResult.success) {
                    deletionError = `Failed to delete image ${find_data.image}: ${deleteResult.error}`;
                    console.error(`[DELETE EVENT]`, deletionError);
                }
            } else {
                deletionError = `Could not extract file path from URL: ${find_data.image}`;
                console.error(`[DELETE EVENT]`, deletionError);
            }
        }

        const delete_data = await getPrisma.event.delete({
            where: { id: parseInt(id) }
        })

        console.log(`[DELETE EVENT] Successfully deleted event: ${id}`);

        // Return response with warning if file couldn't be deleted
        if (deletionError) {
            console.warn(`[DELETE EVENT] Completed with file deletion error`);
            return NextResponse.json({
                message: 'Event deleted but image could not be removed from storage',
                data: delete_data,
                success: true,
                warning: deletionError
            })
        }

        return NextResponse.json({
            message: 'Event deleted successfully',
            data: delete_data,
            success: true
        })

    } catch (error) {
        console.error('[DELETE EVENT ERROR]', error);
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