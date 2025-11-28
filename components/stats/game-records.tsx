"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trophy, TrendingUp, TrendingDown, Minus, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { ko } from "date-fns/locale"

export function GameRecords() {
  const [games, setGames] = useState<any[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newGame, setNewGame] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    opponent: "",
    result: "win" as "win" | "loss" | "draw",
    myScore: 0,
    opponentScore: 0,
  })

  useEffect(() => {
    const savedGames = localStorage.getItem("gameResults")
    if (savedGames) {
      setGames(JSON.parse(savedGames))
    }
  }, [])

  const handleAddGame = () => {
    if (!newGame.opponent) {
      alert("상대팀을 입력해주세요")
      return
    }

    const routineCompletion = calculateRoutineCompletion()

    const game = {
      id: Date.now().toString(),
      date: newGame.date,
      opponent: newGame.opponent,
      result: newGame.result,
      myScore: newGame.myScore,
      opponentScore: newGame.opponentScore,
      score: `${newGame.myScore}-${newGame.opponentScore}`,
      routineCompletion,
    }

    const updatedGames = [game, ...games]
    setGames(updatedGames)
    localStorage.setItem("gameResults", JSON.stringify(updatedGames))

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

  const handleDeleteGame = (gameId: string) => {
    const gameToDelete = games.find((g) => g.id === gameId)
    if (!gameToDelete) return

    const updatedGames = games.filter((g) => g.id !== gameId)
    setGames(updatedGames)
    localStorage.setItem("gameResults", JSON.stringify(updatedGames))

    // Update stats
    const stats = JSON.parse(
      localStorage.getItem("athleteStats") ||
        '{"weeklyCompletion":0,"streak":0,"wins":0,"losses":0,"draws":0,"totalRoutines":0}',
    )
    if (gameToDelete.result === "win") stats.wins = Math.max(0, (stats.wins || 0) - 1)
    else if (gameToDelete.result === "loss") stats.losses = Math.max(0, (stats.losses || 0) - 1)
    else if (gameToDelete.result === "draw") stats.draws = Math.max(0, (stats.draws || 0) - 1)
    localStorage.setItem("athleteStats", JSON.stringify(stats))

    window.dispatchEvent(new Event("gameUpdated"))
  }

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
                경기 추가
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>새 경기 기록</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
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
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">총 경기</p>
            <p className="text-2xl font-bold">{games.length}경기</p>
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
          {games.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>아직 경기 기록이 없습니다</p>
              <p className="text-sm">첫 경기를 추가해보세요!</p>
            </div>
          ) : (
            games.map((game) => (
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
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteGame(game.id)} className="h-8 w-8 p-0">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">경기전 루틴 완료율:</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all" style={{ width: `${game.routineCompletion}%` }} />
                  </div>
                  <span className="text-sm font-semibold">{game.routineCompletion}%</span>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {games.length > 0 && (
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
