"use client"

import { Card } from "@/components/ui/card"

export function MonthlyStats() {
  const monthData = [
    { week: "1주차", rate: 88, completed: 52, total: 59 },
    { week: "2주차", rate: 91, completed: 54, total: 59 },
    { week: "3주차", rate: 85, completed: 50, total: 59 },
    { week: "4주차", rate: 93, completed: 55, total: 59 },
  ]

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
            <p className="text-2xl font-bold">89%</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">총 완료</p>
            <p className="text-2xl font-bold">211개</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
