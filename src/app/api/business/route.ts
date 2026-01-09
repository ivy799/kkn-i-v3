import { getPrisma } from '@/lib/prismaClient';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        
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
        } = body;

        if (!type || !name || !ownerName || !phoneNumber || !description || !address) {
            return NextResponse.json(
                { message: "Type, name, owner name, phone number, description, and address are required" },
                { status: 400 }
            );
        }

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