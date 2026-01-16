"use client"

import { useState } from "react"
import { DayPicker } from "react-day-picker"
import { format, isSameDay, isWithinInterval, parseISO } from "date-fns"
import { id } from "date-fns/locale"
import "react-day-picker/style.css"

import { getEventStatus } from "@/lib/eventUtils"

interface Event {
    id: number
    title: string | null
    startDate: string | null
    endDate: string | null
}

interface EventsCalendarProps {
    events: Event[]
    selectedDate: Date | undefined
    onDateSelect: (date: Date | undefined) => void
}

export function EventsCalendar({ events, selectedDate, onDateSelect }: EventsCalendarProps) {
    const [month, setMonth] = useState<Date>(new Date())

    // Get dates that have events
    const getEventDates = () => {
        const dates: Date[] = []
        events.forEach(event => {
            if (event.startDate) {
                const start = parseISO(event.startDate)
                const end = event.endDate ? parseISO(event.endDate) : start

                // Add all dates in the range
                const current = new Date(start)
                while (current <= end) {
                    dates.push(new Date(current))
                    current.setDate(current.getDate() + 1)
                }
            }
        })
        return dates
    }

    const eventDates = getEventDates()

    // Check if a date has events
    const hasEvent = (date: Date) => {
        return eventDates.some(eventDate => isSameDay(eventDate, date))
    }

    // Get events for a specific date
    const getEventsForDate = (date: Date) => {
        return events.filter(event => {
            if (!event.startDate) return false
            const start = parseISO(event.startDate)
            const end = event.endDate ? parseISO(event.endDate) : start
            return isWithinInterval(date, { start, end }) || isSameDay(date, start) || isSameDay(date, end)
        })
    }

    // Custom DayButton content to show event indicators
    const CustomDayButton = (props: any) => {
        const { day, modifiers, ...buttonProps } = props
        const date = day?.date

        // Safety check for undefined date during SSR
        if (!date) {
            return <button {...buttonProps}>-</button>
        }

        const dateEvents = getEventsForDate(date)
        const hasEvents = dateEvents.length > 0

        return (
            <button {...buttonProps} className={`${buttonProps.className || ''} relative`}>
                <div className="relative flex flex-col items-center">
                    <span>{date.getDate()}</span>
                    {hasEvents && (
                        <div className="absolute -bottom-1 flex gap-0.5">
                            {dateEvents.slice(0, 3).map((event, idx) => {
                                const status = event.startDate ? getEventStatus(event.startDate, event.endDate) : 'COMPLETED'
                                return (
                                    <div
                                        key={idx}
                                        className={`w-1.5 h-1.5 rounded-full ${status === 'UPCOMING' ? 'bg-blue-500' :
                                            status === 'ONGOING' ? 'bg-green-500' :
                                                'bg-gray-400'
                                            }`}
                                    />
                                )
                            })}
                        </div>
                    )}
                </div>
            </button>
        )
    }

    return (
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <style jsx global>{`
                .rdp {
                    --rdp-cell-size: 40px;
                    --rdp-accent-color: #2563eb;
                    --rdp-background-color: #eff6ff;
                    margin: 0;
                }
                .rdp-month {
                    width: 100%;
                }
                .rdp-table {
                    width: 100%;
                    max-width: 100%;
                }
                .rdp-head_cell {
                    font-weight: 600;
                    color: #6b7280;
                    font-size: 0.875rem;
                }
                .rdp-day {
                    border-radius: 8px;
                    font-size: 0.875rem;
                }
                .rdp-day_selected {
                    background-color: #2563eb !important;
                    color: white !important;
                }
                .rdp-day_today {
                    font-weight: bold;
                    color: #2563eb;
                }
                .rdp-nav {
                    gap: 0.5rem;
                }
                .rdp-nav_button {
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                }
                .rdp-caption_label {
                    font-size: 1.125rem;
                    font-weight: 600;
                    color: #111827;
                }
            `}</style>

            <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={onDateSelect}
                month={month}
                onMonthChange={setMonth}
                locale={id}
                showOutsideDays
                fixedWeeks
                modifiers={{
                    hasEvent: eventDates,
                }}
                modifiersStyles={{
                    hasEvent: {
                        fontWeight: 'bold',
                    },
                }}
                components={{
                    DayButton: CustomDayButton,
                }}
            />

            {/* Legend */}
            <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-2">Keterangan:</p>
                <div className="flex flex-wrap gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-gray-600">Akan Datang</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-gray-600">Berlangsung</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-gray-400" />
                        <span className="text-gray-600">Selesai</span>
                    </div>
                </div>
            </div>

            {/* Selected date info */}
            {selectedDate && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600">
                        Menampilkan event pada:{" "}
                        <span className="font-semibold text-gray-900">
                            {format(selectedDate, "d MMMM yyyy", { locale: id })}
                        </span>
                    </p>
                    <button
                        onClick={() => onDateSelect(undefined)}
                        className="mt-2 text-xs text-green-600 hover:underline"
                    >
                        Tampilkan semua event
                    </button>
                </div>
            )}
        </div>
    )
}
