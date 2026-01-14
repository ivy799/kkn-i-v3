"use client"

import { useState } from "react"
import Image from "next/image"

export default function AboutPage() {
    const [activeTab, setActiveTab] = useState<"crew" | "story">("crew")

    const teamMembers = [
        {
            name: "Sabir, S.Pd.I",
            role: "Kepala Desa",
            image: "/img/img-01.jpeg",
        },
        {
            name: "Ahmad Yani",
            role: "Sekretaris Desa",
            image: "/img/img-02.jpeg",
        },
        {
            name: "Siti Nurhaliza",
            role: "Bendahara Desa",
            image: "/img/img-03.jpeg",
        },
        {
            name: "Muhammad Rizki",
            role: "Kaur Pemerintahan",
            image: "/img/img-01.jpeg",
        },
        {
            name: "Fatimah Zahra",
            role: "Kaur Kesejahteraan",
            image: "/img/img-02.jpeg",
        },
        {
            name: "Budi Santoso",
            role: "Kaur Pembangunan",
            image: "/img/img-03.jpeg",
        },
        {
            name: "Ani Widiastuti",
            role: "Kaur Keuangan",
            image: "/img/img-01.jpeg",
        },
        {
            name: "Hendra Gunawan",
            role: "Kepala Dusun",
            image: "/img/img-02.jpeg",
        },
    ]

    return (
        <div className="min-h-screen bg-white">
            <div className="pt-8 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900">
                    Tentang Kami
                </h1>
            </div>

            <div className="w-full h-[300px] md:h-[400px] lg:h-[500px] relative">
                <Image
                    src="/img/img-01.jpeg"
                    alt="Tim Desa Bonto Lojong"
                    fill
                    className="object-cover grayscale"
                    priority
                />
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                    {/* Left Column - Tabs and Team */}
                    <div className="space-y-8">
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
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600" />
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
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600" />
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
                                        className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="relative w-20 h-20 rounded-full overflow-hidden mb-3">
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
                    <div className="flex items-center">
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
