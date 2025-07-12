"use client"

import { useState, use } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Sidebar } from "@/components/sidebar"
import {
  Menu,
  ArrowLeft,
  Users,
  MapPin,
  Calendar,
  Trophy,
  Star,
  Heart,
  Crown,
  Shield,
  TrendingUp,
  Eye,
  Plus,
  Award,
  Target,
  Zap,
  Clock,
  MessageCircle,
  Share2,
  Bookmark,
  Flag,
  Settings,
  UserPlus,
  UserCheck,
  UserX,
  Activity,
  BarChart3,
  Gift,
  Medal,
  Flame,
  CheckCircle,
  X,
} from "lucide-react"
import Link from "next/link"

export default function FanGroupDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMember, setIsMember] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  // Unwrap params using React.use()
  const { id } = use(params)

  // Sample fan group data (in real app, this would come from API)
  const fanGroup = {
    id: id,
    name: "Blue Pride",
    description: "The official Chelsea FC supporters group. We bleed blue! Founded in 2010, we are the most passionate and dedicated Chelsea supporters, bringing together fans from all over the world to celebrate our beloved club.",
    team: "Chelsea FC",
    location: "London, UK",
    members: 15420,
    founded: "2010",
    category: "official",
    level: "exemplary",
    tags: ["Official", "London", "Premier League", "Established"],
    recentActivity: "2 hours ago",
    upcomingEventsCount: 3,
    isMember: isMember,
    achievements: [
      { name: "Best Fan Group 2023", icon: Trophy, date: "2023", description: "Awarded by Premier League for outstanding community engagement" },
      { name: "Community Award", icon: Award, date: "2022", description: "Recognized for charitable work and local community support" },
      { name: "Loyalty Badge", icon: Heart, date: "2021", description: "For maintaining high member retention and engagement" },
      { name: "Event Excellence", icon: Star, date: "2023", description: "For organizing the most successful fan events of the year" }
    ],
    stats: {
      totalEvents: 156,
      totalTokens: 1250000,
      averageAttendance: 89,
      activeMembers: 12450,
      memberGrowth: 12.5,
      eventSuccess: 94.2,
      communityScore: 98.5
    },
    upcomingEvents: [
      {
        id: 1,
        name: "Match Day Meetup",
        date: "2024-01-15",
        time: "14:00",
        location: "Stamford Bridge",
        attendees: 1250,
        maxAttendees: 1500,
        type: "match"
      },
      {
        id: 2,
        name: "Community Service Day",
        date: "2024-01-20",
        time: "10:00",
        location: "Local Community Center",
        attendees: 85,
        maxAttendees: 100,
        type: "community"
      },
      {
        id: 3,
        name: "Fan Group Social",
        date: "2024-01-25",
        time: "19:00",
        location: "The Blue Lion Pub",
        attendees: 320,
        maxAttendees: 400,
        type: "social"
      }
    ],
    recentMembers: [
      { id: 1, name: "Alex Johnson", avatar: "/placeholder-user.jpg", joined: "2 hours ago", level: "respectable" },
      { id: 2, name: "Sarah Williams", avatar: "/placeholder-user.jpg", joined: "4 hours ago", level: "commendable" },
      { id: 3, name: "Mike Davis", avatar: "/placeholder-user.jpg", joined: "6 hours ago", level: "exemplary" },
      { id: 4, name: "Emma Wilson", avatar: "/placeholder-user.jpg", joined: "1 day ago", level: "respectable" }
    ],
    rules: [
      "Respect all members and their opinions",
      "No discrimination or hate speech",
      "Follow Chelsea FC's code of conduct",
      "Participate actively in group activities",
      "Report any inappropriate behavior"
    ],
    benefits: [
      "Exclusive match day meetups",
      "Priority access to events",
      "Special merchandise discounts",
      "Direct communication with club representatives",
      "Community service opportunities"
    ]
  }

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

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "match":
        return "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400"
      case "community":
        return "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
      case "social":
        return "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
    }
  }

  return (
    <div className="bg-white dark:bg-black text-gray-900 dark:text-white">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Header */}
      <header className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 p-4 shadow-sm dark:shadow-none">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-6 w-6" />
            </Button>
            <Link href="/fan-groups">
              <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                <ArrowLeft className="h-6 w-6" />
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="border-gray-200 dark:border-gray-700">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm" className="border-gray-200 dark:border-gray-700">
              <Bookmark className="h-4 w-4 mr-2" />
              Save
            </Button>
            {isMember ? (
              <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                <UserX className="h-4 w-4 mr-2" />
                Leave Group
              </Button>
            ) : (
              <Button size="sm" className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200">
                <UserPlus className="h-4 w-4 mr-2" />
                Join Group
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Group Header */}
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{fanGroup.name}</h1>
                  <Badge className={`${getLevelColor(fanGroup.level)} flex items-center gap-1`}>
                    {(() => {
                      const LevelIcon = getLevelIcon(fanGroup.level)
                      return <LevelIcon className="h-3 w-3" />
                    })()}
                    {fanGroup.level}
                  </Badge>
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-3">{fanGroup.team}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {fanGroup.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Founded {fanGroup.founded}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {fanGroup.members.toLocaleString()} members
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-4">{fanGroup.description}</p>
            
            <div className="flex gap-2">
              {fanGroup.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
            <CardContent className="p-4 text-center">
              <Activity className="h-8 w-8 text-black dark:text-white mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{fanGroup.stats.totalEvents}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Events</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 text-black dark:text-white mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{fanGroup.stats.averageAttendance}%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Avg Attendance</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 text-black dark:text-white mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{fanGroup.stats.activeMembers.toLocaleString()}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Active Members</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
            <CardContent className="p-4 text-center">
              <Trophy className="h-8 w-8 text-black dark:text-white mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{fanGroup.stats.totalTokens.toLocaleString()}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Tokens</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-800">
            <TabsTrigger value="overview" className="data-[state=active]:bg-black dark:data-[state=active]:bg-white data-[state=active]:text-white dark:data-[state=active]:text-black">
              Overview
            </TabsTrigger>
            <TabsTrigger value="members" className="data-[state=active]:bg-black dark:data-[state=active]:bg-white data-[state=active]:text-white dark:data-[state=active]:text-black">
              Members
            </TabsTrigger>
            <TabsTrigger value="info" className="data-[state=active]:bg-black dark:data-[state=active]:bg-white data-[state=active]:text-white dark:data-[state=active]:text-black">
              Info
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                    <Activity className="h-5 w-5 text-black dark:text-white" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="p-2 bg-black/10 dark:bg-white/20 rounded-full">
                      <UserPlus className="h-4 w-4 text-black dark:text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">New member joined</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Alex Johnson joined the group</p>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">2h ago</span>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="p-2 bg-black/10 dark:bg-white/20 rounded-full">
                      <Calendar className="h-4 w-4 text-black dark:text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Event created</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Match Day Meetup scheduled</p>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">4h ago</span>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="p-2 bg-black/10 dark:bg-white/20 rounded-full">
                      <Trophy className="h-4 w-4 text-black dark:text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Achievement unlocked</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Community Award received</p>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">1d ago</span>
                  </div>
                </CardContent>
              </Card>

              {/* Group Performance */}
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-black dark:text-white" />
                    Group Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Member Growth</span>
                      <span className="text-sm font-medium text-black dark:text-white">+{fanGroup.stats.memberGrowth}%</span>
                    </div>
                    <Progress value={fanGroup.stats.memberGrowth} className="h-2 bg-gray-200 dark:bg-gray-700">
                      <div className="h-full bg-black dark:bg-white rounded-full" style={{ width: `${fanGroup.stats.memberGrowth}%` }} />
                    </Progress>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Event Success Rate</span>
                      <span className="text-sm font-medium text-black dark:text-white">{fanGroup.stats.eventSuccess}%</span>
                    </div>
                    <Progress value={fanGroup.stats.eventSuccess} className="h-2 bg-gray-200 dark:bg-gray-700">
                      <div className="h-full bg-black dark:bg-white rounded-full" style={{ width: `${fanGroup.stats.eventSuccess}%` }} />
                    </Progress>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Community Score</span>
                      <span className="text-sm font-medium text-black dark:text-white">{fanGroup.stats.communityScore}%</span>
                    </div>
                    <Progress value={fanGroup.stats.communityScore} className="h-2 bg-gray-200 dark:bg-gray-700">
                      <div className="h-full bg-black dark:bg-white rounded-full" style={{ width: `${fanGroup.stats.communityScore}%` }} />
                    </Progress>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>



          <TabsContent value="members" className="space-y-4">
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <Users className="h-5 w-5 text-black dark:text-white" />
                  Recent Members
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {fanGroup.recentMembers.map((member) => {
                  const LevelIcon = getLevelIcon(member.level)
                  return (
                    <div key={member.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{member.name}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Joined {member.joined}</p>
                        </div>
                      </div>
                      <Badge className={`${getLevelColor(member.level)} flex items-center gap-1`}>
                        <LevelIcon className="h-3 w-3" />
                        {member.level}
                      </Badge>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </TabsContent>





          <TabsContent value="achievements" className="space-y-4">
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-black dark:text-white" />
                  Group Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {fanGroup.achievements.map((achievement, index) => {
                  const IconComponent = achievement.icon
                  return (
                    <div key={index} className="flex items-start gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="p-3 bg-black/10 dark:bg-white/20 rounded-full">
                        <IconComponent className="h-6 w-6 text-black dark:text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white">{achievement.name}</h4>
                          <Badge variant="outline" className="text-xs border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400">
                            {achievement.date}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.description}</p>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="info" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Group Rules */}
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                    <Shield className="h-5 w-5 text-black dark:text-white" />
                    Group Rules
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {fanGroup.rules.map((rule, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-black dark:text-white mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{rule}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Member Benefits */}
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                    <Gift className="h-5 w-5 text-black dark:text-white" />
                    Member Benefits
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {fanGroup.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Star className="h-4 w-4 text-black dark:text-white mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{benefit}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 