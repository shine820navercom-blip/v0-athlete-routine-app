"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Trophy, TrendingUp, Plus, Trash2, Medal } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CompetitionResult {
  id: string
  date: string
  competitionName: string
  rank: number
  award: string
  routineCompletion: number
  type: "competition"
}

interface GameResult {
  id: string
  date: string
  opponent: string
  score: string
  result: "win" | "loss" | "draw"
  routineCompletion: number
  myScore: number
  opponentScore: number
  type: "game"
}

type Result = GameResult | CompetitionResult

export default function GameResultsPage() {
  const [results, setResults] = useState<Result[]>([])
  const [stats, setStats] = useState({ wins: 0, losses: 0, draws: 0 })
  const [correlationData, setCorrelationData] = useState<{ completion: number; winRate: number }[]>([])
  const [isAddingResult, setIsAddingResult] = useState(false)
  const [resultType, setResultType] = useState<"game" | "competition">("game")

  const [newGame, setNewGame] = useState({
    date: "",
    opponent: "",
    myScore: "",
    opponentScore: "",
    result: "" as "win" | "loss" | "draw" | "",
  })

  const [newCompetition, setNewCompetition] = useState({
    date: "",
    competitionName: "",
    rank: "",
    award: "",
  })

  const [userSport, setUserSport] = useState("")

  useEffect(() => {
    const sport = localStorage.getItem("selectedSport") || ""
    setUserSport(sport)

    // Record-based sports
    const recordSports = ["육상", "수영", "사이클", "체조", "발레", "클라이밍", "스케이팅"]
    if (recordSports.includes(sport)) {
      setResultType("competition")
    }

    loadResults()

    const handleResultUpdate = () => {
      loadResults()
    }

    window.addEventListener("gameUpdated", handleResultUpdate)
    return () => window.removeEventListener("gameUpdated", handleResultUpdate)
  }, [])

  const loadResults = () => {
    const savedResults = localStorage.getItem("gameResults")
    const savedStats = localStorage.getItem("athleteStats")

    if (savedResults) {
      const parsedResults = JSON.parse(savedResults)
      setResults(parsedResults)
    }

    if (savedStats) {
      const parsed = JSON.parse(savedStats)
      setStats({ wins: parsed.wins || 0, losses: parsed.losses || 0, draws: parsed.draws || 0 })
    }

    setCorrelationData([
      { completion: 90, winRate: 85 },
      { completion: 80, winRate: 70 },
      { completion: 70, winRate: 50 },
      { completion: 60, winRate: 35 },
      { completion: 50, winRate: 20 },
    ])
  }

  const handleAddCompetition = () => {
    if (!newCompetition.date || !newCompetition.competitionName || !newCompetition.rank) {
      alert("날짜, 대회명, 순위는 필수 입력 사항입니다")
      return
    }

    const routineCompletion = calculateRoutineCompletion()

    const competitionToAdd: CompetitionResult = {
      id: Date.now().toString(),
      date: newCompetition.date,
      competitionName: newCompetition.competitionName,
      rank: Number.parseInt(newCompetition.rank),
      award: newCompetition.award || "",
      routineCompletion,
      type: "competition",
    }

    const updatedResults = [competitionToAdd, ...results]
    setResults(updatedResults)
    localStorage.setItem("gameResults", JSON.stringify(updatedResults))

    setNewCompetition({ date: "", competitionName: "", rank: "", award: "" })
    setIsAddingResult(false)

    window.dispatchEvent(new Event("gameUpdated"))
  }

  const handleAddGame = () => {
    if (!newGame.date || !newGame.opponent || !newGame.myScore || !newGame.opponentScore || !newGame.result) {
      alert("모든 필드를 입력해주세요")
      return
    }

    const routineCompletion = calculateRoutineCompletion()

    const gameToAdd: GameResult = {
      id: Date.now().toString(),
      date: newGame.date,
      opponent: newGame.opponent,
      score: `${newGame.myScore}-${newGame.opponentScore}`,
      result: newGame.result,
      routineCompletion,
      myScore: Number.parseInt(newGame.myScore),
      opponentScore: Number.parseInt(newGame.opponentScore),
      type: "game",
    }

    const updatedResults = [gameToAdd, ...results]
    setResults(updatedResults)
    localStorage.setItem("gameResults", JSON.stringify(updatedResults))

    const newStats = { ...stats }
    if (newGame.result === "win") newStats.wins++
    else if (newGame.result === "loss") newStats.losses++
    else newStats.draws++

    setStats(newStats)
    const athleteStats = JSON.parse(
      localStorage.getItem("athleteStats") ||
        '{"weeklyCompletion":0,"streak":0,"wins":0,"losses":0,"draws":0,"totalRoutines":0}',
    )
    athleteStats.wins = newStats.wins
    athleteStats.losses = newStats.losses
    athleteStats.draws = newStats.draws
    localStorage.setItem("athleteStats", JSON.stringify(athleteStats))

    setNewGame({ date: "", opponent: "", myScore: "", opponentScore: "", result: "" })
    setIsAddingResult(false)

    window.dispatchEvent(new Event("gameUpdated"))
  }

  const calculateRoutineCompletion = () => {
    const routines = JSON.parse(localStorage.getItem("athleteRoutines") || "[]")
    if (routines.length === 0) return 0

    const completedCount = routines.filter((r: any) => r.completed).length
    return Math.round((completedCount / routines.length) * 100)
  }

  const handleDeleteResult = (resultId: string) => {
    const resultToDelete = results.find((r) => r.id === resultId)
    if (!resultToDelete) return

    const updatedResults = results.filter((r) => r.id !== resultId)
    setResults(updatedResults)
    localStorage.setItem("gameResults", JSON.stringify(updatedResults))

    if (resultToDelete.type === "game") {
      const gameResult = resultToDelete as GameResult
      const newStats = { ...stats }
      if (gameResult.result === "win") newStats.wins = Math.max(0, newStats.wins - 1)
      else if (gameResult.result === "loss") newStats.losses = Math.max(0, newStats.losses - 1)
      else newStats.draws = Math.max(0, newStats.draws - 1)

      setStats(newStats)
      const athleteStats = JSON.parse(
        localStorage.getItem("athleteStats") ||
          '{"weeklyCompletion":0,"streak":0,"wins":0,"losses":0,"draws":0,"totalRoutines":0}',
      )
      athleteStats.wins = newStats.wins
      athleteStats.losses = newStats.losses
      athleteStats.draws = newStats.draws
      localStorage.setItem("athleteStats", JSON.stringify(athleteStats))
    }

    window.dispatchEvent(new Event("gameUpdated"))
  }

  const totalGames = stats.wins + stats.losses + stats.draws
  const winRate = totalGames > 0 ? Math.round((stats.wins / totalGames) * 100) : 0

  const games = results.filter((r) => r.type === "game") as GameResult[]
  const competitions = results.filter((r) => r.type === "competition") as CompetitionResult[]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto p-4 md:p-6">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            대시보드로 돌아가기
          </Button>
        </Link>

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">경기 결과</h1>
            <p className="text-muted-foreground">이번 달 경기 기록을 확인하세요</p>
          </div>
          <Dialog open={isAddingResult} onOpenChange={setIsAddingResult}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                기록 추가
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>새 기록 추가</DialogTitle>
              </DialogHeader>
              <Tabs value={resultType} onValueChange={(v) => setResultType(v as "game" | "competition")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="game">경기 (승부)</TabsTrigger>
                  <TabsTrigger value="competition">대회 (순위)</TabsTrigger>
                </TabsList>

                <TabsContent value="game" className="space-y-4 mt-4">
                  <div>
                    <Label>경기 날짜</Label>
                    <Input
                      type="date"
                      value={newGame.date}
                      onChange={(e) => setNewGame({ ...newGame, date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>상대팀</Label>
                    <Input
                      placeholder="상대팀 이름"
                      value={newGame.opponent}
                      onChange={(e) => setNewGame({ ...newGame, opponent: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>우리팀 점수</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={newGame.myScore}
                        onChange={(e) => setNewGame({ ...newGame, myScore: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>상대팀 점수</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={newGame.opponentScore}
                        onChange={(e) => setNewGame({ ...newGame, opponentScore: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>결과</Label>
                    <Select
                      value={newGame.result}
                      onValueChange={(value: any) => setNewGame({ ...newGame, result: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="승/무/패 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="win">승</SelectItem>
                        <SelectItem value="draw">무</SelectItem>
                        <SelectItem value="loss">패</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleAddGame} className="w-full">
                    추가하기
                  </Button>
                </TabsContent>

                <TabsContent value="competition" className="space-y-4 mt-4">
                  <div>
                    <Label>대회 날짜</Label>
                    <Input
                      type="date"
                      value={newCompetition.date}
                      onChange={(e) => setNewCompetition({ ...newCompetition, date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>대회명</Label>
                    <Input
                      placeholder="예: 전국 체전"
                      value={newCompetition.competitionName}
                      onChange={(e) => setNewCompetition({ ...newCompetition, competitionName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>순위</Label>
                    <Input
                      type="number"
                      placeholder="1"
                      min="1"
                      value={newCompetition.rank}
                      onChange={(e) => setNewCompetition({ ...newCompetition, rank: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>수상 (선택)</Label>
                    <Input
                      placeholder="예: 금메달, 우수상"
                      value={newCompetition.award}
                      onChange={(e) => setNewCompetition({ ...newCompetition, award: e.target.value })}
                    />
                  </div>
                  <Button onClick={handleAddCompetition} className="w-full">
                    추가하기
                  </Button>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="text-sm text-muted-foreground">총 경기</span>
            </div>
            <p className="text-3xl font-bold">{totalGames}경기</p>
            <p className="text-sm text-muted-foreground mt-1">
              {stats.wins}승 {stats.draws}무 {stats.losses}패
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="text-sm text-muted-foreground">승률</span>
            </div>
            <p className="text-3xl font-bold">{winRate}%</p>
            <p className="text-sm text-green-600 mt-1">
              {winRate >= 60
                ? "우수한 성적"
                : winRate >= 40
                  ? "평균 이상"
                  : totalGames === 0
                    ? "경기 추가 필요"
                    : "개선 필요"}
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">최근 폼</span>
            </div>
            <p className="text-3xl font-bold">
              {games.length > 0 ? (games[0].result === "win" ? "승" : games[0].result === "draw" ? "무" : "패") : "-"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">최근 경기 결과</p>
          </Card>
        </div>

        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold mb-6">루틴 완료율과 경기 결과 상관관계</h2>
          <p className="text-sm text-muted-foreground mb-6">루틴을 꾸준히 실천할수록 경기 승률이 높아집니다</p>
          <div className="space-y-4">
            {correlationData.map((data) => (
              <div key={data.completion}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">루틴 완료율 {data.completion}%</span>
                  <span className="text-sm text-muted-foreground">승률 {data.winRate}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-green-500 transition-all duration-500"
                    style={{ width: `${data.winRate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-primary/10 rounded-lg">
            <p className="text-sm font-semibold mb-1">핵심 인사이트</p>
            <p className="text-sm text-muted-foreground">
              루틴 완료율 90% 이상 달성 시 승률이 85%까지 상승합니다. 경기 전 루틴을 철저히 준비하세요!
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-6">경기 상세 기록</h2>
          <div className="space-y-3">
            {results.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>아직 기록된 경기가 없습니다</p>
                <Button className="mt-4 bg-transparent" variant="outline" onClick={() => setIsAddingResult(true)}>
                  기록 추가하기
                </Button>
              </div>
            ) : (
              results.map((result) => {
                if (result.type === "competition") {
                  const comp = result as CompetitionResult
                  return (
                    <div key={comp.id} className="p-4 rounded-lg border-l-4 bg-primary/10 border-primary">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Medal className="w-5 h-5 text-primary" />
                          <span className="font-semibold">{comp.competitionName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{comp.date}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteResult(comp.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold">{comp.rank}등</span>
                          {comp.award && (
                            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 rounded text-sm font-semibold">
                              {comp.award}
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">대회 전 루틴 완료율</p>
                          <p className="text-sm font-semibold">{comp.routineCompletion}%</p>
                        </div>
                      </div>
                    </div>
                  )
                } else {
                  const game = result as GameResult
                  return (
                    <div
                      key={game.id}
                      className={`p-4 rounded-lg border-l-4 ${
                        game.result === "win"
                          ? "bg-green-50 border-green-500 dark:bg-green-950/20"
                          : game.result === "draw"
                            ? "bg-yellow-50 border-yellow-500 dark:bg-yellow-950/20"
                            : "bg-red-50 border-red-500 dark:bg-red-950/20"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              game.result === "win"
                                ? "bg-green-500 text-white"
                                : game.result === "draw"
                                  ? "bg-yellow-500 text-white"
                                  : "bg-red-500 text-white"
                            }`}
                          >
                            {game.result === "win" ? "승" : game.result === "draw" ? "무" : "패"}
                          </span>
                          <span className="font-semibold">vs {game.opponent}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{game.date}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteResult(game.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">{game.score}</span>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">경기 전 루틴 완료율</p>
                          <p className="text-sm font-semibold">{game.routineCompletion}%</p>
                        </div>
                      </div>
                    </div>
                  )
                }
              })
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
