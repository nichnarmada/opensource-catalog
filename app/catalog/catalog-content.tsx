"use client"

import { ProjectFilters } from "@/components/filters/project-filters"
import { SearchProjects } from "@/components/search-projects"
import { useEffect, useState } from "react"
import { getLanguages, addLanguage } from "@/firebase/services/languages"
import type { Language } from "@/firebase/services/languages"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { useRouter, useSearchParams } from "next/navigation"

interface CatalogContentProps {
  children: React.ReactNode
  initialSearchQuery: string
  initialLanguage: string
}

export function CatalogContent({
  children,
  initialSearchQuery,
  initialLanguage,
}: CatalogContentProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const { toast } = useToast()

  const [languages, setLanguages] = useState<Language[]>([])
  const [isLoadingLanguages, setIsLoadingLanguages] = useState(true)

  useEffect(() => {
    getLanguages()
      .then(setLanguages)
      .catch((error) => {
        console.error("Failed to fetch languages:", error)
        toast({
          title: "Error",
          description: "Failed to load languages",
          variant: "destructive",
        })
      })
      .finally(() => setIsLoadingLanguages(false))
  }, [toast])

  const handleLanguageChange = (value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value && value !== "all") {
      params.set("language", value.toLowerCase())
    } else {
      params.delete("language")
    }
    router.push(`/catalog?${params.toString()}`)
  }

  const handleAddLanguage = async (name: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add languages",
        variant: "destructive",
      })
      return
    }

    try {
      const language = await addLanguage(name, user.uid)
      setLanguages([...languages, language])
      toast({
        title: "Language added",
        description: `${name} has been added to the list`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to add language",
        variant: "destructive",
      })
      throw error
    }
  }

  return (
    <>
      <SearchProjects initialValue={initialSearchQuery} />
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        <ProjectFilters
          languages={languages}
          currentLanguage={initialLanguage}
          isLoading={isLoadingLanguages}
          onLanguageChange={handleLanguageChange}
          onAddLanguage={handleAddLanguage}
          isAuthenticated={!!user}
        />
        {children}
      </div>
    </>
  )
}
