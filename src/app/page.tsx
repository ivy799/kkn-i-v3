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
          "Dikenal sebagai sentra agrowisata unggulan di ketinggian 1200–1500 mdpl, Bonto Lojong menawarkan pesona alam pegunungan yang sejuk dan tanah yang subur. Desa ini merupakan ikon penghasil sayuran utama serta pusat budidaya stroberi dan apel yang menjadi daya tarik wisatawan mancanegara maupun lokal. Kehadiran Mini Showfarm sebagai ikon wisata juga mempertegas posisi Bonto Lojong sebagai destinasi strategis di Kabupaten Bantaeng. Dengan semangat dedikasi dari setiap periode kepemimpinan, desa ini berkomitmen untuk terus mengembangkan potensi ekonomi lokal dan kesejahteraan masyarakat secara berkelanjutan."
        ]}
        image="/img/img-03.jpeg"
        primaryButtonText="Lihat Peta Desa"
        primaryButtonUrl="/map"
      />
      <div id="wisata">
        <Gallery4
          title="Destinasi Wisata"
          description="Jelajahi keindahan alam dan budaya desa kami. Dari sawah terasering yang memukau hingga spot sunrise terbaik, temukan pengalaman wisata yang tak terlupakan."
          items={tourismItems}
          className="px-20"
          showMoreButton={true}
          showMoreUrl="/wisata"
          showMoreText="Lihat Lebih Banyak"
        />
      </div>
      <BentoGallery items={galleryItems} />
    </div>
  );
}
