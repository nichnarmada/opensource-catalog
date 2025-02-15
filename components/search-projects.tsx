"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function SearchProjects() {
  return (
    <div className="relative flex-1">
      <Input
        type="search"
        placeholder="Search coming soon..."
        className="w-full"
        disabled
      />
      <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
    </div>
  )
}
