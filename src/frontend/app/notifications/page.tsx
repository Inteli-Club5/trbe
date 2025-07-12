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
      title: "Game starting in 1 hour!",
      message: "Chelsea vs Arsenal at Stamford Bridge at 4:00 PM",
      time: "45 min ago",
      read: false,
      icon: MapPin,
      color: "text-black dark:text-white",
    },
    {
      id: 2,
      type: "reward",
      title: "Tokens received!",
      message: "You earned 200 tokens for stadium check-in",
      time: "2 hours ago",
      read: false,
      icon: Trophy,
      color: "text-black dark:text-white",
    },
    {
      id: 3,
      type: "social",
      title: "New mention",
      message: "Michael Thompson mentioned you in a comment",
      time: "3 hours ago",
      read: true,
      icon: Users,
      color: "text-black dark:text-white",
    },
    {
      id: 4,
      type: "challenge",
      title: "Challenge completed!",
      message: "Congratulations! You completed the 'Weekly Attendance' challenge",
      time: "Yesterday",
      read: true,
      icon: CheckCircle,
      color: "text-black dark:text-white",
    },
    {
      id: 5,
      type: "warning",
      title: "Warning issued",
      message: "You received a warning for inappropriate language",
      time: "2 days ago",
      read: true,
      icon: AlertCircle,
      color: "text-black dark:text-white",
    },
    {
      id: 6,
      type: "offer",
      title: "Special offer!",
      message: "20% discount at official store - valid until tomorrow",
      time: "3 days ago",
      read: true,
      icon: Gift,
      color: "text-black dark:text-white",
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
    <div className="bg-white dark:bg-black text-gray-900 dark:text-white">
      {/* Header */}
      <header className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Notifications</h1>
            {unreadCount > 0 && <Badge className="bg-red-500 text-white">{unreadCount}</Badge>}
          </div>
          <Link href="/settings">
            <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              <Settings className="h-6 w-6" />
            </Button>
          </Link>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Quick Actions */}
        {unreadCount > 0 && (
          <div className="flex gap-3">
            <Button onClick={markAllAsRead} size="sm" className="bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black">
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark all as read
            </Button>
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-100 dark:bg-gray-800">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-black dark:data-[state=active]:bg-white data-[state=active]:text-white dark:data-[state=active]:text-black text-xs"
            >
              All ({notifications.length})
            </TabsTrigger>
            <TabsTrigger
              value="game"
              className="data-[state=active]:bg-black dark:data-[state=active]:bg-white data-[state=active]:text-white dark:data-[state=active]:text-black text-xs"
            >
              Games
            </TabsTrigger>
            <TabsTrigger
              value="reward"
              className="data-[state=active]:bg-black dark:data-[state=active]:bg-white data-[state=active]:text-white dark:data-[state=active]:text-black text-xs"
            >
              Rewards
            </TabsTrigger>
            <TabsTrigger
              value="social"
              className="data-[state=active]:bg-black dark:data-[state=active]:bg-white data-[state=active]:text-white dark:data-[state=active]:text-black text-xs"
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
                    className={`bg-white dark:bg-gray-900 border shadow-sm ${
                      !notification.read ? "border-black dark:border-white bg-black/5 dark:bg-white/5" : "border-gray-200 dark:border-gray-800"
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full bg-gray-100 dark:bg-gray-800`}>
                          <IconComponent className={`h-5 w-5 ${notification.color}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className={`font-medium ${!notification.read ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400"}`}>
                                {notification.title}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{notification.message}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs text-gray-500">{notification.time}</span>
                                {!notification.read && <div className="w-2 h-2 bg-black dark:bg-white rounded-full"></div>}
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
                  <h3 className="text-lg font-semibold text-white mb-2">No notifications</h3>
                  <p className="text-gray-400">You're all caught up with your notifications!</p>
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
