"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Project } from "@/types/project"
import Link from "next/link"
import { StarIcon } from "lucide-react"

interface ProjectCardProps {
  project: {
    id: number
    name: string
    description: string | null
    stargazers_count: number
    language: string | null
    html_url: string
  }
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-xl">{project.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{project.description}</p>
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <StarIcon className="w-4 h-4 mr-1" />
            {project.stargazers_count}
          </div>
          {project.language && (
            <div className="text-sm text-muted-foreground">
              {project.language}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
