"use client"

import { Button } from "@/components/ui/button"
import { Menu, Sparkles, Trophy, BarChart3 } from "lucide-react"
import Link from "next/link"

interface DashboardHeaderProps {
  profile: {
    sport: string
    situation: string
  }
}

const sportNames: Record<string, string> = {
  soccer: "축구",
  basketball: "농구",
  baseball: "야구",
  tennis: "테니스",
  swimming: "수영",
  cycling: "사이클",
  weightlifting: "역도",
  running: "육상",
}

export function DashboardHeader({ profile }: DashboardHeaderProps) {
  return (
    <header className="border-b bg-card">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard">
            <h1 className="text-2xl font-bold cursor-pointer">AthleteFlow</h1>
          </Link>
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
            <span>종목:</span>
            <span className="font-semibold text-foreground">{sportNames[profile.sport] || profile.sport}</span>
          </div>
        </div>

        <nav className="flex items-center gap-2">
          <Link href="/ai-coach">
            <Button variant="ghost" size="sm" className="gap-2">
              <Sparkles className="w-4 h-4" />
              <span className="hidden md:inline">AI 코치</span>
            </Button>
          </Link>
          <Link href="/explore">
            <Button variant="ghost" size="sm" className="gap-2">
              <Trophy className="w-4 h-4" />
              <span className="hidden md:inline">프로 루틴</span>
            </Button>
          </Link>
          <Link href="/stats">
            <Button variant="ghost" size="sm" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden md:inline">통계</span>
            </Button>
          </Link>
          <Link href="/routines">
            <Button variant="ghost" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}
