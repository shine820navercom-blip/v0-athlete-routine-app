"use client"

import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DailyCalendar } from "@/components/dashboard/daily-calendar"
import { RoutineList } from "@/components/dashboard/routine-list"
import { QuickStats } from "@/components/dashboard/quick-stats"

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
    const handleRoutinesUpdate = () => {
      setStatsRefreshKey(prev => prev + 1)
    }
    
    window.addEventListener('routinesUpdated', handleRoutinesUpdate)
    return () => window.removeEventListener('routinesUpdated', handleRoutinesUpdate)
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
            onTrainingChange={setHasTraining}
            onGameChange={setHasGame}
          />

          <RoutineList date={selectedDate} hasTraining={hasTraining} hasGame={hasGame} />
        </div>
      </div>
    </div>
  )
}
