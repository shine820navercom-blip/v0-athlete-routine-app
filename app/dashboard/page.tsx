"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DailyCalendar } from "@/components/dashboard/daily-calendar"
import { RoutineList } from "@/components/dashboard/routine-list"
import { QuickStats } from "@/components/dashboard/quick-stats"
import { format } from "date-fns"

export default function DashboardPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [hasTraining, setHasTraining] = useState(false)
  const [hasGame, setHasGame] = useState(false)
  const [statsRefreshKey, setStatsRefreshKey] = useState(0)

  useEffect(() => {
    const athleteProfile = localStorage.getItem("athleteProfile")
    if (!athleteProfile) {
      router.push("/")
    } else {
      setProfile(JSON.parse(athleteProfile))
    }
  }, [router])

  useEffect(() => {
    const dateKey = format(selectedDate, "yyyy-MM-dd")
    const scheduleData = localStorage.getItem("dailySchedule")

    if (scheduleData) {
      const schedule = JSON.parse(scheduleData)
      const daySchedule = schedule[dateKey]

      if (daySchedule) {
        setHasTraining(daySchedule.hasTraining || false)
        setHasGame(daySchedule.hasGame || false)
      } else {
        setHasTraining(false)
        setHasGame(false)
      }
    } else {
      setHasTraining(false)
      setHasGame(false)
    }
  }, [selectedDate])

  const handleTrainingChange = (value: boolean) => {
    setHasTraining(value)
    saveDailySchedule(format(selectedDate, "yyyy-MM-dd"), value, hasGame)
  }

  const handleGameChange = (value: boolean) => {
    setHasGame(value)
    saveDailySchedule(format(selectedDate, "yyyy-MM-dd"), hasTraining, value)
  }

  const saveDailySchedule = (dateKey: string, training: boolean, game: boolean) => {
    const scheduleData = localStorage.getItem("dailySchedule")
    const schedule = scheduleData ? JSON.parse(scheduleData) : {}

    schedule[dateKey] = {
      hasTraining: training,
      hasGame: game,
    }

    localStorage.setItem("dailySchedule", JSON.stringify(schedule))
  }

  useEffect(() => {
    const handleRoutinesUpdate = () => {
      setStatsRefreshKey((prev) => prev + 1)
    }

    window.addEventListener("routinesUpdated", handleRoutinesUpdate)
    return () => window.removeEventListener("routinesUpdated", handleRoutinesUpdate)
  }, [])

  if (!profile) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader profile={profile} />

      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        <QuickStats key={statsRefreshKey} />

        <div className="space-y-6">
          <DailyCalendar
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            hasTraining={hasTraining}
            hasGame={hasGame}
            onTrainingChange={handleTrainingChange}
            onGameChange={handleGameChange}
          />

          <RoutineList date={selectedDate} hasTraining={hasTraining} hasGame={hasGame} />
        </div>
      </div>
    </div>
  )
}
