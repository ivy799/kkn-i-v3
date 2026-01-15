/**
 * Calculate event status based on start and end dates
 * @param startDate - Event start date
 * @param endDate - Event end date (optional)
 * @returns Event status: 'UPCOMING', 'ONGOING', or 'COMPLETED'
 */
export function getEventStatus(
    startDate: string | Date,
    endDate?: string | Date | null
): 'UPCOMING' | 'ONGOING' | 'COMPLETED' {
    // Normalize dates to start of day for proper comparison
    const now = new Date()
    now.setHours(0, 0, 0, 0)

    const start = new Date(startDate)
    start.setHours(0, 0, 0, 0)

    const end = endDate ? new Date(endDate) : null
    if (end) {
        end.setHours(23, 59, 59, 999) // End of the day
    }

    // Event hasn't started yet
    if (now < start) {
        return 'UPCOMING'
    }

    // Event has ended
    if (end && now > end) {
        return 'COMPLETED'
    }

    // Event is currently ongoing
    return 'ONGOING'
}

/**
 * Get Indonesian label for event status
 */
export function getEventStatusLabel(status: 'UPCOMING' | 'ONGOING' | 'COMPLETED'): string {
    const labels = {
        UPCOMING: 'Akan Datang',
        ONGOING: 'Sedang Berlangsung',
        COMPLETED: 'Selesai'
    }
    return labels[status]
}
