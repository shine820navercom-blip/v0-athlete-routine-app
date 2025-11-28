"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Plus, Clock, MoreVertical } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { RoutineTimerModal } from "@/components/timer/routine-timer-modal"

interface Routine {
  id: string
  name: string
  time: string
  duration?: number
  completed: boolean
  type: "daily" | "training" | "game"
}

export default function TodayRoutinesPage() {
  const [routines, setRoutines] = useState<Routine[]>([])
  const [hasTraining, setHasTraining] = useState(false)
  const [hasGame, setHasGame] = useState(false)
  const [timerModalOpen, setTimerModalOpen] = useState(false)
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null)

  useEffect(() => {
    const savedRoutines = localStorage.getItem("athleteRoutines")
    const todaySchedule = localStorage.getItem("todaySchedule")

    if (savedRoutines) {
      setRoutines(JSON.parse(savedRoutines))
    }

    if (todaySchedule) {
      const schedule = JSON.parse(todaySchedule)
      setHasTraining(schedule.hasTraining || false)
      setHasGame(schedule.hasGame || false)
    }
  }, [])

  const toggleRoutine = (id: string) => {
    const routine = routines.find((r) => r.id === id)
    if (routine && !routine.completed && routine.duration) {
      setSelectedRoutine(routine)
      setTimerModalOpen(true)
    } else {
      const updated = routines.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r))
      setRoutines(updated)
      localStorage.setItem("athleteRoutines", JSON.stringify(updated))
    }
  }

  const handleTimerComplete = () => {
    if (selectedRoutine) {
      const updated = routines.map((r) => (r.id === selectedRoutine.id ? { ...r, completed: true } : r))
      setRoutines(updated)
      localStorage.setItem("athleteRoutines", JSON.stringify(updated))
      setSelectedRoutine(null)
    }
  }

  const dailyRoutines = routines.filter((r) => r.type === "daily")
  const trainingRoutines = routines.filter((r) => r.type === "training")
  const gameRoutines = routines.filter((r) => r.type === "game")

  const calculateCompletion = (routineList: Routine[]) => {
    if (routineList.length === 0) return 0
    return Math.round((routineList.filter((r) => r.completed).length / routineList.length) * 100)
  }

  const RoutineSection = ({ title, routines, type }: { title: string; routines: Routine[]; type: string }) => (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{routines.length}개 루틴</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">{calculateCompletion(routines)}%</p>
          <p className="text-xs text-muted-foreground">완료율</p>
        </div>
      </div>

      <div className="space-y-3">
        {routines.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="mb-3">등록된 {title} 루틴이 없습니다</p>
            <Link href="/routines/new">
              <Button size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                루틴 추가하기
              </Button>
            </Link>
          </div>
        ) : (
          routines.map((routine) => (
            <div
              key={routine.id}
              className={`p-4 rounded-lg border transition-all ${
                routine.completed ? "bg-muted border-muted" : "bg-card hover:bg-accent"
              }`}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={routine.completed}
                  onCheckedChange={() => toggleRoutine(routine.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <h4 className={`font-semibold mb-1 ${routine.completed ? "line-through text-muted-foreground" : ""}`}>
                    {routine.name}
                  </h4>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {routine.time}
                    </span>
                    {routine.duration && <span>{routine.duration}분</span>}
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 pt-4 border-t">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${calculateCompletion(routines)}%` }}
          />
        </div>
      </div>
    </Card>
  )

  return (
    <>
      {selectedRoutine && (
        <RoutineTimerModal
          open={timerModalOpen}
          onOpenChange={setTimerModalOpen}
          routineName={selectedRoutine.name}
          duration={selectedRoutine.duration || 0}
          onComplete={handleTimerComplete}
        />
      )}

      <div className="min-h-screen bg-background">
        <div className="max-w-5xl mx-auto p-4 md:p-6">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              대시보드로 돌아가기
            </Button>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">오늘의 루틴</h1>
            <p className="text-muted-foreground">
              {new Date().toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                weekday: "long",
              })}
            </p>
          </div>

          <div className="grid gap-6">
            <RoutineSection title="일상 루틴" routines={dailyRoutines} type="daily" />

            {hasTraining && <RoutineSection title="훈련 루틴" routines={trainingRoutines} type="training" />}

            {hasGame && <RoutineSection title="경기 루틴" routines={gameRoutines} type="game" />}

            {!hasTraining && !hasGame && (
              <Card className="p-6 bg-muted/50">
                <p className="text-center text-muted-foreground">
                  오늘은 훈련과 경기가 없는 날입니다. 캘린더에서 일정을 추가하세요.
                </p>
              </Card>
            )}
          </div>

          <Card className="p-6 mt-6">
            <h3 className="font-semibold mb-4">전체 완료율</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">오늘의 전체 루틴</span>
              <span className="text-2xl font-bold">{calculateCompletion(routines)}%</span>
            </div>
            <div className="h-4 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-green-500 transition-all duration-500"
                style={{ width: `${calculateCompletion(routines)}%` }}
              />
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}
