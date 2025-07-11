"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sidebar } from "@/components/sidebar"
import { Menu, Settings, MapPin, TrendingUp, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const userStats = {
    totalTokens: 15420,
    level: 12,
    gamesAttended: 28,
    activitiesCompleted: 156,
    currentRanking: 156,
    memberSince: "January 2024",
  }

  const badges = [
    { name: "Loyal Fan", description: "10 consecutive games", icon: "🏆", rarity: "gold" },
    { name: "Social Media", description: "100 posts shared", icon: "📱", rarity: "silver" },
    { name: "First Timer", description: "First check-in", icon: "🎯", rarity: "bronze" },
    { name: "Shopper", description: "5 store purchases", icon: "🛍️", rarity: "silver" },
    { name: "Veteran", description: "1 year in app", icon: "⭐", rarity: "gold" },
    { name: "Engaged", description: "500 activities", icon: "🔥", rarity: "platinum" },
  ]

  const recentActivities = [
    { type: "check-in", description: "Check-in at Stamford Bridge", tokens: 200, date: "2 hours ago" },
    { type: "social", description: "Post shared", tokens: 50, date: "Yesterday" },
    { type: "purchase", description: "Official store purchase", tokens: 150, date: "2 days ago" },
    { type: "event", description: "Event participation", tokens: 300, date: "3 days ago" },
    { type: "challenge", description: "Challenge completed", tokens: 100, date: "1 week ago" },
  ]

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "platinum":
        return "text-cyan-600 bg-cyan-50 dark:bg-cyan-900/20 border-cyan-200 dark:border-cyan-700"
      case "gold":
        return "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700"
      case "silver":
        return "text-gray-600 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
      case "bronze":
        return "text-orange-600 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700"
      default:
        return "text-gray-600 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
    }
  }

  return (
    <div className="bg-white dark:bg-black text-gray-900 dark:text-white">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Header */}
      <header className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 p-4 shadow-sm dark:shadow-none">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">My Profile</h1>
          <Link href="/settings">
            <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              <Settings className="h-6 w-6" />
            </Button>
          </Link>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Profile Header */}
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="/placeholder.svg?height=80&width=80" />
                <AvatarFallback className="bg-[#28CA00] text-black text-xl">JS</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">John Smith</h2>
                <p className="text-gray-600 dark:text-gray-400">@johnsmith</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-blue-600 text-white">Chelsea FC</Badge>
                  <Badge variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                    Blue Pride
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Level {userStats.level}</span>
                <span className="text-sm text-[#28CA00]">75% to next level</span>
              </div>
              <Progress value={75} className="h-2 bg-gray-200 dark:bg-gray-800">
                <div className="h-full bg-[#28CA00] rounded-full" style={{ width: "75%" }} />
              </Progress>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#28CA00]">{userStats.totalTokens.toLocaleString()}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Tokens</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#28CA00]">#{userStats.currentRanking}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Overall Ranking</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
            <CardContent className="p-4 text-center">
              <MapPin className="h-8 w-8 text-[#28CA00] mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{userStats.gamesAttended}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Games Attended</div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-8 w-8 text-[#28CA00] mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{userStats.activitiesCompleted}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Activities</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="badges" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-800">
            <TabsTrigger value="badges" className="data-[state=active]:bg-[#28CA00] data-[state=active]:text-black">
              Badges
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-[#28CA00] data-[state=active]:text-black">
              History
            </TabsTrigger>
            <TabsTrigger value="stats" className="data-[state=active]:bg-[#28CA00] data-[state=active]:text-black">
              Statistics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="badges" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-gray-900 dark:text-white font-semibold">Recent Badges</h3>
              <Link href="/badges">
                <Button variant="outline" size="sm" className="border-[#28CA00] text-[#28CA00] bg-transparent hover:bg-[#28CA00] hover:text-black">
                  View All Badges
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {badges.map((badge, index) => (
                <Card key={index} className={`bg-white dark:bg-gray-900 border ${getRarityColor(badge.rarity)} shadow-sm`}>
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl mb-2">{badge.icon}</div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{badge.name}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{badge.description}</p>
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
              <Card key={index} className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#28CA00]/10 dark:bg-[#28CA00]/20 rounded-full">
                        <CheckCircle className="h-4 w-4 text-[#28CA00]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.description}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{activity.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-[#28CA00]">+{activity.tokens}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">tokens</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[#28CA00]" />
                  Activity Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-[#28CA00]">28</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Games Attended</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-[#28CA00]">156</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Activities Completed</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-[#28CA00]">12</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Badges Earned</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-[#28CA00]">156</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Days Active</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
