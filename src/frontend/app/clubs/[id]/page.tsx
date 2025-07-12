"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  Building,
  Globe,
  Target as TargetIcon,
  TrendingDown,
  Users2,
  Home,
  Plane,
  Minus,
  X,
} from "lucide-react"
import Link from "next/link"

export default function ClubDetailPage({ params }: { params: { id: string } }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  // Sample club data (in real app, this would come from API)
  const club = {
    id: params.id,
    name: "Chelsea FC",
    nickname: "The Blues",
    description: "Chelsea Football Club is one of England's most successful clubs, founded in 1905. Based in London, Chelsea has won multiple Premier League titles, FA Cups, and European trophies including the UEFA Champions League. The club plays at Stamford Bridge and has a passionate global fanbase.",
    league: "Premier League",
    location: "London, England",
    founded: "1905",
    stadium: "Stamford Bridge",
    capacity: 40341,
    fans: 154200,
    trophies: 25,
    category: "elite",
    level: "exemplary",
    tags: ["Premier League", "London", "Elite", "European Champions"],
    recentActivity: "2 hours ago",
    upcomingMatches: 3,
    isFollowing: isFollowing,
    achievements: [
      { name: "Premier League Champions 2021/22", icon: Trophy, date: "2022", description: "Won the Premier League title for the 6th time" },
      { name: "Champions League Winners 2021", icon: Crown, date: "2021", description: "Defeated Manchester City in the final" },
      { name: "FA Cup Winners 2022", icon: Medal, date: "2022", description: "Beat Liverpool in the final at Wembley" },
      { name: "UEFA Europa League 2019", icon: Star, date: "2019", description: "Won the Europa League for the second time" }
    ],
    stats: {
      totalMatches: 456,
      totalFans: 154200,
      averageAttendance: 95.2,
      activeSupporters: 124500,
      seasonPoints: 67,
      leaguePosition: 4,
      wins: 18,
      draws: 13,
      losses: 7,
      goalsFor: 58,
      goalsAgainst: 32,
      goalDifference: 26
    },
    upcomingMatches: [
      {
        id: 1,
        opponent: "Arsenal",
        date: "2024-01-15",
        time: "20:00",
        venue: "Stamford Bridge",
        competition: "Premier League",
        type: "home",
        tickets: "Available"
      },
      {
        id: 2,
        opponent: "Manchester City",
        date: "2024-01-20",
        time: "15:00",
        venue: "Etihad Stadium",
        competition: "Premier League",
        type: "away",
        tickets: "Sold Out"
      },
      {
        id: 3,
        opponent: "Liverpool",
        date: "2024-01-25",
        time: "19:45",
        venue: "Stamford Bridge",
        competition: "FA Cup",
        type: "home",
        tickets: "Limited"
      }
    ],
    recentResults: [
      { opponent: "Brighton", result: "W 3-1", date: "2024-01-08", competition: "Premier League" },
      { opponent: "Crystal Palace", result: "D 1-1", date: "2024-01-01", competition: "Premier League" },
      { opponent: "Wolves", result: "W 2-0", date: "2023-12-28", competition: "Premier League" },
      { opponent: "Newcastle", result: "L 1-2", date: "2023-12-23", competition: "Premier League" },
      { opponent: "Sheffield United", result: "W 4-0", date: "2023-12-16", competition: "Premier League" }
    ],
    topPlayers: [
      { id: 1, name: "Cole Palmer", position: "Midfielder", goals: 12, assists: 8, rating: 8.2 },
      { id: 2, name: "Nicolas Jackson", position: "Forward", goals: 10, assists: 3, rating: 7.8 },
      { id: 3, name: "Raheem Sterling", position: "Forward", goals: 8, assists: 6, rating: 7.6 },
      { id: 4, name: "Enzo Fernández", position: "Midfielder", goals: 3, assists: 7, rating: 7.4 }
    ],
    seasonStats: {
      matchesPlayed: 38,
      wins: 18,
      draws: 13,
      losses: 7,
      points: 67,
      position: 4,
      goalsFor: 58,
      goalsAgainst: 32,
      cleanSheets: 12,
      yellowCards: 45,
      redCards: 2
    }
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "elite":
        return "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
      case "premium":
        return "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
      case "standard":
        return "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
    }
  }

  const getResultColor = (result: string) => {
    if (result.startsWith("W")) return "text-green-600 dark:text-green-400"
    if (result.startsWith("D")) return "text-yellow-600 dark:text-yellow-400"
    if (result.startsWith("L")) return "text-red-600 dark:text-red-400"
    return "text-gray-600 dark:text-gray-400"
  }

  const getMatchTypeIcon = (type: string) => {
    switch (type) {
      case "home":
        return Home
      case "away":
        return Plane
      default:
        return Calendar
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
            <Link href="/clubs">
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
            {isFollowing ? (
              <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                <UserX className="h-4 w-4 mr-2" />
                Unfollow
              </Button>
            ) : (
              <Button size="sm" className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200">
                <UserPlus className="h-4 w-4 mr-2" />
                Follow Club
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Club Header */}
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{club.name}</h1>
                  <Badge className={`${getLevelColor(club.level)} flex items-center gap-1`}>
                    {(() => {
                      const LevelIcon = getLevelIcon(club.level)
                      return <LevelIcon className="h-3 w-3" />
                    })()}
                    {club.level}
                  </Badge>
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-3">{club.nickname}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Flag className="h-4 w-4" />
                    {club.league}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {club.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Founded {club.founded}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {club.fans.toLocaleString()} fans
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-4">{club.description}</p>
            
            <div className="flex gap-2">
              <Badge className={`${getCategoryColor(club.category)}`}>
                {club.category}
              </Badge>
              {club.tags.map((tag, index) => (
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
              <Trophy className="h-8 w-8 text-black dark:text-white mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{club.trophies}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Trophies</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
            <CardContent className="p-4 text-center">
              <Building className="h-8 w-8 text-black dark:text-white mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{club.capacity.toLocaleString()}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Stadium Capacity</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 text-black dark:text-white mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{club.stats.averageAttendance}%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Avg Attendance</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
            <CardContent className="p-4 text-center">
              <TargetIcon className="h-8 w-8 text-black dark:text-white mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{club.stats.leaguePosition}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">League Position</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-gray-100 dark:bg-gray-800">
            <TabsTrigger value="overview" className="data-[state=active]:bg-black dark:data-[state=active]:bg-white data-[state=active]:text-white dark:data-[state=active]:text-black">
              Overview
            </TabsTrigger>
            <TabsTrigger value="matches" className="data-[state=active]:bg-black dark:data-[state=active]:bg-white data-[state=active]:text-white dark:data-[state=active]:text-black">
              Matches
            </TabsTrigger>
            <TabsTrigger value="players" className="data-[state=active]:bg-black dark:data-[state=active]:bg-white data-[state=active]:text-white dark:data-[state=active]:text-black">
              Players
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-black dark:data-[state=active]:bg-white data-[state=active]:text-white dark:data-[state=active]:text-black">
              Achievements
            </TabsTrigger>
            <TabsTrigger value="stats" className="data-[state=active]:bg-black dark:data-[state=active]:bg-white data-[state=active]:text-white dark:data-[state=active]:text-black">
              Statistics
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
                      <Trophy className="h-4 w-4 text-black dark:text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Match result</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Won 3-1 against Brighton</p>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">2h ago</span>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="p-2 bg-black/10 dark:bg-white/20 rounded-full">
                      <Users className="h-4 w-4 text-black dark:text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">New fan joined</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">1,250 new followers this week</p>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">4h ago</span>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="p-2 bg-black/10 dark:bg-white/20 rounded-full">
                      <Calendar className="h-4 w-4 text-black dark:text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Upcoming match</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">vs Arsenal on Jan 15</p>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">1d ago</span>
                  </div>
                </CardContent>
              </Card>

              {/* Season Performance */}
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-black dark:text-white" />
                    Season Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">{club.seasonStats.wins}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Wins</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{club.seasonStats.draws}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Draws</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">{club.seasonStats.losses}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Losses</div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">League Position</span>
                      <span className="text-sm font-medium text-black dark:text-white">{club.stats.leaguePosition}th</span>
                    </div>
                    <Progress value={(club.stats.leaguePosition / 20) * 100} className="h-2 bg-gray-200 dark:bg-gray-700">
                      <div className="h-full bg-black dark:bg-white rounded-full" style={{ width: `${(club.stats.leaguePosition / 20) * 100}%` }} />
                    </Progress>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Points</span>
                      <span className="text-sm font-medium text-black dark:text-white">{club.stats.seasonPoints}/114</span>
                    </div>
                    <Progress value={(club.stats.seasonPoints / 114) * 100} className="h-2 bg-gray-200 dark:bg-gray-700">
                      <div className="h-full bg-black dark:bg-white rounded-full" style={{ width: `${(club.stats.seasonPoints / 114) * 100}%` }} />
                    </Progress>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="matches" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upcoming Matches */}
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-black dark:text-white" />
                    Upcoming Matches
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {club.upcomingMatches.map((match) => {
                    const MatchTypeIcon = getMatchTypeIcon(match.type)
                    return (
                      <div key={match.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${
                            match.type === "home" 
                              ? "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                          }`}>
                            <MatchTypeIcon className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">vs {match.opponent}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {match.date} at {match.time} • {match.venue}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{match.competition}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className={`text-xs ${
                          match.tickets === "Available" 
                            ? "border-green-300 dark:border-green-700 text-green-600 dark:text-green-400"
                            : match.tickets === "Limited"
                            ? "border-yellow-300 dark:border-yellow-700 text-yellow-600 dark:text-yellow-400"
                            : "border-red-300 dark:border-red-700 text-red-600 dark:text-red-400"
                        }`}>
                          {match.tickets}
                        </Badge>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>

              {/* Recent Results */}
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-black dark:text-white" />
                    Recent Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {club.recentResults.map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          result.result.startsWith("W") 
                            ? "bg-green-100 dark:bg-green-900/20"
                            : result.result.startsWith("D")
                            ? "bg-yellow-100 dark:bg-yellow-900/20"
                            : "bg-red-100 dark:bg-red-900/20"
                        }`}>
                          {result.result.startsWith("W") ? (
                            <Win className="h-4 w-4 text-green-600 dark:text-green-400" />
                          ) : result.result.startsWith("D") ? (
                            <Draw className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                          ) : (
                            <Loss className="h-4 w-4 text-red-600 dark:text-red-400" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">vs {result.opponent}</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{result.competition}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-semibold ${getResultColor(result.result)}`}>
                          {result.result}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{result.date}</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="players" className="space-y-4">
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <Users2 className="h-5 w-5 text-black dark:text-white" />
                  Top Players
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {club.topPlayers.map((player) => (
                  <div key={player.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          {player.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{player.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{player.position}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-sm font-semibold text-black dark:text-white">{player.goals}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Goals</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-semibold text-black dark:text-white">{player.assists}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Assists</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-semibold text-black dark:text-white">{player.rating}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Rating</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-black dark:text-white" />
                  Club Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {club.achievements.map((achievement, index) => {
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

          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Season Statistics */}
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-black dark:text-white" />
                    Season Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-2xl font-bold text-black dark:text-white">{club.seasonStats.matchesPlayed}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Matches Played</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-2xl font-bold text-black dark:text-white">{club.seasonStats.points}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Points</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-2xl font-bold text-black dark:text-white">{club.seasonStats.goalsFor}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Goals For</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-2xl font-bold text-black dark:text-white">{club.seasonStats.goalsAgainst}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Goals Against</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Discipline */}
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                    <Shield className="h-5 w-5 text-black dark:text-white" />
                    Discipline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{club.seasonStats.yellowCards}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Yellow Cards</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">{club.seasonStats.redCards}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Red Cards</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 