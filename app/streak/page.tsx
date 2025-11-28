"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Flame, Trophy, TrendingUp, CalendarIcon } from 'lucide-react'
import Link from "next/link"

export default function StreakPage() {
  const [stats, setStats] = useState({
    currentStreak: 0,
    longestStreak: 0,
    totalDaysCompleted: 0,
    streakHistory: [] as { date: string; completed: boolean }[],
  })

  useEffect(() => {
    const savedStats = localStorage.getItem("athleteStats")
    const savedStreak = localStorage.getItem("streakData")
    
    if (savedStats) {
      const data = JSON.parse(savedStats)
      setStats({
        currentStreak: data.streak || 0,
        longestStreak: data.longestStreak || 0,
        totalDaysCompleted: data.totalDaysCompleted || 0,
        streakHistory: savedStreak ? JSON.parse(savedStreak) : [],
      })
    }
  }, [])

  const getStreakMessage = (streak: number) => {
    if (streak === 0) return "첫 루틴을 완료하고 연속 달성을 시작하세요!"
    if (streak < 7) return "좋은 시작입니다! 계속 이어가세요!"
    if (streak < 30) return "훌륭합니다! 습관이 자리잡고 있어요!"
    if (streak < 100) return "놀라워요! 당신은 진정한 챔피언입니다!"
    return "전설입니다! 끊임없는 노력이 빛을 발하고 있어요!"
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            대시보드로 돌아가기
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">연속 달성 기록</h1>
          <p className="text-muted-foreground">꾸준함이 만드는 위대한 성과</p>
        </div>

        <div className="space-y-6">
          {/* Current Streak Display */}
          <Card className="p-8 text-center bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Flame className="w-24 h-24 text-orange-500" />
                {stats.currentStreak > 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white drop-shadow-lg">{stats.currentStreak}</span>
                  </div>
                )}
              </div>
            </div>
            <h2 className="text-4xl font-bold mb-2">{stats.currentStreak}일 연속</h2>
            <p className="text-lg text-muted-foreground mb-4">{getStreakMessage(stats.currentStreak)}</p>
            {stats.currentStreak > 0 && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 rounded-full">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-semibold">Day Streak 진행 중!</span>
              </div>
            )}
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Trophy className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">최고 기록</span>
              </div>
              <p className="text-3xl font-bold">{stats.longestStreak}일</p>
              <p className="text-sm text-muted-foreground mt-2">개인 최고 기록</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <CalendarIcon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">총 완료일</span>
              </div>
              <p className="text-3xl font-bold">{stats.totalDaysCompleted}일</p>
              <p className="text-sm text-muted-foreground mt-2">지금까지 달성</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">달성률</span>
              </div>
              <p className="text-3xl font-bold">
                {stats.totalDaysCompleted > 0 ? Math.round((stats.currentStreak / stats.totalDaysCompleted) * 100) : 0}%
              </p>
              <p className="text-sm text-muted-foreground mt-2">연속 달성 비율</p>
            </Card>
          </div>

          {/* Motivation Card */}
          <Card className="p-6 bg-gradient-to-r from-primary/10 to-primary/5">
            <h3 className="font-bold text-lg mb-3">💪 연속 달성의 힘</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• 7일 연속: 습관 형성 초기 단계 돌파</p>
              <p>• 30일 연속: 새로운 습관이 자리잡는 시기</p>
              <p>• 100일 연속: 평생 습관으로 자리잡음</p>
              <p>• 365일 연속: 진정한 마스터 레벨 달성</p>
            </div>
          </Card>

          {/* Tips */}
          <Card className="p-6">
            <h3 className="font-bold text-lg mb-3">연속 달성 유지 팁</h3>
            <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
              <li>매일 같은 시간에 루틴을 실행하세요</li>
              <li>작은 목표부터 시작하여 점차 늘려가세요</li>
              <li>하루를 놓쳤다고 포기하지 마세요. 다시 시작하면 됩니다</li>
              <li>친구나 팀원과 함께 도전하면 더 쉽게 유지할 수 있습니다</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}
