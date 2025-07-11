"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Settings, MapPin, TrendingUp, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const userStats = {
    totalTokens: 15420,
    level: 12,
    gamesAttended: 28,
    activitiesCompleted: 156,
    currentRanking: 156,
    memberSince: "Janeiro 2024",
  }

  const badges = [
    { name: "Fiel Torcedor", description: "10 jogos consecutivos", icon: "🏆", rarity: "gold" },
    { name: "Social Media", description: "100 posts compartilhados", icon: "📱", rarity: "silver" },
    { name: "Primeira Vez", description: "Primeiro check-in", icon: "🎯", rarity: "bronze" },
    { name: "Comprador", description: "5 compras na loja", icon: "🛍️", rarity: "silver" },
    { name: "Veterano", description: "1 ano no app", icon: "⭐", rarity: "gold" },
    { name: "Engajado", description: "500 atividades", icon: "🔥", rarity: "platinum" },
  ]

  const recentActivities = [
    { type: "check-in", description: "Check-in no Maracanã", tokens: 200, date: "Há 2 horas" },
    { type: "social", description: "Post compartilhado", tokens: 50, date: "Ontem" },
    { type: "purchase", description: "Compra na loja oficial", tokens: 150, date: "2 dias atrás" },
    { type: "event", description: "Participação em evento", tokens: 300, date: "3 dias atrás" },
    { type: "challenge", description: "Desafio completado", tokens: 100, date: "1 semana atrás" },
  ]

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "platinum":
        return "text-cyan-400 bg-cyan-400/10 border-cyan-400"
      case "gold":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400"
      case "silver":
        return "text-gray-300 bg-gray-300/10 border-gray-300"
      case "bronze":
        return "text-orange-400 bg-orange-400/10 border-orange-400"
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400"
    }
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
          <h1 className="text-xl font-semibold">Meu Perfil</h1>
          <Link href="/notifications">
            <Button variant="ghost" size="icon" className="text-white">
              <Settings className="h-6 w-6" />
            </Button>
          </Link>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Profile Header */}
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="/placeholder.svg?height=80&width=80" />
                <AvatarFallback className="bg-[#28CA00] text-black text-xl">JD</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white">João da Silva</h2>
                <p className="text-gray-400">@joaosilva</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-red-600 text-white">Flamengo</Badge>
                  <Badge variant="outline" className="border-gray-600 text-gray-300">
                    Torcida Jovem
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Nível {userStats.level}</span>
                <span className="text-sm text-[#28CA00]">75% para o próximo nível</span>
              </div>
              <Progress value={75} className="h-2 bg-gray-800">
                <div className="h-full bg-[#28CA00] rounded-full" style={{ width: "75%" }} />
              </Progress>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#28CA00]">{userStats.totalTokens.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Total de Tokens</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#28CA00]">#{userStats.currentRanking}</div>
                <div className="text-sm text-gray-400">Ranking Geral</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4 text-center">
              <MapPin className="h-8 w-8 text-[#28CA00] mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{userStats.gamesAttended}</div>
              <div className="text-sm text-gray-400">Jogos Assistidos</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-8 w-8 text-[#28CA00] mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{userStats.activitiesCompleted}</div>
              <div className="text-sm text-gray-400">Atividades</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="badges" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800">
            <TabsTrigger value="badges" className="data-[state=active]:bg-[#28CA00] data-[state=active]:text-black">
              Badges
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-[#28CA00] data-[state=active]:text-black">
              Histórico
            </TabsTrigger>
            <TabsTrigger value="stats" className="data-[state=active]:bg-[#28CA00] data-[state=active]:text-black">
              Estatísticas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="badges" className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {badges.map((badge, index) => (
                <Card key={index} className={`bg-gray-900 border ${getRarityColor(badge.rarity)}`}>
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl mb-2">{badge.icon}</div>
                    <h3 className="font-semibold text-white text-sm">{badge.name}</h3>
                    <p className="text-xs text-gray-400 mt-1">{badge.description}</p>
                    <Badge variant="outline" className={`mt-2 text-xs ${getRarityColor(badge.rarity)}`}>
                      {badge.rarity}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-3">
            {recentActivities.map((activity, index) => (
              <Card key={index} className="bg-gray-900 border-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#28CA00]/10 rounded-full">
                        <CheckCircle className="h-4 w-4 text-[#28CA00]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{activity.description}</p>
                        <p className="text-xs text-gray-400">{activity.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-[#28CA00]">+{activity.tokens}</div>
                      <div className="text-xs text-gray-400">tokens</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[#28CA00]" />
                  Estatísticas Gerais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Membro desde:</span>
                  <span className="text-white">{userStats.memberSince}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Média de tokens/mês:</span>
                  <span className="text-[#28CA00]">1,285</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Sequência atual:</span>
                  <span className="text-[#28CA00]">12 dias</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Melhor sequência:</span>
                  <span className="text-[#28CA00]">45 dias</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Badges conquistadas:</span>
                  <span className="text-white">{badges.length}/20</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
