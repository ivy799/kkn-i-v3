"use client"

import { useState, useEffect, useMemo } from "react"
import { TourismCard } from "@/components/tourism-card"
import { TourismFilterSidebar } from "@/components/tourism-filter-sidebar"
import { Loader2 } from "lucide-react"

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
    priceMin: string
    priceMax: string
    facilities: string[]
}

export default function WisataPage() {
    const [tourismSpots, setTourismSpots] = useState<TourismSpot[]>([])
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState<FilterState>({
        search: '',
        priceMin: '',
        priceMax: '',
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

            // Price filter
            if (filters.priceMin && spot.ticketPrice !== null) {
                if (spot.ticketPrice < parseInt(filters.priceMin)) return false
            }
            if (filters.priceMax && spot.ticketPrice !== null) {
                if (spot.ticketPrice > parseInt(filters.priceMax)) return false
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
