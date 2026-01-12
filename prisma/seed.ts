import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { uploadFile } from '../src/lib/storageUtils';
import * as fs from 'fs';
import * as path from 'path';

const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

// Helper function to upload image from public folder
async function uploadImageFromPublic(imagePath: string, bucket: string): Promise<string | null> {
    try {
        const fullPath = path.join(process.cwd(), 'public', imagePath);

        if (!fs.existsSync(fullPath)) {
            console.error(`Image not found: ${fullPath}`);
            return null;
        }

        const fileBuffer = fs.readFileSync(fullPath);
        const fileName = path.basename(imagePath);
        const mimeType = fileName.endsWith('.jpeg') || fileName.endsWith('.jpg')
            ? 'image/jpeg'
            : fileName.endsWith('.png')
                ? 'image/png'
                : 'image/jpeg';

        // Create a File-like object from buffer
        const file = new File([fileBuffer], fileName, { type: mimeType });

        const uploadResult = await uploadFile(bucket, file);

        if (uploadResult.success && uploadResult.publicUrl) {
            console.log(`✓ Uploaded: ${fileName} -> ${uploadResult.publicUrl}`);
            return uploadResult.publicUrl;
        } else {
            console.error(`✗ Failed to upload ${fileName}:`, uploadResult.error);
            return null;
        }
    } catch (error) {
        console.error(`Error uploading image ${imagePath}:`, error);
        return null;
    }
}

