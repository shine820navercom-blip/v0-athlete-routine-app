"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Clock } from "lucide-react"
import Link from "next/link"

export default function NewRoutinePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    type: "daily" as "daily" | "training" | "game",
    enableTime: false,
    time: "07:00",
    enableTimer: false,
    duration: 15,
    days: {
      mon: true,
      tue: true,
      wed: true,
      thu: true,
      fri: true,
      sat: true,
      sun: true,
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const existingRoutines = JSON.parse(localStorage.getItem("athleteRoutines") || "[]")
    const newRoutine = {
      id: Date.now().toString(),
      name: formData.name,
      type: formData.type,
      enableTime: formData.enableTime,
      ...(formData.enableTime && { time: formData.time }),
      enableTimer: formData.enableTimer,
      ...(formData.enableTimer && { duration: formData.duration }),
      days: formData.days,
      completed: false,
      createdAt: new Date().toISOString(),
    }
    localStorage.setItem("athleteRoutines", JSON.stringify([...existingRoutines, newRoutine]))

    // Update total routines count in stats
    const stats = JSON.parse(
      localStorage.getItem("athleteStats") ||
        '{"weeklyCompletion":0,"streak":0,"wins":0,"losses":0,"draws":0,"totalRoutines":0}',
    )
    stats.totalRoutines = existingRoutines.length + 1
    localStorage.setItem("athleteStats", JSON.stringify(stats))

    window.dispatchEvent(new Event("routinesUpdated"))

    router.push("/dashboard")
  }

  const weekDays = [
    { key: "mon", label: "월" },
    { key: "tue", label: "화" },
    { key: "wed", label: "수" },
    { key: "thu", label: "목" },
    { key: "fri", label: "금" },
    { key: "sat", label: "토" },
    { key: "sun", label: "일" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-4 md:p-6">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            대시보드로 돌아가기
          </Button>
        </Link>

        <Card className="p-6 md:p-8">
          <h1 className="text-3xl font-bold mb-6">새 루틴 만들기</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">루틴 이름</Label>
              <Input
                id="name"
                placeholder="예: 아침 스트레칭"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">루틴 유형</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "daily" | "training" | "game") => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">일상 루틴</SelectItem>
                  <SelectItem value="training">훈련 루틴</SelectItem>
                  <SelectItem value="game">경기 루틴</SelectItem>
                </SelectContent>
              </Select>
              {formData.type !== "daily" && (
                <p className="text-sm text-muted-foreground">
                  {formData.type === "training" && "훈련 루틴은 훈련이 있는 날에만 표시됩니다"}
                  {formData.type === "game" && "경기 루틴은 경기가 있는 날에만 표시됩니다"}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="enableTime"
                  checked={formData.enableTime}
                  onCheckedChange={(checked) => setFormData({ ...formData, enableTime: checked as boolean })}
                />
                <Label htmlFor="enableTime" className="cursor-pointer">
                  특정 시간에 실행
                </Label>
              </div>

              {formData.enableTime && (
                <div className="ml-6 space-y-2">
                  <Label htmlFor="time">시간</Label>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="enableTimer"
                  checked={formData.enableTimer}
                  onCheckedChange={(checked) => setFormData({ ...formData, enableTimer: checked as boolean })}
                />
                <Label htmlFor="enableTimer" className="cursor-pointer">
                  타이머 설정
                </Label>
              </div>

              {formData.enableTimer && (
                <div className="ml-6 space-y-2">
                  <Label htmlFor="duration">소요 시간 (분)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    max="240"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: Number.parseInt(e.target.value) })}
                  />
                </div>
              )}
            </div>

            {formData.type === "daily" && (
              <div className="space-y-3">
                <Label>반복 요일</Label>
                <div className="flex gap-2">
                  {weekDays.map((day) => (
                    <button
                      key={day.key}
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          days: {
                            ...formData.days,
                            [day.key]: !formData.days[day.key as keyof typeof formData.days],
                          },
                        })
                      }
                      className={`flex-1 h-12 rounded-lg border-2 font-semibold transition-all ${
                        formData.days[day.key as keyof typeof formData.days]
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border hover:bg-accent"
                      }`}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                루틴 생성하기
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push("/dashboard")}>
                취소
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
