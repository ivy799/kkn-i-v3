"use client"

import {
  IconBusinessplan,
  IconCalendarEvent,
  IconDashboard,
  IconInnerShadowTop,
  IconMap,
  IconNews,
  IconSettings,
  IconUsers
} from "@tabler/icons-react"
import * as React from "react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
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
    </Sidebar>
  )
}
