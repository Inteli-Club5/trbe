"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Shield,
  AlertTriangle,
  CheckCircle,
  Trophy,
  Star,
  Gift,
  Crown,
  TrendingUp,
  Clock,
  X,
} from "lucide-react"
import Link from "next/link"

export default function ReputationPage() {
  const reputationScore = 850
  const maxScore = 1000
  const reputationLevel = "Exemplar"

  const punishments = [
    {
      id: 1,
      type: "warning",
      reason: "Linguagem inadequada no chat",
      date: "15/11/2024",
      status: "active",
      duration: "7 dias",
      remaining: "2 dias",
    },
    {
      id: 2,
      type: "suspension",
      reason: "Comportamento antisportivo relatado",
      date: "02/10/2024",
      status: "completed",
      duration: "3 dias",
      remaining: "Concluída",
    },
  ]

  const benefits = [
    {
      id: 1,
      name: "Acesso VIP",
      description: "Acesso a eventos exclusivos e áreas VIP",
      requirement: "Reputação > 800",
      unlocked: true,
      icon: Crown,
    },
    {
      id: 2,
      name: "Bônus de Tokens",
      description: "+20% de tokens em todas as atividades",
      requirement: "Reputação > 750",
      unlocked: true,
      icon: Trophy,
    },
    {
      id: 3,
      name: "Badge Especial",
      description: "Badge de Torcedor Exemplar no perfil",
      requirement: "Reputação > 900",
      unlocked: false,
      icon: Star,
    },
    {
      id: 4,
      name: "Moderador Comunitário",
      description: "Poder de moderação em chats e eventos",
      requirement: "Reputação > 950",
      unlocked: false,
      icon: Shield,
    },
  ]

  const recentActions = [
    {
      id: 1,
      action: "Check-in no estádio",
      impact: "+5",
      date: "Há 2 horas",
      type: "positive",
    },
    {
      id: 2,
      action: "Ajudou outro torcedor",
      impact: "+10",
      date: "Ontem",
      type: "positive",
    },
    {
      id: 3,
      action: "Advertência por linguagem",
      impact: "-25",
      date: "3 dias atrás",
      type: "negative",
    },
    {
      id: 4,
      action: "Participação em evento",
      impact: "+15",
      date: "1 semana atrás",
      type: "positive",
    },
  ]

  const getReputationColor = (score: number) => {
    if (score >= 900) return "text-purple-400"
    if (score >= 800) return "text-[#28CA00]"
    if (score >= 600) return "text-yellow-500"
    if (score >= 400) return "text-orange-500"
    return "text-red-500"
  }

  const getReputationLevel = (score: number) => {
    if (score >= 950) return "Lendário"
    if (score >= 900) return "Exemplar"
    if (score >= 800) return "Excelente"
    if (score >= 700) return "Muito Bom"
    if (score >= 600) return "Bom"
    if (score >= 400) return "Regular"
    return "Baixo"
  }

  const getPunishmentIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "suspension":
        return <X className="h-5 w-5 text-red-500" />
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-400" />
    }
  }

  const getPunishmentColor = (type: string) => {
    switch (type) {
      case "warning":
        return "border-yellow-500 bg-yellow-500/10"
      case "suspension":
        return "border-red-500 bg-red-500/10"
      default:
        return "border-gray-500 bg-gray-500/10"
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
          <h1 className="text-xl font-semibold">Reputação</h1>
          <div></div>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Reputation Score */}
        <Card className="bg-gradient-to-r from-[#28CA00]/20 to-[#28CA00]/10 border-[#28CA00]">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Shield className="h-8 w-8 text-[#28CA00]" />
                <span className="text-lg font-semibold text-white">Pontuação de Reputação</span>
              </div>

              <div className="space-y-2">
                <div className={`text-4xl font-bold ${getReputationColor(reputationScore)}`}>{reputationScore}</div>
                <div className="text-sm text-gray-300">de {maxScore} pontos</div>
                <Badge className={`${getReputationColor(reputationScore)} bg-transparent border-current`}>
                  {getReputationLevel(reputationScore)}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Progresso para Lendário</span>
                  <span className="text-[#28CA00]">{reputationScore}/950</span>
                </div>
                <Progress value={(reputationScore / 950) * 100} className="h-3 bg-gray-800">
                  <div
                    className="h-full bg-[#28CA00] rounded-full transition-all"
                    style={{ width: `${(reputationScore / 950) * 100}%` }}
                  />
                </Progress>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <div className="text-xl font-bold text-green-500">+45</div>
              <div className="text-sm text-gray-400">Este mês</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4 text-center">
              <Clock className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
              <div className="text-xl font-bold text-yellow-500">1</div>
              <div className="text-sm text-gray-400">Ativa</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-6 w-6 text-[#28CA00] mx-auto mb-2" />
              <div className="text-xl font-bold text-[#28CA00]">98%</div>
              <div className="text-sm text-gray-400">Positiva</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="benefits" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800">
            <TabsTrigger value="benefits" className="data-[state=active]:bg-[#28CA00] data-[state=active]:text-black">
              Benefícios
            </TabsTrigger>
            <TabsTrigger
              value="punishments"
              className="data-[state=active]:bg-[#28CA00] data-[state=active]:text-black"
            >
              Punições
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-[#28CA00] data-[state=active]:text-black">
              Histórico
            </TabsTrigger>
          </TabsList>

          <TabsContent value="benefits" className="space-y-4">
            <div className="grid gap-4">
              {benefits.map((benefit) => {
                const IconComponent = benefit.icon
                return (
                  <Card
                    key={benefit.id}
                    className={`bg-gray-900 ${benefit.unlocked ? "border-[#28CA00]" : "border-gray-800"}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-full ${benefit.unlocked ? "bg-[#28CA00]/10" : "bg-gray-800"}`}>
                          <IconComponent
                            className={`h-6 w-6 ${benefit.unlocked ? "text-[#28CA00]" : "text-gray-400"}`}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-white">{benefit.name}</h3>
                            {benefit.unlocked && (
                              <Badge className="bg-[#28CA00] text-black text-xs">Desbloqueado</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-400 mb-2">{benefit.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">{benefit.requirement}</span>
                            {!benefit.unlocked && (
                              <Badge variant="outline" className="border-gray-600 text-gray-400 text-xs">
                                Bloqueado
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="punishments" className="space-y-4">
            {punishments.length > 0 ? (
              <div className="space-y-3">
                {punishments.map((punishment) => (
                  <Card key={punishment.id} className={`bg-gray-900 ${getPunishmentColor(punishment.type)}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {getPunishmentIcon(punishment.type)}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-white">
                              {punishment.type === "warning" ? "Advertência" : "Suspensão"}
                            </h4>
                            <Badge
                              variant="outline"
                              className={
                                punishment.status === "active"
                                  ? "border-yellow-500 text-yellow-500"
                                  : "border-green-500 text-green-500"
                              }
                            >
                              {punishment.status === "active" ? "Ativa" : "Concluída"}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-300 mb-2">{punishment.reason}</p>
                          <div className="flex justify-between text-xs text-gray-400">
                            <span>Aplicada em: {punishment.date}</span>
                            <span>
                              {punishment.status === "active"
                                ? `Restam: ${punishment.remaining}`
                                : punishment.remaining}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-8 text-center">
                  <CheckCircle className="h-12 w-12 text-[#28CA00] mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Histórico Limpo!</h3>
                  <p className="text-gray-400">Você não possui nenhuma punição ativa ou histórica.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <div className="space-y-3">
              {recentActions.map((action) => (
                <Card key={action.id} className="bg-gray-900 border-gray-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-full ${action.type === "positive" ? "bg-green-500/10" : "bg-red-500/10"}`}
                        >
                          {action.type === "positive" ? (
                            <TrendingUp className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{action.action}</p>
                          <p className="text-xs text-gray-400">{action.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`font-semibold ${action.type === "positive" ? "text-green-500" : "text-red-500"}`}
                        >
                          {action.impact}
                        </div>
                        <div className="text-xs text-gray-400">pontos</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button variant="outline" className="w-full border-gray-700 text-gray-400 hover:text-white bg-transparent">
              Ver Histórico Completo
            </Button>
          </TabsContent>
        </Tabs>

        {/* How to Improve */}
        <Card className="bg-blue-900/20 border-blue-700">
          <CardHeader>
            <CardTitle className="text-blue-400 flex items-center gap-2">
              <Gift className="h-5 w-5" />
              Como Melhorar sua Reputação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-300">
            <p>• Participe ativamente dos jogos e eventos</p>
            <p>• Mantenha comportamento respeitoso</p>
            <p>• Ajude outros torcedores da comunidade</p>
            <p>• Complete desafios e tarefas regularmente</p>
            <p>• Evite linguagem inadequada ou comportamento antisportivo</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
