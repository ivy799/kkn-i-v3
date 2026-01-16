"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { ZoomIn, X } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

interface GalleryItem {
    id: number
    title: string | null
    description: string | null
    media: string | null
    tourismSpotName?: string
}

export default function GalleryPage() {
    const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null)
    const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set())

    // Refs for intersection observer
    const itemRefs = useRef<Map<number, HTMLDivElement>>(new Map())

    useEffect(() => {
        fetchGalleryData()
    }, [])

    // Intersection observer for scroll animations
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const id = Number(entry.target.getAttribute('data-id'))
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
    }, [galleryItems])

    const fetchGalleryData = async () => {
        try {
            const response = await fetch("/api/wisata")
            const data = await response.json()
            if (data.success) {
                // Extract all gallery items from tourism spots
                const allGalleryItems: GalleryItem[] = []
                data.data.forEach((spot: any) => {
                    if (spot.TourismSpotGallery) {
                        spot.TourismSpotGallery.forEach((gallery: any) => {
                            allGalleryItems.push({
                                ...gallery,
                                tourismSpotName: spot.name,
                            })
                        })
                    }
                })
                setGalleryItems(allGalleryItems)
            }
        } catch (error) {
            console.error("Error fetching gallery:", error)
        } finally {
            setLoading(false)
        }
    }

    // Bento grid pattern - \etermines size based on index (no row-span to avoid gaps)
    const getGridClass = (index: number) => {
        const patterns = [
            "col-span-1 md:col-span-2 h-[200px] md:h-[300px]", // 0: Wide
            "col-span-1 md:col-span-1 h-[200px] md:h-[300px]", // 1: Small
            "col-span-1 md:col-span-1 h-[200px] md:h-[300px]", // 2: Small
            "col-span-1 md:col-span-1 h-[200px] md:h-[250px]", // 3: Small
            "col-span-1 md:col-span-2 h-[200px] md:h-[250px]", // 4: Wide
            "col-span-1 md:col-span-1 h-[200px] md:h-[250px]", // 5: Small
            "col-span-1 md:col-span-1 h-[200px] md:h-[280px]", // 6: Small
            "col-span-1 md:col-span-1 h-[200px] md:h-[280px]", // 7: Small
            "col-span-1 md:col-span-2 h-[200px] md:h-[280px]", // 8: Wide
        ]
        return patterns[index % patterns.length]
    }

    const setItemRef = (id: number, element: HTMLDivElement | null) => {
        if (element) {
            itemRefs.current.set(id, element)
        } else {
            itemRefs.current.delete(id)
        }
    }

    return (
        <div className="min-h-screen bg-green-900">
            {/* Hero Section */}
            <section className="relative w-full h-[300px] md:h-[400px] overflow-hidden">
                <Image
                    src="/img/img-11.jpeg"
                    alt="Gallery"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-green-900" />

                <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                        Galeri Desa
                    </h1>
                    <p className="text-lg md:text-xl text-white/90 max-w-2xl drop-shadow-md">
                        Jelajahi momen-momen indah dan kegiatan menarik di desa wisata kami
                    </p>
                </div>
            </section>

            {/* Gallery Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                {loading ? (
                    <div className="flex justify-center items-center py-24">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
                    </div>
                ) : galleryItems.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                        {galleryItems.map((item, index) => (
                            <div
                                key={item.id}
                                ref={(el) => setItemRef(item.id, el)}
                                data-id={item.id}
                                className={`
                                    relative group cursor-pointer overflow-hidden rounded-2xl
                                    ${getGridClass(index)}
                                    transition-all duration-700 ease-out
                                    ${visibleItems.has(item.id)
                                        ? "opacity-100 translate-y-0 scale-100"
                                        : "opacity-0 translate-y-8 scale-95"
                                    }
                                `}
                                style={{
                                    transitionDelay: `${(index % 8) * 100}ms`,
                                }}
                                onClick={() => setSelectedImage(item)}
                            >
                                {/* Image */}
                                <Image
                                    src={item.media || "/img/img-01.jpeg"}
                                    alt={item.title || "Gallery image"}
                                    fill
                                    className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:opacity-70"
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                />

                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                {/* Zoom Icon - Top Right */}
                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                                        <ZoomIn className="w-5 h-5 text-white" />
                                    </div>
                                </div>

                                {/* Title and Description - Bottom */}
                                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                    <h3 className="text-white font-semibold text-base md:text-lg mb-1 line-clamp-1">
                                        {item.title || "Untitled"}
                                    </h3>
                                    {item.description && (
                                        <p className="text-white/80 text-sm line-clamp-2">
                                            {item.description}
                                        </p>
                                    )}
                                    {item.tourismSpotName && (
                                        <p className="text-white/60 text-xs mt-1">
                                            {item.tourismSpotName}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24">
                        <div className="w-16 h-16 bg-green-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ZoomIn className="w-8 h-8 text-green-400" />
                        </div>
                        <p className="text-gray-400 text-lg">Belum ada foto dalam galeri</p>
                    </div>
                )}
            </section>

            {/* Lightbox Dialog */}
            <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
                <DialogContent className="max-w-5xl w-full p-0 overflow-hidden bg-black/95 border-gray-800">
                    <DialogHeader className="absolute top-4 right-4 z-10">
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="rounded-full bg-white/10 backdrop-blur-sm p-2 text-white hover:bg-white/20 transition-colors"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </DialogHeader>
                    {selectedImage && (
                        <div className="relative">
                            <div className="relative w-full aspect-[4/3] md:aspect-video">
                                <Image
                                    src={selectedImage.media || "/img/img-01.jpeg"}
                                    alt={selectedImage.title || "Gallery image"}
                                    fill
                                    className="object-contain"
                                    sizes="100vw"
                                />
                            </div>
                            <div className="p-6 bg-green-900">
                                <DialogTitle className="text-xl md:text-2xl font-bold text-white mb-2">
                                    {selectedImage.title || "Untitled"}
                                </DialogTitle>
                                {selectedImage.description && (
                                    <p className="text-gray-400 text-sm md:text-base">
                                        {selectedImage.description}
                                    </p>
                                )}
                                {selectedImage.tourismSpotName && (
                                    <p className="text-gray-500 text-sm mt-2">
                                        Lokasi: {selectedImage.tourismSpotName}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
