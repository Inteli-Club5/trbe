"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Calendar, MapPin, Users, Star, Trophy, Gift, Flag, Filter, Search } from "lucide-react"
import Link from "next/link"

export default function EventsPage() {
  const [filter, setFilter] = useState("all")

  const events = [
    {
      id: 1,
      title: "Caravana para São Paulo",
      description: "Viagem organizada para o jogo Flamengo vs Corinthians",
      date: "15/12/2024",
      time: "06:00",
      location: "Sede da Torcida Jovem",
      organizer: "Torcida Jovem",
      participants: 45,
      maxParticipants: 50,
      price: "R$ 120",
      category: "travel",
      status: "open",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 2,
      title: "Festa de Fim de Ano",
      description: "Confraternização anual da torcida com shows e sorteios",
      date: "20/12/2024",
      time: "19:00",
      location: "Clube Recreativo Flamengo",
      organizer: "Torcida Jovem",
      participants: 120,
      maxParticipants: 150,
      price: "R$ 50",
      category: "social",
      status: "open",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 3,
      title: "Ação Social - Natal",
      description: "Distribuição de presentes para crianças carentes",
      date: "22/12/2024",
      time: "14:00",
      location: "Comunidade da Rocinha",
      organizer: "Charanga Rubro-Negra",
      participants: 25,
      maxParticipants: 30,
      price: "Gratuito",
      category: "charity",
      status: "open",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 4,
      title: "Treino Aberto",
      description: "Acompanhe o treino do elenco no Ninho do Urubu",
      date: "18/12/2024",
      time: "10:00",
      location: "CT Ninho do Urubu",
      organizer: "Clube Oficial",
      participants: 200,
      maxParticipants: 200,
      price: "R$ 30",
      category: "official",
      status: "full",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 5,
      title: "Encontro de Veteranos",
      description: "Reunião dos torcedores mais antigos da Torcida Jovem",
      date: "10/12/2024",
      time: "15:00",
      location: "Sede da Torcida",
      organizer: "Torcida Jovem",
      participants: 30,
      maxParticipants: 30,
      price: "Gratuito",
      category: "social",
      status: "finished",
      image: "/placeholder.svg?height=100&width=100",
    },
  ]

  const categories = [
    { id: "all", name: "Todos", count: events.length },
    { id: "travel", name: "Viagens", count: events.filter((e) => e.category === "travel").length },
    { id: "social", name: "Social", count: events.filter((e) => e.category === "social").length },
    { id: "charity", name: "Solidário", count: events.filter((e) => e.category === "charity").length },
    { id: "official", name: "Oficial", count: events.filter((e) => e.category === "official").length },
  ]

  const filteredEvents = filter === "all" ? events : events.filter((event) => event.category === filter)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-[#28CA00] text-black"
      case "full":
        return "bg-yellow-600 text-white"
      case "finished":
        return "bg-gray-600 text-white"
      default:
        return "bg-gray-600 text-white"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "open":
        return "Inscrições Abertas"
      case "full":
        return "Lotado"
      case "finished":
        return "Finalizado"
      default:
        return "Indisponível"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "travel":
        return <MapPin className="h-4 w-4" />
      case "social":
        return <Users className="h-4 w-4" />
      case "charity":
        return <Gift className="h-4 w-4" />
      case "official":
        return <Flag className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
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
          <h1 className="text-xl font-semibold">Eventos</h1>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="text-white">
              <Search className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white">
              <Filter className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-[#28CA00]">8</div>
              <div className="text-sm text-gray-400">Este Mês</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-500">3</div>
              <div className="text-sm text-gray-400">Inscritos</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-500">12</div>
              <div className="text-sm text-gray-400">Participados</div>
            </CardContent>
          </Card>
        </div>

        {/* Category Filters */}
        <Tabs value={filter} onValueChange={setFilter} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-gray-800">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="data-[state=active]:bg-[#28CA00] data-[state=active]:text-black text-xs"
              >
                <div className="text-center">
                  <div>{category.name}</div>
                  <div className="text-xs opacity-70">({category.count})</div>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={filter} className="space-y-4 mt-6">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="bg-gray-900 border-gray-800">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <img
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      className="w-20 h-20 rounded-lg object-cover bg-gray-800"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-white">{event.title}</h3>
                          <p className="text-sm text-gray-400">{event.description}</p>
                        </div>
                        <Badge className={`${getStatusColor(event.status)} text-xs`}>
                          {getStatusText(event.status)}
                        </Badge>
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

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            {getCategoryIcon(event.category)}
                            <span className="text-gray-400">{event.organizer}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-400">
                              {event.participants}/{event.maxParticipants}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-[#28CA00]">{event.price}</div>
                        </div>
                      </div>

                      {event.status === "open" && event.participants < event.maxParticipants && (
                        <div className="space-y-2">
                          <Progress
                            value={(event.participants / event.maxParticipants) * 100}
                            className="h-2 bg-gray-800"
                          >
                            <div
                              className="h-full bg-[#28CA00] rounded-full"
                              style={{ width: `${(event.participants / event.maxParticipants) * 100}%` }}
                            />
                          </Progress>
                          <Button size="sm" className="bg-[#28CA00] hover:bg-[#20A000] text-black">
                            Participar
                          </Button>
                        </div>
                      )}

                      {event.status === "full" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-yellow-600 text-yellow-600 bg-transparent"
                          disabled
                        >
                          Lista de Espera
                        </Button>
                      )}

                      {event.status === "finished" && (
                        <div className="flex items-center gap-2">
                          <Badge className="bg-gray-600 text-white text-xs">Finalizado</Badge>
                          <Button size="sm" variant="outline" className="border-gray-700 text-gray-400 bg-transparent">
                            Ver Fotos
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {/* Create Event CTA */}
        <Card className="bg-gradient-to-r from-[#28CA00]/20 to-[#28CA00]/10 border-[#28CA00]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Star className="h-5 w-5 text-[#28CA00]" />
              Organize um Evento
            </CardTitle>
            <CardDescription className="text-gray-300">
              Membros da torcida podem criar eventos para a comunidade
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="bg-[#28CA00] hover:bg-[#20A000] text-black">
              <Trophy className="h-4 w-4 mr-2" />
              Criar Evento
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
