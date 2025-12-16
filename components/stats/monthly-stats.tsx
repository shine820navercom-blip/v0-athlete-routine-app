"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"

export function MonthlyStats() {
  const [monthData, setMonthData] = useState<any[]>([])
  const [monthlyAvg, setMonthlyAvg] = useState(0)
  const [totalCompleted, setTotalCompleted] = useState(0)

  useEffect(() => {
    loadMonthData()

    const handleUpdate = () => {
      loadMonthData()
    }

    window.addEventListener("routineUpdated", handleUpdate)
    return () => {
      window.removeEventListener("routineUpdated", handleUpdate)
    }
  }, [])

  const loadMonthData = () => {
    const history = JSON.parse(localStorage.getItem("routineCompletionHistory") || "{}")
    const routines = JSON.parse(localStorage.getItem("athleteRoutines") || "[]")
    const dailySchedule = JSON.parse(localStorage.getItem("dailySchedule") || "{}")

    const dayMap: Record<number, string> = { 0: "sun", 1: "mon", 2: "tue", 3: "wed", 4: "thu", 5: "fri", 6: "sat" }
    const data = []

    let totalRate = 0
    let weeksCount = 0
    let allCompleted = 0

    for (let weekIndex = 3; weekIndex >= 0; weekIndex--) {
      const weekStart = new Date()
      weekStart.setDate(weekStart.getDate() - (weekIndex + 1) * 7)
      const weekEnd = new Date()
      weekEnd.setDate(weekEnd.getDate() - weekIndex * 7 - 1)

      let weekCompleted = 0
      let weekTotal = 0

      for (let d = 0; d < 7; d++) {
        const currentDate = new Date(weekStart)
        currentDate.setDate(weekStart.getDate() + d)
        if (currentDate > new Date()) break

        const dateKey = currentDate.toISOString().split("T")[0]
        const dayKey = dayMap[currentDate.getDay()]

        const schedule = dailySchedule[dateKey] || { hasTraining: false, hasGame: false }

        const expectedRoutines = routines.filter((r: any) => {
          if (r.type === "일상") {
            return r.days && r.days[dayKey]
          } else if (r.type === "훈련") {
            return schedule.hasTraining
          } else if (r.type === "경기") {
            return schedule.hasGame
          }
          return false
        })

        const completedRoutines = history[dateKey] || []
        weekCompleted += completedRoutines.length
        weekTotal += expectedRoutines.length
      }

      const rate = weekTotal > 0 ? Math.round((weekCompleted / weekTotal) * 100) : 0

      data.push({
        week: `${4 - weekIndex}주차`,
        rate,
        completed: weekCompleted,
        total: weekTotal,
      })

      if (weekTotal > 0) {
        totalRate += rate
        weeksCount++
      }
      allCompleted += weekCompleted
    }

    setMonthData(data)
    setMonthlyAvg(weeksCount > 0 ? Math.round(totalRate / weeksCount) : 0)
    setTotalCompleted(allCompleted)
  }

  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-6">월간 성과</h3>
      <div className="space-y-4">
        {monthData.map((week) => (
          <div key={week.week}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">{week.week}</span>
              <div className="text-right">
                <span className="text-sm text-muted-foreground">
                  {week.completed} / {week.total}
                </span>
                <span className="ml-3 font-semibold">{week.rate}%</span>
              </div>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary transition-all" style={{ width: `${week.rate}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">월간 평균</p>
            <p className="text-2xl font-bold">{monthlyAvg}%</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">총 완료</p>
            <p className="text-2xl font-bold">{totalCompleted}개</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
