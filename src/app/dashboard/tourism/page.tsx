"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { TourismDataTable } from "@/components/tourism-data-table"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { useEffect, useState } from "react"

export default function TourismPage() {
  const [tourismSpots, setTourismSpots] = useState([])
  const [loading, setLoading] = useState(true)

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

  useEffect(() => {
    fetchTourismSpots()
  }, [])

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <TourismDataTable data={tourismSpots} loading={loading} onRefresh={fetchTourismSpots} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}