"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronLeft, ChevronRight, Calendar, Dumbbell, Trophy } from "lucide-react"
import { format, addDays, subDays, startOfWeek } from "date-fns"
import { ko } from "date-fns/locale"

interface DailyCalendarProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
  hasTraining: boolean
  hasGame: boolean
  onTrainingChange: (hasTraining: boolean) => void
  onGameChange: (hasGame: boolean) => void
}

export function DailyCalendar({
  selectedDate,
  onDateChange,
  hasTraining,
  hasGame,
  onTrainingChange,
  onGameChange,
}: DailyCalendarProps) {
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 })
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  return (
    <Card className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">{format(selectedDate, "yyyy년 M월 d일", { locale: ko })}</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => onDateChange(subDays(selectedDate, 1))}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => onDateChange(new Date())}>
              <Calendar className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => onDateChange(addDays(selectedDate, 1))}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => {
            const isSelected = format(day, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
            const isToday = format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")

            return (
              <button
                key={day.toString()}
                onClick={() => onDateChange(day)}
                className={`p-3 rounded-lg text-center transition-all ${
                  isSelected
                    ? "bg-primary text-primary-foreground font-semibold"
                    : isToday
                      ? "bg-accent"
                      : "hover:bg-muted"
                }`}
              >
                <div className="text-xs mb-1">{format(day, "EEE", { locale: ko })}</div>
                <div className="text-lg">{format(day, "d")}</div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold mb-3 block">오늘의 일정</label>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors">
              <Checkbox
                id="hasTraining"
                checked={hasTraining}
                onCheckedChange={(checked) => onTrainingChange(checked as boolean)}
              />
              <label htmlFor="hasTraining" className="flex items-center gap-2 cursor-pointer flex-1">
                <Dumbbell className="w-4 h-4" />
                <span className="font-medium">훈련 있음</span>
              </label>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors">
              <Checkbox
                id="hasGame"
                checked={hasGame}
                onCheckedChange={(checked) => onGameChange(checked as boolean)}
              />
              <label htmlFor="hasGame" className="flex items-center gap-2 cursor-pointer flex-1">
                <Trophy className="w-4 h-4" />
                <span className="font-medium">경기 있음</span>
              </label>
            </div>
          </div>
        </div>

        {(hasTraining || hasGame) && (
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              {hasTraining && hasGame && "일상 루틴에 훈련 루틴과 경기 루틴이 추가됩니다"}
              {hasTraining && !hasGame && "일상 루틴에 훈련 루틴이 추가됩니다"}
              {!hasTraining && hasGame && "일상 루틴에 경기 루틴이 추가됩니다"}
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}
