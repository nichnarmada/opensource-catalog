"use client"

import {
  Home,
  User,
  ChevronUp,
  Compass,
  Bookmark,
  LogIn,
  LogOut,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"
import { doc, onSnapshot } from "firebase/firestore"
import { db } from "@/firebase/config"

export function MainSidebar() {
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const pathname = usePathname()
  const [displayName, setDisplayName] = useState<string>("")

  useEffect(() => {
    if (!user?.uid) {
      setDisplayName("")
      return
    }

    // Subscribe to user document changes
    const unsubscribe = onSnapshot(doc(db, "users", user.uid), (doc) => {
      if (doc.exists()) {
        setDisplayName(doc.data().displayName)
      }
    })

    return () => unsubscribe()
  }, [user?.uid])

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
            <Link href="/discover" passHref legacyBehavior>
              <SidebarMenuButton
                tooltip="Discover"
                className={cn(
                  "h-10",
                  isActive("/discover") && "bg-muted text-foreground"
                )}
              >
                <Compass className="h-5 w-5" />
                <span>Discover</span>
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
      <SidebarFooter className="py-2">
        <SidebarMenu>
          <SidebarMenuItem>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton className="h-10">
                    <User className="h-5 w-5" />
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium">{displayName}</span>
                      <span className="text-xs text-muted-foreground">
                        {user.email}
                      </span>
                    </div>
                    <ChevronUp className="ml-auto h-5 w-5" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                >
                  <DropdownMenuItem onClick={logout} className="h-10">
                    <LogOut className="mr-2 h-5 w-5" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth" passHref legacyBehavior>
                <SidebarMenuButton tooltip="Sign In" className="h-10">
                  <LogIn className="h-5 w-5" />
                  <span>Sign In</span>
                </SidebarMenuButton>
              </Link>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
