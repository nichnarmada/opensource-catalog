"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { useDebouncedCallback } from "use-debounce"

interface SearchProjectsProps {
  initialValue?: string
}

export function SearchProjects({ initialValue = "" }: SearchProjectsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(initialValue)

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set("q", term)
    } else {
      params.delete("q")
    }
    params.set("page", "1")
    router.push(`/catalog?${params.toString()}`)
  }, 300)

  return (
    <div className="relative flex-1">
      <Input
        type="search"
        placeholder="Search projects..."
        className="pr-10"
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
          handleSearch(e.target.value)
        }}
      />
      <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
    </div>
  )
}
