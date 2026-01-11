"use client"

import Image from "next/image"
import { MapPin, Clock, Phone, Tag } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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

interface TourismCardProps {
    id: number
    name: string | null
    description: string | null
    address: string | null
    ticketPrice: number | null
    openingHours: string | null
    closingHours: string | null
    contactPerson: string | null
    TourismSpotGallery: TourismSpotGallery[]
    TourismSpotFacility: TourismSpotFacility[]
}

export function TourismCard({
    name,
    description,
    address,
    ticketPrice,
    openingHours,
    closingHours,
    contactPerson,
    TourismSpotGallery,
    TourismSpotFacility
}: TourismCardProps) {
    const imageUrl = TourismSpotGallery?.[0]?.media || "/img/img-01.jpeg"

    return (
        <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-0">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative w-full md:w-80 h-64 md:h-auto overflow-hidden rounded-lg">
                        <Image
                            src={imageUrl}
                            alt={name || "Tourism spot"}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        {ticketPrice !== null && (
                            <div className="absolute bottom-3 left-3 bg-primary/90 backdrop-blur-sm text-primary-foreground px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1.5 shadow-lg">
                                <Tag className="w-4 h-4" />
                                Rp {ticketPrice.toLocaleString('id-ID')}
                            </div>
                        )}
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 p-4 md:p-5">
                        <div className="space-y-3">
                            {/* Title */}
                            <h3 className="text-xl md:text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                                {name}
                            </h3>

                            {/* Description */}
                            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                {description}
                            </p>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                                {address && (
                                    <div className="flex items-start gap-2 text-sm">
                                        <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                        <span className="text-muted-foreground line-clamp-1">{address}</span>
                                    </div>
                                )}

                                {(openingHours || closingHours) && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                                        <span className="text-muted-foreground">
                                            {openingHours} - {closingHours}
                                        </span>
                                    </div>
                                )}

                                {contactPerson && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                                        <span className="text-muted-foreground">{contactPerson}</span>
                                    </div>
                                )}
                            </div>

                            {/* Facilities */}
                            {TourismSpotFacility && TourismSpotFacility.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 pt-2">
                                    {TourismSpotFacility.slice(0, 4).map((facility) => (
                                        <Badge
                                            key={facility.id}
                                            variant="secondary"
                                            className="text-xs px-2 py-0.5 bg-secondary/50 hover:bg-secondary/80 transition-colors"
                                        >
                                            {facility.name}
                                        </Badge>
                                    ))}
                                    {TourismSpotFacility.length > 4 && (
                                        <Badge variant="outline" className="text-xs px-2 py-0.5">
                                            +{TourismSpotFacility.length - 4} lainnya
                                        </Badge>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
