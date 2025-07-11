"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Trophy, Medal, Award, Crown, TrendingUp, TrendingDown, Minus, Users } from "lucide-react"
import Link from "next/link"

export default function RankingPage() {
  const [period, setPeriod] = useState("monthly")
  const [rankingType, setRankingType] = useState("general")

  const currentUser = {
    id: "current",
    name: "João da Silva",
    position: 156,
    points: 15420,
    change: 12,
    avatar: "/placeholder.svg?height=40&width=40",
    club: "Flamengo",
    torcida: "Torcida Jovem",
  }

  const topUsers = [
    {
      id: 1,
      name: "Carlos Mendes",
      position: 1,
      points: 45230,
      change: 0,
      avatar: "/placeholder.svg?height=40&width=40",
      club: "Flamengo",
      torcida: "Torcida Jovem",
      badges: ["👑", "🏆", "⭐"],
    },
    {
      id: 2,
      name: "Ana Silva",
      position: 2,
      points: 42180,
      change: 1,
      avatar: "/placeholder.svg?height=40&width=40",
      club: "Flamengo",
      torcida: "Charanga",
      badges: ["🥈", "🔥", "⚡"],
    },
    {
      id: 3,
      name: "Pedro Santos",
      position: 3,
      points: 38950,
      change: -1,
      avatar: "/placeholder.svg?height=40&width=40",
      club: "Flamengo",
      torcida: "Raça Rubro-Negra",
      badges: ["🥉", "💪", "🎯"],
    },
  ]

  const nearbyUsers = [
    {
      id: 154,
      name: "Maria Costa",
      position: 154,
      points: 15680,
      change: 3,
      avatar: "/placeholder.svg?height=40&width=40",
      club: "Flamengo",
      torcida: "Independente",
    },
    {
      id: 155,
      name: "Roberto Lima",
      position: 155,
      points: 15550,
      change: -2,
      avatar: "/placeholder.svg?height=40&width=40",
      club: "Flamengo",
      torcida: "Torcida Jovem",
    },
    currentUser,
    {
      id: 157,
      name: "Fernanda Rocha",
      position: 157,
      points: 15320,
      change: 5,
      avatar: "/placeholder.svg?height=40&width=40",
      club: "Flamengo",
      torcida: "Charanga",
    },
    {
      id: 158,
      name: "Lucas Oliveira",
      position: 158,
      points: 15180,
      change: -1,
      avatar: "/placeholder.svg?height=40&width=40",
      club: "Flamengo",
      torcida: "Independente",
    },
  ]

  const torcidaRanking = [
    {
      name: "Torcida Jovem",
      members: 15420,
      totalPoints: 2450000,
      avgPoints: 159,
      position: 1,
      change: 0,
    },
    {
      name: "Charanga Rubro-Negra",
      members: 8350,
      totalPoints: 1890000,
      avgPoints: 226,
      position: 2,
      change: 1,
    },
    {
      name: "Raça Rubro-Negra",
      members: 12100,
      totalPoints: 1650000,
      avgPoints: 136,
      position: 3,
      change: -1,
    },
  ]

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />
      case 3:
        return <Award className="h-6 w-6 text-orange-500" />
      default:
        return <span className="text-lg font-bold text-gray-400">#{position}</span>
    }
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-500" />
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-500" />
    return <Minus className="h-4 w-4 text-gray-400" />
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-500"
    if (change < 0) return "text-red-500"
    return "text-gray-400"
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-black border-b border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-white">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">Rankings</h1>
          <div></div>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Filters */}
        <div className="grid grid-cols-2 gap-4">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="weekly" className="text-white hover:bg-gray-700">
                Semanal
              </SelectItem>
              <SelectItem value="monthly" className="text-white hover:bg-gray-700">
                Mensal
              </SelectItem>
              <SelectItem value="yearly" className="text-white hover:bg-gray-700">
                Anual
              </SelectItem>
              <SelectItem value="all-time" className="text-white hover:bg-gray-700">
                Histórico
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={rankingType} onValueChange={setRankingType}>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="general" className="text-white hover:bg-gray-700">
                Geral
              </SelectItem>
              <SelectItem value="club" className="text-white hover:bg-gray-700">
                Por Clube
              </SelectItem>
              <SelectItem value="region" className="text-white hover:bg-gray-700">
                Por Região
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Current User Position */}
        <Card className="bg-[#28CA00]/10 border-[#28CA00]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl font-bold text-[#28CA00]">#{currentUser.position}</div>
                <Avatar className="h-12 w-12">
                  <AvatarImage src={currentUser.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-[#28CA00] text-black">JD</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-white">{currentUser.name}</h3>
                  <p className="text-sm text-gray-300">{currentUser.torcida}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-[#28CA00]">{currentUser.points.toLocaleString()}</div>
                <div className="flex items-center gap-1">
                  {getChangeIcon(currentUser.change)}
                  <span className={`text-sm ${getChangeColor(currentUser.change)}`}>
                    {Math.abs(currentUser.change)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="individual" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800">
            <TabsTrigger value="individual" className="data-[state=active]:bg-[#28CA00] data-[state=active]:text-black">
              Individual
            </TabsTrigger>
            <TabsTrigger value="torcidas" className="data-[state=active]:bg-[#28CA00] data-[state=active]:text-black">
              Torcidas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="individual" className="space-y-6">
            {/* Top 3 */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-[#28CA00]" />
                  Top 3
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {topUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getPositionIcon(user.position)}
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-gray-700 text-white">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold text-white">{user.name}</h4>
                        <p className="text-sm text-gray-400">{user.torcida}</p>
                      </div>
                      <div className="flex gap-1">
                        {user.badges?.map((badge, index) => (
                          <span key={index} className="text-lg">
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[#28CA00]">{user.points.toLocaleString()}</div>
                      <div className="flex items-center gap-1">
                        {getChangeIcon(user.change)}
                        <span className={`text-sm ${getChangeColor(user.change)}`}>
                          {user.change === 0 ? "-" : Math.abs(user.change)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Nearby Rankings */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Próximos a Você</CardTitle>
                <CardDescription className="text-gray-400">
                  Posições {nearbyUsers[0].position} - {nearbyUsers[nearbyUsers.length - 1].position}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {nearbyUsers.map((user) => (
                  <div
                    key={user.id}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      user.id === "current" ? "bg-[#28CA00]/10 border border-[#28CA00]" : "bg-gray-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 text-center">
                        <span className="text-sm font-bold text-gray-400">#{user.position}</span>
                      </div>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} />
                        <AvatarFallback
                          className={`text-xs ${
                            user.id === "current" ? "bg-[#28CA00] text-black" : "bg-gray-700 text-white"
                          }`}
                        >
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4
                          className={`text-sm font-medium ${user.id === "current" ? "text-[#28CA00]" : "text-white"}`}
                        >
                          {user.name}
                        </h4>
                        <p className="text-xs text-gray-400">{user.torcida}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-sm font-semibold ${user.id === "current" ? "text-[#28CA00]" : "text-white"}`}
                      >
                        {user.points.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        {getChangeIcon(user.change)}
                        <span className={`text-xs ${getChangeColor(user.change)}`}>{Math.abs(user.change)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="torcidas" className="space-y-4">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#28CA00]" />
                  Ranking de Torcidas
                </CardTitle>
                <CardDescription className="text-gray-400">Baseado na média de pontos por membro</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {torcidaRanking.map((torcida) => (
                  <div key={torcida.name} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getPositionIcon(torcida.position)}
                      <div>
                        <h4 className="font-semibold text-white">{torcida.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span>{torcida.members.toLocaleString()} membros</span>
                          <span>Média: {torcida.avgPoints} pts</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[#28CA00]">{(torcida.totalPoints / 1000000).toFixed(1)}M</div>
                      <div className="flex items-center gap-1">
                        {getChangeIcon(torcida.change)}
                        <span className={`text-sm ${getChangeColor(torcida.change)}`}>
                          {torcida.change === 0 ? "-" : Math.abs(torcida.change)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
