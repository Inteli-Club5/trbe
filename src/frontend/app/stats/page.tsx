"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  MapPin,
  Trophy,
  Users,
  Coins,
  Star,
  Target,
  Award,
  BarChart3,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function StatsPage() {
  const [period, setPeriod] = useState("monthly")

  const overallStats = {
    totalTokens: 15420,
    gamesAttended: 28,
    activitiesCompleted: 156,
    currentLevel: 12,
    reputationScore: 850,
    rankingPosition: 156,
    daysActive: 89,
    socialShares: 45,
  }

  const monthlyData = [
    { month: "Jul", tokens: 1200, activities: 12, games: 3 },
    { month: "Aug", tokens: 1450, activities: 15, games: 4 },
    { month: "Sep", tokens: 1680, activities: 18, games: 2 },
    { month: "Oct", tokens: 1320, activities: 14, games: 3 },
    { month: "Nov", tokens: 1890, activities: 21, games: 5 },
    { month: "Dec", tokens: 2100, activities: 19, games: 4 },
  ]

  const achievements = [
    {
      title: "Check-in Streak",
      current: 12,
      best: 25,
      unit: "days",
      progress: 48,
      icon: MapPin,
    },
    {
      title: "Tokens per Month",
      current: 2100,
      best: 2500,
      unit: "tokens",
      progress: 84,
      icon: Coins,
    },
    {
      title: "Activities Completed",
      current: 19,
      best: 25,
      unit: "activities",
      progress: 76,
      icon: Target,
    },
    {
      title: "Social Engagement",
      current: 8,
      best: 15,
      unit: "posts",
      progress: 53,
      icon: Star,
    },
  ]

  const comparisons = [
    {
      metric: "Tokens Earned",
      myValue: 2100,
      avgValue: 1650,
      percentile: 78,
      trend: "up",
    },
    {
      metric: "Games Attended",
      myValue: 4,
      avgValue: 3.2,
      percentile: 65,
      trend: "up",
    },
    {
      metric: "Activities/Month",
      myValue: 19,
      avgValue: 22,
      percentile: 45,
      trend: "down",
    },
    {
      metric: "Reputation",
      myValue: 850,
      avgValue: 720,
      percentile: 82,
      trend: "up",
    },
  ]

  const getTrendIcon = (trend: string) => {
    return trend === "up" ? (
      <TrendingUp className="h-4 w-4 text-black dark:text-white" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    )
  }

  const getTrendColor = (trend: string) => {
    return trend === "up" ? "text-black dark:text-white" : "text-red-500"
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
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Statistics</h1>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-32 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <SelectItem value="weekly" className="text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700">
                Weekly
              </SelectItem>
              <SelectItem value="monthly" className="text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700">
                Monthly
              </SelectItem>
              <SelectItem value="yearly" className="text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700">
                Annual
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
            <CardContent className="p-4 text-center">
              <Coins className="h-8 w-8 text-black dark:text-white mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{overallStats.totalTokens.toLocaleString()}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Tokens</div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
            <CardContent className="p-4 text-center">
              <Trophy className="h-8 w-8 text-black dark:text-white mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">#{overallStats.rankingPosition}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Ranking Position</div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
            <CardContent className="p-4 text-center">
              <MapPin className="h-8 w-8 text-black dark:text-white mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{overallStats.gamesAttended}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Games Attended</div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
            <CardContent className="p-4 text-center">
              <Star className="h-8 w-8 text-black dark:text-white mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{overallStats.reputationScore}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Reputation</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="progress" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-800">
            <TabsTrigger value="progress" className="data-[state=active]:bg-black dark:data-[state=active]:bg-white data-[state=active]:text-white dark:data-[state=active]:text-black">
              Progress
            </TabsTrigger>
            <TabsTrigger value="comparison" className="data-[state=active]:bg-black dark:data-[state=active]:bg-white data-[state=active]:text-white dark:data-[state=active]:text-black">
              Comparison
            </TabsTrigger>
            <TabsTrigger value="trends" className="data-[state=active]:bg-black dark:data-[state=active]:bg-white data-[state=active]:text-white dark:data-[state=active]:text-black">
              Trends
            </TabsTrigger>
          </TabsList>

          <TabsContent value="progress" className="space-y-4">
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <Target className="h-5 w-5 text-black dark:text-white" />
                  Personal Goals
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">Your progress against your personal records</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {achievements.map((achievement, index) => {
                  const IconComponent = achievement.icon
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <IconComponent className="h-4 w-4 text-black dark:text-white" />
                          <span className="text-gray-900 dark:text-white font-medium">{achievement.title}</span>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {achievement.current}/{achievement.best} {achievement.unit}
                        </span>
                      </div>
                      <Progress value={achievement.progress} className="h-2 bg-gray-200 dark:bg-gray-800">
                        <div
                          className="h-full bg-black dark:bg-white rounded-full"
                          style={{ width: `${achievement.progress}%` }}
                        />
                      </Progress>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-4">
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <Users className="h-5 w-5 text-black dark:text-white" />
                  Comparison with Other Supporters
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">How you compare to the community average</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {comparisons.map((comparison, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">{comparison.metric}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          You: {comparison.myValue.toLocaleString()} | Avg: {comparison.avgValue.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        {getTrendIcon(comparison.trend)}
                        <span className={`text-sm font-semibold ${getTrendColor(comparison.trend)}`}>
                          {comparison.percentile}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-black dark:text-white" />
                  Monthly Evolution
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">Your performance over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyData.map((data, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="font-medium text-gray-900 dark:text-white">{data.month}</div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-center">
                          <div className="text-black dark:text-white font-semibold">{data.tokens}</div>
                          <div className="text-gray-600 dark:text-gray-400">tokens</div>
                        </div>
                        <div className="text-center">
                          <div className="text-blue-400 font-semibold">{data.activities}</div>
                          <div className="text-gray-600 dark:text-gray-400">activities</div>
                        </div>
                        <div className="text-center">
                          <div className="text-purple-400 font-semibold">{data.games}</div>
                          <div className="text-gray-600 dark:text-gray-400">games</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

           
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
