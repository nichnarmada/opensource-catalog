"use client"

import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useRouter, useSearchParams } from "next/navigation"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { useState, useEffect } from "react"
import { Language, getLanguages, addLanguage } from "@/services/languages"

export function ProjectFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const { toast } = useToast()
  const currentLanguage = searchParams.get("language") || "all"

  const [languages, setLanguages] = useState<Language[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [newLanguage, setNewLanguage] = useState("")
  const [loading, setLoading] = useState(true)

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
      .finally(() => setLoading(false))
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

  const handleAddLanguage = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add languages",
        variant: "destructive",
      })
      return
    }

    if (!newLanguage.trim()) return

    try {
      const language = await addLanguage(newLanguage.trim(), user.uid)
      setLanguages([...languages, language])
      setNewLanguage("")
      setIsAdding(false)
      toast({
        title: "Language added",
        description: `${newLanguage} has been added to the list`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to add language",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-3">Filters</h4>
          <div className="space-y-4">
            <div className="space-y-3">
              <Label>Language</Label>
              {loading ? (
                <div className="text-sm text-muted-foreground">Loading...</div>
              ) : (
                <div className="space-y-2">
                  <RadioGroup
                    value={currentLanguage}
                    onValueChange={handleLanguageChange}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="all" />
                      <Label
                        htmlFor="all"
                        className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        All Languages
                      </Label>
                    </div>
                    {[...languages].reverse().map((lang) => (
                      <div
                        key={lang.id}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem
                          value={lang.name.toLowerCase()}
                          id={lang.id}
                        />
                        <Label
                          htmlFor={lang.id}
                          className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {lang.name}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  {isAdding ? (
                    <div className="flex gap-2 items-center">
                      <Input
                        placeholder="Enter language name..."
                        value={newLanguage}
                        onChange={(e) => setNewLanguage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            handleAddLanguage()
                          }
                          if (e.key === "Escape") {
                            setIsAdding(false)
                            setNewLanguage("")
                          }
                        }}
                        className="h-8"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          setIsAdding(false)
                          setNewLanguage("")
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-sm font-normal h-8"
                      onClick={() => setIsAdding(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add language
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
