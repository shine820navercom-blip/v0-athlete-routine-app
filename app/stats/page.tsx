"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WeeklyStats } from "@/components/stats/weekly-stats"
import { MonthlyStats } from "@/components/stats/monthly-stats"
import { GameRecords } from "@/components/stats/game-records"
import { SuccessRateChart } from "@/components/stats/success-rate-chart"
import { ArrowLeft, TrendingUp, Calendar, Trophy } from "lucide-react"
import Link from "next/link"

export default function StatsPage() {
  const [stats, setStats] = useState({
    avgCompletion: 0,
    streak: 0,
    winRate: 0,
    wins: 0,
    losses: 0,
    draws: 0,
  })

  useEffect(() => {
    loadStats()

    const handleUpdate = () => {
      loadStats()
    }

    window.addEventListener("routineUpdated", handleUpdate)
    window.addEventListener("gameUpdated", handleUpdate)
    return () => {
      window.removeEventListener("routineUpdated", handleUpdate)
      window.removeEventListener("gameUpdated", handleUpdate)
    }
  }, [])

  const loadStats = () => {
    const athleteStats = JSON.parse(
      localStorage.getItem("athleteStats") ||
        '{"weeklyCompletion":0,"streak":0,"wins":0,"losses":0,"draws":0,"totalRoutines":0}',
    )

    const totalGames = athleteStats.wins + athleteStats.losses + athleteStats.draws
    const winRate = totalGames > 0 ? Math.round((athleteStats.wins / totalGames) * 100) : 0

    setStats({
      avgCompletion: athleteStats.weeklyCompletion || 0,
      streak: athleteStats.streak || 0,
      winRate,
      wins: athleteStats.wins || 0,
      losses: athleteStats.losses || 0,
      draws: athleteStats.draws || 0,
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            대시보드로 돌아가기
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">통계 및 성과</h1>
          <p className="text-muted-foreground">루틴 성공률과 경기 기록을 추적하세요</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">평균 성공률</span>
            </div>
            <p className="text-3xl font-bold">{stats.avgCompletion}%</p>
            <p className="text-sm text-muted-foreground mt-2">
              {stats.avgCompletion > 0 ? "이번 주" : "루틴 추가 필요"}
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">연속 달성</span>
            </div>
            <p className="text-3xl font-bold">{stats.streak}일</p>
            <p className="text-sm text-muted-foreground mt-2">현재 기록</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Trophy className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">경기 승률</span>
            </div>
            <p className="text-3xl font-bold">{stats.winRate}%</p>
            <p className="text-sm text-muted-foreground mt-2">
              {stats.wins + stats.losses + stats.draws > 0
                ? `${stats.wins}승 ${stats.draws}무 ${stats.losses}패`
                : "경기 기록 없음"}
            </p>
          </Card>
        </div>

        <Tabs defaultValue="daily" className="space-y-6">
          <TabsList>
            <TabsTrigger value="daily">일별</TabsTrigger>
            <TabsTrigger value="weekly">주별</TabsTrigger>
            <TabsTrigger value="monthly">월별</TabsTrigger>
            <TabsTrigger value="games">경기 기록</TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="space-y-6">
            <SuccessRateChart period="daily" />
          </TabsContent>

          <TabsContent value="weekly" className="space-y-6">
            <WeeklyStats />
            <SuccessRateChart period="weekly" />
          </TabsContent>

          <TabsContent value="monthly" className="space-y-6">
            <MonthlyStats />
            <SuccessRateChart period="monthly" />
          </TabsContent>

          <TabsContent value="games" className="space-y-6">
            <GameRecords />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
