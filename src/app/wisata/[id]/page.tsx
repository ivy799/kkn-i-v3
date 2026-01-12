"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
    MapPin,
    Clock,
    Phone,
    Tag,
    ChevronLeft,
    Navigation,
    Share2,
    Copy,
    Check,
    Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

interface TourismSpotGallery {
    id: number
    media: string
    title: string | null
    description: string | null
}

interface TourismSpotFacility {
    id: number
    name: string | null
    description: string | null
}

interface TourismSpot {
    id: number
    name: string | null
    description: string | null
    address: string | null
    mapUrl: string | null
    ticketPrice: number | null
    openingHours: string | null
    closingHours: string | null
    contactPerson: string | null
    TourismSpotGallery: TourismSpotGallery[]
    TourismSpotFacility: TourismSpotFacility[]
}

export default function TourismDetailPage() {
    const params = useParams()
    const [tourismSpot, setTourismSpot] = useState<TourismSpot | null>(null)
    const [loading, setLoading] = useState(true)
    const [selectedImage, setSelectedImage] = useState<string>("")
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        if (params.id) {
            fetchTourismSpot()
        }
    }, [params.id])

    const fetchTourismSpot = async () => {
        try {
            setLoading(true)
            const response = await fetch(`/api/tourism/${params.id}`)
            const result = await response.json()
            if (result.success) {
                setTourismSpot(result.data)
                // Set first image as selected
                if (result.data.TourismSpotGallery?.[0]?.media) {
                    setSelectedImage(result.data.TourismSpotGallery[0].media)
                }
            }
        } catch (error) {
            console.error('Error fetching tourism spot:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleShare = async () => {
        const url = window.location.href
        try {
            if (navigator.share) {
                await navigator.share({
                    title: tourismSpot?.name || 'Destinasi Wisata',
                    text: tourismSpot?.description || '',
                    url: url,
                })
            } else {
                await navigator.clipboard.writeText(url)
                setCopied(true)
                toast.success('Link berhasil disalin!')
                setTimeout(() => setCopied(false), 2000)
            }
        } catch (error) {
            console.error('Error sharing:', error)
        }
    }

    const handleOpenMap = () => {
        if (tourismSpot?.mapUrl) {
            window.open(tourismSpot.mapUrl, '_blank')
        } else if (tourismSpot?.address) {
            window.open(`https://maps.google.com/?q=${encodeURIComponent(tourismSpot.address)}`, '_blank')
        }
    }

    const handleContact = () => {
        if (tourismSpot?.contactPerson) {
            window.open(`https://wa.me/${tourismSpot.contactPerson.replace(/\D/g, '')}`, '_blank')
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
                    <p className="text-muted-foreground">Memuat informasi wisata...</p>
                </div>
            </div>
        )
    }

    if (!tourismSpot) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center">
                        <MapPin className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h2 className="text-2xl font-bold">Wisata tidak ditemukan</h2>
                    <p className="text-muted-foreground">Destinasi wisata yang Anda cari tidak tersedia</p>
                    <Link href="/wisata">
                        <Button variant="outline" className="mt-4">
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            Kembali ke Daftar Wisata
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    const defaultImage = "/img/img-01.jpeg"
    const mainImage = selectedImage || tourismSpot.TourismSpotGallery?.[0]?.media || defaultImage
    const galleryImages = tourismSpot.TourismSpotGallery || []

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b border-border/50 backdrop-blur-sm">
                <div className="container mx-auto px-4 py-4">
                    <Link
                        href="/wisata"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Kembali ke Daftar Wisata
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-6 md:py-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Left Side - Image Gallery */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted">
                            <Image
                                src={mainImage}
                                alt={tourismSpot.name || "Tourism spot"}
                                fill
                                className="object-cover transition-all duration-500"
                                priority
                            />
                            {tourismSpot.ticketPrice !== null && (
                                <div className="absolute top-4 left-4 bg-primary/90 backdrop-blur-sm text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg">
                                    <Tag className="w-4 h-4" />
                                    Rp {tourismSpot.ticketPrice.toLocaleString('id-ID')}
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Gallery */}
                        {galleryImages.length > 0 && (
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {galleryImages.map((image, index) => (
                                    <button
                                        key={image.id}
                                        onClick={() => setSelectedImage(image.media)}
                                        className={`relative flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border-2 transition-all duration-300 ${selectedImage === image.media || (index === 0 && !selectedImage)
                                                ? 'border-primary ring-2 ring-primary/20'
                                                : 'border-border/50 hover:border-primary/50'
                                            }`}
                                    >
                                        <Image
                                            src={image.media}
                                            alt={image.title || `Gallery ${index + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Side - Info */}
                    <div className="space-y-6">
                        {/* Title & Price */}
                        <div className="space-y-3">
                            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                                {tourismSpot.name}
                            </h1>
                            {tourismSpot.ticketPrice !== null && (
                                <p className="text-2xl font-bold text-primary">
                                    Rp {tourismSpot.ticketPrice.toLocaleString('id-ID')}
                                    <span className="text-sm font-normal text-muted-foreground ml-2">/ orang</span>
                                </p>
                            )}
                        </div>

                        {/* Quick Info */}
                        <div className="space-y-3">
                            {tourismSpot.address && (
                                <div className="flex items-start gap-3 text-sm">
                                    <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                    <span className="text-muted-foreground">{tourismSpot.address}</span>
                                </div>
                            )}

                            {(tourismSpot.openingHours || tourismSpot.closingHours) && (
                                <div className="flex items-center gap-3 text-sm">
                                    <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                                    <span className="text-muted-foreground">
                                        {tourismSpot.openingHours} - {tourismSpot.closingHours}
                                    </span>
                                </div>
                            )}

                            {tourismSpot.contactPerson && (
                                <div className="flex items-center gap-3 text-sm">
                                    <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                                    <span className="text-muted-foreground">{tourismSpot.contactPerson}</span>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <Button
                                onClick={handleOpenMap}
                                className="h-12 text-base"
                            >
                                <Navigation className="w-5 h-5 mr-2" />
                                Lihat di Peta
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleContact}
                                className="h-12 text-base border-border/50"
                            >
                                <Phone className="w-5 h-5 mr-2" />
                                Hubungi
                            </Button>
                        </div>

                        <Separator />

                        {/* Accordion Sections */}
                        <Accordion type="multiple" defaultValue={["description"]} className="w-full">
                            {/* Description */}
                            <AccordionItem value="description" className="border-border/50">
                                <AccordionTrigger className="text-base font-semibold hover:no-underline">
                                    DESKRIPSI
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground leading-relaxed">
                                    {tourismSpot.description || "Tidak ada deskripsi tersedia."}
                                </AccordionContent>
                            </AccordionItem>

                            {/* Facilities */}
                            {tourismSpot.TourismSpotFacility && tourismSpot.TourismSpotFacility.length > 0 && (
                                <AccordionItem value="facilities" className="border-border/50">
                                    <AccordionTrigger className="text-base font-semibold hover:no-underline">
                                        FASILITAS
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="space-y-3">
                                            {tourismSpot.TourismSpotFacility.map((facility) => (
                                                <div key={facility.id} className="flex items-start gap-3">
                                                    <Badge variant="secondary" className="px-2.5 py-1">
                                                        {facility.name}
                                                    </Badge>
                                                    {facility.description && (
                                                        <span className="text-sm text-muted-foreground">
                                                            {facility.description}
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            )}

                            {/* Operating Hours */}
                            <AccordionItem value="hours" className="border-border/50">
                                <AccordionTrigger className="text-base font-semibold hover:no-underline">
                                    JAM OPERASIONAL
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-muted-foreground">Senin - Minggu</span>
                                            <span className="font-medium">
                                                {tourismSpot.openingHours && tourismSpot.closingHours
                                                    ? `${tourismSpot.openingHours} - ${tourismSpot.closingHours}`
                                                    : "Hubungi pengelola"}
                                            </span>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>

                        <Separator />

                        {/* Share Section */}
                        <div className="space-y-3">
                            <span className="text-sm font-semibold">BAGIKAN</span>
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handleShare}
                                    className="w-10 h-10 rounded-full border-border/50"
                                >
                                    {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => {
                                        navigator.clipboard.writeText(window.location.href)
                                        setCopied(true)
                                        toast.success('Link berhasil disalin!')
                                        setTimeout(() => setCopied(false), 2000)
                                    }}
                                    className="w-10 h-10 rounded-full border-border/50"
                                >
                                    <Copy className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
