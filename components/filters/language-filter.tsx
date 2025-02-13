"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter, useSearchParams } from "next/navigation"

const LANGUAGES = [
  "TypeScript",
  "JavaScript",
  "Python",
  "Java",
  "Go",
  "Rust",
  "C++",
  "Ruby",
] as const

export function LanguageFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentLanguage = searchParams.get("language") || "all"

  const handleLanguageChange = (language: string) => {
    const params = new URLSearchParams(searchParams)
    if (language && language !== "all") {
      params.set("language", language)
    } else {
      params.delete("language")
    }
    router.push(`/?${params.toString()}`)
  }

  return (
    <Select value={currentLanguage} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select Language" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Languages</SelectItem>
        {LANGUAGES.map((lang) => (
          <SelectItem key={lang} value={lang.toLowerCase()}>
            {lang}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
