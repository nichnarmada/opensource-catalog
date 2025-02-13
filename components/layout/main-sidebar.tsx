"use client"

import { Home, Bookmark } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { UserProfile } from "@/components/auth/user-profile"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

export function MainSidebar() {
  const { user } = useAuth()

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-between py-4">
        <span className="font-semibold">Open Source Brainstorm</span>
      </SidebarHeader>
      <SidebarContent className="px-3 py-2">
        <SidebarMenu className="space-y-1">
          <SidebarMenuItem>
            <Link href="/" passHref legacyBehavior>
              <SidebarMenuButton tooltip="Home" className="h-10">
                <Home className="h-5 w-5" />
                <span>Home</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          {user && (
            <SidebarMenuItem>
              <Link href="/saved" passHref legacyBehavior>
                <SidebarMenuButton tooltip="Bookmarks" className="h-10">
                  <Bookmark className="h-5 w-5" />
                  <span>Bookmarks</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarContent>
      <UserProfile />
    </Sidebar>
  )
}
