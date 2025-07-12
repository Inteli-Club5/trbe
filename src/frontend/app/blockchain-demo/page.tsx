"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BlockchainStatus } from "@/components/blockchain-status"
import { useBlockchain } from "@/hooks/use-blockchain"
import { useFanClubs } from "@/hooks/use-fan-clubs"
import { useReputation } from "@/hooks/use-reputation"
import { useToast } from "@/hooks/use-toast"
import {
  ArrowLeft,
  Wallet,
  Users,
  Star,
  Trophy,
  Heart,
  X,
  Plus,
  Minus,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Crown,
  Shield,
  Zap,
  Copy,
  RefreshCw,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"

export default function BlockchainDemoPage() {
  const [newClubId, setNewClubId] = useState("")
  const [newClubPrice, setNewClubPrice] = useState("0.1")
  const [testLikes, setTestLikes] = useState(1)
  const [testComments, setTestComments] = useState(1)
  const [testRetweets, setTestRetweets] = useState(1)

  const blockchain = useBlockchain()
  const fanClubs = useFanClubs()
  const reputation = useReputation()
  const { toast } = useToast()

  // Copy address to clipboard
  const copyAddress = async () => {
    if (blockchain.address) {
      try {
        await navigator.clipboard.writeText(blockchain.address)
        toast({
          title: "Address Copied",
          description: "Wallet address copied to clipboard",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to copy address",
          variant: "destructive",
        })
      }
    }
  }

  // Create new fan club
  const handleCreateFanClub = async () => {
    if (!newClubId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a fan club ID",
        variant: "destructive",
      })
      return
    }

    const success = await fanClubs.createFanClub(newClubId, newClubPrice)
    if (success) {
      setNewClubId("")
      setNewClubPrice("0.1")
      toast({
        title: "Success",
        description: `Fan club "${newClubId}" created successfully!`,
      })
    }
  }

  // Join fan club
  const handleJoinFanClub = async (clubId: string) => {
    const success = await fanClubs.joinFanClub(clubId, "0.1")
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

  // Update reputation
  const handleUpdateReputation = async () => {
    const success = await reputation.updateFromSocialActivity({
      likes: testLikes,
      comments: testComments,
      retweets: testRetweets,
    })

    if (success) {
      toast({
        title: "Reputation Updated",
        description: "Your reputation has been updated on the blockchain!",
      })
    }
  }

  // Quick reputation actions
  const handleQuickAction = async (action: string, count: number = 1) => {
    let success = false
    
    switch (action) {
      case 'likes':
        success = await reputation.addLikes(count)
        break
      case 'comments':
        success = await reputation.addComments(count)
        break
      case 'retweets':
        success = await reputation.addRetweets(count)
        break
      case 'hashtags':
        success = await reputation.addHashtags(count)
        break
      case 'checkins':
        success = await reputation.addCheckIns(count)
        break
      case 'games':
        success = await reputation.addGameParticipation(count)
        break
      case 'reports':
        success = await reputation.addReports(count)
        break
    }

    if (success) {
      toast({
        title: "Action Recorded",
        description: `${action.charAt(0).toUpperCase() + action.slice(1)} recorded on blockchain!`,
      })
    }
  }

  // Sample fan clubs for demo
  const sampleClubs = [
    { id: "chelsea", name: "Chelsea FC", price: "0.1" },
    { id: "manchester-united", name: "Manchester United", price: "0.1" },
    { id: "liverpool", name: "Liverpool FC", price: "0.1" },
    { id: "arsenal", name: "Arsenal FC", price: "0.1" },
  ]

  return (
    <div className="bg-white dark:bg-black text-gray-900 dark:text-white min-h-screen">
      {/* Header */}
      <header className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 p-4 shadow-sm dark:shadow-none">
        <div className="flex items-center justify-between">
          <Link href="/homepage">
            <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Blockchain Demo</h1>
          <div></div>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Blockchain Status */}
        <BlockchainStatus />

        {/* Wallet Information */}
        {blockchain.isConnected && (
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Wallet Information
                </span>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={copyAddress}
                    className="border-gray-200 dark:border-gray-700"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Address
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={blockchain.switchNetwork}
                    disabled={blockchain.isCorrectNetwork}
                    className="border-gray-200 dark:border-gray-700"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Switch Network
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Address:</span>
                  <span className="text-sm font-mono text-gray-900 dark:text-white">
                    {blockchain.formatUserAddress(blockchain.address || "")}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Network:</span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {blockchain.isCorrectNetwork ? "Chiliz Spicy Testnet" : "Wrong Network"}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                  <span className={`text-sm ${blockchain.isCorrectNetwork ? "text-green-600" : "text-red-600"}`}>
                    {blockchain.isCorrectNetwork ? "Connected" : "Wrong Network"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Demo Tabs */}
        <Tabs defaultValue="fan-clubs" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-800">
            <TabsTrigger value="fan-clubs" className="data-[state=active]:bg-black dark:data-[state=active]:bg-white data-[state=active]:text-white dark:data-[state=active]:text-black">
              Fan Clubs
            </TabsTrigger>
            <TabsTrigger value="reputation" className="data-[state=active]:bg-black dark:data-[state=active]:bg-white data-[state=active]:text-white dark:data-[state=active]:text-black">
              Reputation
            </TabsTrigger>
            <TabsTrigger value="transactions" className="data-[state=active]:bg-black dark:data-[state=active]:bg-white data-[state=active]:text-white dark:data-[state=active]:text-black">
              Transactions
            </TabsTrigger>
          </TabsList>

          {/* Fan Clubs Tab */}
          <TabsContent value="fan-clubs" className="space-y-4">
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
                      disabled={fanClubs.isLoading || blockchain.transactionState.isPending}
                      className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                    >
                      {fanClubs.isLoading ? "Creating..." : "Create Club"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Sample Fan Clubs */}
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Sample Fan Clubs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sampleClubs.map((club) => (
                    <div key={club.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{club.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {club.price} CHZ
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Join this fan club to connect with other supporters
                      </p>
                      {blockchain.isConnected ? (
                        fanClubs.isMember(club.id) ? (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleLeaveFanClub(club.id)}
                            disabled={fanClubs.isLoading || blockchain.transactionState.isPending}
                            className="w-full border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Leave Club
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            onClick={() => handleJoinFanClub(club.id)}
                            disabled={fanClubs.isLoading || blockchain.transactionState.isPending}
                            className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                          >
                            <Heart className="h-4 w-4 mr-2" />
                            Join Club
                          </Button>
                        )
                      ) : (
                        <Button 
                          size="sm" 
                          onClick={blockchain.connectWallet}
                          className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                        >
                          <Wallet className="h-4 w-4 mr-2" />
                          Connect Wallet
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reputation Tab */}
          <TabsContent value="reputation" className="space-y-4">
            {/* Current Reputation */}
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Current Reputation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="text-4xl font-bold text-gray-900 dark:text-white">
                    {blockchain.isConnected ? reputation.reputation : "---"}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {blockchain.isConnected ? reputation.getReputationLevel(reputation.reputation) : "Connect wallet to see reputation"}
                  </div>
                  <Badge className={`${blockchain.isConnected ? reputation.getReputationBadgeColor(reputation.reputation) : "bg-gray-500"} text-white`}>
                    {blockchain.isConnected ? reputation.getReputationLevel(reputation.reputation) : "Not Connected"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Update Reputation */}
            {blockchain.isConnected && (
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Update Reputation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Likes</label>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => setTestLikes(Math.max(0, testLikes - 1))}
                          disabled={reputation.isLoading}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-lg font-semibold min-w-[2rem] text-center">{testLikes}</span>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => setTestLikes(testLikes + 1)}
                          disabled={reputation.isLoading}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Comments</label>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => setTestComments(Math.max(0, testComments - 1))}
                          disabled={reputation.isLoading}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-lg font-semibold min-w-[2rem] text-center">{testComments}</span>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => setTestComments(testComments + 1)}
                          disabled={reputation.isLoading}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Retweets</label>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => setTestRetweets(Math.max(0, testRetweets - 1))}
                          disabled={reputation.isLoading}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-lg font-semibold min-w-[2rem] text-center">{testRetweets}</span>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => setTestRetweets(testRetweets + 1)}
                          disabled={reputation.isLoading}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Button 
                    onClick={handleUpdateReputation}
                    disabled={reputation.isLoading || blockchain.transactionState.isPending}
                    className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                  >
                    {reputation.isLoading ? "Updating..." : "Update Reputation on Blockchain"}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            {blockchain.isConnected && (
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleQuickAction('likes')}
                      disabled={reputation.isLoading || blockchain.transactionState.isPending}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      +1 Like
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => handleQuickAction('comments')}
                      disabled={reputation.isLoading || blockchain.transactionState.isPending}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      +1 Comment
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => handleQuickAction('retweets')}
                      disabled={reputation.isLoading || blockchain.transactionState.isPending}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <TrendingUp className="h-4 w-4 mr-2" />
                      +1 Retweet
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => handleQuickAction('checkins')}
                      disabled={reputation.isLoading || blockchain.transactionState.isPending}
                      className="bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      +1 Check-in
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-4">
            {/* Transaction Status */}
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Transaction Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                    <span className={`text-sm ${blockchain.transactionState.isPending ? "text-yellow-600" : blockchain.transactionState.error ? "text-red-600" : "text-green-600"}`}>
                      {blockchain.transactionState.isPending ? "Pending" : blockchain.transactionState.error ? "Failed" : "Ready"}
                    </span>
                  </div>
                  {blockchain.transactionState.hash && (
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Transaction Hash:</span>
                      <span className="text-sm font-mono text-gray-900 dark:text-white">
                        {blockchain.formatUserAddress(blockchain.transactionState.hash)}
                      </span>
                    </div>
                  )}
                  {blockchain.transactionState.error && (
                    <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <span className="text-sm text-red-600 dark:text-red-400">Error:</span>
                      <span className="text-sm text-red-600 dark:text-red-400">
                        {blockchain.transactionState.error}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Network Information */}
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Network Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Network:</span>
                    <span className="text-sm text-gray-900 dark:text-white">Chiliz Spicy Testnet</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Chain ID:</span>
                    <span className="text-sm text-gray-900 dark:text-white">88882</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Currency:</span>
                    <span className="text-sm text-gray-900 dark:text-white">CHZ</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Block Explorer:</span>
                    <a 
                      href="https://spicy-explorer.chiliz.com/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      View Explorer
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 