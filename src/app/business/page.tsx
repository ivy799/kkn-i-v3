"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Search, Filter, MapPin, Phone, Store, X, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"

interface BusinessGallery {
    id: number
    media: string | null
}

interface Business {
    id: number
    type: string | null
    status: string
    name: string | null
    ownerName: string | null
    phoneNumber: string | null
    description: string | null
    minimumPrice: number | null
    maximumPrice: number | null
    address: string | null
    BusinessGallery: BusinessGallery[]
}

const businessTypes = [
    { value: "all", label: "Semua Kategori" },
    { value: "Kuliner", label: "Kuliner" },
    { value: "Kerajinan", label: "Kerajinan" },
    { value: "Pertanian", label: "Pertanian" },
    { value: "Jasa", label: "Jasa" },
]

const formatPrice = (price: number | null) => {
    if (!price) return "-"
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(price)
}

export default function BusinessPage() {
    const [businesses, setBusinesses] = useState<Business[]>([])
    const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedType, setSelectedType] = useState("all")
    const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set())
    const [showFilters, setShowFilters] = useState(false)
    const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    const itemRefs = useRef<Map<number, HTMLDivElement>>(new Map())

    useEffect(() => {
        fetchBusinesses()
    }, [])

    // Filter businesses when search or type changes
    useEffect(() => {
        let result = businesses.filter(b => b.status === "APPROVED")

        // Filter by type
        if (selectedType !== "all") {
            result = result.filter(b => b.type === selectedType)
        }

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            result = result.filter(
                b =>
                    b.name?.toLowerCase().includes(query) ||
                    b.description?.toLowerCase().includes(query) ||
                    b.ownerName?.toLowerCase().includes(query)
            )
        }

        setFilteredBusinesses(result)
    }, [businesses, searchQuery, selectedType])

    // Intersection observer for scroll animations
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const id = Number(entry.target.getAttribute("data-id"))
                    if (entry.isIntersecting) {
                        setVisibleItems((prev) => new Set(prev).add(id))
                    }
                })
            },
            {
                threshold: 0.1,
                rootMargin: "0px 0px -50px 0px",
            }
        )

        itemRefs.current.forEach((element) => {
            if (element) observer.observe(element)
        })

        return () => observer.disconnect()
    }, [filteredBusinesses])

    const fetchBusinesses = async () => {
        try {
            const response = await fetch("/api/business?status=APPROVED")
            const data = await response.json()
            if (data.success) {
                setBusinesses(data.data)
                setFilteredBusinesses(data.data)
            }
        } catch (error) {
            console.error("Error fetching businesses:", error)
        } finally {
            setLoading(false)
        }
    }

    const setItemRef = (id: number, element: HTMLDivElement | null) => {
        if (element) {
            itemRefs.current.set(id, element)
        } else {
            itemRefs.current.delete(id)
        }
    }

    const getTypeColor = (type: string | null) => {
        switch (type) {
            case "Kuliner":
                return "bg-orange-100 text-orange-700"
            case "Kerajinan":
                return "bg-purple-100 text-purple-700"
            case "Pertanian":
                return "bg-green-100 text-green-700"
            case "Jasa":
                return "bg-green-100 text-green-700"
            default:
                return "bg-gray-100 text-gray-700"
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="relative w-full h-[280px] md:h-[350px] overflow-hidden">
                <Image
                    src="/img/img-13.jpeg"
                    alt="UMKM Desa"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />

                <div className="absolute inset-0 flex flex-col justify-center container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                            UMKM Desa
                        </h1>
                        <p className="text-lg md:text-xl text-white/90 drop-shadow-md">
                            Temukan produk dan jasa unggulan dari desa kami
                        </p>
                    </div>
                </div>
            </section>

            {/* Search & Filter Section */}
            <section className="sticky top-0 z-20 bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        {/* Search Input */}
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Cari produk, usaha, atau pemilik..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-12 w-full"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                >
                                    <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                                </button>
                            )}
                        </div>

                        {/* Category Filter - Desktop */}
                        <div className="hidden md:block">
                            <Select value={selectedType} onValueChange={setSelectedType}>
                                <SelectTrigger className="w-[200px] h-12">
                                    <SelectValue placeholder="Kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    {businessTypes.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Filter Button - Mobile */}
                        <Button
                            variant="outline"
                            className="md:hidden w-full h-12"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <Filter className="w-4 h-4 mr-2" />
                            Filter
                        </Button>
                    </div>

                    {/* Mobile Filters */}
                    {showFilters && (
                        <div className="md:hidden mt-4 pb-2">
                            <Select value={selectedType} onValueChange={setSelectedType}>
                                <SelectTrigger className="w-full h-12">
                                    <SelectValue placeholder="Pilih Kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    {businessTypes.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>
            </section>

            {/* Results Count */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <p className="text-sm text-gray-500">
                    Menampilkan {filteredBusinesses.length} UMKM
                    {selectedType !== "all" && ` dalam kategori ${selectedType}`}
                    {searchQuery && ` untuk "${searchQuery}"`}
                </p>
            </section>

            {/* Products Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                {loading ? (
                    <div className="flex justify-center items-center py-24">
                        <div className="text-center space-y-4">
                            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
                            <p className="text-muted-foreground">Memuat UMKM...</p>
                        </div>
                    </div>
                ) : filteredBusinesses.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredBusinesses.map((business, index) => (
                            <div
                                key={business.id}
                                ref={(el) => setItemRef(business.id, el)}
                                data-id={business.id}
                                className={`
                                    group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl
                                    transition-all duration-500 ease-out cursor-pointer
                                    ${visibleItems.has(business.id)
                                        ? "opacity-100 translate-y-0"
                                        : "opacity-0 translate-y-8"
                                    }
                                `}
                                style={{
                                    transitionDelay: `${(index % 8) * 75}ms`,
                                }}
                                onClick={() => {
                                    setSelectedBusiness(business)
                                    setIsDrawerOpen(true)
                                }}
                            >
                                {/* Image */}
                                <div className="relative h-[220px] overflow-hidden bg-gray-100">
                                    {/* Type Badge */}
                                    <div className="absolute top-3 left-3 z-10">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(
                                                business.type
                                            )}`}
                                        >
                                            {business.type || "Lainnya"}
                                        </span>
                                    </div>

                                    <Image
                                        src={
                                            business.BusinessGallery?.[0]?.media ||
                                            "/img/img-01.jpeg"
                                        }
                                        alt={business.name || "Business"}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                    />
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1 group-hover:text-green-600 transition-colors">
                                        {business.name || "Untitled"}
                                    </h3>

                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                        {business.description || "Deskripsi tidak tersedia"}
                                    </p>

                                    {/* Price Range */}
                                    <div className="mb-4">
                                        <span className="text-lg font-bold text-gray-900">
                                            {formatPrice(business.minimumPrice)}
                                        </span>
                                        {business.maximumPrice &&
                                            business.maximumPrice !== business.minimumPrice && (
                                                <span className="text-gray-400 text-sm ml-1">
                                                    - {formatPrice(business.maximumPrice)}
                                                </span>
                                            )}
                                    </div>

                                    {/* Meta Info */}
                                    <div className="space-y-2 text-sm text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <Store className="w-4 h-4 text-gray-400" />
                                            <span className="line-clamp-1">
                                                {business.ownerName || "Pemilik tidak tersedia"}
                                            </span>
                                        </div>
                                        {business.address && (
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-gray-400" />
                                                <span className="line-clamp-1">{business.address}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Contact Button */}
                                    {business.phoneNumber && (
                                        <a
                                            href={`https://wa.me/${business.phoneNumber.replace(
                                                /^0/,
                                                "62"
                                            )}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Phone className="w-4 h-4" />
                                            Hubungi via WhatsApp
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Store className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 text-lg mb-2">Tidak ada UMKM ditemukan</p>
                        <p className="text-gray-400 text-sm">
                            Coba ubah kata kunci pencarian atau filter kategori
                        </p>
                        {(searchQuery || selectedType !== "all") && (
                            <Button
                                variant="outline"
                                className="mt-4"
                                onClick={() => {
                                    setSearchQuery("")
                                    setSelectedType("all")
                                }}
                            >
                                Reset Filter
                            </Button>
                        )}
                    </div>
                )}
            </section>

            {/* Detail Drawer */}
            <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
                    {selectedBusiness && (
                        <>
                            <SheetHeader className="space-y-4">
                                {/* Image Gallery */}
                                <div className="relative h-[250px] -mx-6 -mt-6 mb-4 overflow-hidden">
                                    <Image
                                        src={selectedBusiness.BusinessGallery?.[0]?.media || "/img/img-01.jpeg"}
                                        alt={selectedBusiness.name || "Business"}
                                        fill
                                        className="object-cover"
                                    />
                                    {/* Type Badge */}
                                    <div className="absolute top-4 left-4">
                                        <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getTypeColor(selectedBusiness.type)}`}>
                                            {selectedBusiness.type || "Lainnya"}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <SheetTitle className="text-2xl font-bold text-gray-900">
                                        {selectedBusiness.name || "Untitled"}
                                    </SheetTitle>
                                    <SheetDescription className="text-base text-gray-600 mt-2">
                                        {selectedBusiness.description || "Deskripsi tidak tersedia"}
                                    </SheetDescription>
                                </div>
                            </SheetHeader>

                            <div className="mt-6 space-y-6">
                                {/* Price Range */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Kisaran Harga</h3>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl font-bold text-gray-900">
                                            {formatPrice(selectedBusiness.minimumPrice)}
                                        </span>
                                        {selectedBusiness.maximumPrice && selectedBusiness.maximumPrice !== selectedBusiness.minimumPrice && (
                                            <>
                                                <span className="text-gray-400">-</span>
                                                <span className="text-2xl font-bold text-gray-900">
                                                    {formatPrice(selectedBusiness.maximumPrice)}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Owner Info */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Informasi Pemilik</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            <Store className="w-5 h-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-gray-500">Pemilik</p>
                                                <p className="text-base text-gray-900 font-medium">
                                                    {selectedBusiness.ownerName || "Tidak tersedia"}
                                                </p>
                                            </div>
                                        </div>
                                        {selectedBusiness.address && (
                                            <div className="flex items-start gap-3">
                                                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Alamat</p>
                                                    <p className="text-base text-gray-900">
                                                        {selectedBusiness.address}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        {selectedBusiness.phoneNumber && (
                                            <div className="flex items-start gap-3">
                                                <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Kontak</p>
                                                    <p className="text-base text-gray-900 font-medium">
                                                        {selectedBusiness.phoneNumber}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Gallery Images */}
                                {selectedBusiness.BusinessGallery && selectedBusiness.BusinessGallery.length > 1 && (
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Galeri Foto</h3>
                                        <div className="grid grid-cols-3 gap-2">
                                            {selectedBusiness.BusinessGallery.slice(0, 6).map((gallery, idx) => (
                                                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden">
                                                    <Image
                                                        src={gallery.media || "/img/img-01.jpeg"}
                                                        alt={`Gallery ${idx + 1}`}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* WhatsApp Button */}
                                {selectedBusiness.phoneNumber && (
                                    <a
                                        href={`https://wa.me/${selectedBusiness.phoneNumber.replace(/^0/, "62")}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block"
                                    >
                                        <Button className="w-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center gap-2 h-12">
                                            <Phone className="w-5 h-5" />
                                            Hubungi via WhatsApp
                                        </Button>
                                    </a>
                                )}
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    )
}
