"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Bell, Trophy, MapPin, Users, Gift, AlertCircle, CheckCircle, Trash2, Settings } from "lucide-react"
import Link from "next/link"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "game",
      title: "Jogo começando em 1 hora!",
      message: "Flamengo vs Vasco no Maracanã às 16:00",
      time: "Há 45 min",
      read: false,
      icon: MapPin,
      color: "text-[#28CA00]",
    },
    {
      id: 2,
      type: "reward",
      title: "Tokens recebidos!",
      message: "Você ganhou 200 tokens pelo check-in no estádio",
      time: "Há 2 horas",
      read: false,
      icon: Trophy,
      color: "text-yellow-500",
    },
    {
      id: 3,
      type: "social",
      title: "Nova menção",
      message: "Carlos Mendes mencionou você em um comentário",
      time: "Há 3 horas",
      read: true,
      icon: Users,
      color: "text-blue-500",
    },
    {
      id: 4,
      type: "challenge",
      title: "Desafio completado!",
      message: "Parabéns! Você completou o desafio 'Presença Semanal'",
      time: "Ontem",
      read: true,
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      id: 5,
      type: "warning",
      title: "Advertência aplicada",
      message: "Você recebeu uma advertência por linguagem inadequada",
      time: "2 dias atrás",
      read: true,
      icon: AlertCircle,
      color: "text-red-500",
    },
    {
      id: 6,
      type: "offer",
      title: "Oferta especial!",
      message: "20% de desconto na loja oficial - válido até amanhã",
      time: "3 dias atrás",
      read: true,
      icon: Gift,
      color: "text-purple-500",
    },
  ])

  const markAsRead = (id: number) => {
    setNotifications(notifications.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, read: true })))
  }

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter((notif) => notif.id !== id))
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  const getNotificationsByType = (type: string) => {
    return notifications.filter((n) => n.type === type)
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
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">Notificações</h1>
            {unreadCount > 0 && <Badge className="bg-red-500 text-white">{unreadCount}</Badge>}
          </div>
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-white">
              <Settings className="h-6 w-6" />
            </Button>
          </Link>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Quick Actions */}
        {unreadCount > 0 && (
          <div className="flex gap-3">
            <Button onClick={markAllAsRead} size="sm" className="bg-[#28CA00] hover:bg-[#20A000] text-black">
              <CheckCircle className="h-4 w-4 mr-2" />
              Marcar todas como lidas
            </Button>
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-[#28CA00] data-[state=active]:text-black text-xs"
            >
              Todas ({notifications.length})
            </TabsTrigger>
            <TabsTrigger
              value="game"
              className="data-[state=active]:bg-[#28CA00] data-[state=active]:text-black text-xs"
            >
              Jogos
            </TabsTrigger>
            <TabsTrigger
              value="reward"
              className="data-[state=active]:bg-[#28CA00] data-[state=active]:text-black text-xs"
            >
              Recompensas
            </TabsTrigger>
            <TabsTrigger
              value="social"
              className="data-[state=active]:bg-[#28CA00] data-[state=active]:text-black text-xs"
            >
              Social
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-3">
            {notifications.length > 0 ? (
              notifications.map((notification) => {
                const IconComponent = notification.icon
                return (
                  <Card
                    key={notification.id}
                    className={`bg-gray-900 cursor-pointer transition-all ${
                      !notification.read ? "border-[#28CA00] bg-[#28CA00]/5" : "border-gray-800"
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full bg-gray-800`}>
                          <IconComponent className={`h-5 w-5 ${notification.color}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className={`font-medium ${!notification.read ? "text-white" : "text-gray-300"}`}>
                                {notification.title}
                              </h4>
                              <p className="text-sm text-gray-400 mt-1">{notification.message}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs text-gray-500">{notification.time}</span>
                                {!notification.read && <div className="w-2 h-2 bg-[#28CA00] rounded-full"></div>}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-gray-400 hover:text-red-400"
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteNotification(notification.id)
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            ) : (
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-8 text-center">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Nenhuma notificação</h3>
                  <p className="text-gray-400">Você está em dia com todas as suas notificações!</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="game" className="space-y-3">
            {getNotificationsByType("game").map((notification) => {
              const IconComponent = notification.icon
              return (
                <Card key={notification.id} className="bg-gray-900 border-gray-800">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-gray-800">
                        <IconComponent className={`h-5 w-5 ${notification.color}`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-white">{notification.title}</h4>
                        <p className="text-sm text-gray-400 mt-1">{notification.message}</p>
                        <span className="text-xs text-gray-500 mt-2 block">{notification.time}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </TabsContent>

          <TabsContent value="reward" className="space-y-3">
            {getNotificationsByType("reward").map((notification) => {
              const IconComponent = notification.icon
              return (
                <Card key={notification.id} className="bg-gray-900 border-gray-800">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-gray-800">
                        <IconComponent className={`h-5 w-5 ${notification.color}`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-white">{notification.title}</h4>
                        <p className="text-sm text-gray-400 mt-1">{notification.message}</p>
                        <span className="text-xs text-gray-500 mt-2 block">{notification.time}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </TabsContent>

          <TabsContent value="social" className="space-y-3">
            {getNotificationsByType("social").map((notification) => {
              const IconComponent = notification.icon
              return (
                <Card key={notification.id} className="bg-gray-900 border-gray-800">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-gray-800">
                        <IconComponent className={`h-5 w-5 ${notification.color}`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-white">{notification.title}</h4>
                        <p className="text-sm text-gray-400 mt-1">{notification.message}</p>
                        <span className="text-xs text-gray-500 mt-2 block">{notification.time}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
