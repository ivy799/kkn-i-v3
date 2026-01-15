"use client"

import { useState } from "react"
import { X, SlidersHorizontal } from "lucide-react"
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

    const handleFacilityToggle = (facility: string) => {
        const newFacilities = filters.facilities.includes(facility)
            ? filters.facilities.filter(f => f !== facility)
            : [...filters.facilities, facility]
        onFilterChange({ ...filters, facilities: newFacilities })
    }

    const clearFilters = () => {
        onFilterChange({
            search: '',
            facilities: [],
        })
    }

    const hasActiveFilters =
        filters.search ||
        filters.facilities.length > 0

    const FilterContent = () => (
        <div className="space-y-6">
            {/* Facilities */}
            {availableFacilities.length > 0 && (
                <div className="space-y-3">
                    <Label className="text-sm font-semibold">Fasilitas</Label>
                    <div className="space-y-2.5">
                        {availableFacilities.map((facility) => (
                            <div key={facility} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`facility-${facility}`}
                                    checked={filters.facilities.includes(facility)}
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
                            Filter Wisata
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
                        Filter Wisata
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <FilterContent />
                </CardContent>
            </Card>
        </>
    )
}
