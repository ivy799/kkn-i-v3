"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"

interface AboutSectionProps {
    title?: string
    paragraphs?: string[]
    image?: string
    primaryButtonText?: string
    primaryButtonUrl?: string
    secondaryButtonText?: string
    secondaryButtonUrl?: string
    reverse?: boolean
}

export function AboutSection({
    title = "Tentang Kami",
    paragraphs = [
        "Desa kami didirikan pada tahun 1950, bermula dari sebuah ide sederhana: menciptakan komunitas yang harmonis dan sejahtera. Yang dimulai sebagai kelompok kecil dari tiga keluarga yang berdedikasi telah berkembang menjadi desa yang berkembang pesat dengan berbagai fasilitas modern.",
        "Selama bertahun-tahun, kami telah membantu ribuan wisatawan menemukan kedamaian dan keindahan alam pedesaan. Pendekatan kami menggabungkan kearifan lokal dengan pelayanan modern.",
        "Hari ini, kami terus berinovasi dan mendorong batas-batas, selalu dengan misi awal kami di hati: menempatkan masyarakat sebagai prioritas utama dalam segala yang kami bangun.",
    ],
    image = "/img/img-02.jpeg",
    primaryButtonText = "Pelajari Sejarah Kami",
    primaryButtonUrl = "/about",
    secondaryButtonText = "Kenali Tim Kami",
    secondaryButtonUrl = "/team",
    reverse = false,
}: AboutSectionProps) {
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

    return (
        <section
            ref={sectionRef}
            className="w-full py-16 md:py-24 lg:py-32 bg-white"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center ${reverse ? 'lg:flex lg:flex-row-reverse' : ''}`}>
                    {/* Left Column - Text Content */}
                    <div
                        className={`space-y-6 transition-all duration-1000 lg:flex-1 ${isVisible
                            ? "opacity-100 translate-x-0"
                            : reverse ? "opacity-0 translate-x-10" : "opacity-0 -translate-x-10"
                            }`}
                    >
                        {/* Title */}
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                            {title}
                        </h2>

                        {/* Paragraphs */}
                        <div className="space-y-4">
                            {paragraphs.map((paragraph, index) => (
                                <p
                                    key={index}
                                    className="text-base md:text-lg text-gray-600 leading-relaxed"
                                    style={{
                                        transitionDelay: `${index * 100}ms`,
                                    }}
                                >
                                    {paragraph}
                                </p>
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Button
                                asChild
                                size="lg"
                                className="bg-black text-white hover:bg-gray-800 font-medium px-6 py-6 text-sm md:text-base"
                            >
                                <a href={primaryButtonUrl}>{primaryButtonText}</a>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                size="lg"
                                className="border-2 border-gray-300 text-gray-900 hover:bg-gray-50 font-medium px-6 py-6 text-sm md:text-base"
                            >
                                <a href={secondaryButtonUrl}>{secondaryButtonText}</a>
                            </Button>
                        </div>
                    </div>

                    {/* Right Column - Image */}
                    <div
                        className={`relative transition-all duration-1000 delay-300 lg:flex-1 ${isVisible
                            ? "opacity-100 translate-x-0"
                            : reverse ? "opacity-0 -translate-x-10" : "opacity-0 translate-x-10"
                            }`}
                    >
                        <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-2xl">
                            <Image
                                src={image}
                                alt="About Us"
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
