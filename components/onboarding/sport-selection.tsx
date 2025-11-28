"use client"

import { Card } from "@/components/ui/card"

interface SportSelectionProps {
  onSelect: (sport: string) => void
}

const sports = [
  { id: "soccer", name: "축구", image: "/images/futbol.png" },
  { id: "basketball", name: "농구", image: "/basketball-on-indoor-court.jpg" },
  { id: "baseball", name: "야구", image: "/baseball-bat-and-ball-on-field.jpg" },
  { id: "tennis", name: "테니스", image: "/tennis-racket-and-ball-on-clay-court.jpg" },
  { id: "swimming", name: "수영", image: "/swimming-pool-lanes-olympic.jpg" },
  { id: "cycling", name: "사이클", image: "/professional-racing-bicycle-road.jpg" },
  { id: "weightlifting", name: "역도", image: "/barbell-weights-gym-equipment.jpg" },
  { id: "running", name: "육상", image: "/running-track-stadium-lanes.jpg" },
  { id: "volleyball", name: "배구", image: "/volleyball-net-indoor-court.jpg" },
  { id: "badminton", name: "배드민턴", image: "/badminton-racket-shuttlecock-court.jpg" },
  { id: "tabletennis", name: "탁구", image: "/table-tennis-paddle-ball-table.jpg" },
  { id: "golf", name: "골프", image: "/golf-club-ball-green-course.jpg" },
  { id: "boxing", name: "복싱", image: "/boxing-gloves-ring-equipment.jpg" },
  { id: "taekwondo", name: "태권도", image: "/taekwondo-martial-arts-uniform-dojang.jpg" },
  { id: "judo", name: "유도", image: "/judo-gi-uniform-martial-arts-mat.jpg" },
  { id: "skating", name: "스케이팅", image: "/ice-skating-rink-skates.jpg" },
  { id: "rugby", name: "럭비", image: "/rugby-ball-field-grass.jpg" },
]

export function SportSelection({ onSelect }: SportSelectionProps) {
  return (
    <div className="w-full max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 text-balance">당신의 종목을 선택하세요</h1>
        <p className="text-xl text-muted-foreground text-balance">맞춤형 루틴 관리를 시작합니다</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sports.map((sport) => {
          return (
            <Card
              key={sport.id}
              className="overflow-hidden hover:shadow-xl cursor-pointer transition-all hover:scale-105 group"
              onClick={() => onSelect(sport.id)}
            >
              <div className="relative aspect-[3/2] overflow-hidden">
                <img
                  src={sport.image || "/placeholder.svg"}
                  alt={sport.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute bottom-3 left-3 text-xl font-bold text-white">{sport.name}</span>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
