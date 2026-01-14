import { UserSidebar } from "@/components/user-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getPrisma } from "@/lib/prismaClient"
import { IconBusinessplan, IconClockHour4, IconCircleCheck, IconCircleX } from "@tabler/icons-react"

async function getUserStats(userId: number) {
    // @ts-ignore - userId will exist after prisma generate
    const [total, pending, approved, rejected] = await Promise.all([
        getPrisma.business.count({ where: { userId } }),
        getPrisma.business.count({ where: { userId, status: 'PENDING' } }),
        getPrisma.business.count({ where: { userId, status: 'APPROVED' } }),
        getPrisma.business.count({ where: { userId, status: 'REJECTED' } }),
    ])

    return { total, pending, approved, rejected }
}

export default async function UserDashboardPage() {
    const user = await getCurrentUser()

    if (!user) {
        redirect('/auth/signin')
    }

    const stats = await getUserStats(user.userId)

    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <UserSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
                            {/* Welcome Section */}
                            <div className="rounded-xl border bg-card p-6">
                                <h1 className="text-2xl font-bold mb-2">
                                    Selamat Datang, {user.username}! 👋
                                </h1>
                                <p className="text-muted-foreground">
                                    Kelola pengajuan bisnis Anda dari dashboard ini.
                                </p>
                            </div>

                            {/* Stats Cards */}
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <div className="rounded-xl border bg-card p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="rounded-lg bg-blue-100 p-3">
                                            <IconBusinessplan className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Total Bisnis</p>
                                            <p className="text-2xl font-bold">{stats.total}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-xl border bg-card p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="rounded-lg bg-yellow-100 p-3">
                                            <IconClockHour4 className="h-6 w-6 text-yellow-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Menunggu</p>
                                            <p className="text-2xl font-bold">{stats.pending}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-xl border bg-card p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="rounded-lg bg-green-100 p-3">
                                            <IconCircleCheck className="h-6 w-6 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Disetujui</p>
                                            <p className="text-2xl font-bold">{stats.approved}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-xl border bg-card p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="rounded-lg bg-red-100 p-3">
                                            <IconCircleX className="h-6 w-6 text-red-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Ditolak</p>
                                            <p className="text-2xl font-bold">{stats.rejected}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="rounded-xl border bg-card p-6">
                                <h2 className="text-lg font-semibold mb-4">Aksi Cepat</h2>
                                <div className="grid gap-3 md:grid-cols-2">
                                    <a
                                        href="/user-dashboard/business/new"
                                        className="flex items-center gap-3 rounded-lg border p-4 hover:bg-accent transition-colors"
                                    >
                                        <div className="rounded-lg bg-green-100 p-2">
                                            <IconBusinessplan className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Ajukan Bisnis Baru</p>
                                            <p className="text-sm text-muted-foreground">Daftarkan bisnis Anda untuk ditampilkan</p>
                                        </div>
                                    </a>
                                    <a
                                        href="/user-dashboard/business"
                                        className="flex items-center gap-3 rounded-lg border p-4 hover:bg-accent transition-colors"
                                    >
                                        <div className="rounded-lg bg-blue-100 p-2">
                                            <IconClockHour4 className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Lihat Status Pengajuan</p>
                                            <p className="text-sm text-muted-foreground">Pantau status pengajuan bisnis Anda</p>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
