"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sidebar } from "@/components/sidebar"
import { BlockchainStatus } from "@/components/blockchain-status"
import { Marketplace } from "@/components/marketplace"
import { useBlockchain } from "@/hooks/use-blockchain"
import { useFanClubs } from "@/hooks/use-fan-clubs"
import { useToast } from "@/hooks/use-toast"
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
  Wallet,
  X,
  ShoppingCart,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"

export default function ClubsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("fans")
  const [sortOrder, setSortOrder] = useState("desc")
  const [newClubId, setNewClubId] = useState("")
  const [newClubPrice, setNewClubPrice] = useState("0.1")
  const [activeTab, setActiveTab] = useState("clubs")
  const [selectedMarketplaceClub, setSelectedMarketplaceClub] = useState<string | null>(null)

  const blockchain = useBlockchain()
  const fanClubs = useFanClubs()
  const { toast } = useToast()

  // Load popular fan clubs on mount
  useEffect(() => {
    if (blockchain.isConnected) {
      // Load some popular fan clubs
      const popularClubs = ["chelsea", "manchester-united", "liverpool", "arsenal", "manchester-city"]
      popularClubs.forEach(clubId => {
        fanClubs.loadFanClub(clubId)
      })
    }
  }, [blockchain.isConnected, fanClubs])

  // Create new fan club
  const handleCreateFanClub = async () => {
    // Prevent multiple rapid clicks
    if (fanClubs.isLoading || blockchain.transactionState.isPending) {
      return
    }

    if (!newClubId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a fan club ID",
        variant: "destructive",
      })
      return
    }

    if (!newClubPrice || parseFloat(newClubPrice) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid price",
        variant: "destructive",
      })
      return
    }

    try {
      const success = await fanClubs.createFanClub(newClubId, newClubPrice)
      if (success) {
        setNewClubId("")
        setNewClubPrice("0.1")
        toast({
          title: "Success",
          description: `Fan club "${newClubId}" created successfully!`,
        })
      }
    } catch (error) {
      console.error("Error creating fan club:", error)
      toast({
        title: "Error",
        description: "Failed to create fan club. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Join fan club
  const handleJoinFanClub = async (clubId: string, price: string) => {
    const success = await fanClubs.joinFanClub(clubId, price)
    if (success) {
      toast({
        title: "Success",
        description: `Successfully joined fan club "${clubId}"!`,
      })
    }
  }

  // Leave fan club
  const handleLeaveFanClub = async (clubId: string) => {
    const success = await fanClubs.leaveFanClub(clubId)
    if (success) {
      toast({
        title: "Success",
        description: `Successfully left fan club "${clubId}"!`,
      })
    }
  }

  // Sample clubs data
  const clubs = [
    {
      id: "chelsea",
      name: "Chelsea FC",
      nickname: "The Blues",
      description: "One of England's most successful clubs, Chelsea FC has won multiple Premier League titles and European trophies.",
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
      achievements: [
        { name: "Premier League Champions 2021/22", icon: Trophy },
        { name: "Champions League Winners 2021", icon: Crown },
        { name: "FA Cup Winners 2022", icon: Medal }
      ],
      stats: {
        totalMatches: 456,
        totalFans: 154200,
        averageAttendance: 95.2,
        activeSupporters: 124500,
        seasonPoints: 67,
        leaguePosition: 4
      }
    },
    {
      id: "manchester-united",
      name: "Manchester United",
      nickname: "The Red Devils",
      description: "One of the world's most famous football clubs with a rich history and global fanbase.",
      league: "Premier League",
      location: "Manchester, England",
      founded: "1878",
      stadium: "Old Trafford",
      capacity: 74140,
      fans: 189500,
      trophies: 42,
      category: "elite",
      level: "exemplary",
      tags: ["Premier League", "Manchester", "Elite", "Global Brand"],
      recentActivity: "1 hour ago",
      upcomingMatches: 2,
      achievements: [
        { name: "Premier League Champions 2012/13", icon: Trophy },
        { name: "Champions League Winners 2008", icon: Crown },
        { name: "Most Successful English Club", icon: Award }
      ],
      stats: {
        totalMatches: 523,
        totalFans: 189500,
        averageAttendance: 98.7,
        activeSupporters: 156800,
        seasonPoints: 72,
        leaguePosition: 3
      }
    },
    {
      id: "liverpool",
      name: "Liverpool FC",
      nickname: "The Reds",
      description: "Liverpool FC, one of England's most successful clubs with a passionate fanbase and rich history.",
      league: "Premier League",
      location: "Liverpool, England",
      founded: "1892",
      stadium: "Anfield",
      capacity: 53394,
      fans: 167800,
      trophies: 38,
      category: "elite",
      level: "exemplary",
      tags: ["Premier League", "Liverpool", "Elite", "European Heritage"],
      recentActivity: "30 minutes ago",
      upcomingMatches: 1,
      achievements: [
        { name: "Premier League Champions 2019/20", icon: Trophy },
        { name: "Champions League Winners 2019", icon: Crown },
        { name: "You'll Never Walk Alone", icon: Heart }
      ],
      stats: {
        totalMatches: 498,
        totalFans: 167800,
        averageAttendance: 97.3,
        activeSupporters: 142600,
        seasonPoints: 69,
        leaguePosition: 2
      }
    },
    {
      id: "arsenal",
      name: "Arsenal FC",
      nickname: "The Gunners",
      description: "Arsenal FC, known for their attractive football and rich history in English football.",
      league: "Premier League",
      location: "London, England",
      founded: "1886",
      stadium: "Emirates Stadium",
      capacity: 60704,
      fans: 134600,
      trophies: 31,
      category: "elite",
      level: "commendable",
      tags: ["Premier League", "London", "Elite", "Attacking Football"],
      recentActivity: "45 minutes ago",
      upcomingMatches: 2,
      achievements: [
        { name: "Premier League Champions 2003/04", icon: Trophy },
        { name: "Invincibles Season", icon: Shield },
        { name: "FA Cup Specialists", icon: Medal }
      ],
      stats: {
        totalMatches: 445,
        totalFans: 134600,
        averageAttendance: 96.8,
        activeSupporters: 108900,
        seasonPoints: 75,
        leaguePosition: 1
      }
    },
    {
      id: "manchester-city",
      name: "Manchester City",
      nickname: "The Citizens",
      description: "Manchester City, recent Premier League dominators with a modern approach to football.",
      league: "Premier League",
      location: "Manchester, England",
      founded: "1880",
      stadium: "Etihad Stadium",
      capacity: 53400,
      fans: 118400,
      trophies: 18,
      category: "elite",
      level: "commendable",
      tags: ["Premier League", "Manchester", "Elite", "Modern Era"],
      recentActivity: "1 hour ago",
      upcomingMatches: 1,
      achievements: [
        { name: "Premier League Champions 2022/23", icon: Trophy },
        { name: "Champions League Winners 2023", icon: Crown },
        { name: "Treble Winners", icon: Star }
      ],
      stats: {
        totalMatches: 412,
        totalFans: 118400,
        averageAttendance: 94.5,
        activeSupporters: 95600,
        seasonPoints: 65,
        leaguePosition: 5
      }
    },
    {
      id: "tottenham",
      name: "Tottenham Hotspur",
      nickname: "The Lilywhites",
      description: "Tottenham Hotspur, a historic club with a passionate fanbase and modern stadium.",
      league: "Premier League",
      location: "London, England",
      founded: "1882",
      stadium: "Tottenham Hotspur Stadium",
      capacity: 62850,
      fans: 98700,
      trophies: 15,
      category: "premium",
      level: "respectable",
      tags: ["Premier League", "London", "Premium", "Modern Stadium"],
      recentActivity: "2 hours ago",
      upcomingMatches: 0,
      achievements: [
        { name: "Premier League Runners-up 2016/17", icon: Medal },
        { name: "Champions League Finalists 2019", icon: Trophy }
      ],
      stats: {
        totalMatches: 387,
        totalFans: 98700,
        averageAttendance: 91.2,
        activeSupporters: 78400,
        seasonPoints: 58,
        leaguePosition: 6
      }
    }
  ]

  // Auto-select first club for marketplace when tab is active
  useEffect(() => {
    if (activeTab === "marketplace" && !selectedMarketplaceClub && clubs.length > 0) {
      setSelectedMarketplaceClub(clubs[0].id);
    }
  }, [activeTab, selectedMarketplaceClub, clubs]);

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

  const filteredClubs = clubs
    .filter(club => 
      club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.league.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.location.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      let aValue, bValue
      switch (sortBy) {
        case "fans":
          aValue = a.fans
          bValue = b.fans
          break
        case "founded":
          aValue = parseInt(a.founded)
          bValue = parseInt(b.founded)
          break
        case "trophies":
          aValue = a.trophies
          bValue = b.trophies
          break
        case "capacity":
          aValue = a.capacity
          bValue = b.capacity
          break
        default:
          aValue = a.fans
          bValue = b.fans
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
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Football Clubs</h1>
          <Button size="sm" className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200">
            <Plus className="h-4 w-4 mr-2" />
            Add Club
          </Button>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Blockchain Status */}
        <BlockchainStatus />

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-800">
            <TabsTrigger
              value="clubs"
              className="data-[state=active]:bg-black dark:data-[state=active]:bg-white data-[state=active]:text-white dark:data-[state=active]:text-black"
            >
              <Building className="h-4 w-4 mr-2" />
              Fan Clubs
            </TabsTrigger>
            <TabsTrigger
              value="marketplace"
              className="data-[state=active]:bg-black dark:data-[state=active]:bg-white data-[state=active]:text-white dark:data-[state=active]:text-black"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Marketplace
            </TabsTrigger>
          </TabsList>

          <TabsContent value="clubs" className="space-y-6">
            {/* Create Fan Club */}
            {blockchain.isConnected && (
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create New Fan Club
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Fan Club ID (e.g., chelsea)"
                    value={newClubId}
                    onChange={(e) => setNewClubId(e.target.value)}
                    className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  />
                </div>
                <div className="flex-1">
                  <Input
                    placeholder="Join Price (CHZ)"
                    value={newClubPrice}
                    onChange={(e) => setNewClubPrice(e.target.value)}
                    type="number"
                    step="0.01"
                    min="0"
                    className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  />
                </div>
                <Button 
                  onClick={handleCreateFanClub}
                  disabled={fanClubs.isLoading || blockchain.transactionState.isPending || !newClubId.trim() || !newClubPrice || parseFloat(newClubPrice) <= 0}
                  className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {fanClubs.isLoading || blockchain.transactionState.isPending ? "Creating..." : "Create Club"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

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
          {filteredClubs.map((club) => {
            const LevelIcon = getLevelIcon(club.level)
            return (
              <Card key={club.id} className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-gray-900 dark:text-white mb-1">{club.name}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{club.nickname}</p>
                      <div className="flex items-center gap-2 mb-2">
                        <Flag className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{club.league}</span>
                      </div>
                    </div>
                    <Badge className={`${getLevelColor(club.level)} flex items-center gap-1`}>
                      <LevelIcon className="h-3 w-3" />
                      {club.level}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{club.description}</p>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-lg font-bold text-black dark:text-white">{club.fans.toLocaleString()}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Fans</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-lg font-bold text-black dark:text-white">{club.trophies}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Trophies</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      <Building className="h-4 w-4 text-gray-400" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {club.stadium}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {club.capacity.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 mb-4">
                    <Badge className={`${getCategoryColor(club.category)} text-xs`}>
                      {club.category}
                    </Badge>
                    {club.tags.slice(0, 2).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/clubs/${club.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                    {blockchain.isConnected ? (
                      fanClubs.isMember(club.id) ? (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleLeaveFanClub(club.id)}
                          disabled={fanClubs.isLoading || blockchain.transactionState.isPending}
                          className="border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Leave
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          onClick={() => handleJoinFanClub(club.id, "0.1")}
                          disabled={fanClubs.isLoading || blockchain.transactionState.isPending}
                          className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                        >
                          <Heart className="h-4 w-4 mr-2" />
                          Join
                        </Button>
                      )
                    ) : (
                      <Button 
                        size="sm" 
                        onClick={blockchain.connectWallet}
                        className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                      >
                        <Wallet className="h-4 w-4 mr-2" />
                        Connect
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredClubs.length === 0 && (
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
          </TabsContent>

          <TabsContent value="marketplace" className="space-y-6">
            {blockchain.isConnected ? (
              <div className="space-y-4">
                {/* Marketplace Selection */}
                <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5" />
                      Select Fan Club for Marketplace
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {clubs.map((club) => (
                        <Card 
                          key={club.id} 
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            selectedMarketplaceClub === club.id 
                              ? 'ring-2 ring-black dark:ring-white bg-gray-50 dark:bg-gray-800' 
                              : 'bg-white dark:bg-gray-900'
                          }`}
                          onClick={() => setSelectedMarketplaceClub(club.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-gray-900 dark:text-white">{club.name}</h3>
                              <Badge className={fanClubs.isOwner(club.id) ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"}>
                                {fanClubs.isOwner(club.id) ? "Owner" : fanClubs.isMember(club.id) ? "Member" : "Not Member"}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{club.nickname}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Marketplace Component */}
                {selectedMarketplaceClub && (
                  <Marketplace 
                    fanClubId={selectedMarketplaceClub} 
                    isOwner={fanClubs.isOwner(selectedMarketplaceClub)} 
                    isMember={fanClubs.isMember(selectedMarketplaceClub)} 
                  />
                )}
              </div>
            ) : (
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
                <CardContent className="p-6 text-center">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Connect Wallet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Connect your wallet to access the marketplace
                  </p>
                  <Button onClick={blockchain.connectWallet}>
                    Connect Wallet
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 