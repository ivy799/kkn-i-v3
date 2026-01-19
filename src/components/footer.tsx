import Image from "next/image"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"

export function Footer() {
    const navigationLinks = {
        menu: [
            { name: "Beranda", href: "/" },
            { name: "Profil Desa", href: "/profile" },
            { name: "Galeri", href: "/gallery" },
        ],
        explore: [
            { name: "Event", href: "/events" },
            { name: "Wisata", href: "/tourism" },
            { name: "UMKM", href: "/businesses" },
        ],
        info: [
            { name: "Tentang", href: "/about" },
        ],
    }

    return (
        <footer className="relative w-full bg-green-950 text-white">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
                <Image
                    src="/img/img-01.jpeg"
                    alt="Footer Background"
                    fill
                    className="object-cover opacity-20"
                    quality={75}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-green-950/95 to-green-950/98" />
            </div>

            {/* Content */}
            <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
                    {/* Logo and Social Media */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-2 mb-6">
                            <img
                                src="/img/logo.png"
                                alt="Logo Desa"
                                width={32}
                                height={32}
                                className="w-6 h-8 object-contain"
                            />
                            <span className="text-xl font-bold">Desa Wisata Bonto Lojong</span>
                        </div>
                        <p className="text-gray-400 mb-6 max-w-sm">
                            Desa wisata yang indah dengan pemandangan alam yang menakjubkan dan budaya lokal yang kaya.
                        </p>
                    </div>

                    {/* Navigation Menu */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Menu</h3>
                        <ul className="space-y-3">
                            {navigationLinks.menu.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Explore */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Jelajahi</h3>
                        <ul className="space-y-3">
                            {navigationLinks.explore.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Info */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Informasi</h3>
                        <ul className="space-y-3">
                            {navigationLinks.info.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-green-800">
                    <div className="flex flex-col md:flex-row justify-center items-center gap-4">
                        <p className="text-gray-400 text-sm">
                            Dibuat Oleh KKN Unhas 115 | © {new Date().getFullYear()} Desa Wisata Bonto Lojong. Hak Cipta Dilindungi.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
