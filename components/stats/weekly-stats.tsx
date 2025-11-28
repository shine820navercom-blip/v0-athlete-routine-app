"use client"

import { Card } from "@/components/ui/card"
import { CheckCircle2, Circle } from "lucide-react"

export function WeeklyStats() {
  const weekData = [
    { day: "월", date: "12/9", rate: 100, completed: 8, total: 8 },
    { day: "화", date: "12/10", rate: 87, completed: 7, total: 8 },
    { day: "수", date: "12/11", rate: 100, completed: 8, total: 8 },
    { day: "목", date: "12/12", rate: 75, completed: 6, total: 8 },
    { day: "금", date: "12/13", rate: 100, completed: 8, total: 8 },
    { day: "토", date: "12/14", rate: 90, completed: 9, total: 10 },
    { day: "일", date: "12/15", rate: 85, completed: 6, total: 7 },
  ]

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

            {day.rate === 100 ? (
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
          <span className="text-2xl font-bold">91%</span>
        </div>
      </div>
    </Card>
  )
}
