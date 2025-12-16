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

  const calculateWeeklyCompletion = () => {
    const history = localStorage.getItem("routineCompletionHistory")
    const routines = localStorage.getItem("athleteRoutines")

    if (!history || !routines) return 0

    const completionHistory = JSON.parse(history)
    const allRoutines = JSON.parse(routines)

    // Get this week's dates
    const today = new Date()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay()) // Sunday
    startOfWeek.setHours(0, 0, 0, 0)

    let totalExpected = 0
    let totalCompleted = 0

    // Calculate for each day of the week
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startOfWeek)
      currentDate.setDate(startOfWeek.getDate() + i)

      if (currentDate > today) continue // Don't count future days

      const dateKey = currentDate.toISOString().split("T")[0]
      const dayOfWeek = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][currentDate.getDay()]

      // Count expected routines for this day
      const expectedRoutines = allRoutines.filter((routine: any) => {
        if (routine.type === "일상") {
          return routine.days && routine.days[dayOfWeek]
        }
        return false // Training and game routines are counted separately
      })

      totalExpected += expectedRoutines.length

      // Count completed routines for this day
      if (completionHistory[dateKey]) {
        totalCompleted += completionHistory[dateKey].length
      }
    }

    if (totalExpected === 0) return 0
    return Math.round((totalCompleted / totalExpected) * 100)
  }

  const calculateStreak = () => {
    const history = localStorage.getItem("routineCompletionHistory")
    const routines = localStorage.getItem("athleteRoutines")

    if (!history || !routines) return 0

    const completionHistory = JSON.parse(history)
    const allRoutines = JSON.parse(routines)

    // Get daily routines count per day
    const getDailyRoutinesCount = (date: Date) => {
      const dayOfWeek = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][date.getDay()]
      return allRoutines.filter((routine: any) => {
        if (routine.type === "일상" || routine.type === "daily") {
          return routine.days && routine.days[dayOfWeek]
        }
        return false
      }).length
    }

    // Check if all daily routines were completed on a given date
    const isDateFullyCompleted = (dateKey: string, date: Date) => {
      const expectedCount = getDailyRoutinesCount(date)
      if (expectedCount === 0) return false

      const completedRoutines = completionHistory[dateKey] || []
      const dailyRoutineIds = allRoutines
        .filter((routine: any) => {
          const dayOfWeek = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][date.getDay()]
          if (routine.type === "일상" || routine.type === "daily") {
            return routine.days && routine.days[dayOfWeek]
          }
          return false
        })
        .map((r: any) => r.id)

      const completedDailyRoutines = completedRoutines.filter((id: string) => dailyRoutineIds.includes(id))

      return completedDailyRoutines.length === expectedCount
    }

    let streak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Check backwards from today
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(today.getDate() - i)
      const dateKey = checkDate.toISOString().split("T")[0]

      if (isDateFullyCompleted(dateKey, checkDate)) {
        streak++
      } else {
        // Only break if it's not today (allow starting fresh today)
        if (i > 0) break
      }
    }

    return streak
  }

  const calculateMonthlyGameStats = () => {
    const gameResults = localStorage.getItem("gameResults")
    if (!gameResults) return { wins: 0, losses: 0, draws: 0 }

    const games = JSON.parse(gameResults)
    const today = new Date()
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()

    let wins = 0
    let losses = 0
    let draws = 0

    games.forEach((game: any) => {
      const gameDate = new Date(game.date)
      if (gameDate.getMonth() === currentMonth && gameDate.getFullYear() === currentYear) {
        if (game.type === "match") {
          // For match type games
          if (game.result === "승") wins++
          else if (game.result === "패") losses++
          else if (game.result === "무") draws++
        }
        // For competition type, we don't count win/loss/draw
      }
    })

    return { wins, losses, draws }
  }

  const loadStats = () => {
    const savedStats = localStorage.getItem("athleteStats")
    const routines = localStorage.getItem("athleteRoutines")

    let totalRoutines = 0
    if (routines) {
      const parsedRoutines = JSON.parse(routines)
      totalRoutines = parsedRoutines.length
    }

    const weeklyCompletion = calculateWeeklyCompletion()
    const currentStreak = calculateStreak()
    const gameStats = calculateMonthlyGameStats()

    setStats({
      weeklyCompletion,
      streak: currentStreak,
      wins: gameStats.wins,
      losses: gameStats.losses,
      draws: gameStats.draws,
      totalRoutines,
    })
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
      href: "/routines",
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
