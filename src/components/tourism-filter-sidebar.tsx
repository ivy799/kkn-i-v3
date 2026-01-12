"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Search, X, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

interface FilterState {
    search: string
    priceMin: string
    priceMax: string
    facilities: string[]
}

interface TourismFilterSidebarProps {
    filters: FilterState
    onFilterChange: (filters: FilterState) => void
    availableFacilities: string[]
    totalResults: number
}

export function TourismFilterSidebar({
    filters,
    onFilterChange,
    availableFacilities,
    totalResults,
}: TourismFilterSidebarProps) {
    const [localFilters, setLocalFilters] = useState<FilterState>(filters)
    const [searchInput, setSearchInput] = useState(filters.search)
    const debounceRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        setLocalFilters(filters)
        setSearchInput(filters.search)
    }, [filters])

    // Cleanup debounce on unmount
    useEffect(() => {
        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current)
            }
        }
    }, [])

    const handleSearchChange = useCallback((value: string) => {
        // Update input immediately for responsive UI
        setSearchInput(value)

        // Debounce the filter change
        if (debounceRef.current) {
            clearTimeout(debounceRef.current)
        }

        debounceRef.current = setTimeout(() => {
            const newFilters = { ...localFilters, search: value }
            setLocalFilters(newFilters)
            onFilterChange(newFilters)
        }, 300) // 300ms delay after user stops typing
    }, [localFilters, onFilterChange])

    const handlePriceChange = (field: 'priceMin' | 'priceMax', value: string) => {
        const newFilters = { ...localFilters, [field]: value }
        setLocalFilters(newFilters)
        onFilterChange(newFilters)
    }

    const handleFacilityToggle = (facility: string) => {
        const newFacilities = localFilters.facilities.includes(facility)
            ? localFilters.facilities.filter(f => f !== facility)
            : [...localFilters.facilities, facility]

        const newFilters = { ...localFilters, facilities: newFacilities }
        setLocalFilters(newFilters)
        onFilterChange(newFilters)
    }

    const clearFilters = () => {
        const clearedFilters: FilterState = {
            search: '',
            priceMin: '',
            priceMax: '',
            facilities: [],
        }
        setSearchInput('')
        setLocalFilters(clearedFilters)
        onFilterChange(clearedFilters)
    }

    const hasActiveFilters =
        localFilters.search ||
        localFilters.priceMin ||
        localFilters.priceMax ||
        localFilters.facilities.length > 0

    const FilterContent = () => (
        <div className="space-y-6">
            {/* Search */}
            <div className="space-y-2">
                <Label htmlFor="search" className="text-sm font-semibold">
                    Cari Wisata
                </Label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        id="search"
                        type="text"
                        placeholder="Cari nama atau deskripsi..."
                        value={searchInput}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="pl-9 bg-background/50 border-border/50 focus:border-primary transition-colors"
                    />
                </div>
            </div>

            <Separator />

            {/* Price Range */}
            <div className="space-y-3">
                <Label className="text-sm font-semibold">Rentang Harga Tiket</Label>
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <Label htmlFor="priceMin" className="text-xs text-muted-foreground">
                            Minimum
                        </Label>
                        <Input
                            id="priceMin"
                            type="number"
                            placeholder="0"
                            value={localFilters.priceMin}
                            onChange={(e) => handlePriceChange('priceMin', e.target.value)}
                            className="bg-background/50 border-border/50 focus:border-primary transition-colors"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="priceMax" className="text-xs text-muted-foreground">
                            Maximum
                        </Label>
                        <Input
                            id="priceMax"
                            type="number"
                            placeholder="100000"
                            value={localFilters.priceMax}
                            onChange={(e) => handlePriceChange('priceMax', e.target.value)}
                            className="bg-background/50 border-border/50 focus:border-primary transition-colors"
                        />
                    </div>
                </div>
            </div>

            <Separator />

            {/* Facilities */}
            {availableFacilities.length > 0 && (
                <div className="space-y-3">
                    <Label className="text-sm font-semibold">Fasilitas</Label>
                    <div className="space-y-2.5">
                        {availableFacilities.map((facility) => (
                            <div key={facility} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`facility-${facility}`}
                                    checked={localFilters.facilities.includes(facility)}
                                    onCheckedChange={() => handleFacilityToggle(facility)}
                                    className="border-border/50"
                                />
                                <Label
                                    htmlFor={`facility-${facility}`}
                                    className="text-sm font-normal cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    {facility}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Clear Filters */}
            {hasActiveFilters && (
                <>
                    <Separator />
                    <Button
                        variant="outline"
                        onClick={clearFilters}
                        className="w-full border-border/50 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-colors"
                    >
                        <X className="w-4 h-4 mr-2" />
                        Hapus Semua Filter
                    </Button>
                </>
            )}

            {/* Results Count */}
            <div className="pt-2">
                <p className="text-sm text-center text-muted-foreground">
                    Menampilkan <span className="font-semibold text-foreground">{totalResults}</span> destinasi wisata
                </p>
            </div>
        </div>
    )

    return (
        <>
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-4">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="w-full border-border/50">
                            <SlidersHorizontal className="w-4 h-4 mr-2" />
                            Filter & Cari
                            {hasActiveFilters && (
                                <span className="ml-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                                    Aktif
                                </span>
                            )}
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                        <SheetHeader>
                            <SheetTitle>Filter Wisata</SheetTitle>
                        </SheetHeader>
                        <div className="mt-6">
                            <FilterContent />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop Sidebar */}
            <Card className="hidden lg:block sticky top-6 border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
                <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <SlidersHorizontal className="w-5 h-5 text-primary" />
                        Filter & Cari
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <FilterContent />
                </CardContent>
            </Card>
        </>
    )
}