async function main() {
    console.log('Starting seeding...');

    // // Clear existing data
    // await prisma.tourismSpotGallery.deleteMany({});
    // await prisma.tourismSpotFacility.deleteMany({});
    // await prisma.tourismSpot.deleteMany({});

    // // Seed Tourism Spots
    // console.log('\n📍 Creating Tourism Spot 1: Pantai Indah Kapuk...');
    // const tourismSpot1 = await prisma.tourismSpot.create({
    //     data: {
    //         name: 'Pantai Indah Kapuk',
    //         description: 'Pantai yang indah dengan pemandangan sunset yang menakjubkan. Tempat yang sempurna untuk bersantai bersama keluarga dan menikmati keindahan alam.',
    //         address: 'Jl. Pantai Indah No. 123, Desa Wisata',
    //         mapUrl: 'https://maps.google.com/?q=-6.2088,106.8456',
    //         ticketPrice: 15000,
    //         openingHours: '08:00',
    //         closingHours: '18:00',
    //         contactPerson: '081234567890',
    //         TourismSpotFacility: {
    //             create: [
    //                 {
    //                     name: 'Area Parkir',
    //                     description: 'Area parkir luas untuk kendaraan roda dua dan roda empat',
    //                 },
    //                 {
    //                     name: 'Toilet Umum',
    //                     description: 'Fasilitas toilet yang bersih dan terawat',
    //                 },
    //                 {
    //                     name: 'Warung Makan',
    //                     description: 'Tersedia berbagai warung makan dengan menu lokal',
    //                 },
    //             ],
    //         },
    //     },
    // });

    // // Upload images for Tourism Spot 1
    // console.log('  📸 Uploading images...');
    // const image1 = await uploadImageFromPublic('img/img-01.jpeg', 'tourism');
    // if (image1) {
    //     await prisma.tourismSpotGallery.create({
    //         data: {
    //             tourismSpotId: tourismSpot1.id,
    //             title: 'Pemandangan Pantai',
    //             description: 'Pemandangan pantai yang indah di sore hari',
    //             media: image1,
    //         },
    //     });
    // }

    // const image2 = await uploadImageFromPublic('img/img-02.jpeg', 'tourism');
    // if (image2) {
    //     await prisma.tourismSpotGallery.create({
    //         data: {
    //             tourismSpotId: tourismSpot1.id,
    //             title: 'Sunset di Pantai',
    //             description: 'Matahari terbenam yang menakjubkan',
    //             media: image2,
    //         },
    //     });
    // }
    // console.log('  ✓ Tourism Spot 1 created successfully!\n');


    // // Tourism Spot 2
    // console.log('📍 Creating Tourism Spot 2: Air Terjun Pelangi...');
    // const tourismSpot2 = await prisma.tourismSpot.create({
    //     data: {
    //         name: 'Air Terjun Pelangi',
    //         description: 'Air terjun yang spektakuler dengan ketinggian 50 meter. Airnya yang jernih dan suasana yang sejuk membuat tempat ini sangat cocok untuk refreshing.',
    //         address: 'Jl. Gunung Hijau No. 45, Desa Wisata',
    //         mapUrl: 'https://maps.google.com/?q=-6.2188,106.8556',
    //         ticketPrice: 20000,
    //         openingHours: '07:00',
    //         closingHours: '17:00',
    //         contactPerson: '081234567891',
    //         TourismSpotFacility: {
    //             create: [
    //                 {
    //                     name: 'Gazebo',
    //                     description: 'Gazebo untuk beristirahat dan menikmati pemandangan',
    //                 },
    //                 {
    //                     name: 'Jalur Trekking',
    //                     description: 'Jalur trekking yang aman menuju air terjun',
    //                 },
    //                 {
    //                     name: 'Area Piknik',
    //                     description: 'Area piknik dengan meja dan bangku',
    //                 },
    //             ],
    //         },
    //     },
    // });

    // console.log('  📸 Uploading images...');
    // const image3 = await uploadImageFromPublic('img/img-03.jpeg', 'tourism');
    // if (image3) {
    //     await prisma.tourismSpotGallery.create({
    //         data: {
    //             tourismSpotId: tourismSpot2.id,
    //             title: 'Air Terjun Utama',
    //             description: 'Pemandangan air terjun dari bawah',
    //             media: image3,
    //         },
    //     });
    // }

    // const image4 = await uploadImageFromPublic('img/img-04.jpeg', 'tourism');
    // if (image4) {
    //     await prisma.tourismSpotGallery.create({
    //         data: {
    //             tourismSpotId: tourismSpot2.id,
    //             title: 'Kolam Alami',
    //             description: 'Kolam alami di bawah air terjun',
    //             media: image4,
    //         },
    //     });
    // }
    // console.log('  ✓ Tourism Spot 2 created successfully!\n');

    // // Tourism Spot 3
    // console.log('📍 Creating Tourism Spot 3: Taman Bunga Nusantara...');
    // const tourismSpot3 = await prisma.tourismSpot.create({
    //     data: {
    //         name: 'Taman Bunga Nusantara',
    //         description: 'Taman bunga seluas 5 hektar dengan berbagai jenis bunga dari seluruh nusantara. Tempat yang sempurna untuk fotografi dan wisata edukasi.',
    //         address: 'Jl. Bunga Raya No. 78, Desa Wisata',
    //         mapUrl: 'https://maps.google.com/?q=-6.2288,106.8656',
    //         ticketPrice: 25000,
    //         openingHours: '08:00',
    //         closingHours: '17:00',
    //         contactPerson: '081234567892',
    //         TourismSpotFacility: {
    //             create: [
    //                 {
    //                     name: 'Mushola',
    //                     description: 'Mushola untuk beribadah',
    //                 },
    //                 {
    //                     name: 'Kafe',
    //                     description: 'Kafe dengan pemandangan taman',
    //                 },
    //                 {
    //                     name: 'Toko Souvenir',
    //                     description: 'Toko souvenir dengan berbagai produk lokal',
    //                 },
    //                 {
    //                     name: 'Area Bermain Anak',
    //                     description: 'Area bermain yang aman untuk anak-anak',
    //                 },
    //             ],
    //         },
    //     },
    // });

    // console.log('  📸 Uploading images...');
    // const image5 = await uploadImageFromPublic('img/img-05.jpeg', 'tourism');
    // if (image5) {
    //     await prisma.tourismSpotGallery.create({
    //         data: {
    //             tourismSpotId: tourismSpot3.id,
    //             title: 'Taman Bunga',
    //             description: 'Berbagai jenis bunga yang indah',
    //             media: image5,
    //         },
    //     });
    // }

    // const image6 = await uploadImageFromPublic('img/img-06.jpeg', 'tourism');
    // if (image6) {
    //     await prisma.tourismSpotGallery.create({
    //         data: {
    //             tourismSpotId: tourismSpot3.id,
    //             title: 'Spot Foto',
    //             description: 'Spot foto favorit pengunjung',
    //             media: image6,
    //         },
    //     });
    // }
    // console.log('  ✓ Tourism Spot 3 created successfully!\n');

    // // Tourism Spot 4
    // console.log('📍 Creating Tourism Spot 4: Bukit Matahari...');
    // const tourismSpot4 = await prisma.tourismSpot.create({
    //     data: {
    //         name: 'Bukit Matahari',
    //         description: 'Bukit dengan pemandangan 360 derajat yang menakjubkan. Tempat terbaik untuk melihat sunrise dan sunset. Cocok untuk camping dan hiking.',
    //         address: 'Jl. Puncak Indah No. 12, Desa Wisata',
    //         mapUrl: 'https://maps.google.com/?q=-6.2388,106.8756',
    //         ticketPrice: 10000,
    //         openingHours: '05:00',
    //         closingHours: '19:00',
    //         contactPerson: '081234567893',
    //         TourismSpotFacility: {
    //             create: [
    //                 {
    //                     name: 'Area Camping',
    //                     description: 'Area camping dengan fasilitas lengkap',
    //                 },
    //                 {
    //                     name: 'Pos Keamanan',
    //                     description: 'Pos keamanan 24 jam',
    //                 },
    //                 {
    //                     name: 'Jalur Pendakian',
    //                     description: 'Jalur pendakian yang terawat dengan baik',
    //                 },
    //             ],
    //         },
    //     },
    // });

    // console.log('  📸 Uploading images...');
    // const image7 = await uploadImageFromPublic('img/img-07.jpeg', 'tourism');
    // if (image7) {
    //     await prisma.tourismSpotGallery.create({
    //         data: {
    //             tourismSpotId: tourismSpot4.id,
    //             title: 'Pemandangan dari Puncak',
    //             description: 'Pemandangan spektakuler dari puncak bukit',
    //             media: image7,
    //         },
    //     });
    // }
    // console.log('  ✓ Tourism Spot 4 created successfully!\n');

    // // ==================== EVENTS SEEDING ====================
    // console.log('\n📅 Starting Events Seeding...\n');

    // // Event 1 - Completed (past)
    // console.log('📅 Creating Event 1: Festival Budaya Desa...');
    // const eventImage1 = await uploadImageFromPublic('img/img-01.jpeg', 'events');
    // await prisma.event.create({
    //     data: {
    //         title: 'Festival Budaya Desa',
    //         description: 'Festival tahunan yang menampilkan berbagai kesenian dan budaya lokal desa. Acara ini menghadirkan pertunjukan tari tradisional, musik gamelan, dan pameran kerajinan tangan.',
    //         location: 'Lapangan Desa Wisata',
    //         startDate: new Date('2025-12-15'),
    //         endDate: new Date('2025-12-17'),
    //         image: eventImage1,
    //         status: 'COMPLETED',
    //     },
    // });
    // console.log('  ✓ Event 1 created!\n');

    // // Event 2 - Completed (past)
    // console.log('📅 Creating Event 2: Gotong Royong Bersih Desa...');
    // const eventImage2 = await uploadImageFromPublic('img/img-02.jpeg', 'events');
    // await prisma.event.create({
    //     data: {
    //         title: 'Gotong Royong Bersih Desa',
    //         description: 'Kegiatan gotong royong rutin untuk membersihkan lingkungan desa. Seluruh warga diajak untuk berpartisipasi menjaga kebersihan dan keindahan desa.',
    //         location: 'Seluruh Area Desa',
    //         startDate: new Date('2026-01-05'),
    //         endDate: new Date('2026-01-05'),
    //         image: eventImage2,
    //         status: 'COMPLETED',
    //     },
    // });
    // console.log('  ✓ Event 2 created!\n');

    // // Event 3 - Ongoing (current)
    // console.log('📅 Creating Event 3: Pasar Rakyat Mingguan...');
    // const eventImage3 = await uploadImageFromPublic('img/img-03.jpeg', 'events');
    // await prisma.event.create({
    //     data: {
    //         title: 'Pasar Rakyat Mingguan',
    //         description: 'Pasar tradisional mingguan yang menjual berbagai produk lokal, hasil pertanian, dan kerajinan tangan warga desa. Berlangsung setiap hari Minggu.',
    //         location: 'Halaman Balai Desa',
    //         startDate: new Date('2026-01-12'),
    //         endDate: new Date('2026-01-12'),
    //         image: eventImage3,
    //         status: 'ONGOING',
    //     },
    // });
    // console.log('  ✓ Event 3 created!\n');

    // // Event 4 - Upcoming
    // console.log('📅 Creating Event 4: Pelatihan UMKM Digital...');
    // const eventImage4 = await uploadImageFromPublic('img/img-04.jpeg', 'events');
    // await prisma.event.create({
    //     data: {
    //         title: 'Pelatihan UMKM Digital',
    //         description: 'Pelatihan pemasaran digital untuk pelaku UMKM desa. Materi meliputi cara berjualan online, pembuatan konten, dan pengelolaan media sosial.',
    //         location: 'Aula Balai Desa',
    //         startDate: new Date('2026-01-20'),
    //         endDate: new Date('2026-01-22'),
    //         image: eventImage4,
    //         status: 'UPCOMING',
    //     },
    // });
    // console.log('  ✓ Event 4 created!\n');

    // // Event 5 - Upcoming
    // console.log('📅 Creating Event 5: Musyawarah Desa...');
    // const eventImage5 = await uploadImageFromPublic('img/img-05.jpeg', 'events');
    // await prisma.event.create({
    //     data: {
    //         title: 'Musyawarah Desa',
    //         description: 'Musyawarah rutin warga desa untuk membahas program pembangunan dan pengembangan desa. Seluruh warga diundang untuk hadir dan memberikan aspirasi.',
    //         location: 'Balai Desa',
    //         startDate: new Date('2026-01-25'),
    //         endDate: new Date('2026-01-25'),
    //         image: eventImage5,
    //         status: 'UPCOMING',
    //     },
    // });
    // console.log('  ✓ Event 5 created!\n');

    // // Event 6 - Upcoming
    // console.log('📅 Creating Event 6: Panen Raya Desa...');
    // const eventImage6 = await uploadImageFromPublic('img/img-06.jpeg', 'events');
    // await prisma.event.create({
    //     data: {
    //         title: 'Panen Raya Desa',
    //         description: 'Perayaan panen raya hasil pertanian desa. Acara ini dimeriahkan dengan berbagai lomba, bazaar makanan tradisional, dan pertunjukan seni.',
    //         location: 'Sawah Terasering Desa',
    //         startDate: new Date('2026-02-10'),
    //         endDate: new Date('2026-02-12'),
    //         image: eventImage6,
    //         status: 'UPCOMING',
    //     },
    // });
    // console.log('  ✓ Event 6 created!\n');

    // // Event 7 - Upcoming
    // console.log('📅 Creating Event 7: Lomba Desa Wisata...');
    // const eventImage7 = await uploadImageFromPublic('img/img-07.jpeg', 'events');
    // await prisma.event.create({
    //     data: {
    //         title: 'Lomba Desa Wisata',
    //         description: 'Kompetisi antar RT dalam rangka memperingati HUT Desa. Berbagai lomba seperti kebersihan lingkungan, kreativitas, dan gotong royong akan dinilai oleh juri.',
    //         location: 'Seluruh Area Desa',
    //         startDate: new Date('2026-02-25'),
    //         endDate: new Date('2026-02-28'),
    //         image: eventImage7,
    //         status: 'UPCOMING',
    //     },
    // });
    // console.log('  ✓ Event 7 created!\n');

    // ==================== BUSINESS (UMKM) SEEDING ====================
    console.log('\n🏪 Starting Business (UMKM) Seeding...\n');

    // Business 1 - Kuliner
    console.log('🏪 Creating Business 1: Warung Kopi Desa...');
    const businessImage1 = await uploadImageFromPublic('img/img-01.jpeg', 'businesses');
    const business1 = await prisma.business.create({
        data: {
            type: 'Kuliner',
            status: 'APPROVED',
            name: 'Warung Kopi Desa',
            ownerName: 'Pak Ahmad',
            phoneNumber: '081234567890',
            description: 'Warung kopi tradisional dengan berbagai pilihan kopi lokal dan jajanan tradisional. Suasana pedesaan yang asri dan nyaman.',
            minimumPrice: 5000,
            maximumPrice: 25000,
            address: 'Jl. Desa Wisata No. 1',
        },
    });
    if (businessImage1) {
        await prisma.businessGallery.create({
            data: { businessId: business1.id, media: businessImage1 },
        });
    }
    console.log('  ✓ Business 1 created!\n');

    // Business 2 - Kerajinan
    console.log('🏪 Creating Business 2: Batik Tulis Desa...');
    const businessImage2 = await uploadImageFromPublic('img/img-02.jpeg', 'businesses');
    const business2 = await prisma.business.create({
        data: {
            type: 'Kerajinan',
            status: 'APPROVED',
            name: 'Batik Tulis Desa',
            ownerName: 'Ibu Siti',
            phoneNumber: '081234567891',
            description: 'Produsen batik tulis asli dengan motif khas daerah. Tersedia kain batik, pakaian jadi, dan aksesoris batik.',
            minimumPrice: 150000,
            maximumPrice: 500000,
            address: 'Jl. Pengrajin No. 5',
        },
    });
    if (businessImage2) {
        await prisma.businessGallery.create({
            data: { businessId: business2.id, media: businessImage2 },
        });
    }
    console.log('  ✓ Business 2 created!\n');

    // Business 3 - Kuliner
    console.log('🏪 Creating Business 3: Rujak Buah Segar...');
    const businessImage3 = await uploadImageFromPublic('img/img-03.jpeg', 'businesses');
    const business3 = await prisma.business.create({
        data: {
            type: 'Kuliner',
            status: 'APPROVED',
            name: 'Rujak Buah Segar',
            ownerName: 'Bu Yanti',
            phoneNumber: '081234567892',
            description: 'Rujak buah segar dengan bumbu kacang khas. Menggunakan buah-buahan segar dari kebun lokal.',
            minimumPrice: 10000,
            maximumPrice: 30000,
            address: 'Pasar Desa Blok A',
        },
    });
    if (businessImage3) {
        await prisma.businessGallery.create({
            data: { businessId: business3.id, media: businessImage3 },
        });
    }
    console.log('  ✓ Business 3 created!\n');

    // Business 4 - Kerajinan
    console.log('🏪 Creating Business 4: Anyaman Bambu...');
    const businessImage4 = await uploadImageFromPublic('img/img-04.jpeg', 'businesses');
    const business4 = await prisma.business.create({
        data: {
            type: 'Kerajinan',
            status: 'APPROVED',
            name: 'Anyaman Bambu Kreatif',
            ownerName: 'Pak Joko',
            phoneNumber: '081234567893',
            description: 'Kerajinan anyaman bambu berkualitas tinggi. Tersedia berbagai produk seperti keranjang, tas, dan dekorasi rumah.',
            minimumPrice: 50000,
            maximumPrice: 300000,
            address: 'Kampung Pengrajin RT 02',
        },
    });
    if (businessImage4) {
        await prisma.businessGallery.create({
            data: { businessId: business4.id, media: businessImage4 },
        });
    }
    console.log('  ✓ Business 4 created!\n');

    // Business 5 - Pertanian
    console.log('🏪 Creating Business 5: Sayur Organik Desa...');
    const businessImage5 = await uploadImageFromPublic('img/img-05.jpeg', 'businesses');
    const business5 = await prisma.business.create({
        data: {
            type: 'Pertanian',
            status: 'APPROVED',
            name: 'Sayur Organik Desa',
            ownerName: 'Pak Surya',
            phoneNumber: '081234567894',
            description: 'Sayuran organik segar langsung dari kebun. Tanpa pestisida dan pupuk kimia.',
            minimumPrice: 5000,
            maximumPrice: 50000,
            address: 'Kebun Organik Desa',
        },
    });
    if (businessImage5) {
        await prisma.businessGallery.create({
            data: { businessId: business5.id, media: businessImage5 },
        });
    }
    console.log('  ✓ Business 5 created!\n');

    // Business 6 - Jasa
    console.log('🏪 Creating Business 6: Homestay Desa...');
    const businessImage6 = await uploadImageFromPublic('img/img-06.jpeg', 'businesses');
    const business6 = await prisma.business.create({
        data: {
            type: 'Jasa',
            status: 'APPROVED',
            name: 'Homestay Nyaman Desa',
            ownerName: 'Ibu Dewi',
            phoneNumber: '081234567895',
            description: 'Penginapan nyaman dengan suasana pedesaan. Tersedia kamar dengan fasilitas lengkap dan sarapan tradisional.',
            minimumPrice: 200000,
            maximumPrice: 500000,
            address: 'Jl. Wisata No. 10',
        },
    });
    if (businessImage6) {
        await prisma.businessGallery.create({
            data: { businessId: business6.id, media: businessImage6 },
        });
    }
    console.log('  ✓ Business 6 created!\n');

    // Business 7 - Kuliner
    console.log('🏪 Creating Business 7: Oleh-oleh Khas Desa...');
    const businessImage7 = await uploadImageFromPublic('img/img-07.jpeg', 'businesses');
    const business7 = await prisma.business.create({
        data: {
            type: 'Kuliner',
            status: 'APPROVED',
            name: 'Oleh-oleh Khas Desa',
            ownerName: 'Bu Rina',
            phoneNumber: '081234567896',
            description: 'Berbagai oleh-oleh khas desa seperti keripik, dodol, dan makanan ringan tradisional.',
            minimumPrice: 15000,
            maximumPrice: 100000,
            address: 'Pusat Oleh-oleh Desa',
        },
    });
    if (businessImage7) {
        await prisma.businessGallery.create({
            data: { businessId: business7.id, media: businessImage7 },
        });
    }
    console.log('  ✓ Business 7 created!\n');

    // Business 8 - Pertanian
    console.log('🏪 Creating Business 8: Madu Lebah Asli...');
    const businessImage8 = await uploadImageFromPublic('img/img-08.jpeg', 'businesses');
    const business8 = await prisma.business.create({
        data: {
            type: 'Pertanian',
            status: 'APPROVED',
            name: 'Madu Lebah Asli Desa',
            ownerName: 'Pak Hendra',
            phoneNumber: '081234567897',
            description: 'Madu murni dari peternakan lebah lokal. 100% alami tanpa campuran.',
            minimumPrice: 75000,
            maximumPrice: 200000,
            address: 'Peternakan Lebah Desa',
        },
    });
    if (businessImage8) {
        await prisma.businessGallery.create({
            data: { businessId: business8.id, media: businessImage8 },
        });
    }
    console.log('  ✓ Business 8 created!\n');

    console.log('Seeding completed successfully!');
    console.log(`Created 4 tourism spots with galleries and facilities`);
    console.log(`Created 7 events`);
    console.log(`Created 8 businesses (UMKM)`);
}

main()
    .catch((e) => {
        console.error('Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
