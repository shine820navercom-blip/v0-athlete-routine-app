"use client"

import { Button } from "@/components/ui/button"
import { Menu, Sparkles, Trophy, BarChart3 } from "lucide-react"
import Link from "next/link"

interface DashboardHeaderProps {
  profile: {
    sport: string
    role?: string
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
  volleyball: "배구",
  badminton: "배드민턴",
  tabletennis: "탁구",
  golf: "골프",
  boxing: "복싱",
  taekwondo: "태권도",
  judo: "유도",
  skating: "스케이팅",
  rugby: "럭비",
  ballet: "발레",
  climbing: "클라이밍",
  gymnastics: "체조",
}

const roleNames: Record<string, string> = {
  athlete: "선수",
  coach: "코치",
  director: "감독",
}

export function DashboardHeader({ profile }: DashboardHeaderProps) {
  return (
    <header className="border-b bg-card">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard">
            <h1 className="text-2xl font-bold cursor-pointer">AthleteFlow</h1>
          </Link>
          <div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>종목:</span>
              <span className="font-semibold text-foreground">{sportNames[profile.sport] || profile.sport}</span>
            </div>
            {profile.role && (
              <>
                <span className="text-border">|</span>
                <div className="flex items-center gap-2">
                  <span>역할:</span>
                  <span className="font-semibold text-foreground">{roleNames[profile.role] || profile.role}</span>
                </div>
              </>
            )}
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
