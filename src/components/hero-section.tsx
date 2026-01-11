"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"

interface HeroSectionProps {
    title?: string
    subtitle?: string
    ctaText?: string
    ctaUrl?: string
    backgroundImage?: string
}

export function HeroSection({
    title = "Desa Wisata Bonto Lojong",
    subtitle = "Desa Wisata indah yang sejuk dan asri",
    ctaText = "RESERVASI SEKARANG",
    ctaUrl = "#",
    backgroundImage = "/img/img-01.jpeg",
}: HeroSectionProps) {
    return (
        <section className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src={backgroundImage}
                    alt="Hero Background"
                    fill
                    className="object-cover"
                    priority
                    quality={90}
                />
                {/* Dark overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent" />
            </div>

            {/* Content Container */}
            <div className="relative h-full container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col justify-center h-full max-w-2xl lg:max-w-3xl">
                    {/* Title */}
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight drop-shadow-lg">
                        {title}
                    </h1>

                    {/* Subtitle */}
                    <p className="text-base sm:text-lg md:text-xl text-white/95 mb-8 md:mb-10 max-w-xl drop-shadow-md">
                        {subtitle}
                    </p>

                    {/* CTA Button */}
                    <div>
                        <Button
                            asChild
                            size="lg"
                            className="bg-white text-black hover:bg-white/90 font-semibold px-6 sm:px-8 py-5 sm:py-6 text-xs sm:text-sm md:text-base tracking-wider uppercase shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            <a href={ctaUrl}>{ctaText}</a>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}
