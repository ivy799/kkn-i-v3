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
        "Desa Bonto Lojong, yang terletak di Kecamatan Ulu Ere, Kabupaten Bantaeng, memiliki akar sejarah panjang sejak tahun 1943. Berawal dari bagian Desa Bonto Marannu, wilayah ini resmi berdiri sebagai desa persiapan pada tahun 1997 dan definitif pada tahun 2000. Dari masa perintisan jalan poros di zaman kolonial hingga transformasi infrastruktur modern seperti jaringan listrik dan pengaspalan jalan lintas dusun, Bonto Lojong terus berkembang secara dinamis. Kepemimpinan yang silih berganti melalui proses demokrasi, termasuk penerapan sistem e-voting yang inovatif, telah membawa desa ini menjadi wilayah yang maju dengan tata kelola pelayanan publik yang semakin baik.",

    ],
    image = "/img/img-01.jpeg",
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
            className="w-full py-10 bg-white"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center ${reverse ? 'lg:flex lg:flex-row-reverse' : ''}`}>
                    <div
                        className={`space-y-6 transition-all duration-1000 lg:flex-1 ${isVisible
                            ? "opacity-100 translate-x-0"
                            : reverse ? "opacity-0 translate-x-10" : "opacity-0 -translate-x-10"
                            }`}
                    >
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight inline-block">
                            <span className="relative">
                                {title}
                                <span
                                    className={`absolute bottom-0 left-0 h-1 bg-green-500 transition-all duration-700 ease-out ${isVisible ? 'w-full' : 'w-0'}`}
                                    style={{ transitionDelay: '300ms' }}
                                />
                            </span>
                        </h2>

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
                    </div>

                    <div
                        className={`relative transition-all duration-1000 delay-300 lg:flex-1 ${isVisible
                            ? "opacity-100 translate-x-0"
                            : reverse ? "opacity-0 -translate-x-10" : "opacity-0 translate-x-10"
                            }`}
                    >
                        <div className="relative aspect-square w-full rounded-3xl overflow-hidden shadow-2xl">
                            <Image
                                src={image}
                                alt="About Us"
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-700"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
