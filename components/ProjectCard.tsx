"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GitHubRepo } from "@/types/github"
import { Star } from "lucide-react"

export function ProjectCard({ project }: { project: GitHubRepo }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">{project.name}</CardTitle>
          <div className="flex items-center">
            <Star className="w-4 h-4 mr-1 fill-yellow-500 border-yellow-500" />
            <span className="text-muted-foreground">
              {project.stargazers_count.toLocaleString()}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{project.description}</p>
        {project.language && (
          <div className="text-sm text-muted-foreground">
            {project.language}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
