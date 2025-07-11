"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Users,
  Trophy,
  Calendar,
  MapPin,
  Star,
  Crown,
  MessageCircle,
  Share2,
  Bell,
  UserPlus,
  Settings,
  Flag,
  TrendingUp,
  Award,
} from "lucide-react"
import Link from "next/link"

export default function TorcidaPage() {
  const [isMember, setIsMember] = useState(true)
  const [membershipStatus, setMembershipStatus] = useState("approved") // pending, approved, rejected

  const torcidaInfo = {
    name: "Torcida Jovem",
    fullName: "Torcida Jovem do Flamengo",
    founded: 1967,
    description:
      "A maior torcida organizada do Clube de Regatas do Flamengo, fundada em 1967 com o objetivo de apoiar o clube em todos os momentos.",
    members: 15420,
    ranking: 1,
    totalPoints: 2450000,
    monthlyPoints: 185000,
    colors: ["#FF0000", "#000000"],
    motto: "Sempre Flamengo, sempre junto!",
  }

  const leadership = [
    {
      name: "Carlos Mendes",
      role: "Presidente",
      avatar: "/placeholder.svg?height=40&width=40",
      memberSince: "2010",
      points: 45230,
    },
    {
      name: "Ana Silva",
      role: "Vice-Presidente",
      avatar: "/placeholder.svg?height=40&width=40",
      memberSince: "2012",
      points: 42180,
    },
    {
      name: "Pedro Santos",
      role: "Diretor de Eventos",
      avatar: "/placeholder.svg?height=40&width=40",
      memberSince: "2015",
      points: 38950,
    },
  ]

  const topMembers = [
    {
      name: "Carlos Mendes",
      points: 45230,
      avatar: "/placeholder.svg?height=40&width=40",
      position: 1,
      badges: ["👑", "🏆", "⭐"],
    },
    {
      name: "Ana Silva",
      points: 42180,
      avatar: "/placeholder.svg?height=40&width=40",
      position: 2,
      badges: ["🥈", "🔥", "⚡"],
    },
    {
      name: "Pedro Santos",
      points: 38950,
      avatar: "/placeholder.svg?height=40&width=40",
      position: 3,
      badges: ["🥉", "💪", "🎯"],
    },
    {
      name: "Maria Costa",
      points: 35420,
      avatar: "/placeholder.svg?height=40&width=40",
      position: 4,
      badges: ["🌟", "🎪"],
    },
    {
      name: "João Silva",
      points: 32180,
      avatar: "/placeholder.svg?height=40&width=40",
      position: 5,
      badges: ["🎭", "🎨"],
    },
  ]

  const upcomingEvents = [
    {
      title: "Caravana para São Paulo",
      description: "Viagem organizada para o jogo contra o Corinthians",
      date: "15/12/2024",
      time: "06:00",
      location: "Sede da Torcida",
      participants: 45,
      maxParticipants: 50,
    },
    {
      title: "Festa de Fim de Ano",
      description: "Confraternização anual da torcida",
      date: "20/12/2024",
      time: "19:00",
      location: "Clube Recreativo",
      participants: 120,
      maxParticipants: 150,
    },
    {
      title: "Ação Social - Natal",
      description: "Distribuição de presentes para crianças carentes",
      date: "22/12/2024",
      time: "14:00",
      location: "Comunidade da Rocinha",
      participants: 25,
      maxParticipants: 30,
    },
  ]

  const recentActivities = [
    {
      type: "event",
      description: "Caravana para Brasília organizada",
      participants: 38,
      date: "Há 3 dias",
    },
    {
      type: "achievement",
      description: "Torcida alcançou 15.000 membros",
      date: "Há 1 semana",
    },
    {
      type: "ranking",
      description: "Subiu para #1 no ranking mensal",
      date: "Há 2 semanas",
    },
  ]

  const handleJoinRequest = () => {
    setMembershipStatus("pending")
  }

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Award className="h-5 w-5 text-gray-400" />
      case 3:
        return <Trophy className="h-5 w-5 text-orange-500" />
      default:
        return <span className="text-sm font-bold text-gray-400">#{position}</span>
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-black border-b border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <Link href="/club">
            <Button variant="ghost" size="icon" className="text-white">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">{torcidaInfo.name}</h1>
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
        {/* Torcida Header */}
        <div className="relative">
          <div className="h-32 bg-gradient-to-r from-red-900 to-red-700"></div>
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-end gap-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                <Flag className="h-10 w-10 text-red-600" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-white">{torcidaInfo.name}</h1>
                <p className="text-sm text-gray-200">Fundada em {torcidaInfo.founded}</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-gray-300" />
                    <span className="text-sm text-gray-300">{torcidaInfo.members.toLocaleString()} membros</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Trophy className="h-4 w-4 text-gray-300" />
                    <span className="text-sm text-gray-300">#{torcidaInfo.ranking} no ranking</span>
                  </div>
                </div>
              </div>
              {isMember ? (
                <Button className="bg-[#28CA00] hover:bg-[#20A000] text-black">
                  <Settings className="h-4 w-4 mr-2" />
                  Membro
                </Button>
              ) : (
                <Button
                  onClick={handleJoinRequest}
                  className="bg-[#28CA00] hover:bg-[#20A000] text-black"
                  disabled={membershipStatus === "pending"}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  {membershipStatus === "pending" ? "Solicitação Enviada" : "Solicitar Ingresso"}
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-6 w-6 text-[#28CA00] mx-auto mb-2" />
                <div className="text-xl font-bold text-white">{(torcidaInfo.totalPoints / 1000000).toFixed(1)}M</div>
                <div className="text-sm text-gray-400">Pontos Totais</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4 text-center">
                <Star className="h-6 w-6 text-[#28CA00] mx-auto mb-2" />
                <div className="text-xl font-bold text-white">{(torcidaInfo.monthlyPoints / 1000).toFixed(0)}K</div>
                <div className="text-sm text-gray-400">Este Mês</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4 text-center">
                <Crown className="h-6 w-6 text-[#28CA00] mx-auto mb-2" />
                <div className="text-xl font-bold text-white">#{torcidaInfo.ranking}</div>
                <div className="text-sm text-gray-400">Ranking</div>
              </CardContent>
            </Card>
          </div>

          {/* About */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Sobre a Torcida</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-gray-300">{torcidaInfo.description}</p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Lema:</span>
                <span className="text-sm text-[#28CA00] font-medium">"{torcidaInfo.motto}"</span>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="members" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-800">
              <TabsTrigger
                value="members"
                className="data-[state=active]:bg-[#28CA00] data-[state=active]:text-black text-xs"
              >
                Membros
              </TabsTrigger>
              <TabsTrigger
                value="events"
                className="data-[state=active]:bg-[#28CA00] data-[state=active]:text-black text-xs"
              >
                Eventos
              </TabsTrigger>
              <TabsTrigger
                value="leadership"
                className="data-[state=active]:bg-[#28CA00] data-[state=active]:text-black text-xs"
              >
                Liderança
              </TabsTrigger>
              <TabsTrigger
                value="activity"
                className="data-[state=active]:bg-[#28CA00] data-[state=active]:text-black text-xs"
              >
                Atividade
              </TabsTrigger>
            </TabsList>

            <TabsContent value="members" className="space-y-4">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Top Membros do Mês</CardTitle>
                  <CardDescription className="text-gray-400">
                    Os membros mais engajados da {torcidaInfo.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {topMembers.map((member) => (
                    <div key={member.position} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 text-center">{getPositionIcon(member.position)}</div>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={member.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="bg-gray-700 text-white">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold text-white">{member.name}</h4>
                          <div className="flex gap-1">
                            {member.badges.map((badge, index) => (
                              <span key={index} className="text-sm">
                                {badge}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-[#28CA00]">{member.points.toLocaleString()}</div>
                        <div className="text-xs text-gray-400">pontos</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="events" className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <Card key={index} className="bg-gray-900 border-gray-800">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-white">{event.title}</h3>
                        <p className="text-sm text-gray-400">{event.description}</p>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-300">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {event.date} • {event.time}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Participantes</span>
                          <span className="text-[#28CA00]">
                            {event.participants}/{event.maxParticipants}
                          </span>
                        </div>
                        <Progress
                          value={(event.participants / event.maxParticipants) * 100}
                          className="h-2 bg-gray-800"
                        >
                          <div
                            className="h-full bg-[#28CA00] rounded-full"
                            style={{ width: `${(event.participants / event.maxParticipants) * 100}%` }}
                          />
                        </Progress>
                      </div>

                      {isMember && (
                        <Button size="sm" className="bg-[#28CA00] hover:bg-[#20A000] text-black">
                          Participar
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="leadership" className="space-y-4">
              {leadership.map((leader, index) => (
                <Card key={index} className="bg-gray-900 border-gray-800">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={leader.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-gray-700 text-white">
                          {leader.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{leader.name}</h3>
                        <p className="text-sm text-[#28CA00]">{leader.role}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
                          <span>Membro desde {leader.memberSince}</span>
                          <span>{leader.points.toLocaleString()} pontos</span>
                        </div>
                      </div>
                      {isMember && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-700 text-gray-400 hover:text-white bg-transparent"
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Contatar
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              {recentActivities.map((activity, index) => (
                <Card key={index} className="bg-gray-900 border-gray-800">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#28CA00]/10 rounded-full">
                        {activity.type === "event" && <Calendar className="h-5 w-5 text-[#28CA00]" />}
                        {activity.type === "achievement" && <Trophy className="h-5 w-5 text-[#28CA00]" />}
                        {activity.type === "ranking" && <TrendingUp className="h-5 w-5 text-[#28CA00]" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">{activity.description}</p>
                        {activity.participants && (
                          <p className="text-xs text-gray-400">{activity.participants} participantes</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">{activity.date}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>

          {/* Member Benefits */}
          {isMember && (
            <Card className="bg-[#28CA00]/10 border-[#28CA00]">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Star className="h-5 w-5 text-[#28CA00]" />
                  Benefícios de Membro
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-300">
                <p>• Acesso prioritário a ingressos</p>
                <p>• Desconto em produtos oficiais</p>
                <p>• Participação em eventos exclusivos</p>
                <p>• Bônus de 15% em tokens por atividades</p>
                <p>• Acesso ao chat privado da torcida</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
