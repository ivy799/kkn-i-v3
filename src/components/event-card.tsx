"use client"

import { format, isSameDay } from "date-fns"
import { id } from "date-fns/locale"
import { CalendarIcon, MapPin, Clock } from "lucide-react"

interface EventCardProps {
    event: {
        id: number
        title: string | null
        description: string | null
        location: string | null
        startDate: string | null
        endDate: string | null
        image: string | null
        status: string
    }
}

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
    UPCOMING: { bg: "bg-blue-100", text: "text-blue-800", label: "Akan Datang" },
    ONGOING: { bg: "bg-green-100", text: "text-green-800", label: "Berlangsung" },
    COMPLETED: { bg: "bg-gray-100", text: "text-gray-600", label: "Selesai" },
}

export function EventCard({ event }: EventCardProps) {
    const statusStyle = statusColors[event.status] || statusColors.UPCOMING

    const formatDateRange = () => {
        if (!event.startDate) return "Tanggal belum ditentukan"

        const start = new Date(event.startDate)
        const end = event.endDate ? new Date(event.endDate) : null

        if (!end || isSameDay(start, end)) {
            return format(start, "d MMMM yyyy", { locale: id })
        }

        if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
            return `${format(start, "d", { locale: id })} - ${format(end, "d MMMM yyyy", { locale: id })}`
        }

        return `${format(start, "d MMM", { locale: id })} - ${format(end, "d MMM yyyy", { locale: id })}`
    }

    return (
        <div className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={event.image || "/img/img-01.jpeg"}
                    alt={event.title || "Event"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
                        {statusStyle.label}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {event.title || "Untitled Event"}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {event.description || "Deskripsi tidak tersedia"}
                </p>

                {/* Meta Info */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <CalendarIcon className="w-4 h-4 text-blue-500" />
                        <span>{formatDateRange()}</span>
                    </div>

                    {event.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <MapPin className="w-4 h-4 text-red-500" />
                            <span className="line-clamp-1">{event.location}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
