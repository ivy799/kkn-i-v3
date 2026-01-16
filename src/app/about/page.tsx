"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"

export default function AboutPage() {
    const [activeTab, setActiveTab] = useState<"crew" | "story">("crew")
    const [heroVisible, setHeroVisible] = useState(false)
    const [contentVisible, setContentVisible] = useState(false)
    const heroRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const heroObserver = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setHeroVisible(true)
                }
            },
            { threshold: 0.1 }
        )

        const contentObserver = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setContentVisible(true)
                }
            },
            { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
        )

        if (heroRef.current) {
            heroObserver.observe(heroRef.current)
        }
        if (contentRef.current) {
            contentObserver.observe(contentRef.current)
        }

        return () => {
            if (heroRef.current) {
                heroObserver.unobserve(heroRef.current)
            }
            if (contentRef.current) {
                contentObserver.unobserve(contentRef.current)
            }
        }
    }, [])

    const teamMembers = [
        {
            name: "Muhammad Raihan",
            role: "Kordinator Desa",
            image: "team/img-01.png",
        },
        {
            name: "NUR QALBI FITRI RAMADHANI",
            role: "Sekretaris",
            image: "team/img-02.png",
        },
        {
            name: "A. KIRANA PUTRI DEWI",
            role: "Bendahara",
            image: "team/img-03.png",
        },
        {
            name: "EKAWATI",
            role: "Publikasi dan Dokumentasi",
            image: "team/img-04.png",
        },
        {
            name: "ST. FARADIBA MUNAWARAH",
            role: "Publikasi dan Dokumentasi",
            image: "team/img-05.png",
        },
        {
            name: "CHANTIKA NOER AULIA",
            role: "Hubungan Masyarakat",
            image: "team/img-06.png",
        },
        {
            name: "MUHAMMAD AIDIL ZAINUDDIN",
            role: "Perlengkapan",
            image: "team/img-07.png",
        },
        {
            name: "AHMAD FIRDAUS",
            role: "Perlengkapan",
            image: "team/img-08.png",
        },
    ]

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section with Creative Image Grid */}
            <div ref={heroRef} className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-8 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                    {/* Left Column - Title, Description and Image */}
                    <div className={`lg:col-span-5 flex flex-col gap-6 transition-all duration-700 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                        <div>
                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4">
                                Tentang Kami
                            </h1>
                            <p className="text-gray-600 leading-relaxed">
                                Kami adalah tim yang penuh semangat membangun masa depan desa,
                                satu langkah terobosan dalam satu waktu. Didirikan dengan visi
                                untuk menyelesaikan masalah nyata melalui teknologi dan
                                pemikiran kreatif.
                            </p>
                        </div>
                        {/* Large Left Image */}
                        <div className={`relative w-full aspect-[4/5] rounded-xl overflow-hidden transition-all duration-700 delay-200 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                            <Image
                                src="/img/img-01.jpeg"
                                alt="Aktivitas Desa 1"
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-500"
                                priority
                            />
                        </div>
                    </div>

                    {/* Middle Column - 2 Stacked Images + Desa Kami Text */}
                    <div className={`lg:col-span-3 flex flex-col gap-6 transition-all duration-700 delay-100 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                        <div className="lg:mt-24">
                            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden">
                                <Image
                                    src="/img/img-02.jpeg"
                                    alt="Aktivitas Desa 2"
                                    fill
                                    className="object-cover hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                        </div>
                        <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden">
                            <Image
                                src="/img/img-03.jpeg"
                                alt="Aktivitas Desa 3"
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        {/* Desa Kami Text Section */}
                        <div className={`pt-4 transition-all duration-700 delay-500 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Desa Kami</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Desa kami dirancang untuk menginspirasi kreativitas dan
                                mendorong inovasi. Tempat di mana ide-ide mengalir bebas.
                            </p>
                        </div>
                    </div>

                    {/* Right Columns - Mixed Grid */}
                    <div className={`lg:col-span-4 flex flex-col gap-6 transition-all duration-700 delay-200 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                        <div className="grid grid-cols-2 gap-6 lg:mt-8">
                            {/* Quote/Text Image */}
                            <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
                                <Image
                                    src="/img/img-04.jpeg"
                                    alt="Inspirasi"
                                    fill
                                    className="object-cover hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            {/* Top Right Small Image */}
                            <div className="relative w-full aspect-square rounded-xl overflow-hidden">
                                <Image
                                    src="/img/img-05.jpeg"
                                    alt="Aktivitas Desa 4"
                                    fill
                                    className="object-cover hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                        </div>
                        {/* Bottom Section with Images */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden">
                                <Image
                                    src="/img/img-06.jpeg"
                                    alt="Aktivitas Desa 5"
                                    fill
                                    className="object-cover hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden">
                                <Image
                                    src="/img/img-07.jpeg"
                                    alt="Suasana Desa"
                                    fill
                                    className="object-cover hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div ref={contentRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                    {/* Left Column - Tabs and Team */}
                    <div className={`space-y-8 transition-all duration-700 ${contentVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}>
                        {/* Tab Navigation */}
                        <div className="flex gap-6 border-b border-gray-200">
                            <button
                                onClick={() => setActiveTab("crew")}
                                className={`pb-3 text-lg font-medium transition-colors relative ${activeTab === "crew"
                                    ? "text-green-600"
                                    : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                Tim Kami
                                {activeTab === "crew" && (
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600 transition-all duration-300" />
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab("story")}
                                className={`pb-3 text-lg font-medium transition-colors relative ${activeTab === "story"
                                    ? "text-green-600"
                                    : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                Cerita Kami
                                {activeTab === "story" && (
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600 transition-all duration-300" />
                                )}
                            </button>
                        </div>

                        {/* Subtitle */}
                        <p className="text-lg text-gray-500 leading-relaxed">
                            Kami bertekad membawa perubahan positif untuk desa,
                            mengubah potensi menjadi kemajuan yang nyata.
                        </p>

                        {/* Team Members / Story Content */}
                        {activeTab === "crew" ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {teamMembers.map((member, index) => (
                                    <div
                                        key={index}
                                        className={`flex flex-col items-center text-center p-4 rounded-lg hover:bg-gray-50 transition-all duration-500 hover:shadow-md ${contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                                        style={{ transitionDelay: `${index * 50}ms` }}
                                    >
                                        <div className="relative w-20 h-20 rounded-full overflow-hidden mb-3 ring-2 ring-transparent hover:ring-green-500 transition-all duration-300">
                                            <Image
                                                src={member.image}
                                                alt={member.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 text-base mb-1">
                                                {member.name}
                                            </h3>
                                            <p className="text-gray-600 text-sm">{member.role}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4 text-gray-700 leading-relaxed">
                                <p>
                                    Desa Bonto Lojong memiliki sejarah panjang sejak tahun 1943.
                                    Dari masa kolonial hingga era modern, desa ini terus berkembang
                                    menjadi sentra agrowisata unggulan.
                                </p>
                                <p>
                                    Dengan ketinggian 1200-1500 mdpl, kami menjadi pusat produksi
                                    sayuran, strawberry, dan apel yang terkenal hingga ke luar
                                    provinsi.
                                </p>
                                <p>
                                    Kepemimpinan yang demokratis dan inovatif telah membawa
                                    Bonto Lojong menjadi destinasi wisata strategis di Kabupaten
                                    Bantaeng.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Main Content */}
                    <div className={`flex items-center transition-all duration-700 delay-200 ${contentVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}>
                        <div className="space-y-6">
                            <p className="text-xl md:text-2xl text-gray-900 leading-relaxed font-light">
                                Kami adalah tim yang berdedikasi untuk membangun dan mengembangkan
                                potensi desa. Dengan semangat gotong royong dan inovasi, kami
                                berkomitmen menciptakan pengalaman yang bermakna bagi seluruh
                                masyarakat dan pengunjung.
                            </p>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Misi kami adalah mengembangkan Desa Bonto Lojong sebagai destinasi
                                agrowisata terdepan yang berkelanjutan, dengan tetap menjaga
                                kearifan lokal dan nilai-nilai budaya yang telah diwariskan
                                turun-temurun.
                            </p>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Bersama-sama, kita membangun masa depan yang lebih baik untuk
                                generasi mendatang, dengan memanfaatkan kekayaan alam dan
                                memberdayakan masyarakat lokal.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
