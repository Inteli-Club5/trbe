"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  MapPin,
  Trophy,
  Users,
  Coins,
  Star,
  Target,
  Award,
  BarChart3,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function StatsPage() {
  const [period, setPeriod] = useState("monthly")

  const overallStats = {
    totalTokens: 15420,
    gamesAttended: 28,
    activitiesCompleted: 156,
    currentLevel: 12,
    reputationScore: 850,
    rankingPosition: 156,
    daysActive: 89,
    socialShares: 45,
  }

  const monthlyData = [
    { month: "Jul", tokens: 1200, activities: 12, games: 3 },
    { month: "Ago", tokens: 1450, activities: 15, games: 4 },
    { month: "Set", tokens: 1680, activities: 18, games: 2 },
    { month: "Out", tokens: 1320, activities: 14, games: 3 },
    { month: "Nov", tokens: 1890, activities: 21, games: 5 },
    { month: "Dez", tokens: 2100, activities: 19, games: 4 },
  ]

  const achievements = [
    {
      title: "Sequência de Check-ins",
      current: 12,
      best: 25,
      unit: "dias",
      progress: 48,
      icon: MapPin,
    },
    {
      title: "Tokens por Mês",
      current: 2100,
      best: 2500,
      unit: "tokens",
      progress: 84,
      icon: Coins,
    },
    {
      title: "Atividades Completadas",
      current: 19,
      best: 25,
      unit: "atividades",
      progress: 76,
      icon: Target,
    },
    {
      title: "Engajamento Social",
      current: 8,
      best: 15,
      unit: "posts",
      progress: 53,
      icon: Star,
    },
  ]

  const comparisons = [
    {
      metric: "Tokens Ganhos",
      myValue: 2100,
      avgValue: 1650,
      percentile: 78,
      trend: "up",
    },
    {
      metric: "Jogos Assistidos",
      myValue: 4,
      avgValue: 3.2,
      percentile: 65,
      trend: "up",
    },
    {
      metric: "Atividades/Mês",
      myValue: 19,
      avgValue: 22,
      percentile: 45,
      trend: "down",
    },
    {
      metric: "Reputação",
      myValue: 850,
      avgValue: 720,
      percentile: 82,
      trend: "up",
    },
  ]

  const getTrendIcon = (trend: string) => {
    return trend === "up" ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    )
  }

  const getTrendColor = (trend: string) => {
    return trend === "up" ? "text-green-500" : "text-red-500"
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
          <h1 className="text-xl font-semibold">Estatísticas</h1>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white">
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
            </SelectContent>
          </Select>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4 text-center">
              <Coins className="h-8 w-8 text-[#28CA00] mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{overallStats.totalTokens.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Total de Tokens</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4 text-center">
              <Trophy className="h-8 w-8 text-[#28CA00] mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">#{overallStats.rankingPosition}</div>
              <div className="text-sm text-gray-400">Posição no Ranking</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4 text-center">
              <MapPin className="h-8 w-8 text-[#28CA00] mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{overallStats.gamesAttended}</div>
              <div className="text-sm text-gray-400">Jogos Assistidos</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4 text-center">
              <Star className="h-8 w-8 text-[#28CA00] mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{overallStats.reputationScore}</div>
              <div className="text-sm text-gray-400">Reputação</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="progress" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800">
            <TabsTrigger value="progress" className="data-[state=active]:bg-[#28CA00] data-[state=active]:text-black">
              Progresso
            </TabsTrigger>
            <TabsTrigger value="comparison" className="data-[state=active]:bg-[#28CA00] data-[state=active]:text-black">
              Comparação
            </TabsTrigger>
            <TabsTrigger value="trends" className="data-[state=active]:bg-[#28CA00] data-[state=active]:text-black">
              Tendências
            </TabsTrigger>
          </TabsList>

          <TabsContent value="progress" className="space-y-4">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="h-5 w-5 text-[#28CA00]" />
                  Metas Pessoais
                </CardTitle>
                <CardDescription className="text-gray-400">Seu progresso em relação aos seus recordes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {achievements.map((achievement, index) => {
                  const IconComponent = achievement.icon
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <IconComponent className="h-4 w-4 text-[#28CA00]" />
                          <span className="text-white font-medium">{achievement.title}</span>
                        </div>
                        <span className="text-sm text-gray-400">
                          {achievement.current}/{achievement.best} {achievement.unit}
                        </span>
                      </div>
                      <Progress value={achievement.progress} className="h-2 bg-gray-800">
                        <div
                          className="h-full bg-[#28CA00] rounded-full"
                          style={{ width: `${achievement.progress}%` }}
                        />
                      </Progress>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-4">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#28CA00]" />
                  Comparação com Outros Torcedores
                </CardTitle>
                <CardDescription className="text-gray-400">Como você se compara à média da comunidade</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {comparisons.map((comparison, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-white">{comparison.metric}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-400">
                          Você: {comparison.myValue.toLocaleString()} | Média: {comparison.avgValue.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        {getTrendIcon(comparison.trend)}
                        <span className={`text-sm font-semibold ${getTrendColor(comparison.trend)}`}>
                          {comparison.percentile}º percentil
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[#28CA00]" />
                  Evolução Mensal
                </CardTitle>
                <CardDescription className="text-gray-400">Seu desempenho nos últimos 6 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyData.map((data, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <div className="font-medium text-white">{data.month}</div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-center">
                          <div className="text-[#28CA00] font-semibold">{data.tokens}</div>
                          <div className="text-gray-400">tokens</div>
                        </div>
                        <div className="text-center">
                          <div className="text-blue-400 font-semibold">{data.activities}</div>
                          <div className="text-gray-400">atividades</div>
                        </div>
                        <div className="text-center">
                          <div className="text-purple-400 font-semibold">{data.games}</div>
                          <div className="text-gray-400">jogos</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#28CA00]/10 border-[#28CA00]">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Award className="h-5 w-5 text-[#28CA00]" />
                  Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-300">
                <p>• Você está 25% mais ativo que no mês passado</p>
                <p>• Sua sequência de check-ins melhorou 40% este mês</p>
                <p>• Você está no top 20% dos torcedores mais engajados</p>
                <p>• Continue assim para alcançar o nível 13 em 2 semanas!</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
