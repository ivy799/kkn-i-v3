"use client"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import { TourismCard } from "@/components/tourism-card"
import { TourismFilterSidebar } from "@/components/tourism-filter-sidebar"
import { Input } from "@/components/ui/input"
import { Loader2, Search, X } from "lucide-react"

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

interface FilterState {
    search: string
    facilities: string[]
}

export default function WisataPage() {
    const [tourismSpots, setTourismSpots] = useState<TourismSpot[]>([])
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState<FilterState>({
        search: '',
        facilities: [],
    })

    useEffect(() => {
        fetchTourismSpots()
    }, [])

    const fetchTourismSpots = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/tourism')
            const result = await response.json()
            if (result.success) {
                setTourismSpots(result.data)
            }
        } catch (error) {
            console.error('Error fetching tourism spots:', error)
        } finally {
            setLoading(false)
        }
    }

    // Get all unique facilities from all tourism spots
    const availableFacilities = useMemo(() => {
        const facilitiesSet = new Set<string>()
        tourismSpots.forEach(spot => {
            spot.TourismSpotFacility?.forEach(facility => {
                if (facility.name) {
                    facilitiesSet.add(facility.name)
                }
            })
        })
        return Array.from(facilitiesSet).sort()
    }, [tourismSpots])

    // Filter tourism spots based on current filters
    const filteredTourismSpots = useMemo(() => {
        return tourismSpots.filter(spot => {
            // Search filter
            if (filters.search) {
                const searchLower = filters.search.toLowerCase()
                const matchesName = spot.name?.toLowerCase().includes(searchLower)
                const matchesDescription = spot.description?.toLowerCase().includes(searchLower)
                if (!matchesName && !matchesDescription) return false
            }

            // Facilities filter
            if (filters.facilities.length > 0) {
                const spotFacilities = spot.TourismSpotFacility?.map(f => f.name) || []
                const hasAllFacilities = filters.facilities.every(requiredFacility =>
                    spotFacilities.includes(requiredFacility)
                )
                if (!hasAllFacilities) return false
            }

            return true
        })
    }, [tourismSpots, filters])

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            {/* Hero Section */}
            <section className="relative w-full h-[280px] md:h-[350px] overflow-hidden">
                <Image
                    src="/hero-bg.jpg"
                    alt="Wisata Desa"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />

                <div className="absolute inset-0 flex flex-col justify-center container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                            Wisata Desa
                        </h1>
                        <p className="text-lg md:text-xl text-white/90 drop-shadow-md">
                            Jelajahi keindahan dan pesona destinasi wisata unggulan desa kami
                        </p>
                    </div>
                </div>
            </section>

            {/* Search Section - Sticky */}
            <section className="sticky top-0 z-20 bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-4">
                        {/* Search Input */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Cari nama destinasi atau deskripsi..."
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                className="pl-10 h-12 w-full"
                            />
                            {filters.search && (
                                <button
                                    onClick={() => setFilters({ ...filters, search: '' })}
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                >
                                    <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Results Count */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <p className="text-sm text-gray-500">
                    Menampilkan {filteredTourismSpots.length} destinasi wisata
                    {filters.search && ` untuk "${filters.search}"`}
                </p>
            </section>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-6 md:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Tourism Spots List - Left Side */}
                    <div className="lg:col-span-8 space-y-4">
                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="text-center space-y-4">
                                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
                                    <p className="text-muted-foreground">Memuat destinasi wisata...</p>
                                </div>
                            </div>
                        ) : filteredTourismSpots.length === 0 ? (
                            <div className="text-center py-20 space-y-4">
                                <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center">
                                    <svg
                                        className="w-10 h-10 text-muted-foreground"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-semibold">Tidak ada destinasi ditemukan</h3>
                                    <p className="text-muted-foreground">
                                        Coba ubah filter atau kata kunci pencarian Anda
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4 animate-in fade-in duration-500">
                                {filteredTourismSpots.map((spot) => (
                                    <div
                                        key={spot.id}
                                        className="animate-in slide-in-from-bottom-4 duration-500"
                                        style={{ animationDelay: `${Math.min(filteredTourismSpots.indexOf(spot) * 50, 300)}ms` }}
                                    >
                                        <TourismCard {...spot} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Filter Sidebar - Right Side */}
                    <div className="lg:col-span-4">
                        <TourismFilterSidebar
                            filters={filters}
                            onFilterChange={setFilters}
                            availableFacilities={availableFacilities}
                            totalResults={filteredTourismSpots.length}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
