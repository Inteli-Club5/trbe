"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Menu, MapPin, Trophy, Users, Coins, Star, Calendar, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Sidebar } from "@/components/sidebar"
import Image from "next/image"
import { useTheme } from "@/components/theme-provider"

export default function HomePage() {
  const [notifications] = useState(3)
  const [userTokens] = useState(2450)
  const [userLevel] = useState(12)
  const [userRanking] = useState(156)
  const [levelProgress] = useState(75)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { theme } = useTheme()

  return (
    <div className="bg-white dark:bg-black text-gray-900 dark:text-white">
      {/* Header */}
      <header className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 p-4 shadow-sm dark:shadow-none">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <div className="flex items-center gap-2">
            <Image 
              src={theme === "light" ? "/logo-black.svg" : "/logo.svg"} 
              alt="TRBE" 
              width={100} 
              height={33} 
            />
          </div>
          <div className="w-10"></div>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* User Summary */}
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src="/placeholder.svg?height=48&width=48" />
                <AvatarFallback className="bg-black dark:bg-white text-white dark:text-black">JS</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">John Smith</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Chelsea FC • Blue Pride</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Level {userLevel}</span>
              <span className="text-sm text-black dark:text-white">{levelProgress}%</span>
            </div>
            <Progress value={levelProgress} className="h-2 bg-gray-200 dark:bg-gray-800">
              <div className="h-full bg-black dark:bg-white rounded-full" style={{ width: `${levelProgress}%` }} />
            </Progress>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Ranking: #{userRanking}</span>
              <span className="text-green-600 dark:text-green-400">+125 pts today</span>
            </div>
          </CardContent>
        </Card>

        {/* Next Game */}
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-black dark:text-white" />
              Next Game
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900 dark:text-white">Chelsea FC</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Home</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600 dark:text-gray-400">Today • 4:00 PM</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Stamford Bridge</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900 dark:text-white">Arsenal</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Away</div>
              </div>
            </div>
            <Link href="/check-in">
              <Button className="w-full mt-4 bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black">
                <MapPin className="h-4 w-4 mr-2" />
                Check In
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Active Challenges */}
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
              <Trophy className="h-5 w-5 text-black dark:text-white" />
              Active Challenges
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white">Weekly Attendance</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Attend 2 games this week</p>
                <Progress value={50} className="h-1 mt-2 bg-gray-200 dark:bg-gray-700">
                  <div className="h-full bg-black dark:bg-white rounded-full" style={{ width: "50%" }} />
                </Progress>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-green-600 dark:text-green-400">+500</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">tokens</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white">Social Engagement</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Share 5 club posts</p>
                <Progress value={80} className="h-1 mt-2 bg-gray-200 dark:bg-gray-700">
                  <div className="h-full bg-black dark:bg-white rounded-full" style={{ width: "80%" }} />
                </Progress>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-green-600 dark:text-green-400">+300</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">tokens</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
              <Star className="h-5 w-5 text-black dark:text-white" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-2">
              <CheckCircle className="h-5 w-5 text-black dark:text-white" />
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-white">Check-in at Stamford Bridge</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
              </div>
              <div className="text-sm font-semibold text-green-600 dark:text-green-400">+200</div>
            </div>

            <div className="flex items-center gap-3 p-2">
              <CheckCircle className="h-5 w-5 text-black dark:text-white" />
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-white">Post shared</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Yesterday</p>
              </div>
              <div className="text-sm font-semibold text-green-600 dark:text-green-400">+50</div>
            </div>

            <div className="flex items-center gap-3 p-2">
              <CheckCircle className="h-5 w-5 text-black dark:text-white" />
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-white">Official store purchase</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">2 days ago</p>
              </div>
              <div className="text-sm font-semibold text-green-600 dark:text-green-400">+150</div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/tasks">
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer shadow-sm">
              <CardContent className="p-4 text-center">
                <Trophy className="h-8 w-8 text-black dark:text-white mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900 dark:text-white">Tasks</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/ranking">
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer shadow-sm">
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 text-black dark:text-white mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900 dark:text-white">Rankings</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  )
}
