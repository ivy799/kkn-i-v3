import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/about-section";
import { Gallery4 } from "@/components/gallery4";
import { BentoGallery } from "@/components/bento-gallery";

export default function Home() {
  const tourismItems = [
    {
      id: "wisata-1",
      title: "Sawah Terasering Hijau",
      description: "Nikmati keindahan sawah terasering yang hijau dan asri, pemandangan yang menenangkan jiwa dan cocok untuk fotografi.",
      href: "/tourism/1",
      image: "/img/img-01.jpeg",
    },
    {
      id: "wisata-2",
      title: "Pemandangan Alam Pegunungan",
      description: "Jelajahi keindahan alam pegunungan dengan udara sejuk dan pemandangan yang memukau.",
      href: "/tourism/2",
      image: "/img/img-01.jpeg",
    },
    {
      id: "wisata-3",
      title: "Wisata Agro",
      description: "Kunjungi kebun-kebun organik dan pelajari tentang pertanian berkelanjutan dari petani lokal.",
      href: "/tourism/3",
      image: "/img/img-01.jpeg",
    },
    {
      id: "wisata-4",
      title: "Spot Sunrise Terbaik",
      description: "Saksikan matahari terbit yang spektakuler dari titik tertinggi desa kami.",
      href: "/tourism/4",
      image: "/img/img-01.jpeg",
    },
    {
      id: "wisata-5",
      title: "Trekking & Hiking",
      description: "Jelajahi jalur trekking yang menantang dengan pemandangan alam yang luar biasa.",
      href: "/tourism/5",
      image: "/img/img-01.jpeg",
    },
  ];

  const galleryItems = [
    {
      id: "gallery-1",
      name: "Sawah Terasering Desa",
      image: "/img/img-01.jpeg",
    },
    {
      id: "gallery-2",
      name: "Kegiatan Pertanian",
      image: "/img/img-02.jpeg",
    },
    {
      id: "gallery-3",
      name: "Pemandangan Alam",
      image: "/img/img-03.jpeg",
    },
    {
      id: "gallery-4",
      name: "Budaya Lokal",
      image: "/img/img-01.jpeg",
    },
    {
      id: "gallery-5",
      name: "Produk UMKM",
      image: "/img/img-02.jpeg",
    },
    {
      id: "gallery-6",
      name: "Wisata Desa",
      image: "/img/img-03.jpeg",
    },
  ];

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
