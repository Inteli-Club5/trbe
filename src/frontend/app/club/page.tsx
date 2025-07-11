"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Menu, Users, Trophy, Calendar, MapPin, Star, ExternalLink, Heart, Share2, Filter, Shield, TrendingUp, Award, Activity } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import Link from "next/link"
import Image from "next/image"

export default function ClubPage() {
  const [activeView, setActiveView] = useState<"club" | "fangroup">("club")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const clubInfo = {
    name: "Chelsea Football Club",
    shortName: "Chelsea FC",
    founded: 1905,
    stadium: "Stamford Bridge",
    members: 12000000,
    colors: ["#003366", "#FFFFFF"],
  }

  const fanGroups = [
    {
      id: 1,
      name: "Blue Pride",
      members: 15420,
      description: "The largest organized supporter group of Chelsea FC, founded in 1998",
      ranking: 1,
      totalPoints: 2450000,
      isUserMember: true,
      founded: 1998,
      activities: ["Match attendance", "Social events", "Charity drives"],
      weeklyGrowth: 125,
      averageAge: 28,
      leadership: [
        { name: "Michael Thompson", role: "Leader", avatar: "/placeholder.svg?height=40&width=40" },
        { name: "Sarah Wilson", role: "Vice Leader", avatar: "/placeholder.svg?height=40&width=40" },
      ],
    },
    {
      id: 2,
      name: "Blue Army",
      members: 8350,
      description: "Tradition and celebration in the stands since 1985",
      ranking: 2,
      totalPoints: 1890000,
      isUserMember: false,
      founded: 1985,
      activities: ["Stadium chants", "Away travel", "Historical preservation"],
      weeklyGrowth: 89,
      averageAge: 35,
      leadership: [
        { name: "David Brown", role: "Leader", avatar: "/placeholder.svg?height=40&width=40" },
        { name: "Emma Davis", role: "Vice Leader", avatar: "/placeholder.svg?height=40&width=40" },
      ],
    },
    {
      id: 3,
      name: "Chelsea Faithful",
      members: 12100,
      description: "Passion and spirit in every game",
      ranking: 3,
      totalPoints: 1650000,
      isUserMember: false,
      founded: 2005,
      activities: ["Youth engagement", "Digital content", "Game analysis"],
      weeklyGrowth: 156,
      averageAge: 24,
      leadership: [
        { name: "James Wilson", role: "Leader", avatar: "/placeholder.svg?height=40&width=40" },
        { name: "Lisa Johnson", role: "Vice Leader", avatar: "/placeholder.svg?height=40&width=40" },
      ],
    },
  ]

  const nextGames = [
    {
      opponent: "Arsenal",
      date: "Today",
      time: "4:00 PM",
      stadium: "Stamford Bridge",
      championship: "Premier League",
      isHome: true,
    },
    {
      opponent: "Liverpool",
      date: "Sun, 15/12",
      time: "6:30 PM",
      stadium: "Anfield",
      championship: "Premier League",
      isHome: false,
    },
    {
      opponent: "Manchester City",
      date: "Wed, 18/12",
      time: "9:45 PM",
      stadium: "Stamford Bridge",
      championship: "Carabao Cup",
      isHome: true,
    },
  ]

  const recentNews = [
    {
      title: "Chelsea announces renewal with main sponsor",
      summary: "Three-season deal was officially announced today",
      time: "2 hours ago",
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      title: "Squad returns for 2025 pre-season",
      summary: "Players begin preparation for the new season",
      time: "5 hours ago",
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      title: "Derby tickets now on sale",
      summary: "Sales began today for season ticket holders",
      time: "Yesterday",
      image: "/placeholder.svg?height=60&width=60",
    },
  ]

  const topFans = [
    {
      name: "Michael Thompson",
      points: 45230,
      avatar: "/placeholder.svg?height=40&width=40",
      fanGroup: "Blue Pride",
      position: 1,
    },
    {
      name: "Sarah Wilson",
      points: 42180,
      avatar: "/placeholder.svg?height=40&width=40",
      fanGroup: "Blue Army",
      position: 2,
    },
    {
      name: "David Brown",
      points: 38950,
      avatar: "/placeholder.svg?height=40&width=40",
      fanGroup: "Chelsea Faithful",
      position: 3,
    },
  ]

  const fanGroupEvents = [
    {
      title: "Pre-match meetup vs Arsenal",
      fanGroup: "Blue Pride",
      date: "Today",
      time: "2:00 PM",
      location: "The Shed Pub",
      attendees: 45,
      type: "Social",
    },
    {
      title: "Away travel to Liverpool",
      fanGroup: "Blue Army",
      date: "Sun, 15/12",
      time: "10:00 AM",
      location: "Victoria Station",
      attendees: 120,
      type: "Travel",
    },
    {
      title: "Charity match preparation",
      fanGroup: "Chelsea Faithful",
      date: "Sat, 21/12",
      time: "11:00 AM",
      location: "Local pitch",
      attendees: 28,
      type: "Charity",
    },
  ]

  const userFanGroup = fanGroups.find(fg => fg.isUserMember)

  return (
    <div className="bg-white dark:bg-black text-gray-900 dark:text-white">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Header */}
      <header className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 p-4 shadow-sm dark:shadow-none">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            {activeView === "club" ? "My Club" : "Fan Group"}
          </h1>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              <Share2 className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      {/* Filter Toggle */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                      <Button
              variant={activeView === "club" ? "default" : "ghost"}
              className={`flex-1 ${
                activeView === "club"
                  ? "bg-[#28CA00] text-black hover:bg-[#20A000]"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
              onClick={() => setActiveView("club")}
            >
              <Shield className="h-4 w-4 mr-2" />
              Club
            </Button>
            <Button
              variant={activeView === "fangroup" ? "default" : "ghost"}
              className={`flex-1 ${
                activeView === "fangroup"
                  ? "bg-[#28CA00] text-black hover:bg-[#20A000]"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
              onClick={() => setActiveView("fangroup")}
            >
              <Users className="h-4 w-4 mr-2" />
              Fan Groups
            </Button>
        </div>
      </div>

      {/* Club View */}
      {activeView === "club" && (
        <div className="space-y-6">
          {/* Club Header */}
          <div className="relative">
            <div className="h-32 bg-gradient-to-r from-blue-900 to-blue-700"></div>
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-end gap-4">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">CFC</span>
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-white">{clubInfo.shortName}</h1>
                  <p className="text-sm text-gray-200">Founded in {clubInfo.founded}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-gray-300" />
                      <span className="text-sm text-gray-300">{(clubInfo.members / 1000000).toFixed(0)}M fans</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-gray-300" />
                      <span className="text-sm text-gray-300">{clubInfo.stadium}</span>
                    </div>
                  </div>
                </div>
                <Button className="bg-[#28CA00] hover:bg-[#20A000] text-black">
                  <Heart className="h-4 w-4 mr-2" />
                  Following
                </Button>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
                <CardContent className="p-4 text-center">
                  <Trophy className="h-6 w-6 text-[#28CA00] mx-auto mb-2" />
                  <div className="text-xl font-bold text-gray-900 dark:text-white">34</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Titles</div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
                <CardContent className="p-4 text-center">
                  <Users className="h-6 w-6 text-[#28CA00] mx-auto mb-2" />
                  <div className="text-xl font-bold text-gray-900 dark:text-white">35K</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">On TRIBE</div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
                <CardContent className="p-4 text-center">
                  <Star className="h-6 w-6 text-[#28CA00] mx-auto mb-2" />
                  <div className="text-xl font-bold text-gray-900 dark:text-white">#2</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Ranking</div>
                </CardContent>
              </Card>
            </div>

            {/* Club Tabs */}
            <Tabs defaultValue="games" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-gray-100 dark:bg-gray-800">
                <TabsTrigger
                  value="games"
                  className="data-[state=active]:bg-[#28CA00] data-[state=active]:text-black text-xs"
                >
                  Games
                </TabsTrigger>
                <TabsTrigger
                  value="fangroups"
                  className="data-[state=active]:bg-[#28CA00] data-[state=active]:text-black text-xs"
                >
                  Fan Groups
                </TabsTrigger>
                <TabsTrigger
                  value="news"
                  className="data-[state=active]:bg-[#28CA00] data-[state=active]:text-black text-xs"
                >
                  News
                </TabsTrigger>
                <TabsTrigger
                  value="ranking"
                  className="data-[state=active]:bg-[#28CA00] data-[state=active]:text-black text-xs"
                >
                  Top Fans
                </TabsTrigger>
              </TabsList>

              <TabsContent value="games" className="space-y-4">
                <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-[#28CA00]" />
                      Upcoming Games
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {nextGames.map((game, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="text-center">
                            <div className="text-sm font-semibold text-gray-900 dark:text-white">
                              {game.isHome ? clubInfo.shortName : game.opponent}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{game.isHome ? "Home" : "Away"}</div>
                          </div>
                          <div className="text-center px-2">
                            <div className="text-xs text-gray-500 dark:text-gray-400">vs</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-semibold text-gray-900 dark:text-white">
                              {game.isHome ? game.opponent : clubInfo.shortName}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{game.isHome ? "Away" : "Home"}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-gray-900 dark:text-white">
                            {game.date} • {game.time}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{game.stadium}</div>
                          <Badge className="mt-1 bg-blue-600 text-white text-xs">{game.championship}</Badge>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="fangroups" className="space-y-4">
                {fanGroups.map((fanGroup) => (
                  <Card
                    key={fanGroup.name}
                    className={`bg-white dark:bg-gray-900 ${fanGroup.isUserMember ? "border-[#28CA00]" : "border-gray-200 dark:border-gray-800"} shadow-sm`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white">{fanGroup.name}</h3>
                            {fanGroup.isUserMember && <Badge className="bg-[#28CA00] text-black text-xs">Member</Badge>}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{fanGroup.description}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                              <span className="text-gray-700 dark:text-gray-300">{fanGroup.members.toLocaleString()} members</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Trophy className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                              <span className="text-gray-700 dark:text-gray-300">#{fanGroup.ranking} in ranking</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-[#28CA00]">
                            {(fanGroup.totalPoints / 1000000).toFixed(1)}M
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">total points</div>
                        </div>
                      </div>
                      {!fanGroup.isUserMember && (
                        <Link href={`/fan-group/${fanGroup.ranking}`}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-[#28CA00] text-[#28CA00] hover:bg-[#28CA00] hover:text-black bg-transparent"
                          >
                            View Fan Group
                          </Button>
                        </Link>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="news" className="space-y-4">
                {recentNews.map((news, index) => (
                  <Card key={index} className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        <img
                          src={news.image || "/placeholder.svg"}
                          alt={news.title}
                          className="w-16 h-16 rounded-lg object-cover bg-gray-100 dark:bg-gray-800"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{news.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{news.summary}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 dark:text-gray-400">{news.time}</span>
                            <Button size="sm" variant="ghost" className="text-[#28CA00] hover:bg-[#28CA00]/10">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Read more
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="ranking" className="space-y-4">
                <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white">Top Fans of the Month</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                      The most engaged fans of {clubInfo.shortName}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {topFans.map((fan) => (
                      <div
                        key={fan.position}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 text-center">
                            <span className="text-lg font-bold text-[#28CA00]">#{fan.position}</span>
                          </div>
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={fan.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                              {fan.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">{fan.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{fan.fanGroup}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-[#28CA00]">{fan.points.toLocaleString()}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">points</div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}

      {/* Fan Group View */}
      {activeView === "fangroup" && (
        <div className="space-y-6">
          {/* User's Fan Group Header (if member) */}
          {userFanGroup && (
            <div className="relative">
              <div className="h-32 bg-gradient-to-r from-[#28CA00] to-green-700"></div>
              <div className="absolute inset-0 bg-black/30"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-end gap-4">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-[#28CA00]">BP</span>
                  </div>
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-white">{userFanGroup.name}</h1>
                    <p className="text-sm text-gray-200">Member since 2023</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-gray-300" />
                        <span className="text-sm text-gray-300">{userFanGroup.members.toLocaleString()} members</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Trophy className="h-4 w-4 text-gray-300" />
                        <span className="text-sm text-gray-300">#{userFanGroup.ranking} ranking</span>
                      </div>
                    </div>
                  </div>
                  <Button className="bg-white hover:bg-gray-100 text-gray-900">
                    <Activity className="h-4 w-4 mr-2" />
                    Active Member
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="p-4 space-y-6">
            {/* Fan Group Overview Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
                <CardContent className="p-4 text-center">
                  <Users className="h-6 w-6 text-[#28CA00] mx-auto mb-2" />
                  <div className="text-xl font-bold text-gray-900 dark:text-white">{fanGroups.length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Active Groups</div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="h-6 w-6 text-[#28CA00] mx-auto mb-2" />
                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                    +{fanGroups.reduce((total, fg) => total + fg.weeklyGrowth, 0)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">New Members/Week</div>
                </CardContent>
              </Card>
            </div>

            {/* Fan Groups Tabs */}
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-800">
              <TabsTrigger
                  value="events"
                  className="data-[state=active]:bg-[#28CA00] data-[state=active]:text-black text-xs"
                >
                  Events
                </TabsTrigger>
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-[#28CA00] data-[state=active]:text-black text-xs"
                >
                  All Groups
                </TabsTrigger>
                <TabsTrigger
                  value="rankings"
                  className="data-[state=active]:bg-[#28CA00] data-[state=active]:text-black text-xs"
                >
                  Rankings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {fanGroups.map((fanGroup) => (
                  <Card
                    key={fanGroup.id}
                    className={`bg-white dark:bg-gray-900 ${fanGroup.isUserMember ? "border-[#28CA00]" : "border-gray-200 dark:border-gray-800"} shadow-sm`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{fanGroup.name}</h3>
                            {fanGroup.isUserMember && <Badge className="bg-[#28CA00] text-black text-xs">Your Group</Badge>}
                            <Badge variant="outline" className="text-xs">#{fanGroup.ranking}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{fanGroup.description}</p>
                          
                          {/* Group Stats */}
                          <div className="grid grid-cols-3 gap-4 mb-3">
                            <div className="text-center">
                              <div className="text-lg font-bold text-gray-900 dark:text-white">{fanGroup.members.toLocaleString()}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">Members</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-[#28CA00]">+{fanGroup.weeklyGrowth}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">This Week</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-gray-900 dark:text-white">{fanGroup.averageAge}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">Avg Age</div>
                            </div>
                          </div>

                          {/* Leadership */}
                          <div className="mb-3">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Leadership</h4>
                            <div className="flex gap-2">
                              {fanGroup.leadership.map((leader, idx) => (
                                <div key={idx} className="flex items-center gap-1 text-xs">
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage src={leader.avatar} />
                                    <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs">
                                      {leader.name.split(" ").map((n) => n[0]).join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-gray-600 dark:text-gray-400">{leader.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Activities */}
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Main Activities</h4>
                            <div className="flex flex-wrap gap-1">
                              {fanGroup.activities.map((activity, idx) => (
                                <Badge key={idx} variant="secondary" className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs">
                                  {activity}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="text-right ml-4">
                          <div className="text-xl font-bold text-[#28CA00]">
                            {(fanGroup.totalPoints / 1000000).toFixed(1)}M
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">total points</div>
                          
                          {fanGroup.isUserMember ? (
                            <Button size="sm" className="bg-[#28CA00] hover:bg-[#20A000] text-black">
                              <Activity className="h-3 w-3 mr-1" />
                              Manage
                            </Button>
                          ) : (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-[#28CA00] text-[#28CA00] hover:bg-[#28CA00] hover:text-black"
                            >
                              Join Group
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="events" className="space-y-4">
                <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-[#28CA00]" />
                      Upcoming Fan Group Events
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {fanGroupEvents.map((event, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white">{event.title}</h4>
                            <Badge 
                              className={`text-xs ${
                                event.type === "Social" ? "bg-blue-600" :
                                event.type === "Travel" ? "bg-purple-600" :
                                "bg-green-600"
                              }`}
                            >
                              {event.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Organized by {event.fanGroup}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-700 dark:text-gray-300">
                            <span>{event.date} • {event.time}</span>
                            <span>{event.location}</span>
                            <span>{event.attendees} attending</span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="border-[#28CA00] text-[#28CA00] hover:bg-[#28CA00] hover:text-black">
                          Join Event
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="rankings" className="space-y-4">
                <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                      <Award className="h-5 w-5 text-[#28CA00]" />
                      Fan Group Rankings
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                      Based on total group points and member engagement
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {fanGroups
                      .sort((a, b) => a.ranking - b.ranking)
                      .map((fanGroup) => (
                        <div
                          key={fanGroup.id}
                          className={`flex items-center justify-between p-3 rounded-lg ${
                            fanGroup.isUserMember ? "bg-[#28CA00]/10 border border-[#28CA00]" : "bg-gray-50 dark:bg-gray-800"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 text-center">
                              <span className={`text-lg font-bold ${
                                fanGroup.ranking === 1 ? "text-yellow-500" :
                                fanGroup.ranking === 2 ? "text-gray-400" :
                                fanGroup.ranking === 3 ? "text-amber-600" :
                                "text-[#28CA00]"
                              }`}>
                                #{fanGroup.ranking}
                              </span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-gray-900 dark:text-white">{fanGroup.name}</h4>
                                {fanGroup.isUserMember && (
                                  <Badge className="bg-[#28CA00] text-black text-xs">Your Group</Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                <span>{fanGroup.members.toLocaleString()} members</span>
                                <span>Avg: {Math.round(fanGroup.totalPoints / fanGroup.members)} pts/member</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-[#28CA00]">
                              {(fanGroup.totalPoints / 1000000).toFixed(1)}M
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">total points</div>
                          </div>
                        </div>
                      ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  )
}
