"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { X } from "lucide-react"

interface GalleryItem {
    id: string
    name: string
    image: string
}

interface BentoGalleryProps {
    title?: string
    description?: string
    items: GalleryItem[]
    showMoreUrl?: string
    showMoreText?: string
}

export function BentoGallery({
    title = "Galeri Foto",
    description = "Jelajahi momen-momen indah dan kegiatan menarik di desa kami melalui koleksi foto pilihan.",
    items,
    showMoreUrl = "/gallery",
    showMoreText = "Lihat Semua Galeri",
}: BentoGalleryProps) {
    const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null)
    const [isVisible, setIsVisible] = useState(false)
    const sectionRef = useRef<HTMLElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                }
            },
            {
                threshold: 0.1,
                rootMargin: "0px 0px -100px 0px",
            }
        )

        if (sectionRef.current) {
            observer.observe(sectionRef.current)
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current)
            }
        }
    }, [])

    // Limit to 6 items for bento grid
    const displayItems = items.slice(0, 6)

    return (
        <section ref={sectionRef} className="w-full py-10 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className={`text-center mb-12 md:mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"}`}>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 inline-block">
                        <span className="relative">
                            {title}
                            <span
                                className={`absolute bottom-0 left-0 h-1 bg-green-500 transition-all duration-700 ease-out ${isVisible ? 'w-full' : 'w-0'}`}
                                style={{ transitionDelay: '500ms' }}
                            />
                        </span>
                    </h2>
                    <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
                        {description}
                    </p>
                </div>

                {/* Bento Grid */}
                <div className={`grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] gap-4 mb-8 transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
                    {displayItems.map((item, index) => {
                        // Define different sizes for bento grid layout
                        const gridClass =
                            index === 0 ? "md:col-span-2 md:row-span-2" : // Large square
                                index === 1 ? "md:col-span-2 md:row-span-1" : // Wide rectangle
                                    index === 2 ? "md:col-span-1 md:row-span-1" : // Small square
                                        index === 3 ? "md:col-span-1 md:row-span-1" : // Small square
                                            index === 4 ? "md:col-span-2 md:row-span-1" : // Wide rectangle
                                                "md:col-span-2 md:row-span-1" // Wide rectangle

                        return (
                            <div
                                key={item.id}
                                className={`relative group cursor-pointer overflow-hidden rounded-2xl ${gridClass}`}
                                onClick={() => setSelectedImage(item)}
                            >
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                                />
                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center">
                                    <p className="text-white font-semibold text-lg md:text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4 text-center">
                                        {item.name}
                                    </p>
                                </div>
                            </div>
                        )
                    })}          </div>

                {/* Show More Button */}
                <div className="flex justify-center">
                    <Button
                        asChild
                        size="lg"
                        className="bg-black text-white hover:bg-gray-800 font-medium px-8 py-6 text-sm md:text-base"
                    >
                        <a href={showMoreUrl}>{showMoreText}</a>
                    </Button>
                </div>
            </div>

            {/* Zoom Dialog */}
            <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
                <DialogContent className="max-w-4xl w-full p-0 overflow-hidden">
                    <DialogHeader className="absolute top-4 right-4 z-10">
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </DialogHeader>
                    {selectedImage && (
                        <div className="relative">
                            <div className="relative w-full aspect-video">
                                <Image
                                    src={selectedImage.image}
                                    alt={selectedImage.name}
                                    fill
                                    className="object-contain"
                                    sizes="(max-width: 1200px) 100vw, 1200px"
                                />
                            </div>
                            <div className="p-6 bg-white">
                                <DialogTitle className="text-2xl font-bold text-gray-900">
                                    {selectedImage.name}
                                </DialogTitle>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </section>
    )
}
