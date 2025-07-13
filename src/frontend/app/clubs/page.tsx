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
  Flag,
  Building,
  Globe,
  Medal,
  Flame,
} from "lucide-react"
import Link from "next/link"
import { useFootballCompetitions, useFootballTeamsByCompetition } from "@/hooks/use-football-api-web3"

export default function ClubsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("fans")
  const [sortOrder, setSortOrder] = useState("desc")
  const [selectedCompetition, setSelectedCompetition] = useState("PL") // Premier League by default

  // Fetch real football data
  const { data: competitions, loading: competitionsLoading, error: competitionsError } = useFootballCompetitions()
  const { data: teams, loading: teamsLoading, error: teamsError } = useFootballTeamsByCompetition(selectedCompetition)

  // Filter and sort teams based on search and sort criteria
  const filteredTeams = teams?.teams?.filter((team: any) => 
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.area?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  const sortedTeams = [...filteredTeams].sort((a: any, b: any) => {
    if (sortOrder === "asc") {
      return a.name.localeCompare(b.name)
    } else {
      return b.name.localeCompare(a.name)
    }
  })

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

  return (
    <div className="bg-white dark:bg-black text-gray-900 dark:text-white">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Header */}
      <header className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 p-4 shadow-sm dark:shadow-none">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Football Clubs</h1>
          <Button size="sm" className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200">
            <Plus className="h-4 w-4 mr-2" />
            Add Club
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
                  placeholder="Search clubs..."
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
                  <option value="fans">Fans</option>
                  <option value="founded">Founded</option>
                  <option value="trophies">Trophies</option>
                  <option value="capacity">Stadium Capacity</option>
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

        {/* Clubs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedTeams.map((team: any) => {
            const LevelIcon = getLevelIcon(team.level)
            return (
              <Card key={team.id} className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-gray-900 dark:text-white mb-1">{team.name}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{team.nickname}</p>
                      <div className="flex items-center gap-2 mb-2">
                        <Flag className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{team.league}</span>
                      </div>
                    </div>
                    <Badge className={`${getLevelColor(team.level)} flex items-center gap-1`}>
                      <LevelIcon className="h-3 w-3" />
                      {team.level}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{team.description}</p>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-lg font-bold text-black dark:text-white">{team.fans.toLocaleString()}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Fans</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-lg font-bold text-black dark:text-white">{team.trophies}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Trophies</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      <Building className="h-4 w-4 text-gray-400" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {team.stadium}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {team.capacity.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 mb-4">
                    <Badge className={`${getCategoryColor(team.category)} text-xs`}>
                      {team.category}
                    </Badge>
                    {team.tags.slice(0, 2).map((tag: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/clubs/${team.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                    <Button size="sm" className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200">
                      Follow
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {sortedTeams.length === 0 && (
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
            <CardContent className="p-8 text-center">
              <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No clubs found</h3>
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