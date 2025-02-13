"use client"

import { useAuth } from "@/contexts/auth-context"
import { LogIn, LogOut, User, ChevronUp } from "lucide-react"
import {
  SidebarFooter,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenu,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

export function UserProfile() {
  const { user, logout } = useAuth()

  if (!user) {
    return (
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/auth" passHref legacyBehavior>
              <SidebarMenuButton tooltip="Sign In" className="h-10">
                <LogIn className="h-5 w-5" />
                <span>Sign In</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    )
  }

  return (
    <SidebarFooter className="py-2">
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton className="h-10">
                <User className="h-5 w-5" />
                <span>{user.email}</span>
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
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  )
}
