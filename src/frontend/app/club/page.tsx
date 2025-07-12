"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Menu, Users, Trophy, Calendar, MapPin, Star, ExternalLink, Heart, Share2, Filter, Shield, TrendingUp, Award, Activity, Search, MessageCircle, Gift, MessageSquare, Instagram, Facebook, X, Wallet, Coins, Loader2 } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useBlockchain } from "@/hooks/use-blockchain"
import { useToast } from "@/hooks/use-toast"
import { ethers } from "ethers"

export default function ClubPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [activeView, setActiveView] = useState<"club" | "fangroup">("club")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [showProductModal, setShowProductModal] = useState(false)
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [selectedColor, setSelectedColor] = useState<string>("")
  const [userBalance, setUserBalance] = useState<string>("0")
  const [isLoadingBalance, setIsLoadingBalance] = useState(false)
  const [isProcessingPurchase, setIsProcessingPurchase] = useState(false)

  // Blockchain integration
  const {
    isConnected,
    address,
    connectWallet,
    formatTokenAmount,
    transactionState,
    isCorrectNetwork,
    switchNetwork
  } = useBlockchain()

  const clubInfo = {
    name: "Chelsea Football Club",
    shortName: "Chelsea FC",
    founded: 1905,
    stadium: "Stamford Bridge",
    members: 12000000,
    colors: ["#003366", "#FFFFFF"],
  }

  // Load user's CHZ balance
  useEffect(() => {
    if (isConnected && address) {
      loadUserBalance()
      toast({
        title: "Wallet Connected",
        description: `Connected to ${address.slice(0, 6)}...${address.slice(-4)}`,
      })
    } else {
      setUserBalance("0")
    }
  }, [isConnected, address, toast])

  const loadUserBalance = async () => {
    if (!window.ethereum || !address) return
    
    setIsLoadingBalance(true)
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const balance = await provider.getBalance(address)
      setUserBalance(ethers.utils.formatEther(balance))
    } catch (error) {
      console.error("Failed to load balance:", error)
      setUserBalance("0")
    } finally {
      setIsLoadingBalance(false)
    }
  }

  // Handle product purchase with blockchain
  const handlePurchase = async (product: any) => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to make a purchase",
        variant: "destructive"
      })
      return
    }

    if (!isCorrectNetwork) {
      toast({
        title: "Wrong Network",
        description: "Please switch to Chiliz Spicy Testnet to make purchases",
        variant: "destructive"
      })
      return
    }

    if (!window.ethereum) {
      toast({
        title: "No Wallet",
        description: "Please install MetaMask or another wallet",
        variant: "destructive"
      })
      return
    }

    // Check if user has enough balance
    const productPrice = ethers.utils.parseEther(product.price.toString())
    const userBalanceWei = ethers.utils.parseEther(userBalance)
    
    if (userBalanceWei.lt(productPrice)) {
      toast({
        title: "Insufficient Balance",
        description: `You need ${product.price.toLocaleString()} CHZ but have ${formatTokenAmount(userBalance)} CHZ`,
        variant: "destructive"
      })
      return
    }

    setIsProcessingPurchase(true)

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      
      // For this demo, we'll simulate a marketplace purchase
      // In a real implementation, this would call the buyMarketplaceItem function
      // from the blockchain library with the actual marketplace contract
      
      // Simulate the purchase by sending CHZ to a demo club owner address
      // This represents the marketplace transaction
      const clubOwnerAddress = "0x6B509c04e3caA2207b8f2A60A067a8ddED03b8d0" // Demo club owner
      
      const tx = await signer.sendTransaction({
        to: clubOwnerAddress,
        value: productPrice,
        gasLimit: 100000, // Higher gas limit for marketplace transactions
        data: ethers.utils.hexlify(ethers.utils.toUtf8Bytes(`Purchase: ${product.name}`)) // Add purchase data
      })

      toast({
        title: "Transaction Submitted",
        description: "Your purchase is being processed on the blockchain...",
      })

      const receipt = await tx.wait()

      toast({
        title: "Purchase Successful! 🎉",
        description: `${product.name} purchased for ${product.price.toLocaleString()} CHZ. Transaction: ${receipt.transactionHash.slice(0, 10)}...`,
      })

      // Refresh balance
      await loadUserBalance()
      setShowProductModal(false)
      
    } catch (error: any) {
      console.error("Purchase error:", error)
      
      let errorMessage = "Purchase failed"
      if (error.code === 4001) {
        errorMessage = "Transaction was cancelled by user"
      } else if (error.message?.includes("insufficient funds")) {
        errorMessage = "Insufficient CHZ balance for purchase and gas fees"
      } else if (error.message?.includes("user rejected")) {
        errorMessage = "Transaction was rejected"
      } else if (error.message?.includes("gas")) {
        errorMessage = "Gas estimation failed. Please try again."
      } else if (error.message?.includes("network")) {
        errorMessage = "Network error. Please check your connection."
      }
      
      toast({
        title: "Purchase Failed",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setIsProcessingPurchase(false)
    }
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

  const shopProducts = [
    {
      id: 1,
      name: "Blue Pride T-Shirt",
      description: "Official group t-shirt with logo",
      price: 2500,
      image: "/placeholder.svg?height=200&width=200",
      category: "Clothing",
      sizes: ["S", "M", "L", "XL"],
      colors: ["Blue", "White", "Black"],
      inStock: true,
      rating: 4.8,
      reviews: 124
    },
    {
      id: 2,
      name: "Group Hoodie",
      description: "Warm hoodie with group branding",
      price: 4500,
      image: "/placeholder.svg?height=200&width=200",
      category: "Clothing",
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: ["Navy", "Gray", "Black"],
      inStock: true,
      rating: 4.9,
      reviews: 89
    },
    {
      id: 3,
      name: "Scarf",
      description: "Official group scarf",
      price: 1500,
      image: "/placeholder.svg?height=200&width=200",
      category: "Accessories",
      colors: ["Blue/White", "Navy/Gold"],
      inStock: true,
      rating: 4.7,
      reviews: 156
    },
    {
      id: 4,
      name: "Cap",
      description: "Baseball cap with group logo",
      price: 1800,
      image: "/placeholder.svg?height=200&width=200",
      category: "Accessories",
      colors: ["Blue", "Black", "White"],
      inStock: true,
      rating: 4.6,
      reviews: 203
    },
    {
      id: 5,
      name: "Stickers Pack",
      description: "Set of 5 group stickers",
      price: 800,
      image: "/placeholder.svg?height=200&width=200",
      category: "Accessories",
      inStock: true,
      rating: 4.5,
      reviews: 67
    },
    {
      id: 6,
      name: "Pin Badge",
      description: "Collectible pin badge",
      price: 500,
      image: "/placeholder.svg?height=200&width=200",
      category: "Accessories",
      inStock: true,
      rating: 4.8,
      reviews: 234
    }
  ]

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
          <div className="flex items-center gap-3">
            {/* Wallet Connection & Balance */}
            {isConnected ? (
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg">
                <Wallet className="h-4 w-4 text-green-600" />
                <div className="text-sm">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </div>
                  <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                    <Coins className="h-3 w-3" />
                    {isLoadingBalance ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <span>{formatTokenAmount(userBalance)} CHZ</span>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-gray-200 dark:hover:bg-gray-700"
                      onClick={loadUserBalance}
                      disabled={isLoadingBalance}
                    >
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <Button 
                onClick={connectWallet}
                className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
              >
                <Wallet className="h-4 w-4 mr-2" />
                Connect Wallet
              </Button>
            )}
            <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              <Share2 className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      {/* Network Warning */}
      {isConnected && !isCorrectNetwork && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-yellow-600" />
              <div>
                <div className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                  Wrong Network
                </div>
                <div className="text-xs text-yellow-700 dark:text-yellow-300">
                  Please switch to Chiliz Spicy Testnet to use the marketplace
                </div>
              </div>
            </div>
            <Button
              size="sm"
              onClick={switchNetwork}
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              Switch Network
            </Button>
          </div>
        </div>
      )}

      {/* Transaction Status */}
      {transactionState.isPending && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800 px-4 py-3">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            <div className="flex-1">
              <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Transaction in Progress
              </div>
              <div className="text-xs text-blue-700 dark:text-blue-300">
                Please wait while your transaction is being processed...
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Toggle */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                      <Button
              variant={activeView === "club" ? "default" : "ghost"}
              className={`flex-1 ${
                activeView === "club"
                  ? "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
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
                  ? "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
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
            <div className="h-32 bg-gradient-to-r from-black to-gray-700 dark:from-white dark:to-gray-300"></div>
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-end gap-4">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-black dark:text-white">CFC</span>
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
                <Button className="bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black">
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
                  <Trophy className="h-6 w-6 text-black dark:text-white mx-auto mb-2" />
                  <div className="text-xl font-bold text-gray-900 dark:text-white">34</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Titles</div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
                <CardContent className="p-4 text-center">
                  <Users className="h-6 w-6 text-black dark:text-white mx-auto mb-2" />
                  <div className="text-xl font-bold text-gray-900 dark:text-white">35K</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">On TRBE</div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
                <CardContent className="p-4 text-center">
                  <Star className="h-6 w-6 text-black dark:text-white mx-auto mb-2" />
                  <div className="text-xl font-bold text-gray-900 dark:text-white">#2</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Ranking</div>
                </CardContent>
              </Card>
            </div>

            {/* Club Tabs */}
            <Tabs defaultValue="games" className="w-full">
              <TabsList className="grid w-full grid-cols-5 bg-gray-100 dark:bg-gray-800">
                <TabsTrigger
                  value="games"
                  className="data-[state=active]:bg-black dark:data-[state=active]:bg-white data-[state=active]:text-white dark:data-[state=active]:text-black text-xs"
                >
                  Games
                </TabsTrigger>
                <TabsTrigger
                  value="fangroups"
                  className="data-[state=active]:bg-black dark:data-[state=active]:bg-white data-[state=active]:text-white dark:data-[state=active]:text-black text-xs"
                >
                  Fan Groups
                </TabsTrigger>
                <TabsTrigger
                  value="news"
                  className="data-[state=active]:bg-black dark:data-[state=active]:bg-white data-[state=active]:text-white dark:data-[state=active]:text-black text-xs"
                >
                  News
                </TabsTrigger>
                <TabsTrigger
                  value="store"
                  className="data-[state=active]:bg-black dark:data-[state=active]:bg-white data-[state=active]:text-white dark:data-[state=active]:text-black text-xs"
                >
                  Store
                </TabsTrigger>
                <TabsTrigger
                  value="ranking"
                  className="data-[state=active]:bg-black dark:data-[state=active]:bg-white data-[state=active]:text-white dark:data-[state=active]:text-black text-xs"
                >
                  Top Fans
                </TabsTrigger>
              </TabsList>

              <TabsContent value="games" className="space-y-4">
                <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-black dark:text-white" />
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
                    className={`bg-white dark:bg-gray-900 ${fanGroup.isUserMember ? "border-black dark:border-white" : "border-gray-200 dark:border-gray-800"} shadow-sm`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white">{fanGroup.name}</h3>
                            {fanGroup.isUserMember && <Badge className="bg-black dark:bg-white text-white dark:text-black text-xs">Member</Badge>}
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
                          <div className="text-lg font-bold text-black dark:text-white">
                            {(fanGroup.totalPoints / 1000000).toFixed(1)}M
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">total tokens</div>
                        </div>
                      </div>

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
                            <Button size="sm" variant="ghost" className="text-black dark:text-white hover:bg-black/10 dark:hover:bg-white/10">
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

              <TabsContent value="store" className="space-y-4">
                {/* Wallet Connection Instructions */}
                {!isConnected && (
                  <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                    <CardHeader>
                      <CardTitle className="text-blue-900 dark:text-blue-100 flex items-center gap-2">
                        <Wallet className="h-5 w-5" />
                        Connect Your Wallet
                      </CardTitle>
                      <CardDescription className="text-blue-700 dark:text-blue-300">
                        Connect your wallet to purchase items with CHZ tokens on the blockchain
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        onClick={connectWallet}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Wallet className="h-4 w-4 mr-2" />
                        Connect Wallet to Shop
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Network Instructions */}
                {isConnected && !isCorrectNetwork && (
                  <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                    <CardHeader>
                      <CardTitle className="text-yellow-900 dark:text-yellow-100 flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Switch Network
                      </CardTitle>
                      <CardDescription className="text-yellow-700 dark:text-yellow-300">
                        You need to be on Chiliz Spicy Testnet to use the marketplace
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        onClick={switchNetwork}
                        className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                      >
                        Switch to Chiliz Spicy Testnet
                      </Button>
                    </CardContent>
                  </Card>
                )}

                <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                      <Gift className="h-5 w-5 text-black dark:text-white" />
                      Socios.com Store
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                      Buy official fan tokens, merchandise, and more on Socios.com.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href="https://socios.com/shop" target="_blank" rel="noopener noreferrer">
                      <Button className="w-full bg-green-600 hover:bg-green-700 text-white text-base font-semibold flex items-center justify-center gap-2" size="lg">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Visit Socios.com Store
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
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
                            <span className="text-lg font-bold text-black dark:text-white">#{fan.position}</span>
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
                                              <div className="font-bold text-black dark:text-white">{fan.points.toLocaleString()}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">tokens</div>
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
              {/* Background Banner */}
              <div className="h-48 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-500 relative overflow-hidden">
                {/* Geometric Shapes */}
                <div className="absolute top-4 right-20 w-16 h-16 bg-white/10 rounded-full"></div>
                <div className="absolute bottom-8 left-8 w-8 h-8 bg-white/10 rounded-full"></div>
                <div className="absolute top-16 left-1/4 w-12 h-12 bg-white/5 rotate-45"></div>
                <div className="absolute top-8 right-8 w-6 h-6 bg-white/15 rounded-full"></div>
                <div className="absolute bottom-16 right-1/3 w-10 h-10 bg-white/8 rounded-full"></div>
              </div>
              <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
              
              {/* Search button in top right */}
              <div className="absolute top-4 right-4 z-10">
                <Button 
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 transition-all duration-200"
                  onClick={() => router.push("/fan-groups")}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              
                            <div className="absolute inset-0 flex items-center">
                <div className="flex items-center gap-4 px-4">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl font-bold text-black dark:text-white">BP</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h1 className="text-xl font-bold text-white break-words pr-8">{userFanGroup.name}</h1>
                    <p className="text-sm text-gray-200">Member since 2023</p>
                    <p className="text-sm text-gray-300 mt-1 max-w-md line-clamp-2">
                      {userFanGroup.description || "The largest organized supporter group of Chelsea FC, bringing together passionate fans from around the world to celebrate our beloved club."}
                    </p>
                    <div className="flex items-center gap-4 mt-2 flex-wrap">
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
                </div>
              </div>
              
              {/* Active Member Button - positioned at bottom right */}
              <div className="absolute bottom-4 right-4">
                <Button className="bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black flex-shrink-0">
                  <Users className="h-4 w-4 mr-2" />
                  Active Member
                </Button>
              </div>
            </div>
          )}

          <div className="p-4 space-y-6">
            {/* Fan Group Overview Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
                <CardContent className="p-4 text-center">
                  <Users className="h-6 w-6 text-black dark:text-white mx-auto mb-2" />
                  <div className="text-xl font-bold text-gray-900 dark:text-white">{fanGroups.length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Active Groups</div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="h-6 w-6 text-black dark:text-white mx-auto mb-2" />
                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                    +{fanGroups.reduce((total, fg) => total + fg.weeklyGrowth, 0)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">New Members/Week</div>
                </CardContent>
              </Card>
            </div>

            {/* Fan Groups Tabs */}
            <Tabs defaultValue="events" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-gray-100 dark:bg-gray-800">
              <TabsTrigger
                  value="events"
                  className="data-[state=active]:bg-black dark:data-[state=active]:bg-white data-[state=active]:text-white dark:data-[state=active]:text-black text-xs"
                >
                  Events
                </TabsTrigger>
                <TabsTrigger
                  value="communication"
                  className="data-[state=active]:bg-black dark:data-[state=active]:bg-white data-[state=active]:text-white dark:data-[state=active]:text-black text-xs"
                >
                  Communication
                </TabsTrigger>
                <TabsTrigger
                  value="shop"
                  className="data-[state=active]:bg-black dark:data-[state=active]:bg-white data-[state=active]:text-white dark:data-[state=active]:text-black text-xs"
                >
                  Shop
                </TabsTrigger>
                <TabsTrigger
                  value="rankings"
                  className="data-[state=active]:bg-black dark:data-[state=active]:bg-white data-[state=active]:text-white dark:data-[state=active]:text-black text-xs"
                >
                  Rankings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="communication" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Official Channels */}
                  <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                        <MessageCircle className="h-5 w-5 text-black dark:text-white" />
                        Official Channels
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-500 rounded-full">
                            <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">WhatsApp Group</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Main discussion group</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                                    {/* Social Media */}
                  <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                        <Share2 className="h-5 w-5 text-black dark:text-white" />
                        Social Media
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                            <svg className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">Twitter</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">@BluePrideOfficial</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="border-gray-200 dark:border-gray-700">
                          Follow
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-full">
                            <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">Instagram</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">@bluepride_official</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="border-gray-200 dark:border-gray-700">
                          Follow
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-600 rounded-full">
                            <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">Facebook</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Blue Pride Official</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="border-gray-200 dark:border-gray-700">
                          Follow
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="shop" className="space-y-4">
                <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                      <Gift className="h-5 w-5 text-black dark:text-white" />
                      Group Merchandise
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                      Exclusive merchandise for group members
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {shopProducts.map((product) => (
                        <Card 
                          key={product.id} 
                          className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                                     onClick={() => {
                             setSelectedProduct(product)
                             setSelectedSize("")
                             setSelectedColor("")
                             setShowProductModal(true)
                           }}
                        >
                          <CardContent className="p-4">
                            <div className="w-full h-32 bg-gray-100 dark:bg-gray-700 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden">
                              <img 
                                src={product.image} 
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                              
                            </div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{product.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{product.description}</p>
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-lg font-bold text-black dark:text-white">{product.price.toLocaleString()} CHZ</span>
                                {isConnected && (
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {!isCorrectNetwork ? (
                                      <span className="text-yellow-600">⚠ Wrong network</span>
                                    ) : parseFloat(userBalance) >= product.price ? (
                                      <span className="text-green-600">✓ You can afford this</span>
                                    ) : (
                                      <span className="text-red-600">✗ Insufficient balance</span>
                                    )}
                                  </div>
                                )}
                              </div>
                              <Button 
                                size="sm" 
                                className={`font-medium px-4 py-2 rounded-lg transition-all duration-200 border-2 border-transparent ${
                                  isConnected && isCorrectNetwork && parseFloat(userBalance) >= product.price
                                    ? "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 hover:border-gray-300 dark:hover:border-gray-600"
                                    : "bg-gray-400 dark:bg-gray-600 text-gray-200 dark:text-gray-400 cursor-not-allowed"
                                }`}
                                                                  onClick={(e) => {
                                    e.stopPropagation()
                                    if (!isConnected) {
                                      toast({
                                        title: "Wallet Required",
                                        description: "Please connect your wallet to purchase items",
                                        variant: "destructive"
                                      })
                                      return
                                    }
                                    if (!isCorrectNetwork) {
                                      toast({
                                        title: "Wrong Network",
                                        description: "Please switch to Chiliz Spicy Testnet to purchase items",
                                        variant: "destructive"
                                      })
                                      return
                                    }
                                    if (parseFloat(userBalance) < product.price) {
                                      toast({
                                        title: "Insufficient Balance",
                                        description: `You need ${product.price.toLocaleString()} CHZ but have ${formatTokenAmount(userBalance)} CHZ`,
                                        variant: "destructive"
                                      })
                                      return
                                    }
                                    setSelectedProduct(product)
                                    setSelectedSize("")
                                    setSelectedColor("")
                                    setShowProductModal(true)
                                  }}
                                  disabled={!isConnected || !isCorrectNetwork || parseFloat(userBalance) < product.price}
                                                              >
                                  {!isConnected ? "Connect Wallet" : !isCorrectNetwork ? "Wrong Network" : "Buy"}
                                </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="events" className="space-y-4">
                <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-black dark:text-white" />
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
                                "bg-black dark:bg-white text-white dark:text-black"
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
                        <Button size="sm" variant="outline" className="border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black">
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
                      <Award className="h-5 w-5 text-black dark:text-white" />
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
                          className={`flex items-center justify-between p-4 rounded-lg ${
                            fanGroup.isUserMember ? "bg-black/10 border border-black dark:border-white" : "bg-gray-50 dark:bg-gray-800"
                          }`}
                        >
                                                      <div className="flex items-center gap-4">
                              <div className="w-10 text-center">
                                <span className={`text-xl font-bold ${
                                  fanGroup.ranking === 1 ? "text-yellow-500" :
                                  fanGroup.ranking === 2 ? "text-gray-400" :
                                  fanGroup.ranking === 3 ? "text-amber-600" :
                                  "text-black dark:text-white"
                                }`}>
                                  #{fanGroup.ranking}
                                </span>
                              </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-gray-900 dark:text-white">{fanGroup.name}</h4>
                                {fanGroup.isUserMember && (
                                  <Badge className="bg-black dark:bg-white text-white dark:text-black text-xs">Your Group</Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                <span>{fanGroup.members.toLocaleString()} members</span>
                                <span>Avg: {Math.round(fanGroup.totalPoints / fanGroup.members)} tokens/member</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-black dark:text-white">
                              {(fanGroup.totalPoints / 1000000).toFixed(1)}M
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">total tokens</div>
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

      {/* Product Detail Modal */}
      {showProductModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img 
                src={selectedProduct.image} 
                alt={selectedProduct.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-900 rounded-full"
                onClick={() => setShowProductModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
              
            </div>
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    {selectedProduct.name}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedProduct.category}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-black dark:text-white">
                    {selectedProduct.price.toLocaleString()} tokens
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400">
                    In Stock
                  </div>
                </div>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-6">
                {selectedProduct.description}
              </p>

                             {selectedProduct.sizes && (
                 <div className="mb-6">
                   <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Size</h3>
                   <div className="flex gap-2">
                     {selectedProduct.sizes.map((size: string) => (
                       <Button
                         key={size}
                         variant={selectedSize === size ? "default" : "outline"}
                         size="sm"
                         className={`${
                           selectedSize === size 
                             ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white" 
                             : "border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                         }`}
                         onClick={() => setSelectedSize(size)}
                       >
                         {size}
                       </Button>
                     ))}
                   </div>
                 </div>
               )}

                             {selectedProduct.colors && (
                 <div className="mb-6">
                   <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Color</h3>
                   <div className="flex gap-2">
                     {selectedProduct.colors.map((color: string) => (
                       <Button
                         key={color}
                         variant={selectedColor === color ? "default" : "outline"}
                         size="sm"
                         className={`${
                           selectedColor === color 
                             ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white" 
                             : "border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                         }`}
                         onClick={() => setSelectedColor(color)}
                       >
                         {color}
                       </Button>
                     ))}
                   </div>
                 </div>
               )}

                             <div className="space-y-3">
                 <Button 
                   className={`w-full font-semibold py-4 rounded-xl transition-all duration-200 border-2 border-transparent shadow-lg hover:shadow-xl ${
                     (selectedProduct.sizes && !selectedSize) || (selectedProduct.colors && !selectedColor) || isProcessingPurchase
                       ? "bg-gray-400 dark:bg-gray-600 text-gray-200 dark:text-gray-400 cursor-not-allowed"
                       : "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 hover:border-gray-300 dark:hover:border-gray-600"
                   }`}
                   onClick={() => {
                     if ((selectedProduct.sizes && !selectedSize) || (selectedProduct.colors && !selectedColor)) {
                       toast({
                         title: "Selection Required",
                         description: "Please select size and color before purchasing",
                         variant: "destructive"
                       })
                       return
                     }
                     
                     handlePurchase(selectedProduct)
                   }}
                   disabled={(selectedProduct.sizes && !selectedSize) || (selectedProduct.colors && !selectedColor) || isProcessingPurchase}
                 >
                   {isProcessingPurchase ? (
                     <div className="flex items-center gap-2">
                       <Loader2 className="h-4 w-4 animate-spin" />
                       Processing...
                     </div>
                   ) : selectedProduct.sizes && !selectedSize 
                     ? "Select Size" 
                     : selectedProduct.colors && !selectedColor 
                     ? "Select Color" 
                     : `Purchase for ${selectedProduct.price.toLocaleString()} CHZ`
                   }
                 </Button>
                 
                 <Button 
                   variant="outline" 
                   className="w-full border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 py-4 rounded-xl"
                   onClick={() => setShowProductModal(false)}
                 >
                   Cancel
                 </Button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
