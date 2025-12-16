"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trophy, TrendingUp, TrendingDown, Minus, Trash2, Medal } from "lucide-react"
import { format } from "date-fns"
import { ko } from "date-fns/locale"

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
  result: "win" | "loss" | "draw"
  myScore: number
  opponentScore: number
  score: string
  routineCompletion: number
  type: "game"
}

type Result = GameResult | CompetitionResult

export function GameRecords() {
  const [results, setResults] = useState<Result[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [resultType, setResultType] = useState<"game" | "competition">("game")

  const [newGame, setNewGame] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    opponent: "",
    result: "win" as "win" | "loss" | "draw",
    myScore: 0,
    opponentScore: 0,
  })

  const [newCompetition, setNewCompetition] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    competitionName: "",
    rank: 1,
    award: "",
  })

  useEffect(() => {
    const savedResults = localStorage.getItem("gameResults")
    if (savedResults) {
      setResults(JSON.parse(savedResults))
    }
  }, [])

  const handleAddCompetition = () => {
    if (!newCompetition.competitionName || !newCompetition.rank) {
      alert("대회명과 순위를 입력해주세요")
      return
    }

    const routineCompletion = calculateRoutineCompletion()

    const competition: CompetitionResult = {
      id: Date.now().toString(),
      date: newCompetition.date,
      competitionName: newCompetition.competitionName,
      rank: newCompetition.rank,
      award: newCompetition.award,
      routineCompletion,
      type: "competition",
    }

    const updatedResults = [competition, ...results]
    setResults(updatedResults)
    localStorage.setItem("gameResults", JSON.stringify(updatedResults))

    window.dispatchEvent(new Event("gameUpdated"))

    setIsDialogOpen(false)
    setNewCompetition({
      date: format(new Date(), "yyyy-MM-dd"),
      competitionName: "",
      rank: 1,
      award: "",
    })
  }

  const handleAddGame = () => {
    if (!newGame.opponent) {
      alert("상대팀을 입력해주세요")
      return
    }

    const routineCompletion = calculateRoutineCompletion()

    const game: GameResult = {
      id: Date.now().toString(),
      date: newGame.date,
      opponent: newGame.opponent,
      result: newGame.result,
      myScore: newGame.myScore,
      opponentScore: newGame.opponentScore,
      score: `${newGame.myScore}-${newGame.opponentScore}`,
      routineCompletion,
      type: "game",
    }

    const updatedResults = [game, ...results]
    setResults(updatedResults)
    localStorage.setItem("gameResults", JSON.stringify(updatedResults))

    const stats = JSON.parse(
      localStorage.getItem("athleteStats") ||
        '{"weeklyCompletion":0,"streak":0,"wins":0,"losses":0,"draws":0,"totalRoutines":0}',
    )
    if (newGame.result === "win") stats.wins = (stats.wins || 0) + 1
    else if (newGame.result === "loss") stats.losses = (stats.losses || 0) + 1
    else if (newGame.result === "draw") stats.draws = (stats.draws || 0) + 1
    localStorage.setItem("athleteStats", JSON.stringify(stats))

    window.dispatchEvent(new Event("gameUpdated"))

    setIsDialogOpen(false)
    setNewGame({
      date: format(new Date(), "yyyy-MM-dd"),
      opponent: "",
      result: "win",
      myScore: 0,
      opponentScore: 0,
    })
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
      const stats = JSON.parse(
        localStorage.getItem("athleteStats") ||
          '{"weeklyCompletion":0,"streak":0,"wins":0,"losses":0,"draws":0,"totalRoutines":0}',
      )
      if (gameResult.result === "win") stats.wins = Math.max(0, (stats.wins || 0) - 1)
      else if (gameResult.result === "loss") stats.losses = Math.max(0, (stats.losses || 0) - 1)
      else if (gameResult.result === "draw") stats.draws = Math.max(0, (stats.draws || 0) - 1)
      localStorage.setItem("athleteStats", JSON.stringify(stats))
    }

    window.dispatchEvent(new Event("gameUpdated"))
  }

  const games = results.filter((r) => r.type === "game") as GameResult[]
  const wins = games.filter((g) => g.result === "win").length
  const losses = games.filter((g) => g.result === "loss").length
  const draws = games.filter((g) => g.result === "draw").length

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">경기 기록</h3>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                기록 추가
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>새 기록 추가</DialogTitle>
              </DialogHeader>
              <Tabs value={resultType} onValueChange={(v) => setResultType(v as "game" | "competition")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="game">경기 (승부)</TabsTrigger>
                  <TabsTrigger value="competition">대회 (순위)</TabsTrigger>
                </TabsList>

                <TabsContent value="game" className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">경기 날짜</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newGame.date}
                      onChange={(e) => setNewGame({ ...newGame, date: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="opponent">상대 팀/선수</Label>
                    <Input
                      id="opponent"
                      placeholder="예: A팀"
                      value={newGame.opponent}
                      onChange={(e) => setNewGame({ ...newGame, opponent: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="myScore">내 점수</Label>
                      <Input
                        id="myScore"
                        type="number"
                        min="0"
                        value={newGame.myScore}
                        onChange={(e) => setNewGame({ ...newGame, myScore: Number.parseInt(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="opponentScore">상대 점수</Label>
                      <Input
                        id="opponentScore"
                        type="number"
                        min="0"
                        value={newGame.opponentScore}
                        onChange={(e) => setNewGame({ ...newGame, opponentScore: Number.parseInt(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="result">결과</Label>
                    <Select
                      value={newGame.result}
                      onValueChange={(value: "win" | "loss" | "draw") => setNewGame({ ...newGame, result: value })}
                    >
                      <SelectTrigger id="result">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="win">승리</SelectItem>
                        <SelectItem value="draw">무승부</SelectItem>
                        <SelectItem value="loss">패배</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={handleAddGame} className="w-full">
                    기록 저장
                  </Button>
                </TabsContent>

                <TabsContent value="competition" className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="comp-date">대회 날짜</Label>
                    <Input
                      id="comp-date"
                      type="date"
                      value={newCompetition.date}
                      onChange={(e) => setNewCompetition({ ...newCompetition, date: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="comp-name">대회명</Label>
                    <Input
                      id="comp-name"
                      placeholder="예: 전국 체전"
                      value={newCompetition.competitionName}
                      onChange={(e) => setNewCompetition({ ...newCompetition, competitionName: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rank">순위</Label>
                    <Input
                      id="rank"
                      type="number"
                      min="1"
                      placeholder="1"
                      value={newCompetition.rank}
                      onChange={(e) => setNewCompetition({ ...newCompetition, rank: Number.parseInt(e.target.value) })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="award">수상 (선택)</Label>
                    <Input
                      id="award"
                      placeholder="예: 금메달, 우수상"
                      value={newCompetition.award}
                      onChange={(e) => setNewCompetition({ ...newCompetition, award: e.target.value })}
                    />
                  </div>

                  <Button onClick={handleAddCompetition} className="w-full">
                    기록 저장
                  </Button>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">총 경기</p>
            <p className="text-2xl font-bold">{results.length}건</p>
          </div>
          <div className="p-4 bg-green-500/10 rounded-lg">
            <p className="text-sm text-green-700 dark:text-green-400 mb-1">승리</p>
            <p className="text-2xl font-bold text-green-700 dark:text-green-400">{wins}승</p>
          </div>
          <div className="p-4 bg-yellow-500/10 rounded-lg">
            <p className="text-sm text-yellow-700 dark:text-yellow-400 mb-1">무승부</p>
            <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">{draws}무</p>
          </div>
          <div className="p-4 bg-red-500/10 rounded-lg">
            <p className="text-sm text-red-700 dark:text-red-400 mb-1">패배</p>
            <p className="text-2xl font-bold text-red-700 dark:text-red-400">{losses}패</p>
          </div>
        </div>

        <div className="space-y-3">
          {results.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>아직 경기 기록이 없습니다</p>
              <p className="text-sm">첫 경기를 추가해보세요!</p>
            </div>
          ) : (
            results.map((result) => {
              if (result.type === "competition") {
                const comp = result as CompetitionResult
                return (
                  <div key={comp.id} className="p-4 border rounded-lg hover:bg-accent transition-all bg-primary/5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Medal className="w-5 h-5 text-primary" />
                        <div>
                          <h4 className="font-semibold">{comp.competitionName}</h4>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(comp.date), "yyyy년 M월 d일 (EEE)", { locale: ko })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-lg font-bold text-primary">{comp.rank}등</p>
                          {comp.award && <p className="text-xs font-semibold text-yellow-600">{comp.award}</p>}
                        </div>
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

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">대회 전 루틴 완료율:</span>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${comp.routineCompletion}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold">{comp.routineCompletion}%</span>
                    </div>
                  </div>
                )
              } else {
                const game = result as GameResult
                return (
                  <div key={game.id} className="p-4 border rounded-lg hover:bg-accent transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {game.result === "win" ? (
                          <TrendingUp className="w-5 h-5 text-green-600" />
                        ) : game.result === "draw" ? (
                          <Minus className="w-5 h-5 text-yellow-600" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-red-600" />
                        )}
                        <div>
                          <h4 className="font-semibold">vs {game.opponent}</h4>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(game.date), "yyyy년 M월 d일 (EEE)", { locale: ko })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p
                            className={`text-lg font-bold ${
                              game.result === "win"
                                ? "text-green-600"
                                : game.result === "draw"
                                  ? "text-yellow-600"
                                  : "text-red-600"
                            }`}
                          >
                            {game.myScore} - {game.opponentScore}
                          </p>
                          <p
                            className={`text-xs font-semibold ${
                              game.result === "win"
                                ? "text-green-600"
                                : game.result === "draw"
                                  ? "text-yellow-600"
                                  : "text-red-600"
                            }`}
                          >
                            {game.result === "win" ? "승리" : game.result === "draw" ? "무승부" : "패배"}
                          </p>
                        </div>
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

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">경기전 루틴 완료율:</span>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${game.routineCompletion}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold">{game.routineCompletion}%</span>
                    </div>
                  </div>
                )
              }
            })
          )}
        </div>
      </Card>

      {results.length > 0 && (
        <Card className="p-6">
          <h4 className="font-semibold mb-4">인사이트</h4>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <Trophy className="w-4 h-4 text-primary mt-0.5" />
              <p>
                <span className="font-semibold">루틴 완료율이 90% 이상</span>일 때 승률이 가장 높습니다.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <TrendingUp className="w-4 h-4 text-primary mt-0.5" />
              <p>
                꾸준한 루틴 실천이 <span className="font-semibold">경기 성적 향상</span>에 도움이 됩니다.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
