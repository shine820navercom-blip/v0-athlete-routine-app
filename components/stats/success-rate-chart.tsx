"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

interface SuccessRateChartProps {
  period: "daily" | "weekly" | "monthly"
}

export function SuccessRateChart({ period }: SuccessRateChartProps) {
  const [data, setData] = useState<{ name: string; rate: number }[]>([])

  useEffect(() => {
    loadChartData()

    const handleUpdate = () => {
      loadChartData()
    }

    window.addEventListener("routineUpdated", handleUpdate)
    return () => {
      window.removeEventListener("routineUpdated", handleUpdate)
    }
  }, [period])

  const loadChartData = () => {
    const history = JSON.parse(localStorage.getItem("routineCompletionHistory") || "{}")
    const routines = JSON.parse(localStorage.getItem("athleteRoutines") || "[]")
    const dailySchedule = JSON.parse(localStorage.getItem("dailySchedule") || "{}")

    if (period === "daily") {
      // Last 7 days
      const days = ["일", "월", "화", "수", "목", "금", "토"]
      const dailyData = []

      for (let i = 6; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dateKey = date.toISOString().split("T")[0]
        const dayName = days[date.getDay()]

        const { completed, total } = calculateDayCompletion(dateKey, routines, history, dailySchedule)
        const rate = total > 0 ? Math.round((completed / total) * 100) : 0

        dailyData.push({ name: dayName, rate })
      }

      setData(dailyData)
    } else if (period === "weekly") {
      // Last 4 weeks
      const weeklyData = []

      for (let i = 3; i >= 0; i--) {
        const weekStart = new Date()
        weekStart.setDate(weekStart.getDate() - (i + 1) * 7)
        const weekEnd = new Date()
        weekEnd.setDate(weekEnd.getDate() - i * 7 - 1)

        let totalCompleted = 0
        let totalExpected = 0

        for (let d = 0; d < 7; d++) {
          const currentDate = new Date(weekStart)
          currentDate.setDate(weekStart.getDate() + d)
          const dateKey = currentDate.toISOString().split("T")[0]

          const { completed, total } = calculateDayCompletion(dateKey, routines, history, dailySchedule)
          totalCompleted += completed
          totalExpected += total
        }

        const rate = totalExpected > 0 ? Math.round((totalCompleted / totalExpected) * 100) : 0
        weeklyData.push({ name: `${4 - i}주`, rate })
      }

      setData(weeklyData)
    } else if (period === "monthly") {
      // Last 4 months
      const monthlyData = []
      const monthNames = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]

      for (let i = 3; i >= 0; i--) {
        const monthDate = new Date()
        monthDate.setMonth(monthDate.getMonth() - i)
        const monthName = monthNames[monthDate.getMonth()]

        let totalCompleted = 0
        let totalExpected = 0

        const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate()

        for (let day = 1; day <= daysInMonth; day++) {
          const currentDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), day)
          if (currentDate > new Date()) break

          const dateKey = currentDate.toISOString().split("T")[0]
          const { completed, total } = calculateDayCompletion(dateKey, routines, history, dailySchedule)
          totalCompleted += completed
          totalExpected += total
        }

        const rate = totalExpected > 0 ? Math.round((totalCompleted / totalExpected) * 100) : 0
        monthlyData.push({ name: monthName, rate })
      }

      setData(monthlyData)
    }
  }

  const calculateDayCompletion = (
    dateKey: string,
    routines: any[],
    history: Record<string, string[]>,
    dailySchedule: Record<string, any>,
  ) => {
    const date = new Date(dateKey)
    const dayMap: Record<number, string> = { 0: "sun", 1: "mon", 2: "tue", 3: "wed", 4: "thu", 5: "fri", 6: "sat" }
    const dayKey = dayMap[date.getDay()]

    const schedule = dailySchedule[dateKey] || { hasTraining: false, hasGame: false }

    const expectedRoutines = routines.filter((r) => {
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

    return {
      completed: completedRoutines.length,
      total: expectedRoutines.length,
    }
  }

  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-6">루틴 성공률 추이</h3>
      {data.every((d) => d.rate === 0) ? (
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          루틴을 완료하면 통계가 표시됩니다
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="name" className="text-xs" stroke="hsl(var(--muted-foreground))" />
            <YAxis className="text-xs" stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
            />
            <Line
              type="monotone"
              dataKey="rate"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={{ fill: "hsl(var(--primary))", r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Card>
  )
}
