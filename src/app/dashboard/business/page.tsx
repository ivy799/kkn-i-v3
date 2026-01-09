"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { BusinessDataTable } from "@/components/business-data-table"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { useEffect, useState } from "react"

export default function BusinessPage() {
  const [businesses, setBusinesses] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchBusinesses = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/business')
      const result = await response.json()
      if (result.success) {
        setBusinesses(result.data)
      }
    } catch (error) {
      console.error('Error fetching businesses:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBusinesses()
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
              <BusinessDataTable data={businesses} loading={loading} onRefresh={fetchBusinesses} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}