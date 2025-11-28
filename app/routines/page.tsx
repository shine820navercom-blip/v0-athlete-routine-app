"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RoutineCard } from "@/components/routines/routine-card"
import { Plus, Search } from 'lucide-react'
import Link from "next/link"

export default function RoutinesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [routines, setRoutines] = useState<any[]>([])

  useEffect(() => {
    loadRoutines()
    
    // Listen for routine updates
    const handleRoutineUpdate = () => {
      loadRoutines()
    }
    
    window.addEventListener('routineUpdated', handleRoutineUpdate)
    return () => window.removeEventListener('routineUpdated', handleRoutineUpdate)
  }, [])

  const loadRoutines = () => {
    const stored = localStorage.getItem('athleteRoutines')
    if (stored) {
      setRoutines(JSON.parse(stored))
    }
  }

  const handleDelete = (id: string) => {
    const updated = routines.filter(r => r.id !== id)
    localStorage.setItem('athleteRoutines', JSON.stringify(updated))
    setRoutines(updated)
    window.dispatchEvent(new Event('routineUpdated'))
  }

  const filterRoutines = (type: string) => {
    return routines.filter(r => 
      r.type === type && 
      r.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  const dailyRoutines = filterRoutines('daily')
  const trainingRoutines = filterRoutines('training')
  const gameRoutines = filterRoutines('game')

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">총 루틴</h1>
            <p className="text-muted-foreground">내가 생성한 모든 루틴을 관리하고 편집하세요</p>
          </div>
          <Link href="/routines/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />새 루틴
            </Button>
          </Link>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="루틴 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs defaultValue="daily" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="daily">일상 루틴 ({dailyRoutines.length})</TabsTrigger>
            <TabsTrigger value="training">훈련 루틴 ({trainingRoutines.length})</TabsTrigger>
            <TabsTrigger value="game">경기 루틴 ({gameRoutines.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="space-y-4">
            {dailyRoutines.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                일상 루틴이 없습니다. 새 루틴을 추가해보세요.
              </div>
            ) : (
              dailyRoutines.map((routine) => (
                <RoutineCard 
                  key={routine.id} 
                  routine={routine} 
                  type="daily"
                  onDelete={handleDelete}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="training" className="space-y-4">
            {trainingRoutines.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                훈련 루틴이 없습니다. 새 루틴을 추가해보세요.
              </div>
            ) : (
              trainingRoutines.map((routine) => (
                <RoutineCard 
                  key={routine.id} 
                  routine={routine} 
                  type="training"
                  onDelete={handleDelete}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="game" className="space-y-4">
            {gameRoutines.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                경기 루틴이 없습니다. 새 루틴을 추가해보세요.
              </div>
            ) : (
              gameRoutines.map((routine) => (
                <RoutineCard 
                  key={routine.id} 
                  routine={routine} 
                  type="game"
                  onDelete={handleDelete}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
