"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LogIn } from "lucide-react"

export function NavHeader() {
  const { user } = useAuth()

  if (user) {
    return null
  }

  return (
    <div className="absolute top-4 right-4 sm:top-6 sm:right-6 lg:top-8 lg:right-8">
      <Link href="/auth">
        <Button variant="outline" size="sm" className="gap-2">
          <LogIn className="h-4 w-4" />
          <span>Sign In</span>
        </Button>
      </Link>
    </div>
  )
}
