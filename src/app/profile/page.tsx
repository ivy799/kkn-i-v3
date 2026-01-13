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
                                <p className="text-gray-600 text-sm md:text-base mb-2">Sejarah</p>
                                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 inline-block">
                                    <span className="relative">
                                        Desa Bonto Lojong
                                        <span
                                            className={`absolute bottom-0 left-0 h-1 bg-green-500 transition-all duration-700 ease-out ${isHistoryVisible ? 'w-full' : 'w-0'}`}
                                            style={{ transitionDelay: '300ms' }}
                                        />
                                    </span>
                                </h2>
                            </div>

                            <div className="space-y-4 text-gray-700 leading-relaxed">
                                <p className="text-base md:text-lg">
                                    Desa Bonto Lojong adalah salah satu desa yang berada di kecamatan <strong>Ulu Ere Kabupaten Bantaeng</strong> yang terbentuk pada tahun 1943. Pada zaman Belanda masih berkuasa, masyarakat Desa Bonto Lojong sangat merasakan penderitaan. Namun pada saat itu ada sebuah peristiwa yang sampai sekarang masih dirasakan manfaatnya bagi masyarakat yakni perintisan jalan poros desa.
                                </p>

                                <p className="text-base md:text-lg">
                                    Di tahun 1970, pembangunan sekolah pertama di Dusun Bangkeng Bonto walau masih di bawah kolong rumah, namun merupakan sekolah pencetak pelajar pertama di Desa Bonto Lojong yang masih di bawah Pemerintah Desa Bonto Marannu.
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
                                    src="/img/img-02.jpeg"
                                    alt="Desa Bonto Lojong"
                                    className="relative w-full h-[300px] md:h-[400px] object-cover rounded-lg shadow-lg"
                                />
                            </div>
                        </div>
                    </div>

                    {/* History Content - Full Width Text */}
                    <div className={`space-y-6 text-gray-700 leading-relaxed text-base md:text-lg transition-all duration-1000 delay-500 ${isHistoryVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
                        <p>
                            Seiring dengan berjalannya waktu, pada tahun 1997 digagas dan dibentuk Desa Persiapan di mana nama desanya diambil dari nama gunung yang disebut dengan <strong>Bonto Lojong</strong>. Desa Persiapan Bonto Lojong dijabat oleh Bpk. Amiruddin Saing. Pemilihan desa pertama dilakukan pada tahun 2000 yang dilanjutkan oleh Bapak Amiruddin, S.Sos selaku kepala desa yang terpilih selama satu periode, dan pada tahun 2005 terpilih kembali untuk periode kedua.
                        </p>

                        <p>
                            Selama pemerintahan yang dipimpin oleh Bpk. Amiruddin, S.Sos, pembangunan di segala bidang sangat berkembang dengan pesat baik pembangunan yang berbentuk fisik maupun nonfisik. Salah satu pembangunan pada tahun 1997 adalah pengadaan jaringan listrik yang dibangun dan dirasakan manfaatnya oleh masyarakat Desa Bonto Lojong sampai sekarang.
                        </p>

                        <p>
                            Pada tahun 2000, pembangunan dan peningkatan jalan Desa Bonto Lojong yang dapat memperlancar transportasi dalam mengangkut hasil-hasil bumi masyarakat telah dikembangkan hingga sekarang. Hotmix jalan Dusun Bangkeng Bonto tempus Desa Bonto Tangnga yang dapat melancarkan pengangkutan hasil bumi masyarakat, Hotmix jalan Dusun Cipar menghubungkan Desa Kayu Loe Kecamatan Bantaeng sepanjang 3,1 KM telah berhasil dibangun oleh pemerintah yang berlokasi di Cidondong Parring-parring.
                        </p>

                        <p>
                            Dalam perjalanan pembangunan, desa yang memiliki potensi yang tidak dimiliki oleh semua desa di Kabupaten Bantaeng, Desa Bonto Lojong dilirik oleh pemerintah Kabupaten Bantaeng untuk dijadikan sebagai <strong>Sentra Agrowisata</strong> di Kecamatan Ulu Ere. Desa Bonto Lojong sudah mulai dikenal dengan daerah dingin yang memiliki ketinggian <strong>1200-1500 Mdpl</strong> ini, sangat cocok dengan pengembangan tanaman Strawberry dan Apel.
                        </p>

                        <p>
                            Oleh sebab itu, pada tahun 2008 silam, Desa Bonto Lojong telah digarap dengan pengembangan tanaman Strawberry dan Apel, yang sampai saat ini menjadi objek wisata bagi para tamu dan pengunjung, baik dari dalam daerah maupun dari luar daerah. Selain dengan tanaman seperti itu, Bonto Lojong juga dikenal dengan daerah pusat sayuran yang mampu menyuplai sayuran ke kota Bantaeng, ke daerah-daerah tetangga bahkan sampai ke luar provinsi.
                        </p>
                    </div>

                    {/* Additional History Content */}
                    <div className={`mt-12 space-y-6 text-gray-700 leading-relaxed text-base md:text-lg transition-all duration-1000 delay-700 ${isHistoryVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Perkembangan Kepemimpinan</h3>

                        <p>
                            Pada tahun 2011, Kepala Desa Amiruddin Saing, S.Sos telah berakhir masa periode kepemimpinannya dari tahun 2005-2010, dan dilaksanakanlah pemilihan Kepala Desa yang bertempat di kantor lapangan sepak bola Lannying. Pada pemilihan kali ini diikuti oleh 5 (lima) pasangan calon di antaranya adalah Bapak Ruddin, Mudo, Rahman, Johari dan Samsu. Pemilihan ini dilaksanakan secara demokratis langsung, umum, bebas dan adil. Pemilihan kali ini dimenangkan oleh Bapak SAMSU dengan periode 2011-2017.
                        </p>

                        <p>
                            Pada periode Bapak SAMSU, tahun pertama telah dibangun salah satu taman bunga mini yang berlokasi di Dusun Bangkeng Bonto. Taman mini ini menjadi ikon besar Desa Bonto Lojong yang menjadi sorotan mata para pengunjung yang melintas di Desa Bonto Lojong. Selain diminati oleh warga masyarakat, taman mini ini sering didatangi oleh para pejabat baik dari daerah sendiri maupun dari luar daerah. Taman mini ini yang biasa disebut dengan <strong>Mini Showfarm</strong>, selain menjadi tempat wisata, lokasi ini juga pernah menjadi tempat syuting Bupati Bantaeng dalam promosi The New Bantaeng.
                        </p>

                        <p>
                            Pada tahun 2018, Kepala Desa Samsu telah berakhir masa periode kepemimpinannya dari tahun 2011-2017, dan dilaksanakan kembali pemilihan kepala desa yang bertempat di Kantor Desa Bonto Lojong. Pada pemilihan kali ini diikuti oleh 5 (lima) pasangan calon di antaranya adalah Bapak Samsu, Sabir S.Pdi, Tamrin, Edi Hermawan, dan Syahril Harahap. Pemilihan ini dilaksanakan dengan sistem E-Voting dan dimenangkan oleh Bapak TAMRIN dengan periode 2018-2023.
                        </p>

                        <p>
                            Sebagai Kepala Desa selama menjabat, Bapak Tamrin telah memainkan peran penting dalam mengelola dan memimpin masyarakat di Desa Bonto Lojong. Dengan kebijaksanaan dan dedikasinya sebagai Kepala Desa, Bapak Tamrin telah berhasil memajukan desa ini melalui berbagai inisiatif pembangunan dan program kesejahteraan masyarakat. Di bawah kepemimpinannya, infrastruktur desa diperbaiki, layanan publik ditingkatkan dan potensi ekonomi lokal dikembangkan.
                        </p>

                        <p>
                            Pada tahun 2023, Kepala Desa Tamrin telah berakhir masa periode kepemimpinannya dari tahun 2018-2023, dan dilaksanakan kembali pemilihan kepala desa yang bertempat di Kantor Desa Bonto Lojong. Pada pemilihan kali ini diikuti oleh 3 (tiga) pasangan calon di antaranya adalah Bpk. Sabir S.Pdi, Tamrin, M Justam. Pemilihan ini dilaksanakan dengan sistem E-Voting dan dimenangkan oleh <strong>Bapak Sabir S.Pdi</strong> dengan periode 2024-2029.
                        </p>
                    </div>

                    {/* Village Head Table */}
                    <div className={`mt-12 transition-all duration-1000 delay-900 ${isHistoryVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
                            Daftar Nama-nama Kepala Desa
                        </h3>

                        <div className="overflow-x-auto">
                            <table className="w-full bg-white rounded-xl shadow-lg overflow-hidden">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">No</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Nama</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">Masa Jabatan</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">Tahun</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-gray-600 font-medium">1</td>
                                        <td className="px-6 py-4 text-gray-900 font-medium">H. AMIRUDDIN, S.Sos., M.Si</td>
                                        <td className="px-6 py-4 text-center text-gray-600">2 Periode</td>
                                        <td className="px-6 py-4 text-center text-gray-600">2000 - 2010</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-gray-600 font-medium">2</td>
                                        <td className="px-6 py-4 text-gray-900 font-medium">SAMSUD</td>
                                        <td className="px-6 py-4 text-center text-gray-600">1 Periode</td>
                                        <td className="px-6 py-4 text-center text-gray-600">2011 - 2017</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-gray-600 font-medium">3</td>
                                        <td className="px-6 py-4 text-gray-900 font-medium">TAMRIN SE</td>
                                        <td className="px-6 py-4 text-center text-gray-600">1 Periode</td>
                                        <td className="px-6 py-4 text-center text-gray-600">2018 - 2023</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-gray-600 font-medium">4</td>
                                        <td className="px-6 py-4 text-gray-900 font-medium">SABIR, S.Pd.I</td>
                                        <td className="px-6 py-4 text-center text-gray-600">-</td>
                                        <td className="px-6 py-4 text-center text-gray-600">2023 - 2031</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
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
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 inline-block">
                                <span className="relative">
                                    Lokasi Desa
                                    <span
                                        className={`absolute bottom-0 left-0 h-1 bg-green-500 transition-all duration-700 ease-out ${isProfileVisible ? 'w-full' : 'w-0'}`}
                                        style={{ transitionDelay: '500ms' }}
                                    />
                                </span>
                            </h2>
                            <div className="w-20 h-1 bg-green-600 mb-6" />
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
                            <div className="inline-flex items-center space-x-2 text-green-600 font-semibold">
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
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 inline-block">
                                <span className="relative">
                                    Visi
                                    <span
                                        className={`absolute bottom-0 left-0 h-1 bg-green-500 transition-all duration-700 ease-out ${isVisionVisible ? 'w-full' : 'w-0'}`}
                                        style={{ transitionDelay: '300ms' }}
                                    />
                                </span>
                            </h2>

                            <div className="bg-green-50 border-l-4 border-green-600 p-6 md:p-8 rounded-r-lg shadow-sm">
                                <p className="text-gray-800 text-lg md:text-xl leading-relaxed font-medium">
                                    Menjadi desa wisata terdepan yang berkelanjutan, berlandaskan nilai-nilai budaya lokal dan pemberdayaan masyarakat untuk kesejahteraan bersama.
                                </p>
                            </div>
                        </div>

                        {/* Mission */}
                        <div className={`flex flex-col transition-all duration-1000 delay-300 ${isVisionVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
                            }`}>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 inline-block">
                                <span className="relative">
                                    Misi
                                    <span
                                        className={`absolute bottom-0 left-0 h-1 bg-green-500 transition-all duration-700 ease-out ${isVisionVisible ? 'w-full' : 'w-0'}`}
                                        style={{ transitionDelay: '500ms' }}
                                    />
                                </span>
                            </h2>

                            <div className="space-y-6">
                                {/* Mission Item 1 */}
                                <div className="flex gap-4 items-start">
                                    <div className="flex-shrink-0 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
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
                                    <div className="flex-shrink-0 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
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
                                    <div className="flex-shrink-0 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
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
                                    <div className="flex-shrink-0 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
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
                                    <div className="flex-shrink-0 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
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
