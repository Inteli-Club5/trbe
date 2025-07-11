"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  MapPin,
  Share2,
  ShoppingBag,
  Calendar,
  Trophy,
  Clock,
  CheckCircle,
  Star,
  Filter,
  Coins,
} from "lucide-react"
import Link from "next/link"

export default function TasksPage() {
  const [filter, setFilter] = useState("all")

  const tasks = [
    {
      id: 1,
      title: "Check-in no Maracanã",
      description: "Faça check-in no próximo jogo em casa",
      category: "presence",
      tokens: 200,
      difficulty: "easy",
      deadline: "Hoje, 16:00",
      status: "available",
      progress: 0,
      maxProgress: 1,
      icon: MapPin,
    },
    {
      id: 2,
      title: "Compartilhar 5 Posts",
      description: "Compartilhe 5 posts oficiais do clube nas redes sociais",
      category: "social",
      tokens: 250,
      difficulty: "medium",
      deadline: "Em 3 dias",
      status: "in_progress",
      progress: 3,
      maxProgress: 5,
      icon: Share2,
    },
    {
      id: 3,
      title: "Compra na Loja Oficial",
      description: "Faça uma compra de qualquer valor na loja oficial",
      category: "purchase",
      tokens: 300,
      difficulty: "easy",
      deadline: "Em 1 semana",
      status: "available",
      progress: 0,
      maxProgress: 1,
      icon: ShoppingBag,
    },
    {
      id: 4,
      title: "Presença Semanal",
      description: "Vá a 2 jogos esta semana",
      category: "presence",
      tokens: 500,
      difficulty: "hard",
      deadline: "Em 4 dias",
      status: "in_progress",
      progress: 1,
      maxProgress: 2,
      icon: Calendar,
    },
    {
      id: 5,
      title: "Engajamento Diário",
      description: "Faça login por 7 dias consecutivos",
      category: "engagement",
      tokens: 150,
      difficulty: "easy",
      deadline: "Contínuo",
      status: "in_progress",
      progress: 4,
      maxProgress: 7,
      icon: Star,
    },
    {
      id: 6,
      title: "Primeira Compra",
      description: "Faça sua primeira compra usando tokens",
      category: "purchase",
      tokens: 100,
      difficulty: "easy",
      deadline: "Sem prazo",
      status: "completed",
      progress: 1,
      maxProgress: 1,
      icon: ShoppingBag,
    },
  ]

  const categories = [
    { id: "all", name: "Todas", count: tasks.length },
    { id: "presence", name: "Presença", count: tasks.filter((t) => t.category === "presence").length },
    { id: "social", name: "Social", count: tasks.filter((t) => t.category === "social").length },
    { id: "purchase", name: "Compras", count: tasks.filter((t) => t.category === "purchase").length },
    { id: "engagement", name: "Engajamento", count: tasks.filter((t) => t.category === "engagement").length },
  ]

  const filteredTasks = filter === "all" ? tasks : tasks.filter((task) => task.category === filter)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-600"
      case "medium":
        return "bg-yellow-600"
      case "hard":
        return "bg-red-600"
      default:
        return "bg-gray-600"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "border-gray-700"
      case "in_progress":
        return "border-[#28CA00]"
      case "completed":
        return "border-green-600 bg-green-600/10"
      default:
        return "border-gray-700"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "in_progress":
        return <Clock className="h-5 w-5 text-[#28CA00]" />
      default:
        return null
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
          <h1 className="text-xl font-semibold">Tarefas de Engajamento</h1>
          <Button variant="ghost" size="icon" className="text-white">
            <Filter className="h-6 w-6" />
          </Button>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-[#28CA00]">12</div>
              <div className="text-sm text-gray-400">Disponíveis</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-500">3</div>
              <div className="text-sm text-gray-400">Em Progresso</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-500">8</div>
              <div className="text-sm text-gray-400">Concluídas</div>
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
            {filteredTasks.map((task) => {
              const IconComponent = task.icon
              return (
                <Card key={task.id} className={`bg-gray-900 ${getStatusColor(task.status)}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-[#28CA00]/10 rounded-full">
                        <IconComponent className="h-6 w-6 text-[#28CA00]" />
                      </div>

                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-white">{task.title}</h3>
                            <p className="text-sm text-gray-400">{task.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(task.status)}
                            <div className="text-right">
                              <div className="text-lg font-bold text-[#28CA00]">+{task.tokens}</div>
                              <div className="text-xs text-gray-400">tokens</div>
                            </div>
                          </div>
                        </div>

                        {task.status === "in_progress" && task.maxProgress > 1 && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Progresso</span>
                              <span className="text-[#28CA00]">
                                {task.progress}/{task.maxProgress}
                              </span>
                            </div>
                            <Progress value={(task.progress / task.maxProgress) * 100} className="h-2 bg-gray-800">
                              <div
                                className="h-full bg-[#28CA00] rounded-full transition-all"
                                style={{ width: `${(task.progress / task.maxProgress) * 100}%` }}
                              />
                            </Progress>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge className={`${getDifficultyColor(task.difficulty)} text-white text-xs`}>
                              {task.difficulty === "easy"
                                ? "Fácil"
                                : task.difficulty === "medium"
                                  ? "Médio"
                                  : "Difícil"}
                            </Badge>
                            <span className="text-xs text-gray-400">{task.deadline}</span>
                          </div>

                          {task.status === "available" && (
                            <Button size="sm" className="bg-[#28CA00] hover:bg-[#20A000] text-black">
                              Iniciar
                            </Button>
                          )}

                          {task.status === "in_progress" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-[#28CA00] text-[#28CA00] bg-transparent"
                            >
                              Continuar
                            </Button>
                          )}

                          {task.status === "completed" && (
                            <Badge className="bg-green-600 text-white">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Concluída
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </TabsContent>
        </Tabs>

        {/* Daily Challenge */}
        <Card className="bg-gradient-to-r from-[#28CA00]/20 to-[#28CA00]/10 border-[#28CA00]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Trophy className="h-5 w-5 text-[#28CA00]" />
              Desafio Diário
            </CardTitle>
            <CardDescription className="text-gray-300">Complete 3 tarefas hoje e ganhe bônus</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white">Progresso do dia</span>
                <span className="text-[#28CA00] font-semibold">1/3</span>
              </div>
              <Progress value={33} className="h-3 bg-gray-800">
                <div className="h-full bg-[#28CA00] rounded-full" style={{ width: "33%" }} />
              </Progress>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Recompensa:</span>
                <div className="flex items-center gap-1">
                  <Coins className="h-4 w-4 text-[#28CA00]" />
                  <span className="font-semibold text-[#28CA00]">+500 tokens</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
