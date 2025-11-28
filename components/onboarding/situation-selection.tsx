"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Heart, Sun, Dumbbell, Calendar } from "lucide-react"

interface SituationSelectionProps {
  sport: string
  onSelect: (situation: string) => void
  onBack: () => void
}

const situations = [
  {
    id: "injury-recovery",
    name: "부상 회복 중",
    description: "재활 및 회복을 위한 루틴",
    icon: Heart,
  },
  {
    id: "game-day-morning",
    name: "경기 당일 아침",
    description: "경기 전 준비 루틴",
    icon: Sun,
  },
  {
    id: "pre-training",
    name: "훈련 전 루틴",
    description: "효과적인 워밍업과 준비",
    icon: Dumbbell,
  },
  {
    id: "post-training",
    name: "훈련 후 루틴",
    description: "회복과 쿨다운",
    icon: Dumbbell,
  },
  {
    id: "off-season",
    name: "시즌 오프",
    description: "컨디션 유지 및 관리",
    icon: Calendar,
  },
]

export function SituationSelection({ sport, onSelect, onBack }: SituationSelectionProps) {
  return (
    <div className="w-full max-w-3xl">
      <Button variant="ghost" onClick={onBack} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        뒤로 가기
      </Button>

      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4 text-balance">현재 상황을 선택하세요</h1>
        <p className="text-lg text-muted-foreground text-balance">상황에 맞는 루틴을 추천해드립니다</p>
      </div>

      <div className="space-y-3">
        {situations.map((situation) => {
          const Icon = situation.icon
          return (
            <Card
              key={situation.id}
              className="p-6 hover:bg-accent cursor-pointer transition-all hover:scale-[1.02] group"
              onClick={() => onSelect(situation.id)}
            >
              <div className="flex items-center gap-4">
                <div className="bg-primary text-primary-foreground p-3 rounded-lg group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-1">{situation.name}</h3>
                  <p className="text-muted-foreground">{situation.description}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
