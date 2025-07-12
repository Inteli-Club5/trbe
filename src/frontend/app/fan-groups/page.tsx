"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sidebar } from "@/components/sidebar"
import {
  Menu,
  Search,
  Users,
  MapPin,
  Calendar,
  Trophy,
  Star,
  Heart,
  Crown,
  Shield,
  TrendingUp,
  Filter,
  SortAsc,
  SortDesc,
  Eye,
  Plus,
  Award,
  Target,
  Zap,
} from "lucide-react"
import Link from "next/link"

export default function FanGroupsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("members")
  const [sortOrder, setSortOrder] = useState("desc")

  // Sample fan groups data
  const fanGroups = [
    {
      id: "blue-pride",
      name: "Blue Pride",
      description: "The official Chelsea FC supporters group. We bleed blue!",
      team: "Chelsea FC",
      location: "London, UK",
      members: 15420,
      founded: "2010",
      category: "official",
      level: "exemplary",
      tags: ["Official", "London", "Premier League"],
      recentActivity: "2 hours ago",
      upcomingEvents: 3,
      achievements: [
        { name: "Best Fan Group 2023", icon: Trophy },
        { name: "Community Award", icon: Award },
        { name: "Loyalty Badge", icon: Heart }
      ],
      stats: {
        totalEvents: 156,
        totalTokens: 1250000,
        averageAttendance: 89,
        activeMembers: 12450
      }
    },
    {
      id: "red-devils-united",
      name: "Red Devils United",
      description: "Manchester United's most passionate supporters. Glory Glory Man United!",
      team: "Manchester United",
      location: "Manchester, UK",
      members: 12850,
      founded: "2008",
      category: "official",
      level: "exemplary",
      tags: ["Official", "Manchester", "Premier League"],
      recentActivity: "1 hour ago",
      upcomingEvents: 2,
      achievements: [
        { name: "Fan Group of the Year", icon: Crown },
        { name: "Community Service", icon: Shield }
      ],
      stats: {
        totalEvents: 142,
        totalTokens: 980000,
        averageAttendance: 87,
        activeMembers: 10200
      }
    },
    {
      id: "kop-kings",
      name: "Kop Kings",
      description: "Liverpool FC supporters from the heart of the Kop. You'll Never Walk Alone!",
      team: "Liverpool FC",
      location: "Liverpool, UK",
      members: 11200,
      founded: "2012",
      category: "official",
      level: "commendable",
      tags: ["Official", "Liverpool", "Premier League"],
      recentActivity: "30 minutes ago",
      upcomingEvents: 1,
      achievements: [
        { name: "Loyalty Award", icon: Heart },
        { name: "Community Impact", icon: Award }
      ],
      stats: {
        totalEvents: 98,
        totalTokens: 750000,
        averageAttendance: 92,
        activeMembers: 8900
      }
    },
    {
      id: "gunners-army",
      name: "Gunners Army",
      description: "Arsenal FC supporters united. Come on you Gunners!",
      team: "Arsenal FC",
      location: "London, UK",
      members: 9800,
      founded: "2015",
      category: "official",
      level: "commendable",
      tags: ["Official", "London", "Premier League"],
      recentActivity: "45 minutes ago",
      upcomingEvents: 2,
      achievements: [
        { name: "Rising Star", icon: Star },
        { name: "Community Builder", icon: Users }
      ],
      stats: {
        totalEvents: 76,
        totalTokens: 520000,
        averageAttendance: 85,
        activeMembers: 7200
      }
    },
    {
      id: "cityzens",
      name: "Cityzens",
      description: "Manchester City supporters group. Blue Moon rising!",
      team: "Manchester City",
      location: "Manchester, UK",
      members: 8900,
      founded: "2017",
      category: "official",
      level: "respectable",
      tags: ["Official", "Manchester", "Premier League"],
      recentActivity: "1 hour ago",
      upcomingEvents: 1,
      achievements: [
        { name: "Newcomer Award", icon: Star }
      ],
      stats: {
        totalEvents: 54,
        totalTokens: 380000,
        averageAttendance: 82,
        activeMembers: 6500
      }
    },
    {
      id: "spurs-legion",
      name: "Spurs Legion",
      description: "Tottenham Hotspur supporters. To Dare Is To Do!",
      team: "Tottenham Hotspur",
      location: "London, UK",
      members: 7200,
      founded: "2019",
      category: "official",
      level: "respectable",
      tags: ["Official", "London", "Premier League"],
      recentActivity: "2 hours ago",
      upcomingEvents: 0,
      achievements: [],
      stats: {
        totalEvents: 32,
        totalTokens: 210000,
        averageAttendance: 78,
        activeMembers: 4800
      }
    }
  ]

  const getLevelColor = (level: string) => {
    switch (level) {
      case "exemplary":
        return "text-black dark:text-white bg-black/10 dark:bg-white/20 border-black dark:border-white"
      case "commendable":
        return "text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700"
      case "respectable":
        return "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700"
      default:
        return "text-gray-600 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
    }
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "exemplary":
        return Crown
      case "commendable":
        return Star
      case "respectable":
        return Shield
      default:
        return Users
    }
  }

  const filteredGroups = fanGroups
    .filter(group => 
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.location.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      let aValue, bValue
      switch (sortBy) {
        case "members":
          aValue = a.members
          bValue = b.members
          break
        case "founded":
          aValue = parseInt(a.founded)
          bValue = parseInt(b.founded)
          break
        case "events":
          aValue = a.stats.totalEvents
          bValue = b.stats.totalEvents
          break
        default:
          aValue = a.members
          bValue = b.members
      }
      return sortOrder === "desc" ? bValue - aValue : aValue - bValue
    })

  return (
    <div className="bg-white dark:bg-black text-gray-900 dark:text-white">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Header */}
      <header className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 p-4 shadow-sm dark:shadow-none">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Fan Groups</h1>
          <Button size="sm" className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200">
            <Plus className="h-4 w-4 mr-2" />
            Create Group
          </Button>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Search and Filters */}
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search fan groups..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm"
                >
                  <option value="members">Members</option>
                  <option value="founded">Founded</option>
                  <option value="events">Events</option>
                </select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
                  className="border-gray-200 dark:border-gray-700"
                >
                  {sortOrder === "desc" ? <SortDesc className="h-4 w-4" /> : <SortAsc className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fan Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGroups.map((group) => {
            const LevelIcon = getLevelIcon(group.level)
            return (
              <Card key={group.id} className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-gray-900 dark:text-white mb-1">{group.name}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{group.team}</p>
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{group.location}</span>
                      </div>
                    </div>
                    <Badge className={`${getLevelColor(group.level)} flex items-center gap-1`}>
                      <LevelIcon className="h-3 w-3" />
                      {group.level}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{group.description}</p>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-lg font-bold text-black dark:text-white">{group.members.toLocaleString()}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Members</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-lg font-bold text-black dark:text-white">{group.stats.totalEvents}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Events</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {group.upcomingEvents} upcoming
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-gray-400" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {group.stats.averageAttendance}% attendance
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 mb-4">
                    {group.tags.slice(0, 2).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/fan-groups/${group.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                    <Button size="sm" className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200">
                      Join
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredGroups.length === 0 && (
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No fan groups found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
              <Button 
                onClick={() => setSearchQuery("")}
                className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
              >
                Clear Search
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 