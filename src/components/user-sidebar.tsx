"use client"

import {
    IconBusinessplan,
    IconDashboard,
    IconInnerShadowTop,
    IconLogout,
    IconPlus,
} from "@tabler/icons-react"
import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { NavMain } from "@/components/nav-main"
import { Button } from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
    navMain: [
        {
            title: "Dashboard",
            url: "/user-dashboard",
            icon: IconDashboard,
        },
        {
            title: "Bisnis Saya",
            url: "/user-dashboard/business",
            icon: IconBusinessplan,
        },
        {
            title: "Ajukan Bisnis Baru",
            url: "/user-dashboard/business/new",
            icon: IconPlus,
        },
    ],
}

export function UserSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const router = useRouter()
    const [isLoggingOut, setIsLoggingOut] = React.useState(false)

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true)
            const response = await fetch("/api/auth/signout", { method: "POST" })
            if (response.ok) {
                toast.success("Berhasil logout")
                router.push("/")
                router.refresh()
            } else {
                toast.error("Gagal logout")
            }
        } catch (error) {
            toast.error("Terjadi kesalahan saat logout")
        } finally {
            setIsLoggingOut(false)
        }
    }

    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:!p-1.5"
                        >
                            <a href="/">
                                <IconInnerShadowTop className="!size-5" />
                                <span className="text-base font-semibold">Bonto Lojong</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter className="p-4">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="outline"
                            className="w-full justify-center gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                        >
                            <IconLogout className="size-4" />
                            <span>Keluar</span>
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Konfirmasi Keluar</AlertDialogTitle>
                            <AlertDialogDescription>
                                Apakah Anda yakin ingin keluar dari akun? Anda perlu login kembali untuk mengakses dashboard.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={isLoggingOut}>Batal</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                {isLoggingOut ? "Keluar..." : "Ya, Keluar"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </SidebarFooter>
        </Sidebar>
    )
}
