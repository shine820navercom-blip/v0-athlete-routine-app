"use client"

import { Card } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

interface SuccessRateChartProps {
  period: "daily" | "weekly" | "monthly"
}

export function SuccessRateChart({ period }: SuccessRateChartProps) {
  const dailyData = [
    { name: "월", rate: 100 },
    { name: "화", rate: 87 },
    { name: "수", rate: 100 },
    { name: "목", rate: 75 },
    { name: "금", rate: 100 },
    { name: "토", rate: 90 },
    { name: "일", rate: 85 },
  ]

  const weeklyData = [
    { name: "1주", rate: 88 },
    { name: "2주", rate: 91 },
    { name: "3주", rate: 85 },
    { name: "4주", rate: 93 },
  ]

  const monthlyData = [
    { name: "9월", rate: 82 },
    { name: "10월", rate: 85 },
    { name: "11월", rate: 89 },
    { name: "12월", rate: 91 },
  ]

  const data = period === "daily" ? dailyData : period === "weekly" ? weeklyData : monthlyData

  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-6">루틴 성공률 추이</h3>
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
    </Card>
  )
}
