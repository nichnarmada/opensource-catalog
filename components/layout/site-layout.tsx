"use client"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { MainSidebar } from "@/components/layout/main-sidebar"

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen>
      <MainSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}
