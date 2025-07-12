"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Trophy, Medal, Award, Crown, TrendingUp, TrendingDown, Minus, Users } from "lucide-react"
import Link from "next/link"

export default function RankingPage() {
  const [period, setPeriod] = useState("monthly")
  const [rankingType, setRankingType] = useState("general")

  const currentUser = {
    id: "current",
    name: "John Smith",
    position: 156,
    points: 15420,
    change: 12,
    avatar: "/placeholder.svg?height=40&width=40",
    club: "Chelsea FC",
    fanGroup: "Blue Pride",
  }

  const topUsers = [
    {
      id: 1,
      name: "Michael Thompson",
      position: 1,
      points: 45230,
      change: 0,
      avatar: "/placeholder.svg?height=40&width=40",
      club: "Chelsea FC",
      fanGroup: "Blue Pride",
      badges: ["👑", "🏆", "⭐"],
    },
    {
      id: 2,
      name: "Sarah Wilson",
      position: 2,
      points: 42180,
      change: 1,
      avatar: "/placeholder.svg?height=40&width=40",
      club: "Chelsea FC",
      fanGroup: "Blue Army",
      badges: ["🥈", "🔥", "⚡"],
    },
    {
      id: 3,
      name: "David Brown",
      position: 3,
      points: 38950,
      change: -1,
      avatar: "/placeholder.svg?height=40&width=40",
      club: "Chelsea FC",
      fanGroup: "Chelsea Faithful",
      badges: ["🥉", "💪", "🎯"],
    },
  ]

  const nearbyUsers = [
    {
      id: 154,
      name: "Emma Davis",
      position: 154,
      points: 15680,
      change: 3,
      avatar: "/placeholder.svg?height=40&width=40",
      club: "Chelsea FC",
      fanGroup: "Independent",
    },
    {
      id: 155,
      name: "James Miller",
      position: 155,
      points: 15550,
      change: -2,
      avatar: "/placeholder.svg?height=40&width=40",
      club: "Chelsea FC",
      fanGroup: "Blue Pride",
    },
    currentUser,
    {
      id: 157,
      name: "Robert Wilson",
      position: 157,
      points: 15320,
      change: 5,
      avatar: "/placeholder.svg?height=40&width=40",
      club: "Chelsea FC",
      fanGroup: "Blue Army",
    },
    {
      id: 158,
      name: "Alice Johnson",
      position: 158,
      points: 15180,
      change: -1,
      avatar: "/placeholder.svg?height=40&width=40",
      club: "Chelsea FC",
      fanGroup: "Independent",
    },
  ]

  const fanGroupRanking = [
    {
      name: "Blue Pride",
      members: 15420,
      totalPoints: 2450000,
      avgPoints: 159,
      position: 1,
      change: 0,
    },
    {
      name: "Blue Army",
      members: 8350,
      totalPoints: 1890000,
      avgPoints: 226,
      position: 2,
      change: 1,
    },
    {
      name: "Chelsea Faithful",
      members: 12100,
      totalPoints: 1650000,
      avgPoints: 136,
      position: 3,
      change: -1,
    },
  ]

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />
      case 3:
        return <Award className="h-6 w-6 text-orange-500" />
      default:
        return <span className="text-lg font-bold text-gray-500 dark:text-gray-400">#{position}</span>
    }
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-black dark:text-white" />
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-500" />
    return <Minus className="h-4 w-4 text-gray-400" />
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-black dark:text-white"
    if (change < 0) return "text-red-500"
    return "text-gray-400"
  }

  return (
    <div className="bg-white dark:bg-black text-gray-900 dark:text-white">
      {/* Header */}
      <header className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 p-4 shadow-sm dark:shadow-none">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Rankings</h1>
          <div></div>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Filters */}
        <div className="grid grid-cols-2 gap-4">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <SelectItem value="weekly" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
                Weekly
              </SelectItem>
              <SelectItem value="monthly" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
                Monthly
              </SelectItem>
              <SelectItem value="yearly" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
                Annual
              </SelectItem>
              <SelectItem value="all-time" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
                All Time
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={rankingType} onValueChange={setRankingType}>
            <SelectTrigger className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <SelectItem value="general" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
                General
              </SelectItem>
              <SelectItem value="fan-groups" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
                Fan Groups
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Current User Position */}
        <Card className="bg-black/10 dark:bg-white/20 border-black dark:border-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={currentUser.avatar} />
                  <AvatarFallback className="bg-black dark:bg-white text-white dark:text-black">
                    {currentUser.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{currentUser.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{currentUser.club} • {currentUser.fanGroup}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-black dark:text-white">#{currentUser.position}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{currentUser.points.toLocaleString()} pts</div>
                <div className={`text-xs ${getChangeColor(currentUser.change)}`}>
                  {currentUser.change > 0 ? "+" : ""}{currentUser.change}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="top" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-800">
            <TabsTrigger value="top" className="data-[state=active]:bg-black dark:data-[state=active]:bg-white data-[state=active]:text-white dark:data-[state=active]:text-black">
              Top 3
            </TabsTrigger>
            <TabsTrigger value="nearby" className="data-[state=active]:bg-black dark:data-[state=active]:bg-white data-[state=active]:text-white dark:data-[state=active]:text-black">
              Nearby
            </TabsTrigger>
            <TabsTrigger value="groups" className="data-[state=active]:bg-black dark:data-[state=active]:bg-white data-[state=active]:text-white dark:data-[state=active]:text-black">
              Groups
            </TabsTrigger>
          </TabsList>

          <TabsContent value="top" className="space-y-3">
            {topUsers.map((user) => (
              <Card key={user.id} className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {getPositionIcon(user.position)}
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                            {user.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{user.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{user.club} • {user.fanGroup}</p>
                        <div className="flex gap-1 mt-1">
                          {user.badges?.map((badge, index) => (
                            <span key={index} className="text-sm">{badge}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-black dark:text-white">{user.points.toLocaleString()}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">points</div>
                      <div className={`text-xs ${getChangeColor(user.change)}`}>
                        {user.change > 0 ? "+" : ""}{user.change}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="nearby" className="space-y-3">
            {nearbyUsers.map((user) => (
              <Card 
                key={user.id} 
                className={`bg-white dark:bg-gray-900 border shadow-sm ${
                  user.id === "current" 
                    ? "border-black dark:border-white bg-black/5 dark:bg-white/10" 
                    : "border-gray-200 dark:border-gray-800"
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-500 dark:text-gray-400">#{user.position}</span>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                            {user.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{user.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{user.club} • {user.fanGroup}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-black dark:text-white">{user.points.toLocaleString()}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">points</div>
                      <div className={`text-xs ${getChangeColor(user.change)}`}>
                        {user.change > 0 ? "+" : ""}{user.change}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="groups" className="space-y-3">
            {fanGroupRanking.map((group) => (
              <Card key={group.name} className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {getPositionIcon(group.position)}
                        <div className="p-2 bg-black/10 dark:bg-white/20 rounded-full">
                          <Users className="h-5 w-5 text-black dark:text-white" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{group.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{group.members.toLocaleString()} members</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-black dark:text-white">{group.totalPoints.toLocaleString()}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">total points</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Avg: {group.avgPoints} pts/member</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
