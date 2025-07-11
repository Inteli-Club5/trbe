"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Users, Trophy, Calendar, MapPin, Star, ExternalLink, Heart, Share2, Bell } from "lucide-react"
import Link from "next/link"

export default function ClubPage() {
  const clubInfo = {
    name: "Clube de Regatas do Flamengo",
    shortName: "Flamengo",
    founded: 1895,
    stadium: "Maracanã",
    members: 45000000,
    colors: ["#FF0000", "#000000"],
  }

  const torcidas = [
    {
      name: "Torcida Jovem",
      members: 15420,
      description: "A maior torcida organizada do Flamengo, fundada em 1967",
      ranking: 1,
      totalPoints: 2450000,
      isUserMember: true,
    },
    {
      name: "Charanga Rubro-Negra",
      members: 8350,
      description: "Tradição e festa nas arquibancadas desde 1942",
      ranking: 2,
      totalPoints: 1890000,
      isUserMember: false,
    },
    {
      name: "Raça Rubro-Negra",
      members: 12100,
      description: "Paixão e garra em cada jogo",
      ranking: 3,
      totalPoints: 1650000,
      isUserMember: false,
    },
  ]

  const nextGames = [
    {
      opponent: "Vasco",
      date: "Hoje",
      time: "16:00",
      stadium: "Maracanã",
      championship: "Campeonato Carioca",
      isHome: true,
    },
    {
      opponent: "Botafogo",
      date: "Dom, 15/12",
      time: "18:30",
      stadium: "Nilton Santos",
      championship: "Campeonato Carioca",
      isHome: false,
    },
    {
      opponent: "Fluminense",
      date: "Qua, 18/12",
      time: "21:45",
      stadium: "Maracanã",
      championship: "Copa do Brasil",
      isHome: true,
    },
  ]

  const recentNews = [
    {
      title: "Flamengo anuncia renovação com patrocinador master",
      summary: "Acordo válido por mais três temporadas foi oficializado hoje",
      time: "Há 2 horas",
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      title: "Elenco se reapresenta para pré-temporada 2025",
      summary: "Jogadores iniciam preparação para a nova temporada",
      time: "Há 5 horas",
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      title: "Ingressos para o clássico já estão à venda",
      summary: "Vendas começaram hoje para sócios-torcedores",
      time: "Ontem",
      image: "/placeholder.svg?height=60&width=60",
    },
  ]

  const topTorcedores = [
    {
      name: "Carlos Mendes",
      points: 45230,
      avatar: "/placeholder.svg?height=40&width=40",
      torcida: "Torcida Jovem",
      position: 1,
    },
    {
      name: "Ana Silva",
      points: 42180,
      avatar: "/placeholder.svg?height=40&width=40",
      torcida: "Charanga",
      position: 2,
    },
    {
      name: "Pedro Santos",
      points: 38950,
      avatar: "/placeholder.svg?height=40&width=40",
      torcida: "Raça Rubro-Negra",
      position: 3,
    },
  ]

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
          <h1 className="text-xl font-semibold">Meu Clube</h1>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="text-white">
              <Bell className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white">
              <Share2 className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      <div className="space-y-6">
        {/* Club Header */}
        <div className="relative">
          <div className="h-32 bg-gradient-to-r from-red-900 to-red-700"></div>
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-end gap-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-red-600">CRF</span>
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-white">{clubInfo.shortName}</h1>
                <p className="text-sm text-gray-200">Fundado em {clubInfo.founded}</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-gray-300" />
                    <span className="text-sm text-gray-300">{(clubInfo.members / 1000000).toFixed(0)}M torcedores</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-gray-300" />
                    <span className="text-sm text-gray-300">{clubInfo.stadium}</span>
                  </div>
                </div>
              </div>
              <Button className="bg-[#28CA00] hover:bg-[#20A000] text-black">
                <Heart className="h-4 w-4 mr-2" />
                Seguindo
              </Button>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4 text-center">
                <Trophy className="h-6 w-6 text-[#28CA00] mx-auto mb-2" />
                <div className="text-xl font-bold text-white">127</div>
                <div className="text-sm text-gray-400">Títulos</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4 text-center">
                <Users className="h-6 w-6 text-[#28CA00] mx-auto mb-2" />
                <div className="text-xl font-bold text-white">35K</div>
                <div className="text-sm text-gray-400">No TRBE</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4 text-center">
                <Star className="h-6 w-6 text-[#28CA00] mx-auto mb-2" />
                <div className="text-xl font-bold text-white">#1</div>
                <div className="text-sm text-gray-400">Ranking</div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="games" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-800">
              <TabsTrigger
                value="games"
                className="data-[state=active]:bg-[#28CA00] data-[state=active]:text-black text-xs"
              >
                Jogos
              </TabsTrigger>
              <TabsTrigger
                value="torcidas"
                className="data-[state=active]:bg-[#28CA00] data-[state=active]:text-black text-xs"
              >
                Torcidas
              </TabsTrigger>
              <TabsTrigger
                value="news"
                className="data-[state=active]:bg-[#28CA00] data-[state=active]:text-black text-xs"
              >
                Notícias
              </TabsTrigger>
              <TabsTrigger
                value="ranking"
                className="data-[state=active]:bg-[#28CA00] data-[state=active]:text-black text-xs"
              >
                Top Fans
              </TabsTrigger>
            </TabsList>

            <TabsContent value="games" className="space-y-4">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-[#28CA00]" />
                    Próximos Jogos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {nextGames.map((game, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="text-center">
                          <div className="text-sm font-semibold text-white">
                            {game.isHome ? clubInfo.shortName : game.opponent}
                          </div>
                          <div className="text-xs text-gray-400">{game.isHome ? "Casa" : "Visitante"}</div>
                        </div>
                        <div className="text-center px-2">
                          <div className="text-xs text-gray-400">vs</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-semibold text-white">
                            {game.isHome ? game.opponent : clubInfo.shortName}
                          </div>
                          <div className="text-xs text-gray-400">{game.isHome ? "Visitante" : "Casa"}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-white">
                          {game.date} • {game.time}
                        </div>
                        <div className="text-xs text-gray-400">{game.stadium}</div>
                        <Badge className="mt-1 bg-blue-600 text-white text-xs">{game.championship}</Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="torcidas" className="space-y-4">
              {torcidas.map((torcida) => (
                <Card
                  key={torcida.name}
                  className={`bg-gray-900 ${torcida.isUserMember ? "border-[#28CA00]" : "border-gray-800"}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-white">{torcida.name}</h3>
                          {torcida.isUserMember && <Badge className="bg-[#28CA00] text-black text-xs">Membro</Badge>}
                        </div>
                        <p className="text-sm text-gray-400 mb-2">{torcida.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-300">{torcida.members.toLocaleString()} membros</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Trophy className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-300">#{torcida.ranking} no ranking</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-[#28CA00]">
                          {(torcida.totalPoints / 1000000).toFixed(1)}M
                        </div>
                        <div className="text-xs text-gray-400">pontos totais</div>
                      </div>
                    </div>
                    {!torcida.isUserMember && (
                      <Link href={`/torcida/${torcida.ranking}`}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-[#28CA00] text-[#28CA00] hover:bg-[#28CA00] hover:text-black bg-transparent"
                        >
                          Ver Torcida
                        </Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="news" className="space-y-4">
              {recentNews.map((news, index) => (
                <Card key={index} className="bg-gray-900 border-gray-800">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <img
                        src={news.image || "/placeholder.svg"}
                        alt={news.title}
                        className="w-16 h-16 rounded-lg object-cover bg-gray-800"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-1">{news.title}</h3>
                        <p className="text-sm text-gray-400 mb-2">{news.summary}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">{news.time}</span>
                          <Button size="sm" variant="ghost" className="text-[#28CA00] hover:bg-[#28CA00]/10">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Ler mais
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="ranking" className="space-y-4">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Top Torcedores do Mês</CardTitle>
                  <CardDescription className="text-gray-400">
                    Os torcedores mais engajados do {clubInfo.shortName}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {topTorcedores.map((torcedor) => (
                    <div
                      key={torcedor.position}
                      className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 text-center">
                          <span className="text-lg font-bold text-[#28CA00]">#{torcedor.position}</span>
                        </div>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={torcedor.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="bg-gray-700 text-white">
                            {torcedor.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold text-white">{torcedor.name}</h4>
                          <p className="text-sm text-gray-400">{torcedor.torcida}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-[#28CA00]">{torcedor.points.toLocaleString()}</div>
                        <div className="text-xs text-gray-400">pontos</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
