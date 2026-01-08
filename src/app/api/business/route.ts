import { getPrisma } from '@/lib/prismaClient';
import { NextResponse, NextRequest } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const type = formData.get("type") as string;
        const name = formData.get("name") as string;
        const slug = formData.get("slug") as string;
        const ownerName = formData.get("ownerName") as string;
        const phoneNumber = formData.get("phoneNumber") as string;
        const description = formData.get("description") as string;
        const minimumPrice = formData.get("minimumPrice") as string;
        const maximumPrice = formData.get("maximumPrice") as string;
        const address = formData.get("address") as string;
        const status = formData.get("status") as string;
        const file = formData.get("productsImage") as File | null;

        if (!type || !name || !ownerName || !phoneNumber || !description || !address) {
            return NextResponse.json(
                { message: "Type, name, owner name, phone number, description, and address are required" },
                { status: 400 }
            );
        }

        let imagePath: string | null = null;

        if (file && file.size > 0) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadDir = path.join(process.cwd(), "public", "uploads", "businesses");
            await mkdir(uploadDir, { recursive: true });

            const fileName = `${Date.now()}-${file.name}`;
            const filePath = path.join(uploadDir, fileName);

            await writeFile(filePath, buffer);
            imagePath = `/uploads/businesses/${fileName}`;
        }

        const newBusiness = await getPrisma.business.create({
            data: {
                type,
                name,
                slug: slug || null,
                ownerName,
                phoneNumber,
                description,
                minimumPrice: minimumPrice || null,
                maximumPrice: maximumPrice || null,
                address,
                productsImage: imagePath,
                status: status as any || 'PENDING',
            },
        });

        return NextResponse.json({
            message: "Business created successfully",
            data: newBusiness,
            success: true,
        });

    } catch (error) {
        console.error("Error creating business:", error);
        return NextResponse.json(
            { message: "Error creating business" },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const type = searchParams.get('type');

        const whereClause: any = {};
        
        if (status) {
            whereClause.status = status;
        }
        
        if (type) {
            whereClause.type = type;
        }

        const businesses = await getPrisma.business.findMany({
            where: whereClause,
            select: {
                id: true,
                type: true,
                status: true,
                name: true,
                slug: true,
                ownerName: true,
                phoneNumber: true,
                description: true,
                minimumPrice: true,
                maximumPrice: true,
                address: true,
                productsImage: true,
                rejectionReason: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json({
            message: 'Businesses acquired successfully',
            data: businesses,
            success: true
        });

    } catch (error) {
        console.error("Error getting businesses:", error);
        return NextResponse.json(
            { message: 'Error getting businesses' },
            { status: 500 }
        );
    }
}