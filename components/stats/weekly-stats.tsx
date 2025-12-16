"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { CheckCircle2, Circle } from "lucide-react"

export function WeeklyStats() {
  const [weekData, setWeekData] = useState<any[]>([])
  const [weeklyAvg, setWeeklyAvg] = useState(0)

  useEffect(() => {
    loadWeekData()

    const handleUpdate = () => {
      loadWeekData()
    }

    window.addEventListener("routineUpdated", handleUpdate)
    return () => {
      window.removeEventListener("routineUpdated", handleUpdate)
    }
  }, [])

  const loadWeekData = () => {
    const history = JSON.parse(localStorage.getItem("routineCompletionHistory") || "{}")
    const routines = JSON.parse(localStorage.getItem("athleteRoutines") || "[]")
    const dailySchedule = JSON.parse(localStorage.getItem("dailySchedule") || "{}")

    const days = ["일", "월", "화", "수", "목", "금", "토"]
    const dayMap: Record<number, string> = { 0: "sun", 1: "mon", 2: "tue", 3: "wed", 4: "thu", 5: "fri", 6: "sat" }
    const data = []

    let totalRate = 0
    let daysCount = 0

    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateKey = date.toISOString().split("T")[0]
      const dayName = days[date.getDay()]
      const dayKey = dayMap[date.getDay()]

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
      const total = expectedRoutines.length
      const completed = completedRoutines.length
      const rate = total > 0 ? Math.round((completed / total) * 100) : 0

      data.push({
        day: dayName,
        date: `${date.getMonth() + 1}/${date.getDate()}`,
        rate,
        completed,
        total,
      })

      if (total > 0) {
        totalRate += rate
        daysCount++
      }
    }

    setWeekData(data)
    setWeeklyAvg(daysCount > 0 ? Math.round(totalRate / daysCount) : 0)
  }

  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-6">주간 성과</h3>
      <div className="space-y-4">
        {weekData.map((day) => (
          <div key={day.date} className="flex items-center gap-4">
            <div className="w-16 text-center">
              <div className="text-sm font-semibold">{day.day}</div>
              <div className="text-xs text-muted-foreground">{day.date}</div>
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">
                  {day.completed} / {day.total} 완료
                </span>
                <span className="text-sm font-semibold">{day.rate}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${day.rate === 100 ? "bg-green-500" : "bg-primary"}`}
                  style={{ width: `${day.rate}%` }}
                />
              </div>
            </div>

            {day.rate === 100 && day.total > 0 ? (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            ) : (
              <Circle className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">주간 평균</span>
          <span className="text-2xl font-bold">{weeklyAvg}%</span>
        </div>
      </div>
    </Card>
  )
}
