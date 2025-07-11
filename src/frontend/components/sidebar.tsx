"use client"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Home,
  User,
  Trophy,
  Users,
  Coins,
  Shield,
  Settings,
  Bell,
  HelpCircle,
  LogOut,
  X,
  Flag,
  Calendar,
  Star,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const userInfo = {
    name: "João da Silva",
    email: "joao.silva@email.com",
    club: "Flamengo",
    torcida: "Torcida Jovem",
    level: 12,
    tokens: 2450,
    reputation: 850,
  }

  const notifications = 3 // Add this line

  const menuItems = [
    { icon: Home, label: "Início", href: "/", badge: null },
    { icon: User, label: "Meu Perfil", href: "/profile", badge: null },
    { icon: Trophy, label: "Tarefas", href: "/tasks", badge: "3" },
    { icon: Shield, label: "Reputação", href: "/reputation", badge: null },
    { icon: Users, label: "Rankings", href: "/ranking", badge: null },
    { icon: Coins, label: "Carteira", href: "/wallet", badge: null },
    { icon: Flag, label: "Meu Clube", href: "/club", badge: null },
    { icon: Calendar, label: "Eventos", href: "/events", badge: "2" },
    { icon: Bell, label: "Notificações", href: "/notifications", badge: "5" },
  ]

  const quickActions = [
    { icon: Star, label: "Minha Torcida", href: "/torcida/1" },
    { icon: TrendingUp, label: "Estatísticas", href: "/stats" },
    { icon: HelpCircle, label: "Ajuda", href: "/help" },
    { icon: Settings, label: "Configurações", href: "/settings" },
  ]

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />

      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-80 bg-gray-900 border-r border-gray-800 z-50 transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#28CA00]">TRBE</h2>
              <Link href="/notifications">
                <Button variant="ghost" size="icon" className="text-white relative">
                  <Bell className="h-6 w-6" />
                  {notifications > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-red-500 text-white text-xs">
                      {notifications}
                    </Badge>
                  )}
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-white">
                <X className="h-6 w-6" />
              </Button>
            </div>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src="/placeholder.svg?height=48&width=48" />
                <AvatarFallback className="bg-[#28CA00] text-black">JD</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-white">{userInfo.name}</h3>
                <p className="text-sm text-gray-400">
                  {userInfo.club} • {userInfo.torcida}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-lg font-bold text-[#28CA00]">{userInfo.level}</div>
                <div className="text-xs text-gray-400">Nível</div>
              </div>
              <div>
                <div className="text-lg font-bold text-[#28CA00]">{userInfo.tokens}</div>
                <div className="text-xs text-gray-400">Tokens</div>
              </div>
              <div>
                <div className="text-lg font-bold text-[#28CA00]">{userInfo.reputation}</div>
                <div className="text-xs text-gray-400">Reputação</div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Menu Principal</h4>
              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const IconComponent = item.icon
                  return (
                    <Link key={item.href} href={item.href} onClick={onClose}>
                      <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                        <IconComponent className="h-5 w-5" />
                        <span className="flex-1">{item.label}</span>
                        {item.badge && <Badge className="bg-red-500 text-white text-xs">{item.badge}</Badge>}
                      </div>
                    </Link>
                  )
                })}
              </nav>
            </div>

            <Separator className="bg-gray-800" />

            <div className="p-4">
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Ações Rápidas</h4>
              <nav className="space-y-1">
                {quickActions.map((item) => {
                  const IconComponent = item.icon
                  return (
                    <Link key={item.href} href={item.href} onClick={onClose}>
                      <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                        <IconComponent className="h-5 w-5" />
                        <span>{item.label}</span>
                      </div>
                    </Link>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-800">
            <Button
              variant="outline"
              className="w-full border-red-700 text-red-400 hover:bg-red-900/30 justify-start bg-transparent"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>

            <div className="mt-3 text-center text-xs text-gray-500">TRBE v1.0.0</div>
          </div>
        </div>
      </div>
    </>
  )
}
