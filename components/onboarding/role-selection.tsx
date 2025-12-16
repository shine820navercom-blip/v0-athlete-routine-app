"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, User, Clipboard, Flag } from "lucide-react"

interface RoleSelectionProps {
  onSelect: (role: string) => void
  onBack: () => void
}

const roles = [
  {
    id: "athlete",
    name: "선수",
    description: "개인 루틴과 성과 관리",
    icon: User,
  },
  {
    id: "coach",
    name: "코치",
    description: "선수 지도 및 훈련 계획",
    icon: Clipboard,
  },
  {
    id: "director",
    name: "감독",
    description: "팀 전략 및 전체 관리",
    icon: Flag,
  },
]

export function RoleSelection({ onSelect, onBack }: RoleSelectionProps) {
  return (
    <div className="w-full max-w-3xl">
      <Button variant="ghost" onClick={onBack} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        뒤로 가기
      </Button>

      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4 text-balance">역할을 선택하세요</h1>
        <p className="text-lg text-muted-foreground text-balance">당신의 역할에 맞는 기능을 제공합니다</p>
      </div>

      <div className="space-y-3">
        {roles.map((role) => {
          const Icon = role.icon
          return (
            <Card
              key={role.id}
              className="p-6 hover:bg-accent cursor-pointer transition-all hover:scale-[1.02] group"
              onClick={() => onSelect(role.id)}
            >
              <div className="flex items-center gap-4">
                <div className="bg-primary text-primary-foreground p-3 rounded-lg group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-1">{role.name}</h3>
                  <p className="text-muted-foreground">{role.description}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
