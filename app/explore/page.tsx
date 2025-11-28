"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AthleteCard } from "@/components/explore/athlete-card"
import { RoutineDetailModal } from "@/components/explore/routine-detail-modal"
import { ArrowLeft, Search } from 'lucide-react'
import Link from "next/link"

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAthlete, setSelectedAthlete] = useState<any>(null)

  const athletes = {
    soccer: [
      {
        id: "1",
        name: "크리스티아누 호나우두",
        sport: "soccer",
        position: "공격수",
        achievements: ["UEFA 챔피언스리그 5회 우승", "발롱도르 5회 수상"],
        image: "/cristiano-ronaldo-professional.jpg",
        routines: [
          {
            name: "아침 훈련 전 루틴",
            time: "06:00",
            duration: 45,
            description: "웨이트 트레이닝과 스트레칭으로 몸을 깨운다",
            details: ["15분 동적 스트레칭", "20분 코어 강화 운동", "10분 유산소 운동"],
          },
          {
            name: "경기 당일 준비",
            time: "경기 3시간 전",
            duration: 90,
            description: "명상과 시각화로 정신을 집중한다",
            details: ["30분 명상 및 시각화", "20분 가벼운 스트레칭", "영양 섭취 및 수분 보충"],
          },
        ],
      },
      {
        id: "2",
        name: "손흥민",
        sport: "soccer",
        position: "윙어",
        achievements: ["프리미어리그 득점왕", "아시안 최우수 선수"],
        image: "/son-heung-min-professional.jpg",
        routines: [
          {
            name: "회복 루틴",
            time: "20:00",
            duration: 40,
            description: "훈련 후 철저한 회복 관리",
            details: ["10분 아이스 배스", "20분 전신 스트레칭", "10분 폼 롤러"],
          },
        ],
      },
    ],
    basketball: [
      {
        id: "3",
        name: "르브론 제임스",
        sport: "basketball",
        position: "포워드",
        achievements: ["NBA 챔피언십 4회", "NBA MVP 4회"],
        image: "/lebron-james-professional.jpg",
        routines: [
          {
            name: "훈련 전 준비",
            time: "09:00",
            duration: 90,
            description: "체계적인 웨이트와 슈팅 연습",
            details: ["45분 웨이트 트레이닝", "30분 슈팅 드릴", "15분 쿨다운"],
          },
          {
            name: "회복 및 재생",
            time: "저녁",
            duration: 60,
            description: "냉온 교대욕과 마사지로 회복",
            details: ["20분 냉온 교대욕", "30분 전문 마사지", "10분 명상"],
          },
        ],
      },
    ],
    tennis: [
      {
        id: "4",
        name: "로저 페더러",
        sport: "tennis",
        position: "싱글",
        achievements: ["그랜드 슬램 20회 우승", "월드 랭킹 1위 310주"],
        image: "/roger-federer-professional.jpg",
        routines: [
          {
            name: "경기 전 워밍업",
            time: "경기 2시간 전",
            duration: 60,
            description: "완벽한 컨디션 조성",
            details: ["20분 동적 스트레칭", "30분 파트너와 랠리", "10분 멘탈 집중"],
          },
        ],
      },
    ],
  }

  const allAthletes = [...athletes.soccer, ...athletes.basketball, ...athletes.tennis]
  
  const filteredAthletes = searchQuery
    ? allAthletes.filter((athlete) =>
        athlete.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allAthletes

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            대시보드로 돌아가기
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">프로 선수 루틴</h1>
          <p className="text-muted-foreground">세계적인 선수들의 실제 루틴을 확인하고 내 루틴에 추가하세요</p>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="선수 이름으로 검색... (예: 손흥민, 호나우두, 르브론)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          {searchQuery && (
            <p className="text-sm text-muted-foreground mt-2">
              {filteredAthletes.length}명의 선수를 찾았습니다
            </p>
          )}
        </div>

        {searchQuery ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAthletes.length > 0 ? (
              filteredAthletes.map((athlete) => (
                <AthleteCard key={athlete.id} athlete={athlete} onViewRoutines={() => setSelectedAthlete(athlete)} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>검색 결과가 없습니다</p>
              </div>
            )}
          </div>
        ) : (
          <Tabs defaultValue="soccer" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="soccer">축구</TabsTrigger>
              <TabsTrigger value="basketball">농구</TabsTrigger>
              <TabsTrigger value="tennis">테니스</TabsTrigger>
            </TabsList>

            <TabsContent value="soccer" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {athletes.soccer.map((athlete) => (
                  <AthleteCard key={athlete.id} athlete={athlete} onViewRoutines={() => setSelectedAthlete(athlete)} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="basketball" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {athletes.basketball.map((athlete) => (
                  <AthleteCard key={athlete.id} athlete={athlete} onViewRoutines={() => setSelectedAthlete(athlete)} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="tennis" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {athletes.tennis.map((athlete) => (
                  <AthleteCard key={athlete.id} athlete={athlete} onViewRoutines={() => setSelectedAthlete(athlete)} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>

      {selectedAthlete && <RoutineDetailModal athlete={selectedAthlete} onClose={() => setSelectedAthlete(null)} />}
    </div>
  )
}
