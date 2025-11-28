"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, Eye } from "lucide-react"
import Image from "next/image"

interface AthleteCardProps {
  athlete: {
    id: string
    name: string
    sport: string
    position: string
    achievements: string[]
    image: string
    routines: any[]
  }
  onViewRoutines: () => void
}

export function AthleteCard({ athlete, onViewRoutines }: AthleteCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all group">
      <div className="relative h-64 bg-muted">
        <Image
          src={athlete.image || "/placeholder.svg"}
          alt={athlete.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-white mb-1">{athlete.name}</h3>
          <p className="text-sm text-white/80">{athlete.position}</p>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold">주요 성과</span>
          </div>
          <ul className="space-y-1">
            {athlete.achievements.slice(0, 2).map((achievement, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start">
                <span className="mr-2">•</span>
                <span>{achievement}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <span>{athlete.routines.length}개 루틴</span>
        </div>

        <Button onClick={onViewRoutines} className="w-full">
          <Eye className="w-4 h-4 mr-2" />
          루틴 보기
        </Button>
      </div>
    </Card>
  )
}
