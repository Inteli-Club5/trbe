"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sidebar } from "@/components/sidebar"
import {
  Menu,
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
  Users,
  Crown,
} from "lucide-react"
import Link from "next/link"

export default function TasksPage() {
  const [filter, setFilter] = useState("all")
  const [showFilterOptions, setShowFilterOptions] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const tasks = [
    {
      id: "daily-checkin",
      title: "Daily Check-in",
      description: "Check in at Stamford Bridge today",
      category: "presence",
      difficulty: "easy",
      tokens: 100,
      deadline: "Today",
      status: "available",
      icon: MapPin,
      progress: 0,
      maxProgress: 1,
    },
    {
      id: "share-post",
      title: "Share on Social Media",
      description: "Share a post about today's match",
      category: "social",
      difficulty: "easy",
      tokens: 50,
      deadline: "Today",
      status: "in_progress",
      icon: Share2,
      progress: 1,
      maxProgress: 3,
    },
    {
      id: "buy-merchandise",
      title: "Purchase Official Merchandise",
      description: "Buy any item from the official store",
      category: "purchase",
      difficulty: "medium",
      tokens: 200,
      deadline: "This week",
      status: "available",
      icon: ShoppingBag,
      progress: 0,
      maxProgress: 1,
    },
    {
      id: "invite-friends",
      title: "Invite 3 Friends",
      description: "Invite friends to join the fan community",
      category: "social",
      difficulty: "medium",
      tokens: 300,
      deadline: "This month",
      status: "in_progress",
      icon: Users,
      progress: 1,
      maxProgress: 3,
    },
    {
      id: "attend-away-game",
      title: "Attend Away Game",
      description: "Check in at an away match",
      category: "presence",
      difficulty: "hard",
      tokens: 500,
      deadline: "Next month",
      status: "available",
      icon: MapPin,
      progress: 0,
      maxProgress: 1,
    },
    {
      id: "premium-purchase",
      title: "Make Premium Purchase",
      description: "Purchase items worth £100 or more",
      category: "purchase",
      difficulty: "hard",
      tokens: 400,
      deadline: "No deadline",
      status: "completed",
      icon: Star,
      progress: 1,
      maxProgress: 1,
    },
    {
      id: "weekly-engagement",
      title: "7-Day Activity Streak",
      description: "Be active for 7 consecutive days",
      category: "engagement",
      difficulty: "medium",
      tokens: 250,
      deadline: "Ongoing",
      status: "in_progress",
      icon: Calendar,
      progress: 3,
      maxProgress: 7,
    },
    {
      id: "fan-group-leader",
      title: "Become Fan Group Leader",
      description: "Lead activities in your fan group",
      category: "engagement",
      difficulty: "hard",
      tokens: 600,
      deadline: "No deadline",
      status: "available",
      icon: Crown,
      progress: 0,
      maxProgress: 1,
    },
  ]

  const categories = [
    { id: "all", name: "All", count: tasks.length },
    { id: "presence", name: "Attendance", count: tasks.filter((t) => t.category === "presence").length },
    { id: "social", name: "Social", count: tasks.filter((t) => t.category === "social").length },
    { id: "purchase", name: "Purchases", count: tasks.filter((t) => t.category === "purchase").length },
    { id: "engagement", name: "Engagement", count: tasks.filter((t) => t.category === "engagement").length },
  ]

  const filteredTasks = filter === "all" ? tasks : tasks.filter((task) => task.category === filter)

  const handleFilterToggle = () => {
    setShowFilterOptions(!showFilterOptions)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-600"
      case "medium":
        return "bg-orange-500"
      case "hard":
        return "bg-red-600"
      default:
        return "bg-gray-600"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "border-gray-200 dark:border-gray-800"
      case "in_progress":
        return "border-[#28CA00]"
      case "completed":
        return "border-green-600 bg-green-50 dark:bg-green-900/20"
      default:
        return "border-gray-200 dark:border-gray-800"
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
    <div className="bg-white dark:bg-black text-gray-900 dark:text-white">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Header */}
      <header className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 p-4 shadow-sm dark:shadow-none">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Engagement Tasks</h1>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            onClick={handleFilterToggle}
          >
            <Filter className="h-6 w-6" />
          </Button>
        </div>
      </header>

      {/* Filter Options */}
      {showFilterOptions && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={filter === category.id ? "default" : "outline"}
                size="sm"
                className={`${
                  filter === category.id
                    ? "bg-[#28CA00] hover:bg-[#20A000] text-black"
                    : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
                onClick={() => setFilter(category.id)}
              >
                {category.name} ({category.count})
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 space-y-4">
        {/* Task Cards */}
        {filteredTasks.map((task) => {
          const IconComponent = task.icon
          const progressPercentage = (task.progress / task.maxProgress) * 100

          return (
            <Card
              key={task.id}
              className={`bg-white dark:bg-gray-900 border ${getStatusColor(task.status)} shadow-sm`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full ${
                    task.status === "completed" 
                      ? "bg-green-100 dark:bg-green-900/30" 
                      : task.status === "in_progress"
                      ? "bg-[#28CA00]/10 dark:bg-[#28CA00]/20"
                      : "bg-gray-100 dark:bg-gray-800"
                  }`}>
                    <IconComponent className={`h-6 w-6 ${
                      task.status === "completed"
                        ? "text-green-600 dark:text-green-400"
                        : task.status === "in_progress"
                        ? "text-[#28CA00]"
                        : "text-gray-400 dark:text-gray-500"
                    }`} />
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-semibold ${
                            task.status === "completed"
                              ? "text-gray-500 dark:text-gray-400 line-through"
                              : "text-gray-900 dark:text-white"
                          }`}>
                            {task.title}
                          </h3>
                          {getStatusIcon(task.status)}
                        </div>
                        <p className={`text-sm ${
                          task.status === "completed"
                            ? "text-gray-500 dark:text-gray-400"
                            : "text-gray-600 dark:text-gray-400"
                        }`}>
                          {task.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-[#28CA00]">+{task.tokens}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">tokens</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge className={getDifficultyColor(task.difficulty)}>
                        {task.difficulty}
                      </Badge>
                      <Badge variant="outline" className="text-xs border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400">
                        {task.deadline}
                      </Badge>
                    </div>

                    {task.status === "in_progress" && task.maxProgress > 1 && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600 dark:text-gray-400">Progress</span>
                          <span className="text-[#28CA00]">{task.progress}/{task.maxProgress}</span>
                        </div>
                        <Progress value={progressPercentage} className="h-2 bg-gray-200 dark:bg-gray-800">
                          <div
                            className="h-full bg-[#28CA00] rounded-full transition-all"
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </Progress>
                      </div>
                    )}

                    {task.status === "available" && (
                      <Button
                        size="sm"
                        className="bg-[#28CA00] hover:bg-[#20A000] text-black"
                      >
                        Start Task
                      </Button>
                    )}

                    {task.status === "in_progress" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-[#28CA00] text-[#28CA00] hover:bg-[#28CA00] hover:text-black"
                      >
                        Continue
                      </Button>
                    )}

                    {task.status === "completed" && (
                      <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Completed</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
