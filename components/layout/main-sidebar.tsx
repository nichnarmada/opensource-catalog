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
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function MainSidebar() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const handleAuthRequired = () => {
    toast({
      title: "Authentication required",
      description: "Please sign in to access this feature",
      variant: "destructive",
    })
    router.push("/auth")
  }

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
          <SidebarMenuItem>
            {user ? (
              <Link href="/saved" passHref legacyBehavior>
                <SidebarMenuButton tooltip="Bookmarks" className="h-10">
                  <Bookmark className="h-5 w-5" />
                  <span>Bookmarks</span>
                </SidebarMenuButton>
              </Link>
            ) : (
              <SidebarMenuButton
                tooltip="Bookmarks"
                className="h-10"
                onClick={handleAuthRequired}
              >
                <Bookmark className="h-5 w-5" />
                <span>Bookmarks</span>
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <UserProfile />
    </Sidebar>
  )
}
