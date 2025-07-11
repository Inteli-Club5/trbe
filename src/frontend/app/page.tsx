"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Bell, Menu, MapPin, Trophy, Users, Coins, Star, Calendar, CheckCircle, Shield, Flag } from "lucide-react"
import Link from "next/link"
import { Sidebar } from "@/components/sidebar"

export default function HomePage() {
  const [notifications] = useState(3)
  const [userTokens] = useState(2450)
  const [userLevel] = useState(12)
  const [userRanking] = useState(156)
  const [levelProgress] = useState(75)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-black border-b border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-white" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-6 w-6" />
            </Button>
            <h1 className="text-2xl font-bold text-[#28CA00]">TRBE</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-[#28CA00] text-black px-3 py-1 rounded-full text-sm font-semibold">
              <Coins className="h-4 w-4" />
              {userTokens.toLocaleString()}
            </div>
            <Button variant="ghost" size="icon" className="text-white relative">
              <Bell className="h-6 w-6" />
              {notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-red-500 text-white text-xs">
                  {notifications}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* User Summary */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src="/placeholder.svg?height=48&width=48" />
                <AvatarFallback className="bg-[#28CA00] text-black">JD</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-white">João da Silva</h3>
                <p className="text-sm text-gray-400">Flamengo • Torcida Jovem</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Nível {userLevel}</span>
              <span className="text-sm text-[#28CA00]">{levelProgress}%</span>
            </div>
            <Progress value={levelProgress} className="h-2 bg-gray-800">
              <div className="h-full bg-[#28CA00] rounded-full" style={{ width: `${levelProgress}%` }} />
            </Progress>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Ranking: #{userRanking}</span>
              <span className="text-[#28CA00]">+125 pts hoje</span>
            </div>
          </CardContent>
        </Card>

        {/* Next Game */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#28CA00]" />
              Próximo Jogo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="text-lg font-semibold text-white">Flamengo</div>
                <div className="text-xs text-gray-400">Casa</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-400">Hoje • 16:00</div>
                <div className="text-xs text-gray-500">Maracanã</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-white">Vasco</div>
                <div className="text-xs text-gray-400">Visitante</div>
              </div>
            </div>
            <Link href="/check-in">
              <Button className="w-full mt-4 bg-[#28CA00] hover:bg-[#20A000] text-black">
                <MapPin className="h-4 w-4 mr-2" />
                Fazer Check-in
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Active Challenges */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2">
              <Trophy className="h-5 w-5 text-[#28CA00]" />
              Desafios Ativos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-white">Presença Semanal</h4>
                <p className="text-sm text-gray-400">Vá a 2 jogos esta semana</p>
                <Progress value={50} className="h-1 mt-2 bg-gray-700">
                  <div className="h-full bg-[#28CA00] rounded-full" style={{ width: "50%" }} />
                </Progress>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-[#28CA00]">+500</div>
                <div className="text-xs text-gray-400">tokens</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-white">Engajamento Social</h4>
                <p className="text-sm text-gray-400">Compartilhe 5 posts do clube</p>
                <Progress value={80} className="h-1 mt-2 bg-gray-700">
                  <div className="h-full bg-[#28CA00] rounded-full" style={{ width: "80%" }} />
                </Progress>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-[#28CA00]">+300</div>
                <div className="text-xs text-gray-400">tokens</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2">
              <Star className="h-5 w-5 text-[#28CA00]" />
              Atividades Recentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-2">
              <CheckCircle className="h-5 w-5 text-[#28CA00]" />
              <div className="flex-1">
                <p className="text-sm text-white">Check-in no Maracanã</p>
                <p className="text-xs text-gray-400">Há 2 horas</p>
              </div>
              <div className="text-sm font-semibold text-[#28CA00]">+200</div>
            </div>

            <div className="flex items-center gap-3 p-2">
              <CheckCircle className="h-5 w-5 text-[#28CA00]" />
              <div className="flex-1">
                <p className="text-sm text-white">Post compartilhado</p>
                <p className="text-xs text-gray-400">Ontem</p>
              </div>
              <div className="text-sm font-semibold text-[#28CA00]">+50</div>
            </div>

            <div className="flex items-center gap-3 p-2">
              <CheckCircle className="h-5 w-5 text-[#28CA00]" />
              <div className="flex-1">
                <p className="text-sm text-white">Compra na loja oficial</p>
                <p className="text-xs text-gray-400">2 dias atrás</p>
              </div>
              <div className="text-sm font-semibold text-[#28CA00]">+150</div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/tasks">
            <Card className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-colors cursor-pointer">
              <CardContent className="p-4 text-center">
                <Trophy className="h-8 w-8 text-[#28CA00] mx-auto mb-2" />
                <p className="text-sm font-medium text-white">Tarefas</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/ranking">
            <Card className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-colors cursor-pointer">
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 text-[#28CA00] mx-auto mb-2" />
                <p className="text-sm font-medium text-white">Ranking</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 p-4">
        <div className="flex justify-around">
          <Link href="/" className="flex flex-col items-center gap-1">
            <div className="p-2 rounded-full bg-[#28CA00]">
              <Trophy className="h-5 w-5 text-black" />
            </div>
            <span className="text-xs text-[#28CA00]">Home</span>
          </Link>

          <Link href="/tasks" className="flex flex-col items-center gap-1">
            <div className="p-2 rounded-full">
              <CheckCircle className="h-5 w-5 text-gray-400" />
            </div>
            <span className="text-xs text-gray-400">Tasks</span>
          </Link>

          <Link href="/torcida/1" className="flex flex-col items-center gap-1">
            <div className="p-2 rounded-full">
              <Flag className="h-5 w-5 text-gray-400" />
            </div>
            <span className="text-xs text-gray-400">Torcida</span>
          </Link>

          <Link href="/reputation" className="flex flex-col items-center gap-1">
            <div className="p-2 rounded-full">
              <Shield className="h-5 w-5 text-gray-400" />
            </div>
            <span className="text-xs text-gray-400">Reputação</span>
          </Link>

          <Link href="/profile" className="flex flex-col items-center gap-1">
            <div className="p-2 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback className="bg-gray-700 text-gray-400 text-xs">JD</AvatarFallback>
              </Avatar>
            </div>
            <span className="text-xs text-gray-400">Perfil</span>
          </Link>
        </div>
      </nav>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  )
}
