"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Calendar, Edit, Trash2 } from "lucide-react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface RoutineCardProps {
  routine: {
    id: string
    name: string
    time: string
    duration?: number
    enableTimer?: boolean
    days?: { [key: string]: boolean } | string[]
    type: string
    enableTime?: boolean
  }
  type: "daily" | "training" | "game"
  onDelete: (id: string) => void
}

export function RoutineCard({ routine, type, onDelete }: RoutineCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const getInitialDays = () => {
    if (!routine.days) return { mon: false, tue: false, wed: false, thu: false, fri: false, sat: false, sun: false }
    if (Array.isArray(routine.days)) {
      const dayMap: { [key: string]: boolean } = {
        mon: false,
        tue: false,
        wed: false,
        thu: false,
        fri: false,
        sat: false,
        sun: false,
      }
      const koreanToEng: { [key: string]: string } = {
        월: "mon",
        화: "tue",
        수: "wed",
        목: "thu",
        금: "fri",
        토: "sat",
        일: "sun",
      }
      routine.days.forEach((day) => {
        const engDay = koreanToEng[day]
        if (engDay) dayMap[engDay] = true
      })
      return dayMap
    }
    return routine.days as { [key: string]: boolean }
  }

  const [editForm, setEditForm] = useState({
    name: routine.name,
    time: routine.time,
    duration: routine.duration || 0,
    enableTimer: routine.enableTimer || false,
    enableTime: routine.hasOwnProperty("enableTime") ? (routine as any).enableTime : true,
    days: getInitialDays(),
  })

  const typeLabels = {
    daily: "일상",
    training: "훈련",
    game: "경기",
  }

  const dayMapping = {
    mon: "월",
    tue: "화",
    wed: "수",
    thu: "목",
    fri: "금",
    sat: "토",
    sun: "일",
  }

  const getDaysDisplay = () => {
    if (!routine.days) return null

    if (Array.isArray(routine.days)) {
      return routine.days.join(", ")
    }

    // If it's an object, convert to Korean day names
    const selectedDays = Object.entries(routine.days)
      .filter(([_, selected]) => selected)
      .map(([day]) => dayMapping[day as keyof typeof dayMapping])

    return selectedDays.length > 0 ? selectedDays.join(", ") : null
  }

  const handleEdit = () => {
    const routines = JSON.parse(localStorage.getItem("athleteRoutines") || "[]")
    const updated = routines.map((r: any) => (r.id === routine.id ? { ...r, ...editForm } : r))
    localStorage.setItem("athleteRoutines", JSON.stringify(updated))
    window.dispatchEvent(new Event("routineUpdated"))
    setIsEditOpen(false)
  }

  const handleDeleteConfirm = () => {
    onDelete(routine.id)
    setIsDeleteOpen(false)
  }

  const toggleDay = (day: string) => {
    setEditForm((prev) => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: !prev.days[day],
      },
    }))
  }

  const daysDisplay = getDaysDisplay()

  return (
    <>
      <Card className="p-6 hover:bg-accent/50 transition-all">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-xl font-semibold">{routine.name}</h3>
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded">
                {typeLabels[type]}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-2">
              {routine.enableTime !== false && routine.time && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {routine.time}
                  {routine.enableTimer && routine.duration ? ` (${routine.duration}분)` : ""}
                </span>
              )}
              {daysDisplay && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {daysDisplay}
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-2 ml-4">
            <Button variant="outline" size="icon" onClick={() => setIsEditOpen(true)}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setIsDeleteOpen(true)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>루틴 수정</DialogTitle>
            <DialogDescription>루틴 정보를 수정하세요</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">루틴 이름</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="edit-enableTime"
                  checked={editForm.enableTime}
                  onChange={(e) => setEditForm({ ...editForm, enableTime: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <Label htmlFor="edit-enableTime" className="cursor-pointer">
                  특정 시간에 실행
                </Label>
              </div>

              {editForm.enableTime && (
                <div className="ml-6 space-y-2">
                  <Label htmlFor="edit-time">시간</Label>
                  <Input
                    id="edit-time"
                    type="time"
                    value={editForm.time}
                    onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                  />
                </div>
              )}
            </div>

            {type === "daily" && (
              <div className="space-y-2">
                <Label>반복 요일</Label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(dayMapping).map(([engDay, korDay]) => (
                    <Button
                      key={engDay}
                      type="button"
                      variant={editForm.days[engDay] ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleDay(engDay)}
                    >
                      {korDay}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="edit-timer">타이머</Label>
              <Select
                value={editForm.enableTimer ? "yes" : "no"}
                onValueChange={(value) => setEditForm({ ...editForm, enableTimer: value === "yes" })}
              >
                <SelectTrigger id="edit-timer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no">사용 안함</SelectItem>
                  <SelectItem value="yes">사용</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {editForm.enableTimer && (
              <div className="space-y-2">
                <Label htmlFor="edit-duration">타이머 시간 (분)</Label>
                <Input
                  id="edit-duration"
                  type="number"
                  value={editForm.duration}
                  onChange={(e) => setEditForm({ ...editForm, duration: Number.parseInt(e.target.value) })}
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              취소
            </Button>
            <Button onClick={handleEdit}>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>루틴 삭제</DialogTitle>
            <DialogDescription>
              "{routine.name}" 루틴을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
