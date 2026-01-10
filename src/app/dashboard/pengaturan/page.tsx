"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { VillageProfileForm } from "@/components/village-profile-form"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { useEffect, useState } from "react"

export default function VillageProfilePage() {
    const [villageProfile, setVillageProfile] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchVillageProfile = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/village-profile')
            const result = await response.json()
            if (result.success) {
                setVillageProfile(result.data)
            }
        } catch (error) {
            console.error('Error fetching village profile:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchVillageProfile()
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
                            <VillageProfileForm data={villageProfile} loading={loading} onRefresh={fetchVillageProfile} />
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
