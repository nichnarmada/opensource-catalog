"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { GitHubRepo } from "@/types/github"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

interface ProjectCardProps {
  project: GitHubRepo
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex-none">
        <div className="space-y-1">
          <a
            href={project.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block font-semibold hover:underline line-clamp-2"
          >
            {project.full_name}
          </a>
          <div className="flex items-center text-sm text-muted-foreground">
            <Star className="mr-1 h-4 w-4 fill-yellow-500 text-yellow-500" />
            {project.stargazers_count.toLocaleString()}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {project.language && (
            <Badge variant="secondary">{project.language}</Badge>
          )}
          {project.topics?.slice(0, 3).map((topic) => (
            <Badge key={topic} variant="outline">
              {topic}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
