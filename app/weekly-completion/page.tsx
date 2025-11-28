"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, TrendingUp } from 'lucide-react'
import Link from "next/link"
import { useEffect, useState } from "react"

export default function WeeklyCompletionPage() {
  const [weeklyData, setWeeklyData] = useState([
    { day: "월", completion: 0, total: 0 },
    { day: "화", completion: 0, total: 0 },
    { day: "수", completion: 0, total: 0 },
    { day: "목", completion: 0, total: 0 },
    { day: "금", completion: 0, total: 0 },
    { day: "토", completion: 0, total: 0 },
    { day: "일", completion: 0, total: 0 },
  ])

  const [weeklyAverage, setWeeklyAverage] = useState(0)

  useEffect(() => {
    // Calculate weekly stats from localStorage
    const stats = JSON.parse(localStorage.getItem("athleteStats") || '{}')
    setWeeklyAverage(stats.weeklyCompletion || 0)
    
    // You can expand this to track daily completion rates
    // For now, we'll show example data
    setWeeklyData([
      { day: "월", completion: 8, total: 10 },
      { day: "화", completion: 9, total: 10 },
      { day: "수", completion: 7, total: 10 },
      { day: "목", completion: 10, total: 10 },
      { day: "금", completion: 8, total: 10 },
      { day: "토", completion: 6, total: 8 },
      { day: "일", completion: 5, total: 8 },
    ])
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto p-4 md:p-6">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            대시보드로 돌아가기
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">이번 주 완료율</h1>
          <p className="text-muted-foreground">이번 주 루틴 완료 현황을 확인하세요</p>
        </div>

        <Card className="p-8 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">평균 완료율</p>
              <p className="text-4xl font-bold">{weeklyAverage}%</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {weeklyAverage >= 80
              ? "훌륭합니다! 이번 주도 꾸준히 루틴을 실천하고 있습니다."
              : weeklyAverage >= 60
                ? "잘하고 있습니다! 조금만 더 힘내세요."
                : "루틴 실천을 늘려보세요. 작은 변화가 큰 차이를 만듭니다."}
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-6">요일별 완료율 추이</h2>
          <div className="space-y-4">
            {weeklyData.map((day) => {
              const percentage = day.total > 0 ? Math.round((day.completion / day.total) * 100) : 0
              return (
                <div key={day.day}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{day.day}요일</span>
                    <span className="text-sm text-muted-foreground">
                      {day.completion}/{day.total} 완료 ({percentage}%)
                    </span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        percentage >= 80
                          ? "bg-green-500"
                          : percentage >= 60
                            ? "bg-blue-500"
                            : percentage >= 40
                              ? "bg-yellow-500"
                              : "bg-red-500"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        <Card className="p-6 mt-6">
          <h3 className="font-semibold mb-4">주간 인사이트</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5" />
              <p>
                <strong>최고의 날:</strong> 목요일 (100% 완료)
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-1.5" />
              <p>
                <strong>개선 필요:</strong> 주말 완료율이 낮습니다. 주말 루틴을 조정해보세요.
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5" />
              <p>
                <strong>추천:</strong> 평일 페이스를 주말에도 유지해보세요.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
