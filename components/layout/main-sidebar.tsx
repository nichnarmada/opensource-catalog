"use client"

import { Home, Bookmark, Users, Library } from "lucide-react"
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
import { useRouter, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function MainSidebar() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const pathname = usePathname()

  const handleAuthRequired = () => {
    toast({
      title: "Authentication required",
      description: "Please sign in to access this feature",
      variant: "destructive",
    })
    router.push("/auth")
  }

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
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
              <SidebarMenuButton
                tooltip="Home"
                className={cn(
                  "h-10",
                  isActive("/") && "bg-muted text-foreground"
                )}
              >
                <Home className="h-5 w-5" />
                <span>Home</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/catalog" passHref legacyBehavior>
              <SidebarMenuButton
                tooltip="Catalog"
                className={cn(
                  "h-10",
                  isActive("/catalog") && "bg-muted text-foreground"
                )}
              >
                <Library className="h-5 w-5" />
                <span>Catalog</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/community" passHref legacyBehavior>
              <SidebarMenuButton
                tooltip="Community"
                className={cn(
                  "h-10",
                  isActive("/community") && "bg-muted text-foreground"
                )}
              >
                <Users className="h-5 w-5" />
                <span>Community</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            {user ? (
              <Link href="/saved" passHref legacyBehavior>
                <SidebarMenuButton
                  tooltip="Bookmarks"
                  className={cn(
                    "h-10",
                    isActive("/saved") && "bg-muted text-foreground"
                  )}
                >
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
