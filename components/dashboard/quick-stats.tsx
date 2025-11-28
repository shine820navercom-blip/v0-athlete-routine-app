"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, Target, Calendar, Trophy } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"

export function QuickStats() {
  const [stats, setStats] = useState({
    weeklyCompletion: 0,
    streak: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    totalRoutines: 0,
  })

  useEffect(() => {
    loadStats()

    const handleRoutineUpdate = () => {
      loadStats()
    }

    const handleGameUpdate = () => {
      loadStats()
    }

    window.addEventListener("routineUpdated", handleRoutineUpdate)
    window.addEventListener("gameUpdated", handleGameUpdate)
    return () => {
      window.removeEventListener("routineUpdated", handleRoutineUpdate)
      window.removeEventListener("gameUpdated", handleGameUpdate)
    }
  }, [])

  const loadStats = () => {
    const savedStats = localStorage.getItem("athleteStats")
    const routines = localStorage.getItem("athleteRoutines")

    let totalRoutines = 0
    if (routines) {
      const parsedRoutines = JSON.parse(routines)
      totalRoutines = parsedRoutines.length
    }

    if (savedStats) {
      setStats({
        ...JSON.parse(savedStats),
        totalRoutines,
      })
    } else {
      setStats({
        weeklyCompletion: 0,
        streak: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        totalRoutines,
      })
    }
  }

  const statsDisplay = [
    {
      label: "이번 주 완료율",
      value: `${stats.weeklyCompletion}%`,
      change: stats.weeklyCompletion > 0 ? `+${stats.weeklyCompletion}%` : "시작하기",
      icon: TrendingUp,
      positive: true,
      href: "/weekly-completion",
    },
    {
      label: "연속 달성",
      value: `${stats.streak}일`,
      change: stats.streak > 0 ? "달성 중" : "시작 전",
      icon: Target,
      positive: true,
      href: "/streak",
    },
    {
      label: "이번 달 경기",
      value:
        stats.wins + stats.losses + stats.draws > 0 ? `${stats.wins}승 ${stats.draws}무 ${stats.losses}패` : "0경기",
      change:
        stats.wins + stats.losses + stats.draws > 0
          ? `승률 ${Math.round((stats.wins / (stats.wins + stats.losses + stats.draws)) * 100)}%`
          : "기록 없음",
      icon: Trophy,
      positive: true,
      href: "/game-results",
    },
    {
      label: "총 루틴",
      value: `${stats.totalRoutines}개`,
      change: stats.totalRoutines > 0 ? "활성 루틴" : "루틴 추가",
      icon: Calendar,
      positive: true,
      href: "/routines", // Changed from /today-routines to /routines to show all routines
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsDisplay.map((stat) => {
        const Icon = stat.icon
        return (
          <Link key={stat.label} href={stat.href}>
            <Card className="p-6 hover:bg-accent transition-colors cursor-pointer h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <span className={`text-xs font-semibold ${stat.positive ? "text-green-600" : "text-red-600"}`}>
                  {stat.change}
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
