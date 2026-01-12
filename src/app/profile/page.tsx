"use client"

import { useEffect, useRef, useState } from "react"

export default function ProfilePage() {
    // Animation states for each section
    const [isProfileVisible, setIsProfileVisible] = useState(false)
    const [isHistoryVisible, setIsHistoryVisible] = useState(false)
    const [isVisionVisible, setIsVisionVisible] = useState(false)

    // Refs for each section
    const profileRef = useRef<HTMLElement>(null)
    const historyRef = useRef<HTMLElement>(null)
    const visionRef = useRef<HTMLElement>(null)

    // Intersection Observer for profile section
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsProfileVisible(true)
                }
            },
            {
                threshold: 0.1,
                rootMargin: "0px 0px -100px 0px",
            }
        )

        if (profileRef.current) {
            observer.observe(profileRef.current)
        }

        return () => {
            if (profileRef.current) {
                observer.unobserve(profileRef.current)
            }
        }
    }, [])

    // Intersection Observer for history section
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsHistoryVisible(true)
                }
            },
            {
                threshold: 0.1,
                rootMargin: "0px 0px -100px 0px",
            }
        )

        if (historyRef.current) {
            observer.observe(historyRef.current)
        }

        return () => {
            if (historyRef.current) {
                observer.unobserve(historyRef.current)
            }
        }
    }, [])

    // Intersection Observer for vision section
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisionVisible(true)
                }
            },
            {
                threshold: 0.1,
                rootMargin: "0px 0px -100px 0px",
            }
        )

        if (visionRef.current) {
            observer.observe(visionRef.current)
        }

        return () => {
            if (visionRef.current) {
                observer.unobserve(visionRef.current)
            }
        }
    }, [])

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Image Section */}
            <section className="w-full h-[400px] md:h-[500px] lg:h-[600px] relative overflow-hidden">
                <img
                    src="/hero-bg.jpg"
                    alt="Desa"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent" />

                {/* Hero Text Content */}
                <div className="absolute inset-0 flex flex-col justify-center container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl lg:max-w-3xl">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight drop-shadow-lg">
                            Profil Desa
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl text-white/95 max-w-xl drop-shadow-md">
                            Kenali lebih dekat desa wisata kami yang kaya akan budaya dan keindahan alam
                        </p>
                    </div>
                </div>
            </section>

            {/* History Section */}
            <section ref={historyRef} className="bg-gray-50 py-12 md:py-16 lg:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Top Section - Title and Image */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-8 md:mb-12">
                        {/* Left - Title and Description */}
                        <div className={`space-y-6 transition-all duration-1000 ${isHistoryVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                            }`}>
                            <div>
                                <p className="text-gray-600 text-sm md:text-base mb-2">Desa Wisata</p>
                                <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
                                    Nglanggeran
                                </h2>
                            </div>

                            <div className="space-y-4 text-gray-700 leading-relaxed">
                                <p className="text-base md:text-lg">
                                    Desa Wisata Nglanggeran telah mendapat penghargaan <strong>ASEAN Sustainable Tourism Award</strong> pada 2018 dan <strong>ASEAN Community Based Tourism (CBT) Award 2017</strong>.
                                </p>

                                <p className="text-base md:text-lg">
                                    Desa Wisata Nglanggeran mendapat predikat <strong>Best Tourism Village</strong> oleh <strong>United Nation World Tourism Organization (UNWTO)</strong> pada tahun 2021 bersama dengan 44 desa dari 32 negara di antara 174 desa yang diusulkan dari 75 negara anggota UNWTO.
                                </p>
                            </div>
                        </div>

                        {/* Right - Image with Border Effect */}
                        <div className={`relative transition-all duration-1000 delay-300 ${isHistoryVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                            }`}>
                            <div className="relative">
                                {/* Border effect */}
                                <div className="absolute -top-3 -right-3 w-full h-full border-4 border-gray-900 rounded-lg" />
                                {/* Main image */}
                                <img
                                    src="/hero-bg.jpg"
                                    alt="Desa Wisata Nglanggeran"
                                    className="relative w-full h-[300px] md:h-[400px] object-cover rounded-lg shadow-lg"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Bottom Section - Full Width Text */}
                    <div className="space-y-6 text-gray-700 leading-relaxed text-base md:text-lg">
                        <p>
                            Pengembangan Kawasan Ekowisata Gunung Api Purba diawali oleh Kelompok Pemuda Karang Taruna desa Nglanggeran sejak tahun 1999, dengan adanya kesadaran peduli lingkungan bersama masyarakat menanam pohon-pohon di area gunung yang merupakan gunung yang gundul/gersang diantara bongkahan-bongkahan batu pencakar langit. Dengan berbagai kegiatan aktif dilakukan oleh kelompok pemuda dan masyarakat selanjutnya pemerintah Desa Nglanggeran mempercayakan pengelolaan lahan seluas 48 Ha untuk dikelola pemuda (Karang Taruna Bukit Putra Mandiri) yang tertuang dalam SK Kepala Desa Nglanggeran No.05/KPTS/1999 tertanggal Desa 12 Mei 1999.
                        </p>

                        <p>
                            Lahan seluas 48 Ha mulai dilakukan penghijauan oleh warga masyarakat dan juga pemuda karang taruna. Setelah kondisi lingkungan mulai hijau, semakin nyaman dan memiliki daya tarik wisata, mendapatkan dukungan dari Dinas Budpar Gunungkidul melalui promosi (FAM Tour) ditahun 2007. Seiring dengan meningkatnya kapasitas para pemuda Karang Taruna Nglanggeran yang melakukan studi juga juga mengenal teknologi promosi menggunakan media Teknologi Informasi sangat mendukung dalam pengenalan Gunung Api Purba menjadi kawasan wisata.
                        </p>

                        <p>
                            Sebelum 2007 terjadi kevakuman pengelolaan saat setelah terjadi gempa 26 Mei 2006 hingga ditahun 2007, dan karang taruna mulai lagi muncul kepermukaan untuk melakukan pengelolaan kawasan wisata dengan pendampingan dari dinas Budpar Gunungkidul sejak tahun 2007. Dibuatlah kesepakatan bersama untuk mengelola kawasan wisata dengan membentuk kelompok sadar wisata yang diberi nama Kelompok Sadar Wisata (Pokdarwis) Nglanggeran pada tanggal 12 Desember 2007.
                        </p>
                    </div>
                </div>
            </section>

            {/* Content Section - Map and Text */}
            <section ref={profileRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Map Section */}
                    <div className={`w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-lg transition-all duration-1000 ${isProfileVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
                        }`}>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126748.56347862248!2d107.57311709999999!3d-6.903444399999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e6398252477f%3A0x146a1f93d3e815b2!2sBandung%2C%20Bandung%20City%2C%20West%20Java!5e0!3m2!1sen!2sid!4v1234567890123!5m2!1sen!2sid"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Peta Desa"
                        />
                    </div>

                    {/* Text Description Section */}
                    <div className={`flex flex-col justify-center space-y-6 transition-all duration-1000 delay-300 ${isProfileVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
                        }`}>
                        <div>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                                Lokasi Desa
                            </h2>
                            <div className="w-20 h-1 bg-blue-600 mb-6" />
                        </div>

                        <div className="space-y-4 text-gray-700 leading-relaxed">
                            <p className="text-lg md:text-xl">
                                Desa kami adalah sebuah komunitas yang kaya akan budaya dan tradisi.
                                Terletak di wilayah yang strategis, desa ini memiliki potensi besar
                                dalam berbagai sektor.
                            </p>

                            <p className="text-base md:text-lg">
                                Kami bertekad untuk terus berkembang dan berinovasi, dengan tetap
                                menjaga nilai-nilai luhur yang telah diwariskan oleh para pendahulu.
                                Melalui kerja sama dan gotong royong, kami membangun masa depan yang
                                lebih baik untuk generasi mendatang.
                            </p>

                            <p className="text-base md:text-lg">
                                Dengan sumber daya alam yang melimpah dan masyarakat yang solid,
                                desa kami terus berupaya meningkatkan kesejahteraan warga melalui
                                berbagai program pembangunan dan pemberdayaan masyarakat.
                            </p>
                        </div>

                        <div className="pt-4">
                            <div className="inline-flex items-center space-x-2 text-blue-600 font-semibold">
                                <span>Pelajari lebih lanjut</span>
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vision & Mission Section */}
            <section ref={visionRef} className="bg-white py-12 md:py-16 lg:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                        {/* Vision */}
                        <div className={`flex flex-col justify-center transition-all duration-1000 ${isVisionVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
                            }`}>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
                                Visi
                            </h2>

                            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 md:p-8 rounded-r-lg shadow-sm">
                                <p className="text-gray-800 text-lg md:text-xl leading-relaxed font-medium">
                                    Menjadi desa wisata terdepan yang berkelanjutan, berlandaskan nilai-nilai budaya lokal dan pemberdayaan masyarakat untuk kesejahteraan bersama.
                                </p>
                            </div>
                        </div>

                        {/* Mission */}
                        <div className={`flex flex-col transition-all duration-1000 delay-300 ${isVisionVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
                            }`}>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
                                Misi
                            </h2>

                            <div className="space-y-6">
                                {/* Mission Item 1 */}
                                <div className="flex gap-4 items-start">
                                    <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                        1
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 text-lg mb-2">
                                            Mengembangkan Potensi Wisata
                                        </h3>
                                        <p className="text-gray-700 leading-relaxed">
                                            Mengoptimalkan potensi alam, budaya, dan sumber daya lokal untuk menciptakan destinasi wisata yang menarik dan berkelanjutan.
                                        </p>
                                    </div>
                                </div>

                                {/* Mission Item 2 */}
                                <div className="flex gap-4 items-start">
                                    <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                        2
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 text-lg mb-2">
                                            Memberdayakan Masyarakat
                                        </h3>
                                        <p className="text-gray-700 leading-relaxed">
                                            Meningkatkan kapasitas dan kesejahteraan masyarakat melalui pelatihan, pendampingan, dan keterlibatan aktif dalam pengelolaan wisata.
                                        </p>
                                    </div>
                                </div>

                                {/* Mission Item 3 */}
                                <div className="flex gap-4 items-start">
                                    <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                        3
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 text-lg mb-2">
                                            Melestarikan Budaya dan Lingkungan
                                        </h3>
                                        <p className="text-gray-700 leading-relaxed">
                                            Menjaga dan melestarikan kearifan lokal, tradisi budaya, serta kelestarian lingkungan untuk generasi mendatang.
                                        </p>
                                    </div>
                                </div>

                                {/* Mission Item 4 */}
                                <div className="flex gap-4 items-start">
                                    <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                        4
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 text-lg mb-2">
                                            Meningkatkan Kualitas Pelayanan
                                        </h3>
                                        <p className="text-gray-700 leading-relaxed">
                                            Memberikan pelayanan terbaik kepada wisatawan dengan standar profesional dan ramah lingkungan.
                                        </p>
                                    </div>
                                </div>

                                {/* Mission Item 5 */}
                                <div className="flex gap-4 items-start">
                                    <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                        5
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 text-lg mb-2">
                                            Membangun Kemitraan Strategis
                                        </h3>
                                        <p className="text-gray-700 leading-relaxed">
                                            Menjalin kerja sama dengan berbagai pihak untuk mendukung pengembangan desa wisata yang berkelanjutan.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
