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
import { safeToLocaleString } from "@/lib/utils";

// Comprehensive list of all teams with Chiliz fan tokens
const allTeams = [
  // Football Teams with Chiliz Fan Tokens
  {
    id: 1,
    name: "AS Roma",
    nickname: "I Giallorossi",
    league: "Serie A",
    description: "One of Italy's most successful clubs, known for their passionate fanbase and rich history.",
    fans: 2500000,
    trophies: 3,
    stadium: "Stadio Olimpico",
    capacity: 70634,
    level: "exemplary",
    category: "elite",
    tags: ["Italian", "Historic", "Passionate"]
  },
  {
    id: 2,
    name: "Paris Saint‑Germain",
    nickname: "Les Parisiens",
    league: "Ligue 1",
    description: "French powerhouse with global reach and star-studded lineup.",
    fans: 3500000,
    trophies: 11,
    stadium: "Parc des Princes",
    capacity: 47929,
    level: "exemplary",
    category: "elite",
    tags: ["French", "Global", "Star-studded"]
  },
  {
    id: 3,
    name: "FC Barcelona",
    nickname: "Barça",
    league: "La Liga",
    description: "Catalan giants with a unique playing style and worldwide following.",
    fans: 4000000,
    trophies: 26,
    stadium: "Camp Nou",
    capacity: 99354,
    level: "exemplary",
    category: "elite",
    tags: ["Spanish", "Historic", "Més que un club"]
  },
  {
    id: 4,
    name: "Galatasaray",
    nickname: "Cimbom",
    league: "Süper Lig",
    description: "Turkish football institution with passionate supporters.",
    fans: 1800000,
    trophies: 23,
    stadium: "Türk Telekom Stadium",
    capacity: 52280,
    level: "commendable",
    category: "premium",
    tags: ["Turkish", "Passionate", "Historic"]
  },
  {
    id: 5,
    name: "Juventus",
    nickname: "La Vecchia Signora",
    league: "Serie A",
    description: "Italy's most successful club with a rich tradition of excellence.",
    fans: 3000000,
    trophies: 36,
    stadium: "Allianz Stadium",
    capacity: 41507,
    level: "exemplary",
    category: "elite",
    tags: ["Italian", "Historic", "Successful"]
  },
  {
    id: 6,
    name: "Manchester City",
    nickname: "The Citizens",
    league: "Premier League",
    description: "English champions with modern success and global appeal.",
    fans: 2800000,
    trophies: 8,
    stadium: "Etihad Stadium",
    capacity: 53400,
    level: "exemplary",
    category: "elite",
    tags: ["English", "Modern", "Successful"]
  },
  {
    id: 7,
    name: "Atlético de Madrid",
    nickname: "Los Colchoneros",
    league: "La Liga",
    description: "Madrid's working-class club with passionate support.",
    fans: 2200000,
    trophies: 11,
    stadium: "Metropolitano",
    capacity: 68456,
    level: "commendable",
    category: "premium",
    tags: ["Spanish", "Passionate", "Working-class"]
  },
  {
    id: 8,
    name: "AC Milan",
    nickname: "I Rossoneri",
    league: "Serie A",
    description: "Italian giants with European pedigree and rich history.",
    fans: 2500000,
    trophies: 19,
    stadium: "San Siro",
    capacity: 80018,
    level: "exemplary",
    category: "elite",
    tags: ["Italian", "European", "Historic"]
  },
  {
    id: 9,
    name: "Inter Milan",
    nickname: "I Nerazzurri",
    league: "Serie A",
    description: "Milan's blue and black half with international success.",
    fans: 2400000,
    trophies: 19,
    stadium: "San Siro",
    capacity: 80018,
    level: "exemplary",
    category: "elite",
    tags: ["Italian", "European", "Historic"]
  },
  {
    id: 10,
    name: "Tottenham Hotspur",
    nickname: "Spurs",
    league: "Premier League",
    description: "North London club with modern stadium and global fanbase.",
    fans: 2000000,
    trophies: 2,
    stadium: "Tottenham Hotspur Stadium",
    capacity: 62850,
    level: "commendable",
    category: "premium",
    tags: ["English", "Modern", "London"]
  },
  {
    id: 11,
    name: "Arsenal",
    nickname: "The Gunners",
    league: "Premier League",
    description: "London's red and white with beautiful football tradition.",
    fans: 2300000,
    trophies: 13,
    stadium: "Emirates Stadium",
    capacity: 60704,
    level: "exemplary",
    category: "elite",
    tags: ["English", "Historic", "London"]
  },
  {
    id: 12,
    name: "Napoli",
    nickname: "I Partenopei",
    league: "Serie A",
    description: "Southern Italy's pride with passionate Neapolitan support.",
    fans: 1800000,
    trophies: 3,
    stadium: "Diego Armando Maradona",
    capacity: 54726,
    level: "commendable",
    category: "premium",
    tags: ["Italian", "Passionate", "Southern"]
  },
  {
    id: 13,
    name: "Flamengo",
    nickname: "O Mengão",
    league: "Brasileirão",
    description: "Brazil's most popular club with massive following.",
    fans: 40000000,
    trophies: 8,
    stadium: "Maracanã",
    capacity: 78838,
    level: "exemplary",
    category: "elite",
    tags: ["Brazilian", "Popular", "Historic"]
  },
  {
    id: 14,
    name: "Valencia CF",
    nickname: "Los Che",
    league: "La Liga",
    description: "Valencia's orange and white with European success.",
    fans: 1500000,
    trophies: 6,
    stadium: "Mestalla",
    capacity: 55000,
    level: "respectable",
    category: "standard",
    tags: ["Spanish", "European", "Historic"]
  },
  {
    id: 15,
    name: "AS Monaco",
    nickname: "Les Rouge et Blanc",
    league: "Ligue 1",
    description: "Principality club with glamorous appeal and youth development.",
    fans: 800000,
    trophies: 8,
    stadium: "Stade Louis II",
    capacity: 18523,
    level: "respectable",
    category: "standard",
    tags: ["French", "Glamorous", "Youth"]
  },
  {
    id: 16,
    name: "Everton",
    nickname: "The Toffees",
    league: "Premier League",
    description: "Liverpool's blue half with rich history and tradition.",
    fans: 1200000,
    trophies: 9,
    stadium: "Goodison Park",
    capacity: 39414,
    level: "respectable",
    category: "standard",
    tags: ["English", "Historic", "Liverpool"]
  },
  {
    id: 17,
    name: "Aston Villa",
    nickname: "The Villans",
    league: "Premier League",
    description: "Birmingham's historic club with European pedigree.",
    fans: 1100000,
    trophies: 7,
    stadium: "Villa Park",
    capacity: 42785,
    level: "respectable",
    category: "standard",
    tags: ["English", "Historic", "Birmingham"]
  },
  {
    id: 18,
    name: "Tigres",
    nickname: "Los Tigres",
    league: "Liga MX",
    description: "Mexican powerhouse with passionate northern support.",
    fans: 2500000,
    trophies: 7,
    stadium: "Estadio Universitario",
    capacity: 41815,
    level: "commendable",
    category: "premium",
    tags: ["Mexican", "Passionate", "Northern"]
  },
  {
    id: 19,
    name: "S.C. Corinthians",
    nickname: "O Timão",
    league: "Brasileirão",
    description: "São Paulo's working-class club with massive support.",
    fans: 30000000,
    trophies: 7,
    stadium: "Neo Química Arena",
    capacity: 49508,
    level: "exemplary",
    category: "elite",
    tags: ["Brazilian", "Working-class", "Popular"]
  },
  {
    id: 20,
    name: "Clube Atlético Mineiro",
    nickname: "O Galo",
    league: "Brasileirão",
    description: "Belo Horizonte's pride with passionate support.",
    fans: 15000000,
    trophies: 2,
    stadium: "Arena MRV",
    capacity: 46160,
    level: "commendable",
    category: "premium",
    tags: ["Brazilian", "Passionate", "Belo Horizonte"]
  },
  {
    id: 21,
    name: "Esporte Clube Bahia",
    nickname: "O Tricolor",
    league: "Brasileirão",
    description: "Salvador's historic club with loyal fanbase.",
    fans: 8000000,
    trophies: 2,
    stadium: "Arena Fonte Nova",
    capacity: 48000,
    level: "respectable",
    category: "standard",
    tags: ["Brazilian", "Historic", "Salvador"]
  },
  {
    id: 22,
    name: "Leeds United",
    nickname: "The Whites",
    league: "Premier League",
    description: "Yorkshire's pride with passionate support and history.",
    fans: 1000000,
    trophies: 3,
    stadium: "Elland Road",
    capacity: 37890,
    level: "respectable",
    category: "standard",
    tags: ["English", "Passionate", "Yorkshire"]
  },
  {
    id: 23,
    name: "Sao Paulo FC",
    nickname: "O Tricolor",
    league: "Brasileirão",
    description: "São Paulo's most successful club with rich history.",
    fans: 20000000,
    trophies: 6,
    stadium: "Morumbi",
    capacity: 67728,
    level: "exemplary",
    category: "elite",
    tags: ["Brazilian", "Successful", "Historic"]
  },
  {
    id: 24,
    name: "Real Sociedad",
    nickname: "La Real",
    league: "La Liga",
    description: "Basque club with strong local identity and youth development.",
    fans: 800000,
    trophies: 2,
    stadium: "Reale Arena",
    capacity: 39500,
    level: "respectable",
    category: "standard",
    tags: ["Spanish", "Basque", "Youth"]
  },
  {
    id: 25,
    name: "Vasco da Gama",
    nickname: "O Gigante da Colina",
    league: "Brasileirão",
    description: "Rio's historic club with working-class roots.",
    fans: 12000000,
    trophies: 4,
    stadium: "São Januário",
    capacity: 24584,
    level: "commendable",
    category: "premium",
    tags: ["Brazilian", "Historic", "Rio"]
  },
  {
    id: 26,
    name: "Dinamo Zagreb",
    nickname: "Plavi",
    league: "HNL",
    description: "Croatia's most successful club with European experience.",
    fans: 500000,
    trophies: 23,
    stadium: "Maksimir",
    capacity: 35123,
    level: "respectable",
    category: "standard",
    tags: ["Croatian", "Successful", "European"]
  },
  {
    id: 27,
    name: "CA Independiente",
    nickname: "El Rojo",
    league: "Primera División",
    description: "Argentina's historic club with rich tradition.",
    fans: 3000000,
    trophies: 16,
    stadium: "Libertadores de América",
    capacity: 52000,
    level: "commendable",
    category: "premium",
    tags: ["Argentine", "Historic", "Successful"]
  },
  {
    id: 28,
    name: "Apollon Limassol",
    nickname: "Theos",
    league: "Cypriot First Division",
    description: "Cyprus' successful club with European ambitions.",
    fans: 200000,
    trophies: 4,
    stadium: "Tsirion Stadium",
    capacity: 13631,
    level: "respectable",
    category: "standard",
    tags: ["Cypriot", "European", "Ambitious"]
  },
  
  // National Teams
  {
    id: 29,
    name: "Argentine Football Association",
    nickname: "La Albiceleste",
    league: "International",
    description: "Argentina's national team with rich football heritage.",
    fans: 45000000,
    trophies: 3,
    stadium: "Various",
    capacity: 0,
    level: "exemplary",
    category: "elite",
    tags: ["National", "World Cup", "Historic"]
  },
  {
    id: 30,
    name: "Portugal National Team",
    nickname: "A Seleção",
    league: "International",
    description: "Portugal's national team with golden generation legacy.",
    fans: 10000000,
    trophies: 1,
    stadium: "Various",
    capacity: 0,
    level: "exemplary",
    category: "elite",
    tags: ["National", "European", "Golden Generation"]
  },
  {
    id: 31,
    name: "Italian National Football Team",
    nickname: "Gli Azzurri",
    league: "International",
    description: "Italy's national team with defensive excellence tradition.",
    fans: 60000000,
    trophies: 4,
    stadium: "Various",
    capacity: 0,
    level: "exemplary",
    category: "elite",
    tags: ["National", "World Cup", "Defensive"]
  },
  
  // Turkish Teams
  {
    id: 32,
    name: "Trabzonspor",
    nickname: "Bordo-Mavili",
    league: "Süper Lig",
    description: "Black Sea region's pride with passionate support.",
    fans: 1200000,
    trophies: 7,
    stadium: "Şenol Güneş Sports Complex",
    capacity: 40598,
    level: "commendable",
    category: "premium",
    tags: ["Turkish", "Black Sea", "Passionate"]
  },
  {
    id: 33,
    name: "Samsunspor",
    nickname: "Kırmızı-Beyaz",
    league: "Süper Lig",
    description: "Samsun's historic club with loyal fanbase.",
    fans: 500000,
    trophies: 0,
    stadium: "Samsun 19 Mayıs",
    capacity: 19720,
    level: "respectable",
    category: "standard",
    tags: ["Turkish", "Historic", "Samsun"]
  },
  {
    id: 34,
    name: "Göztepe S.K.",
    nickname: "Göz-Göz",
    league: "TFF 1. Lig",
    description: "İzmir's beloved club with passionate support.",
    fans: 300000,
    trophies: 0,
    stadium: "Gürsel Aksel",
    capacity: 25675,
    level: "respectable",
    category: "standard",
    tags: ["Turkish", "İzmir", "Passionate"]
  },
  {
    id: 35,
    name: "İstanbul Başakşehir",
    nickname: "Turuncu-Lacivertliler",
    league: "Süper Lig",
    description: "Istanbul's modern club with ambitious project.",
    fans: 400000,
    trophies: 1,
    stadium: "Başakşehir Fatih Terim",
    capacity: 17250,
    level: "respectable",
    category: "standard",
    tags: ["Turkish", "Istanbul", "Modern"]
  },
  {
    id: 36,
    name: "Alanyaspor",
    nickname: "Kestane-Gök Mavisi",
    league: "Süper Lig",
    description: "Alanya's rising club with coastal charm.",
    fans: 200000,
    trophies: 0,
    stadium: "Bahçeşehir Okulları",
    capacity: 15000,
    level: "respectable",
    category: "standard",
    tags: ["Turkish", "Alanya", "Rising"]
  },
  
  // Formula 1 Teams
  {
    id: 37,
    name: "Aston Martin Cognizant",
    nickname: "The Green Team",
    league: "Formula 1",
    description: "British F1 team with luxury automotive heritage.",
    fans: 800000,
    trophies: 0,
    stadium: "Various Circuits",
    capacity: 0,
    level: "commendable",
    category: "premium",
    tags: ["F1", "British", "Luxury"]
  },
  {
    id: 38,
    name: "Alfa Romeo Racing ORLEN",
    nickname: "The Red Team",
    league: "Formula 1",
    description: "Swiss-Italian F1 team with automotive tradition.",
    fans: 600000,
    trophies: 0,
    stadium: "Various Circuits",
    capacity: 0,
    level: "commendable",
    category: "premium",
    tags: ["F1", "Swiss-Italian", "Automotive"]
  },
  
  // Esports & Other
  {
    id: 39,
    name: "OG (esports)",
    nickname: "The Green Dream",
    league: "Esports",
    description: "Legendary esports organization with multiple game titles.",
    fans: 2000000,
    trophies: 15,
    stadium: "Online",
    capacity: 0,
    level: "exemplary",
    category: "elite",
    tags: ["Esports", "Dota 2", "Legendary"]
  },
  {
    id: 40,
    name: "Blockasset",
    nickname: "The Blockchain Team",
    league: "Esports",
    description: "Blockchain-powered esports organization.",
    fans: 300000,
    trophies: 2,
    stadium: "Online",
    capacity: 0,
    level: "respectable",
    category: "standard",
    tags: ["Esports", "Blockchain", "Innovative"]
  },
  {
    id: 41,
    name: "Team Heretics",
    nickname: "Los Heretics",
    league: "Esports",
    description: "Spanish esports organization with global reach.",
    fans: 800000,
    trophies: 5,
    stadium: "Online",
    capacity: 0,
    level: "commendable",
    category: "premium",
    tags: ["Esports", "Spanish", "Global"]
  }
]

