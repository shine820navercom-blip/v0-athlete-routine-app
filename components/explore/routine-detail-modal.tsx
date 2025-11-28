"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Clock, Plus, CheckCircle } from "lucide-react"
import { useState } from "react"
import Image from "next/image"

interface RoutineDetailModalProps {
  athlete: {
    name: string
    image: string
    routines: Array<{
      name: string
      time: string
      duration: number
      description: string
      details: string[]
    }>
  }
  onClose: () => void
}

export function RoutineDetailModal({ athlete, onClose }: RoutineDetailModalProps) {
  const [addedRoutines, setAddedRoutines] = useState<Set<string>>(new Set())

  const handleAddRoutine = (routineName: string) => {
    setAddedRoutines((prev) => new Set(prev).add(routineName))
    setTimeout(() => {
      setAddedRoutines((prev) => {
        const next = new Set(prev)
        next.delete(routineName)
        return next
      })
    }, 2000)
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden">
              <Image src={athlete.image || "/placeholder.svg"} alt={athlete.name} fill className="object-cover" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{athlete.name}</h2>
              <p className="text-sm text-muted-foreground">{athlete.routines.length}개의 루틴</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {athlete.routines.map((routine, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{routine.name}</h3>
                  <p className="text-muted-foreground mb-3">{routine.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {routine.time}
                    </span>
                    <span>{routine.duration}분</span>
                  </div>
                </div>
                <Button
                  onClick={() => handleAddRoutine(routine.name)}
                  disabled={addedRoutines.has(routine.name)}
                  className="ml-4"
                >
                  {addedRoutines.has(routine.name) ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      추가됨
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />내 루틴에 추가
                    </>
                  )}
                </Button>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">세부 사항</h4>
                <ul className="space-y-2">
                  {routine.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <span className="text-primary font-bold">{idx + 1}.</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  )
}
