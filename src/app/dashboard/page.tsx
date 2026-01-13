import { AppSidebar } from "@/components/app-sidebar"
import { DashboardChart } from "@/components/dashboard-chart"
import { DashboardTable } from "@/components/dashboard-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { getPrisma } from "@/lib/prismaClient"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"

async function getDashboardData() {
  const [tourismSpots, businesses, events, stats] = await Promise.all([
    getPrisma.tourismSpot.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        _count: {
          select: {
            TourismSpotGallery: true,
          },
        },
      },
      take: 10,
      orderBy: { id: 'desc' },
    }),
    getPrisma.business.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        type: true,
      },
      take: 10,
      orderBy: { id: 'desc' },
    }),
    getPrisma.event.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        startDate: true,
        status: true,
      },
      take: 10,
      orderBy: { id: 'desc' },
    }),
    Promise.all([
      getPrisma.tourismSpot.count(),
      getPrisma.business.count(),
      getPrisma.event.count(),
      getPrisma.tourismSpotGallery.count(),
    ]),
  ])

  return {
    tourismSpots,
    businesses,
    events: events.map(e => ({
      ...e,
      title: e.title || 'Untitled Event',
      startDate: e.startDate?.toISOString() || new Date().toISOString(),
    })),
    chartData: {
      wisata: stats[0],
      umkm: stats[1],
      event: stats[2],
      galeri: stats[3],
    },
  }
}

export default async function Page() {
  // Server-side authentication check - defense in depth
  const user = await getCurrentUser()

  if (!user) {
    redirect('/auth/signin')
  }

  if (user.role !== 'ADMIN') {
    redirect('/')
  }

  const dashboardData = await getDashboardData()

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
              <SectionCards />
              <div className="px-4 lg:px-6">
                <DashboardChart data={dashboardData.chartData} />
              </div>
              <DashboardTable
                tourismSpots={dashboardData.tourismSpots}
                businesses={dashboardData.businesses}
                events={dashboardData.events}
              />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