export default function ClubsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("fans")
  const [sortOrder, setSortOrder] = useState("desc")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // Filter and sort teams based on search and sort criteria
  const filteredTeams = allTeams.filter((team) => {
    const matchesSearch = team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         team.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         team.league.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = selectedCategory === "all" || team.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

<<<<<<< HEAD
<<<<<<< Updated upstream
=======
>>>>>>> 63834b673c58e2916cb3c44ff8f79173cfc57ba8
  // Transform teams data to include fallback values for missing properties
  const transformedTeams = filteredTeams.map((team: any) => ({
    ...team,
    fans: team.fans || Math.floor(Math.random() * 1000000) + 10000,
    trophies: team.trophies || Math.floor(Math.random() * 20) + 1,
    stadium: team.venue || 'Unknown Stadium',
    capacity: team.capacity || Math.floor(Math.random() * 80000) + 20000,
    level: team.level || 'respectable',
    category: team.category || 'standard',
    tags: team.tags || ['Football', 'Sports'],
    nickname: team.shortName || team.name,
    league: team.area?.name || 'Unknown League',
    description: team.description || `${team.name} is a professional football club.`
  }))

  const sortedTeams = [...transformedTeams].sort((a: any, b: any) => {
    if (sortOrder === "asc") {
      return a.name.localeCompare(b.name)
=======
  const sortedTeams = [...filteredTeams].sort((a, b) => {
    if (sortBy === "fans") {
      return sortOrder === "desc" ? b.fans - a.fans : a.fans - b.fans
    } else if (sortBy === "trophies") {
      return sortOrder === "desc" ? b.trophies - a.trophies : a.trophies - b.trophies
    } else if (sortBy === "capacity") {
      return sortOrder === "desc" ? b.capacity - a.capacity : a.capacity - b.capacity
>>>>>>> Stashed changes
    } else {
      return sortOrder === "desc" ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name)
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
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm"
                >
                  <option value="all">All Categories</option>
                  <option value="elite">Elite</option>
                  <option value="premium">Premium</option>
                  <option value="standard">Standard</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm"
                >
                  <option value="fans">Fans</option>
                  <option value="trophies">Trophies</option>
                  <option value="capacity">Stadium Capacity</option>
                  <option value="name">Name</option>
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

<<<<<<< HEAD
<<<<<<< Updated upstream
=======
>>>>>>> 63834b673c58e2916cb3c44ff8f79173cfc57ba8
        {/* Loading State */}
        {(teamsLoading || competitionsLoading) && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Error State */}
        {(teamsError || competitionsError) && (
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
            <CardContent className="p-8 text-center">
              <div className="text-red-500 mb-4">
                <Shield className="h-12 w-12 mx-auto mb-2" />
                <h3 className="text-lg font-semibold">Error Loading Data</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {teamsError || competitionsError}
                </p>
              </div>
              <Button onClick={() => window.location.reload()} variant="outline">
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

<<<<<<< HEAD
        {/* Clubs Grid */}
        {!teamsLoading && !competitionsLoading && !teamsError && !competitionsError && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedTeams.map((team: any) => {
=======
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Clubs</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{allTeams.length}</p>
                </div>
                <Building className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Fans</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {safeToLocaleString(allTeams.reduce((sum, team) => sum + team.fans, 0))}
                  </p>
                </div>
                <Users className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Trophies</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {allTeams.reduce((sum, team) => sum + team.trophies, 0)}
                  </p>
                </div>
                <Trophy className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Categories</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">3</p>
                </div>
                <Award className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Clubs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedTeams.map((team) => {
>>>>>>> Stashed changes
=======
        {/* Clubs Grid */}
        {!teamsLoading && !competitionsLoading && !teamsError && !competitionsError && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedTeams.map((team: any) => {
>>>>>>> 63834b673c58e2916cb3c44ff8f79173cfc57ba8
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
                      <div className="text-lg font-bold text-black dark:text-white">{safeToLocaleString(team.fans)}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Fans</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-lg font-bold text-black dark:text-white">{team.trophies}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Trophies</div>
                    </div>
                  </div>

                  {team.stadium !== "Various" && team.stadium !== "Online" && (
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1">
                        <Building className="h-4 w-4 text-gray-400" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {team.stadium}
                        </span>
                      </div>
                      {team.capacity > 0 && (
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {safeToLocaleString(team.capacity)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2 mb-4">
                    <Badge className={`${getCategoryColor(team.category)} text-xs`}>
                      {team.category}
                    </Badge>
                    {team.tags.slice(0, 2).map((tag, index) => (
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
        )}

        {sortedTeams.length === 0 && !teamsLoading && !competitionsLoading && !teamsError && !competitionsError && (
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
            <CardContent className="p-8 text-center">
              <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No clubs found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
              <Button 
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                }}
                className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 