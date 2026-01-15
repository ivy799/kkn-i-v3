"use client"

import { useState, useEffect } from "react"
import { format, isSameDay, parseISO, isWithinInterval } from "date-fns"
import { id } from "date-fns/locale"
import { EventCard } from "@/components/event-card"
import { EventsCalendar } from "@/components/events-calendar"
import { CalendarDays, List } from "lucide-react"

interface Event {
    id: number
    title: string | null
    description: string | null
    location: string | null
    startDate: string | null
    endDate: string | null
    image: string | null
    status: string
}

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
    const [view, setView] = useState<"calendar" | "list">("calendar")

    useEffect(() => {
        fetchEvents()
    }, [])

    const fetchEvents = async () => {
        try {
            const response = await fetch("/api/event")
            const data = await response.json()
            if (data.success) {
                setEvents(data.data)
            }
        } catch (error) {
            console.error("Error fetching events:", error)
        } finally {
            setLoading(false)
        }
    }

    // Filter events based on selected date
    const filteredEvents = selectedDate
        ? events.filter(event => {
            if (!event.startDate) return false
            const start = parseISO(event.startDate)
            const end = event.endDate ? parseISO(event.endDate) : start
            return (
                isSameDay(selectedDate, start) ||
                isSameDay(selectedDate, end) ||
                isWithinInterval(selectedDate, { start, end })
            )
        })
        : events

    // Sort events: ONGOING first, then UPCOMING by date, then COMPLETED
    const sortedEvents = [...filteredEvents].sort((a, b) => {
        const statusOrder = { ONGOING: 0, UPCOMING: 1, COMPLETED: 2 }
        const orderA = statusOrder[a.status as keyof typeof statusOrder] ?? 3
        const orderB = statusOrder[b.status as keyof typeof statusOrder] ?? 3

        if (orderA !== orderB) return orderA - orderB

        // If same status, sort by date
        const dateA = a.startDate ? new Date(a.startDate).getTime() : 0
        const dateB = b.startDate ? new Date(b.startDate).getTime() : 0

        // For upcoming/ongoing, earlier first; for completed, recent first
        return a.status === "COMPLETED" ? dateB - dateA : dateA - dateB
    })

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="relative w-full h-[300px] md:h-[400px] overflow-hidden">
                <img
                    src="/hero-bg.jpg"
                    alt="Events"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />

                <div className="absolute inset-0 flex flex-col justify-center container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                            Agenda Desa
                        </h1>
                        <p className="text-lg md:text-xl text-white/90 drop-shadow-md">
                            Ikuti berbagai kegiatan menarik di desa wisata kami
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* View Toggle - Mobile */}
                <div className="flex md:hidden justify-center mb-6">
                    <div className="inline-flex rounded-lg bg-white shadow p-1">
                        <button
                            onClick={() => setView("calendar")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${view === "calendar"
                                ? "bg-green-600 text-white"
                                : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            <CalendarDays className="w-4 h-4" />
                            Kalender
                        </button>
                        <button
                            onClick={() => setView("list")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${view === "list"
                                ? "bg-green-600 text-white"
                                : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            <List className="w-4 h-4" />
                            Daftar
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Calendar - Hidden on mobile when list view is active */}
                    <div className={`md:col-span-3 lg:col-span-1 ${view === "list" ? "hidden md:block" : ""}`}>
                        <div className="md:max-w-2xl md:mx-auto lg:max-w-none lg:mx-0 sticky top-4">
                            <EventsCalendar
                                events={events}
                                selectedDate={selectedDate}
                                onDateSelect={setSelectedDate}
                            />
                        </div>
                    </div>

                    {/* Events List - Hidden on mobile when calendar view is active */}
                    <div className={`md:col-span-3 lg:col-span-2 ${view === "calendar" ? "hidden md:block" : ""}`}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {selectedDate
                                    ? `Event ${format(selectedDate, "d MMMM yyyy", { locale: id })}`
                                    : "Semua Event"
                                }
                            </h2>
                            <span className="text-sm text-gray-500">
                                {sortedEvents.length} event{sortedEvents.length !== 1 ? "" : ""}
                            </span>
                        </div>

                        {loading ? (
                            <div className="flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                            </div>
                        ) : sortedEvents.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {sortedEvents.map(event => (
                                    <EventCard key={event.id} event={event} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <CalendarDays className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">
                                    {selectedDate
                                        ? "Tidak ada event pada tanggal ini"
                                        : "Belum ada event yang tersedia"
                                    }
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    )
}
