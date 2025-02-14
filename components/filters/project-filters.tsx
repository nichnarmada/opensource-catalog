"use client"

import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Language } from "@/firebase/services/languages"
import { useState } from "react"

interface ProjectFiltersProps {
  languages: Language[]
  currentLanguage: string
  isLoading: boolean
  onLanguageChange: (language: string) => void
  onAddLanguage: (name: string) => Promise<void>
  isAuthenticated: boolean
}

export function ProjectFilters({
  languages,
  currentLanguage,
  isLoading,
  onLanguageChange,
  onAddLanguage,
  isAuthenticated,
}: ProjectFiltersProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [newLanguage, setNewLanguage] = useState("")

  const handleAddLanguage = async () => {
    if (!isAuthenticated) return
    if (!newLanguage.trim()) return

    try {
      await onAddLanguage(newLanguage.trim())
      setNewLanguage("")
      setIsAdding(false)
    } catch (error) {
      // Error handling is now done at the page level
      throw error
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
              {isLoading ? (
                <div className="text-sm text-muted-foreground">Loading...</div>
              ) : (
                <div className="space-y-2">
                  <RadioGroup
                    value={currentLanguage}
                    onValueChange={onLanguageChange}
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
                      disabled={!isAuthenticated}
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
