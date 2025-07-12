"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Trophy,
  MapPin,
  Share2,
  ShoppingBag,
  Star,
  Calendar,
  Users,
  Shield,
  Crown,
  Zap,
  Target,
  Heart,
  Award,
  Gem,
  Flame,
  Lock,
} from "lucide-react"
import Link from "next/link"

export default function BadgesPage() {
  const [filter, setFilter] = useState("all")

  // All available badges in the system
  const allBadges = [
    // Attendance Badges
    {
      id: "first-checkin",
      name: "First Steps",
      description: "Complete your first check-in",
      category: "attendance",
      rarity: "bronze",
      icon: "🎯",
      iconComponent: Target,
      requirement: "1 check-in",
      earned: true,
      progress: 1,
      maxProgress: 1,
      tokens: 100,
    },
    {
      id: "regular-attendee",
      name: "Regular Attendee",
      description: "Attend 5 consecutive games",
      category: "attendance",
      rarity: "silver",
      icon: "📅",
      iconComponent: Calendar,
      requirement: "5 consecutive games",
      earned: true,
      progress: 5,
      maxProgress: 5,
      tokens: 300,
    },
    {
      id: "loyal-fan",
      name: "Loyal Fan",
      description: "Attend 10 consecutive games",
      category: "attendance",
      rarity: "gold",
      icon: "🏆",
      iconComponent: Trophy,
      requirement: "10 consecutive games",
      earned: true,
      progress: 10,
      maxProgress: 10,
      tokens: 500,
    },
    {
      id: "die-hard",
      name: "Die Hard",
      description: "Attend 25 games in a season",
      category: "attendance",
      rarity: "platinum",
      icon: "💎",
      iconComponent: Gem,
      requirement: "25 games in season",
      earned: false,
      progress: 18,
      maxProgress: 25,
      tokens: 1000,
    },

    // Social Badges
    {
      id: "social-starter",
      name: "Social Starter",
      description: "Share your first post",
      category: "social",
      rarity: "bronze",
      icon: "📱",
      iconComponent: Share2,
      requirement: "1 social share",
      earned: true,
      progress: 1,
      maxProgress: 1,
      tokens: 50,
    },
    {
      id: "influencer",
      name: "Influencer",
      description: "Share 50 posts",
      category: "social",
      rarity: "silver",
      icon: "📢",
      iconComponent: Share2,
      requirement: "50 social shares",
      earned: true,
      progress: 50,
      maxProgress: 50,
      tokens: 250,
    },
    {
      id: "viral-sensation",
      name: "Viral Sensation",
      description: "Share 100 posts",
      category: "social",
      rarity: "gold",
      icon: "🔥",
      iconComponent: Flame,
      requirement: "100 social shares",
      earned: true,
      progress: 100,
      maxProgress: 100,
      tokens: 500,
    },
    {
      id: "social-legend",
      name: "Social Legend",
      description: "Share 500 posts",
      category: "social",
      rarity: "platinum",
      icon: "⭐",
      iconComponent: Star,
      requirement: "500 social shares",
      earned: false,
      progress: 234,
      maxProgress: 500,
      tokens: 1500,
    },

    // Shopping Badges
    {
      id: "first-purchase",
      name: "First Purchase",
      description: "Make your first store purchase",
      category: "shopping",
      rarity: "bronze",
      icon: "🛍️",
      iconComponent: ShoppingBag,
      requirement: "1 purchase",
      earned: true,
      progress: 1,
      maxProgress: 1,
      tokens: 100,
    },
    {
      id: "regular-shopper",
      name: "Regular Shopper",
      description: "Make 5 store purchases",
      category: "shopping",
      rarity: "silver",
      icon: "🛒",
      iconComponent: ShoppingBag,
      requirement: "5 purchases",
      earned: true,
      progress: 5,
      maxProgress: 5,
      tokens: 300,
    },
    {
      id: "big-spender",
      name: "Big Spender",
      description: "Spend £500 in the store",
      category: "shopping",
      rarity: "gold",
      icon: "💰",
      iconComponent: ShoppingBag,
      requirement: "£500 spent",
      earned: false,
      progress: 320,
      maxProgress: 500,
      tokens: 800,
    },

    // Engagement Badges
    {
      id: "week-streak",
      name: "Week Warrior",
      description: "Log in for 7 consecutive days",
      category: "engagement",
      rarity: "silver",
      icon: "⚡",
      iconComponent: Zap,
      requirement: "7 day streak",
      earned: true,
      progress: 7,
      maxProgress: 7,
      tokens: 200,
    },
    {
      id: "month-streak",
      name: "Monthly Master",
      description: "Log in for 30 consecutive days",
      category: "engagement",
      rarity: "gold",
      icon: "🎖️",
      iconComponent: Award,
      requirement: "30 day streak",
      earned: false,
      progress: 12,
      maxProgress: 30,
      tokens: 600,
    },
    {
      id: "year-veteran",
      name: "Veteran",
      description: "Be a member for 1 year",
      category: "engagement",
      rarity: "platinum",
      icon: "🏅",
      iconComponent: Crown,
      requirement: "1 year membership",
      earned: true,
      progress: 1,
      maxProgress: 1,
      tokens: 1000,
    },

    // Special Badges
    {
      id: "reputation-master",
      name: "Reputation Master",
      description: "Reach 900 reputation points",
      category: "special",
      rarity: "platinum",
      icon: "🛡️",
      iconComponent: Shield,
      requirement: "900 reputation",
      earned: false,
      progress: 850,
      maxProgress: 900,
      tokens: 1500,
    },
    {
      id: "community-leader",
      name: "Community Leader",
      description: "Help 50 other fans",
      category: "special",
      rarity: "gold",
      icon: "❤️",
      iconComponent: Heart,
      requirement: "Help 50 fans",
      earned: false,
      progress: 23,
      maxProgress: 50,
      tokens: 1000,
    },
    {
      id: "fan-group-founder",
      name: "Fan Group Founder",
      description: "Create a fan group with 100+ members",
      category: "special",
      rarity: "legendary",
      icon: "👑",
      iconComponent: Crown,
      requirement: "Create successful fan group",
      earned: false,
      progress: 0,
      maxProgress: 1,
      tokens: 2500,
    },
  ]

  const categories = [
    { id: "all", name: "All", count: allBadges.length },
    { id: "attendance", name: "Attendance", count: allBadges.filter(b => b.category === "attendance").length },
    { id: "social", name: "Social", count: allBadges.filter(b => b.category === "social").length },
    { id: "shopping", name: "Shopping", count: allBadges.filter(b => b.category === "shopping").length },
    { id: "engagement", name: "Engagement", count: allBadges.filter(b => b.category === "engagement").length },
    { id: "special", name: "Special", count: allBadges.filter(b => b.category === "special").length },
  ]

  const filteredBadges = filter === "all" ? allBadges : allBadges.filter(badge => badge.category === filter)
  const earnedBadges = allBadges.filter(badge => badge.earned)

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return "text-purple-400"
      case "platinum":
        return "text-cyan-400"
      case "gold":
        return "text-yellow-400"
      case "silver":
        return "text-gray-300"
      case "bronze":
        return "text-orange-400"
      default:
        return "text-gray-400"
    }
  }

  return (
    <div className="bg-white dark:bg-black text-gray-900 dark:text-white">
      {/* Header */}
      <header className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <Link href="/profile">
            <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Badge Collection</h1>
          <div className="w-10"></div>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Progress Summary */}
        <Card className="bg-black/10 dark:bg-white/20 border-black dark:border-white shadow-sm">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Trophy className="h-8 w-8 text-black dark:text-white" />
                <span className="text-lg font-semibold text-gray-900 dark:text-white">Badge Progress</span>
              </div>

              <div className="space-y-2">
                <div className="text-3xl font-bold text-black dark:text-white">{earnedBadges.length}/{allBadges.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Badges Earned</div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Collection Progress</span>
                  <span className="text-black dark:text-white">{Math.round((earnedBadges.length / allBadges.length) * 100)}%</span>
                </div>
                <Progress value={(earnedBadges.length / allBadges.length) * 100} className="h-3 bg-gray-200 dark:bg-gray-800">
                  <div
                    className="h-full bg-black dark:bg-white rounded-full transition-all"
                    style={{ width: `${(earnedBadges.length / allBadges.length) * 100}%` }}
                  />
                </Progress>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Filters */}
        <Tabs value={filter} onValueChange={setFilter} className="w-full">
          <TabsList className="grid w-full grid-cols-6 gap-2 bg-gray-100 dark:bg-gray-800 h-auto p-2">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-black dark:data-[state=active]:bg-white data-[state=active]:text-white dark:data-[state=active]:text-black text-sm py-2"
            >
              All ({allBadges.length})
            </TabsTrigger>
            <TabsTrigger
              value="attendance"
              className="data-[state=active]:bg-black dark:data-[state=active]:bg-white data-[state=active]:text-white dark:data-[state=active]:text-black text-sm py-2"
            >
              Attendance
            </TabsTrigger>
            <TabsTrigger
              value="social"
              className="data-[state=active]:bg-black dark:data-[state=active]:bg-white data-[state=active]:text-white dark:data-[state=active]:text-black text-sm py-2"
            >
              Social
            </TabsTrigger>
            <TabsTrigger
              value="shopping"
              className="data-[state=active]:bg-black dark:data-[state=active]:bg-white data-[state=active]:text-white dark:data-[state=active]:text-black text-sm py-2"
            >
              Shopping
            </TabsTrigger>
            <TabsTrigger
              value="engagement"
              className="data-[state=active]:bg-black dark:data-[state=active]:bg-white data-[state=active]:text-white dark:data-[state=active]:text-black text-sm py-2"
            >
              Engagement
            </TabsTrigger>
            <TabsTrigger
              value="special"
              className="data-[state=active]:bg-black dark:data-[state=active]:bg-white data-[state=active]:text-white dark:data-[state=active]:text-black text-sm py-2"
            >
              Special
            </TabsTrigger>
          </TabsList>

          {/* Badges Grid */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            {filteredBadges.map((badge) => {
              const IconComponent = badge.iconComponent
              const isLocked = !badge.earned
              const progressPercentage = badge.maxProgress > 1 ? (badge.progress / badge.maxProgress) * 100 : 0

              return (
                <Card
                  key={badge.id}
                  className={`bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm ${isLocked ? "opacity-75" : ""}`}
                >
                  <CardContent className="p-4 text-center">
                    {/* Lock overlay for unearned badges */}
                    {isLocked && (
                      <div className="absolute top-2 right-2">
                        <Lock className="h-4 w-4 text-gray-500" />
                      </div>
                    )}

                    {/* Badge Icon */}
                    <div className="mb-3">
                      <div className={`text-4xl ${isLocked ? "grayscale" : ""}`}>
                        {badge.icon}
                      </div>
                    </div>

                    {/* Badge Info */}
                    <h3 className={`font-semibold text-sm mb-1 ${isLocked ? "text-gray-400" : "text-gray-900 dark:text-white"}`}>
                      {badge.name}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      {badge.description}
                    </p>

                    {/* Rarity Badge */}
                    <Badge 
                      variant="outline" 
                      className={`text-xs mb-2 ${
                        isLocked ? "border-gray-300 dark:border-gray-600 text-gray-500" : `${getRarityColor(badge.rarity)} border-current`
                      }`}
                    >
                      {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
                    </Badge>

                    {/* Progress Bar for multi-step badges */}
                    {badge.maxProgress > 1 && (
                      <div className="space-y-1 mb-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600 dark:text-gray-400">Progress</span>
                          <span className={isLocked ? "text-gray-500" : "text-black dark:text-white"}>
                            {badge.progress}/{badge.maxProgress}
                          </span>
                        </div>
                        <Progress value={progressPercentage} className="h-1.5 bg-gray-200 dark:bg-gray-800">
                          <div
                            className={`h-full rounded-full transition-all ${
                              isLocked ? "bg-gray-400 dark:bg-gray-600" : "bg-black dark:bg-white"
                            }`}
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </Progress>
                      </div>
                    )}

                    {/* Tokens Reward */}
                    <div className="flex items-center justify-center gap-1">
                      <Trophy className={`h-3 w-3 ${isLocked ? "text-gray-500" : "text-black dark:text-white"}`} />
                      <span className={`text-xs font-medium ${isLocked ? "text-gray-500" : "text-black dark:text-white"}`}>
                        +{badge.tokens} tokens
                      </span>
                    </div>

                    {/* Requirements */}
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                      {badge.requirement}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </Tabs>
      </div>
    </div>
  )
} 