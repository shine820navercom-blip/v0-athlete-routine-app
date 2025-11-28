"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Clock, Play, Pause, RotateCcw, X } from "lucide-react"

interface RoutineTimerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  routineName: string
  duration: number
  onComplete: () => void
}

export function RoutineTimerModal({ open, onOpenChange, routineName, duration, onComplete }: RoutineTimerModalProps) {
  const [timeLeft, setTimeLeft] = useState(duration * 60)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    if (open) {
      setTimeLeft(duration * 60)
      setIsRunning(true)
    }
  }, [open, duration])

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false)
          playCompletionSound()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, timeLeft])

  const playCompletionSound = () => {
    const audio = new Audio("/notification.mp3")
    audio.play().catch(() => {})
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100

  const handleComplete = () => {
    onComplete()
    onOpenChange(false)
  }

  const handleReset = () => {
    setTimeLeft(duration * 60)
    setIsRunning(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            {routineName}
          </DialogTitle>
        </DialogHeader>

        <div className="py-8">
          <div className="relative w-48 h-48 mx-auto mb-6">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted" />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                className="text-primary transition-all duration-1000"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold tabular-nums">{formatTime(timeLeft)}</span>
              <span className="text-sm text-muted-foreground mt-2">{duration}분 타이머</span>
            </div>
          </div>

          {timeLeft === 0 && (
            <div className="text-center mb-4">
              <p className="text-lg font-semibold text-green-600">타이머 완료!</p>
              <p className="text-sm text-muted-foreground">루틴을 완료하셨나요?</p>
            </div>
          )}

          <div className="flex gap-2 justify-center">
            {timeLeft > 0 ? (
              <>
                <Button
                  size="lg"
                  variant={isRunning ? "secondary" : "default"}
                  onClick={() => setIsRunning(!isRunning)}
                  className="gap-2"
                >
                  {isRunning ? (
                    <>
                      <Pause className="w-4 h-4" />
                      일시정지
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      시작
                    </>
                  )}
                </Button>
                <Button size="lg" variant="outline" onClick={handleReset} className="gap-2 bg-transparent">
                  <RotateCcw className="w-4 h-4" />
                  리셋
                </Button>
              </>
            ) : (
              <>
                <Button size="lg" onClick={handleComplete} className="gap-2">
                  완료 체크
                </Button>
                <Button size="lg" variant="outline" onClick={handleReset} className="gap-2 bg-transparent">
                  <RotateCcw className="w-4 h-4" />
                  다시하기
                </Button>
              </>
            )}
            <Button size="lg" variant="ghost" onClick={() => onOpenChange(false)} className="gap-2">
              <X className="w-4 h-4" />
              닫기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
