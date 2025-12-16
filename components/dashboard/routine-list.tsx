"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Clock, MoreVertical } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { RoutineTimerModal } from "@/components/timer/routine-timer-modal"

interface RoutineListProps {
  date: Date
  hasTraining: boolean
  hasGame: boolean
}

interface Routine {
  id: string
  name: string
  time: string
  duration?: number
  type: "daily" | "training" | "game"
  enableTime?: boolean
  enableTimer?: boolean
  days?: {
    mon: boolean
    tue: boolean
    wed: boolean
    thu: boolean
    fri: boolean
    sat: boolean
    sun: boolean
  }
}

export function RoutineList({ date, hasTraining, hasGame }: RoutineListProps) {
  const [routines, setRoutines] = useState<Routine[]>([])
  const [completedRoutines, setCompletedRoutines] = useState<Set<string>>(new Set())
  const [refreshKey, setRefreshKey] = useState(0)
  const [timerModalOpen, setTimerModalOpen] = useState(false)
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null)

  const getDateKey = (date: Date) => {
    return date.toISOString().split("T")[0]
  }

  const getDayKey = (date: Date): keyof Routine["days"] => {
    const dayIndex = date.getDay()
    const dayKeys: (keyof Routine["days"])[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]
    return dayKeys[dayIndex]
  }

  useEffect(() => {
    const savedRoutines = localStorage.getItem("athleteRoutines")
    if (savedRoutines) {
      const parsed = JSON.parse(savedRoutines)
      setRoutines(parsed)
    }

    // Load completion status for the selected date
    const dateKey = getDateKey(date)
    const history = JSON.parse(localStorage.getItem("routineCompletionHistory") || "{}")
    const completedIds = history[dateKey] || []
    setCompletedRoutines(new Set(completedIds))
  }, [refreshKey, date])

  useEffect(() => {
    const handleRoutinesUpdate = () => {
      setRefreshKey((prev) => prev + 1)
    }

    window.addEventListener("routinesUpdated", handleRoutinesUpdate)
    return () => window.removeEventListener("routinesUpdated", handleRoutinesUpdate)
  }, [])

  const currentDayKey = getDayKey(date)
  const filteredRoutines = routines.filter((routine) => {
    if (routine.type === "daily") {
      if (routine.days) {
        return routine.days[currentDayKey] === true
      }
      return true
    }

    if (routine.type === "training") return hasTraining
    if (routine.type === "game") return hasGame

    return false
  })

  const toggleRoutine = (id: string) => {
    const routine = routines.find((r) => r.id === id)
    const isCompleted = completedRoutines.has(id)

    if (routine && !isCompleted && routine.enableTimer && routine.duration) {
      setSelectedRoutine(routine)
      setTimerModalOpen(true)
    } else {
      const dateKey = getDateKey(date)
      const history = JSON.parse(localStorage.getItem("routineCompletionHistory") || "{}")

      if (!history[dateKey]) {
        history[dateKey] = []
      }

      if (!isCompleted) {
        history[dateKey].push(id)
        setCompletedRoutines(new Set([...completedRoutines, id]))
      } else {
        history[dateKey] = history[dateKey].filter((rid: string) => rid !== id)
        const newCompleted = new Set(completedRoutines)
        newCompleted.delete(id)
        setCompletedRoutines(newCompleted)
      }

      localStorage.setItem("routineCompletionHistory", JSON.stringify(history))

      // Trigger stats update
      window.dispatchEvent(new Event("routinesUpdated"))
    }
  }

  const handleTimerComplete = () => {
    if (selectedRoutine) {
      const dateKey = getDateKey(date)
      const history = JSON.parse(localStorage.getItem("routineCompletionHistory") || "{}")

      if (!history[dateKey]) {
        history[dateKey] = []
      }

      if (!history[dateKey].includes(selectedRoutine.id)) {
        history[dateKey].push(selectedRoutine.id)
      }

      localStorage.setItem("routineCompletionHistory", JSON.stringify(history))

      setCompletedRoutines(new Set([...completedRoutines, selectedRoutine.id]))
      setSelectedRoutine(null)

      // Trigger stats update
      window.dispatchEvent(new Event("routinesUpdated"))
    }
  }

  const dailyRoutines = filteredRoutines.filter((r) => r.type === "daily")
  const trainingRoutines = filteredRoutines.filter((r) => r.type === "training")
  const gameRoutines = filteredRoutines.filter((r) => r.type === "game")

  const RoutineCard = ({ routine }: { routine: Routine }) => {
    const isCompleted = completedRoutines.has(routine.id)

    return (
      <div
        className={`p-4 rounded-lg border transition-all ${
          isCompleted ? "bg-muted border-muted" : "bg-card hover:bg-accent"
        }`}
      >
        <div className="flex items-start gap-3">
          <Checkbox checked={isCompleted} onCheckedChange={() => toggleRoutine(routine.id)} className="mt-1" />
          <div className="flex-1 min-w-0">
            <h4 className={`font-semibold mb-1 ${isCompleted ? "line-through text-muted-foreground" : ""}`}>
              {routine.name}
            </h4>
            <div className="flex flex-col gap-1 text-sm text-muted-foreground">
              {routine.enableTime !== false && routine.time && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {routine.time}
                </span>
              )}
              {routine.enableTimer && routine.duration && <span>{routine.duration}분</span>}
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>
    )
  }

  const completionRate =
    filteredRoutines.length > 0
      ? Math.round((filteredRoutines.filter((r) => completedRoutines.has(r.id)).length / filteredRoutines.length) * 100)
      : 0

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

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold">오늘의 루틴</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {date.toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "long" })}
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/ai-coach">
              <Button variant="outline" size="sm">
                AI 추천
              </Button>
            </Link>
            <Link href="/routines/new">
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                추가
              </Button>
            </Link>
          </div>
        </div>

        {filteredRoutines.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg mb-2">등록된 루틴이 없습니다</p>
            <p className="text-sm mb-4">첫 번째 루틴을 추가하여 시작해보세요</p>
            <div className="flex gap-2 justify-center">
              <Link href="/ai-coach">
                <Button variant="outline">AI 추천 받기</Button>
              </Link>
              <Link href="/routines/new">
                <Button>직접 추가하기</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {dailyRoutines.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  일상 루틴
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dailyRoutines.map((routine) => (
                    <RoutineCard key={routine.id} routine={routine} />
                  ))}
                </div>
              </div>
            )}

            {trainingRoutines.length > 0 && hasTraining && (
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  훈련 루틴
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {trainingRoutines.map((routine) => (
                    <RoutineCard key={routine.id} routine={routine} />
                  ))}
                </div>
              </div>
            )}

            {gameRoutines.length > 0 && hasGame && (
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  경기 루틴
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {gameRoutines.map((routine) => (
                    <RoutineCard key={routine.id} routine={routine} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 pt-6 border-t">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">오늘의 완료율</span>
            <span className="font-semibold text-lg">{completionRate}%</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-500" style={{ width: `${completionRate}%` }} />
          </div>
        </div>
      </Card>
    </>
  )
}
