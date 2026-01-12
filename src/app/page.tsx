import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/about-section";
import { Gallery4 } from "@/components/gallery4";
import { BentoGallery } from "@/components/bento-gallery";
import { getPrisma } from "@/lib/prismaClient";

async function getTourismSpots() {
  const spots = await getPrisma.tourismSpot.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      TourismSpotGallery: {
        select: {
          media: true,
        },
        take: 1,
      },
    },
    take: 5,
    orderBy: {
      id: 'asc',
    },
  });

  return spots.map((spot) => ({
    id: `wisata-${spot.id}`,
    title: spot.name || "Destinasi Wisata",
    description: spot.description || "Jelajahi keindahan destinasi wisata ini.",
    href: `/wisata/${spot.id}`,
    image: spot.TourismSpotGallery[0]?.media || "/img/img-01.jpeg",
  }));
}

async function getGalleryItems() {
  const spots = await getPrisma.tourismSpot.findMany({
    select: {
      TourismSpotGallery: {
        select: {
          id: true,
          title: true,
          media: true,
        },
      },
    },
  });

  const allGalleryItems: { id: string; name: string; image: string }[] = [];

  spots.forEach((spot) => {
    spot.TourismSpotGallery.forEach((gallery) => {
      allGalleryItems.push({
        id: `gallery-${gallery.id}`,
        name: gallery.title || "Galeri Desa",
        image: gallery.media || "/img/img-01.jpeg",
      });
    });
  });

  return allGalleryItems.slice(0, 6);
}

export default async function Home() {
  const tourismItems = await getTourismSpots();
  const galleryItems = await getGalleryItems();

  return (
    <div className="min-h-screen">
      <HeroSection />
      <AboutSection />
      <AboutSection
        reverse
        title="Kondisi Geografis & Mata Pencaharian"
        paragraphs={[
          "Desa kami terletak di dataran tinggi dengan ketinggian 800-1200 meter di atas permukaan laut, dikelilingi oleh hamparan sawah terasering yang hijau dan perbukitan yang asri. Iklim sejuk dengan suhu rata-rata 20-25°C menjadikan desa ini tempat yang ideal untuk pertanian dan pariwisata.",
          "Mayoritas penduduk desa bermata pencaharian sebagai petani dengan komoditas utama padi, sayuran organik, dan kopi. Selain itu, sektor pariwisata dan kerajinan tangan lokal juga berkembang pesat, memberikan peluang ekonomi tambahan bagi masyarakat.",
          "Dengan kondisi geografis yang strategis dan sumber daya alam yang melimpah, desa kami terus berkembang menjadi destinasi agrowisata yang menarik sambil tetap mempertahankan kearifan lokal dan kelestarian lingkungan.",
        ]}
        image="/img/img-03.jpeg"
        primaryButtonText="Lihat Peta Desa"
        primaryButtonUrl="/map"
        secondaryButtonText="Produk Lokal"
        secondaryButtonUrl="/products"
      />
      <Gallery4
        title="Destinasi Wisata"
        description="Jelajahi keindahan alam dan budaya desa kami. Dari sawah terasering yang memukau hingga spot sunrise terbaik, temukan pengalaman wisata yang tak terlupakan."
        items={tourismItems}
        className="p-10"
      />
      <BentoGallery items={galleryItems} />
    </div>
  );
}
