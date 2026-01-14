import { getPrisma } from '@/lib/prismaClient';
import { NextResponse, NextRequest } from 'next/server';
import { uploadFile } from '@/lib/storageUtils';

// GET - Fetch current user's businesses
export async function GET(request: NextRequest) {
    try {
        const userId = request.headers.get('x-user-id');

        if (!userId) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const businesses = await getPrisma.business.findMany({
            where: {
                // @ts-ignore - userId will exist after prisma generate
                userId: parseInt(userId),
            },
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
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json({
            message: 'User businesses acquired successfully',
            data: businesses,
            success: true
        });

    } catch (error) {
        console.error("Error getting user businesses:", error);
        return NextResponse.json(
            { success: false, message: 'Error getting user businesses' },
            { status: 500 }
        );
    }
}

// POST - Submit new business request
export async function POST(request: NextRequest) {
    try {
        // Coba ambil dari header dulu (jika middleware aktif)
        let userId = request.headers.get('x-user-id');

        // Jika tidak ada header (middleware dimatikan), baca token dari cookies
        if (!userId) {
            const token = request.cookies.get('auth_token')?.value;
            console.log('📝 [API] No x-user-id header, reading token from cookies:', token ? 'exists' : 'missing');

            if (!token) {
                return NextResponse.json(
                    { success: false, message: 'Unauthorized - No token' },
                    { status: 401 }
                );
            }

            try {
                // Import verifyToken
                const { verifyToken } = await import('@/lib/jwt');
                const payload = verifyToken(token);
                console.log('✅ [API] Token verified - User ID:', payload.userId);
                userId = payload.userId.toString();
            } catch (error) {
                console.log('❌ [API] Invalid token:', error);
                return NextResponse.json(
                    { success: false, message: 'Invalid token' },
                    { status: 401 }
                );
            }
        } else {
            console.log('✅ [API] Using x-user-id from middleware:', userId);
        }

        const formData = await request.formData();

        const type = formData.get('type') as string;
        const name = formData.get('name') as string;
        const ownerName = formData.get('ownerName') as string;
        const phoneNumber = formData.get('phoneNumber') as string;
        const description = formData.get('description') as string;
        const minimumPrice = formData.get('minimumPrice') as string;
        const maximumPrice = formData.get('maximumPrice') as string;
        const address = formData.get('address') as string;
        const images = formData.getAll('images') as File[];

        if (!type || !name || !ownerName || !phoneNumber || !description || !address) {
            return NextResponse.json(
                { success: false, message: "Semua field wajib harus diisi" },
                { status: 400 }
            );
        }

        // Create business with PENDING status and linked to user
        const newBusiness = await getPrisma.business.create({
            data: {
                type,
                name,
                ownerName,
                phoneNumber,
                description,
                minimumPrice: minimumPrice ? parseFloat(minimumPrice) : null,
                maximumPrice: maximumPrice ? parseFloat(maximumPrice) : null,
                address,
                status: 'PENDING',
                // @ts-ignore - userId will exist after prisma generate
                userId: parseInt(userId),
            },
        });

        // Upload images ke Supabase Storage dan buat gallery entries
        if (images && images.length > 0) {
            for (const image of images) {
                if (image && image.size > 0) {
                    const uploadResult = await uploadFile('businesses', image);

                    if (uploadResult.success && uploadResult.publicUrl) {
                        await getPrisma.businessGallery.create({
                            data: {
                                businessId: newBusiness.id,
                                media: uploadResult.publicUrl,
                                title: null,
                                description: null,
                            },
                        });
                    }
                }
            }
        }

        return NextResponse.json({
            message: "Pengajuan bisnis berhasil dikirim",
            data: newBusiness,
            success: true,
        });

    } catch (error) {
        console.error("Error creating business request:", error);
        return NextResponse.json(
            { success: false, message: "Error creating business request" },
            { status: 500 }
        );
    }
}
