import { getPrisma } from '@/lib/prismaClient';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(_request: NextRequest) {
    try {
        let villageProfile = await getPrisma.villageProfile.findFirst();

        if (!villageProfile) {
            villageProfile = await getPrisma.villageProfile.create({
                data: {
                    villageName: null,
                    address: null,
                    email: null,
                    phone: null,
                    vision: null,
                    mission: null,
                    mapEmbedCode: null,
                }
            });
        }

        return NextResponse.json({
            message: 'Village profile acquired successfully',
            data: villageProfile,
            success: true
        });

    } catch (error) {
        console.error("Error getting village profile:", error);
        return NextResponse.json(
            { message: 'Error getting village profile' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            villageName,
            address,
            email,
            phone,
            vision,
            mission,
            mapEmbedCode
        } = body;

        let villageProfile = await getPrisma.villageProfile.findFirst();

        if (!villageProfile) {
            villageProfile = await getPrisma.villageProfile.create({
                data: {
                    villageName: villageName || null,
                    address: address || null,
                    email: email || null,
                    phone: phone || null,
                    vision: vision || null,
                    mission: mission || null,
                    mapEmbedCode: mapEmbedCode || null,
                }
            });

            return NextResponse.json({
                message: 'Village profile created successfully',
                data: villageProfile,
                success: true
            });
        }

        const updateData: any = {};
        
        if (villageName !== undefined) updateData.villageName = villageName || null;
        if (address !== undefined) updateData.address = address || null;
        if (email !== undefined) updateData.email = email || null;
        if (phone !== undefined) updateData.phone = phone || null;
        if (vision !== undefined) updateData.vision = vision || null;
        if (mission !== undefined) updateData.mission = mission || null;
        if (mapEmbedCode !== undefined) updateData.mapEmbedCode = mapEmbedCode || null;

        const updatedProfile = await getPrisma.villageProfile.update({
            where: { id: villageProfile.id },
            data: updateData
        });

        return NextResponse.json({
            message: 'Village profile updated successfully',
            data: updatedProfile,
            success: true
        });

    } catch (error) {
        console.error('Error updating village profile:', error);
        return NextResponse.json(
            { message: 'Error updating village profile' },
            { status: 500 }
        );
    }
}