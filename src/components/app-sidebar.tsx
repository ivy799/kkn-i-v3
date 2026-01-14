"use client"

import {
  IconBusinessplan,
  IconCalendarEvent,
  IconDashboard,
  IconInnerShadowTop,
  IconLogout,
  IconMap,
  IconNews,
  IconSettings,
  IconUsers
} from "@tabler/icons-react"
import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
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
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Wisata",
      url: "/dashboard/tourism",
      icon: IconMap,
    },
    {
      title: "Bisnis",
      url: "/dashboard/business",
      icon: IconBusinessplan,
    },
    {
      title: "Acara",
      url: "/dashboard/events",
      icon: IconCalendarEvent,
    },
  ],
  Settings: [
    {
      name: "Pengguna",
      url: "/dashboard/users",
      icon: IconUsers,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        <NavDocuments items={data.Settings} />
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
