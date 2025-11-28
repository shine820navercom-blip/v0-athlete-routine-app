"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, Send, Sparkles, Plus, Clock, Dumbbell, Trophy } from 'lucide-react'
import Link from "next/link"

interface Message {
  role: "user" | "assistant"
  content: string
  routineSuggestion?: {
    name: string
    time: string
    duration: number
    description: string
    type: "daily" | "training" | "game"
  }
}

export default function AICoachPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "안녕하세요! 저는 당신의 AI 루틴 코치입니다. 운동선수에게 필요한 맞춤형 루틴을 추천해드립니다.\n\n추천 받고 싶은 루틴 유형을 선택하거나 직접 말씀해주세요:",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = input
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setIsLoading(true)

    setTimeout(() => {
      const aiResponse = generateAIResponse(userMessage)
      setMessages((prev) => [...prev, aiResponse])
      setIsLoading(false)
    }, 1500)
  }

  const generateAIResponse = (userInput: string): Message => {
    const lowerInput = userInput.toLowerCase()

    if (lowerInput.includes("훈련") || lowerInput.includes("training") || lowerInput.includes("연습")) {
      return {
        role: "assistant",
        content:
          "훈련 루틴을 추천해드립니다. 최상의 훈련 효과를 위한 체계적인 90분 루틴입니다. 워밍업부터 쿨다운까지 모든 단계를 포함합니다.",
        routineSuggestion: {
          name: "전문가급 훈련 루틴",
          time: "10:00",
          duration: 90,
          description: "동적 스트레칭 → 기술 훈련 → 체력 훈련 → 쿨다운으로 구성된 완벽한 훈련 루틴",
          type: "training",
        },
      }
    } else if (lowerInput.includes("경기") || lowerInput.includes("game") || lowerInput.includes("시합")) {
      return {
        role: "assistant",
        content:
          "경기 당일 루틴을 추천합니다. 최고의 퍼포먼스를 위한 경기 2시간 전 준비 루틴입니다. 신체적, 정신적 준비를 완벽하게 갖춥니다.",
        routineSuggestion: {
          name: "경기 당일 루틴",
          time: "경기 2시간 전",
          duration: 60,
          description: "가벼운 워밍업 → 전술 확인 → 멘탈 준비 → 최종 점검으로 구성",
          type: "game",
        },
      }
    } else if (lowerInput.includes("아침") || lowerInput.includes("morning")) {
      return {
        role: "assistant",
        content: "활력 넘치는 아침 루틴을 추천합니다. 매일 아침 30분으로 하루를 시작하세요.",
        routineSuggestion: {
          name: "모닝 루틴",
          time: "07:00",
          duration: 30,
          description: "기상 후 스트레칭, 명상, 가벼운 유산소로 하루를 시작",
          type: "daily",
        },
      }
    } else if (lowerInput.includes("회복") || lowerInput.includes("recovery") || lowerInput.includes("부상")) {
      return {
        role: "assistant",
        content: "회복 중심 루틴을 추천합니다. 부상 예방과 근육 회복에 최적화된 루틴입니다.",
        routineSuggestion: {
          name: "회복 & 재활 루틴",
          time: "20:00",
          duration: 40,
          description: "폼롤링, 스트레칭, 아이스 배스, 영양 섭취 체크",
          type: "training",
        },
      }
    } else if (lowerInput.includes("웜업") || lowerInput.includes("워밍업") || lowerInput.includes("준비")) {
      return {
        role: "assistant",
        content: "효과적인 워밍업 루틴을 추천합니다. 부상을 예방하고 최고의 퍼포먼스를 준비하세요.",
        routineSuggestion: {
          name: "프로급 워밍업",
          time: "훈련 30분 전",
          duration: 25,
          description: "관절 풀기 → 동적 스트레칭 → 심박수 올리기 → 종목별 준비운동",
          type: "training",
        },
      }
    } else if (lowerInput.includes("쿨다운") || lowerInput.includes("마무리") || lowerInput.includes("정리")) {
      return {
        role: "assistant",
        content: "훈련 후 필수 쿨다운 루틴입니다. 회복을 돕고 다음 훈련을 준비합니다.",
        routineSuggestion: {
          name: "쿨다운 루틴",
          time: "훈련 직후",
          duration: 20,
          description: "정적 스트레칭 → 호흡 정리 → 수분 보충 → 영양 섭취",
          type: "training",
        },
      }
    } else {
      return {
        role: "assistant",
        content:
          "구체적으로 어떤 루틴이 필요하신가요? 아래 버튼을 눌러 빠르게 추천받을 수 있습니다:\n\n• 훈련 루틴 - 본격적인 훈련을 위한 루틴\n• 경기 루틴 - 경기 당일 준비 루틴\n• 일상 루틴 - 매일 반복하는 루틴\n\n직접 입력하셔도 좋습니다!",
      }
    }
  }

  const handleAddRoutine = (routine: any) => {
    const existingRoutines = localStorage.getItem("athleteRoutines")
    const routines = existingRoutines ? JSON.parse(existingRoutines) : []

    const newRoutine = {
      id: Date.now().toString(),
      name: routine.name,
      time: routine.time,
      duration: routine.duration,
      completed: false,
      type: routine.type,
    }

    routines.push(newRoutine)
    localStorage.setItem("athleteRoutines", JSON.stringify(routines))

    alert(`"${routine.name}" 루틴이 추가되었습니다!`)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            대시보드로 돌아가기
          </Button>
        </Link>

        <Card className="flex flex-col h-[calc(100vh-200px)]">
          <div className="p-6 border-b">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">AI 루틴 코치</h1>
                <p className="text-sm text-muted-foreground">맞춤형 훈련 및 경기 루틴 추천</p>
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1 p-6">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] ${
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    } rounded-lg p-4`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>

                    {message.routineSuggestion && (
                      <Card className="mt-4 p-4 bg-background">
                        <div className="mb-3">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-lg">{message.routineSuggestion.name}</h4>
                            <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                              {message.routineSuggestion.type === "daily"
                                ? "일상"
                                : message.routineSuggestion.type === "training"
                                  ? "훈련"
                                  : "경기"}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {message.routineSuggestion.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {message.routineSuggestion.time}
                            </span>
                            <span className="font-semibold">{message.routineSuggestion.duration}분</span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className="w-full"
                          onClick={() => handleAddRoutine(message.routineSuggestion)}
                        >
                          <Plus className="w-4 h-4 mr-2" />내 루틴에 추가
                        </Button>
                      </Card>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-primary rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                      <div
                        className="w-2 h-2 bg-primary rounded-full animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-6 border-t">
            <div className="flex gap-2 mb-3">
              <Input
                placeholder="어떤 루틴이 필요하신가요?"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setInput("훈련 루틴 추천해줘")
                  setTimeout(handleSend, 100)
                }}
              >
                <Dumbbell className="w-3 h-3 mr-1" />
                훈련 루틴
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setInput("경기 당일 루틴")
                  setTimeout(handleSend, 100)
                }}
              >
                <Trophy className="w-3 h-3 mr-1" />
                경기 루틴
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setInput("웜업 루틴")
                  setTimeout(handleSend, 100)
                }}
              >
                워밍업
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setInput("회복 루틴")
                  setTimeout(handleSend, 100)
                }}
              >
                회복
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setInput("아침 루틴")
                  setTimeout(handleSend, 100)
                }}
              >
                아침 루틴
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
