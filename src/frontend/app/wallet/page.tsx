"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BlockchainStatus } from "@/components/blockchain-status"
import { useBlockchain } from "@/hooks/use-blockchain"
import { useToast } from "@/hooks/use-toast"
import {
  ArrowLeft,
  Coins,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  History,
  ShoppingBag,
  ExternalLink,
  RefreshCw,
  Copy,
} from "lucide-react"
import Link from "next/link"

export default function WalletPage() {
  const [walletBalance] = useState(15420)
  const [lockedTokens] = useState(500)

  const blockchain = useBlockchain()
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

  // Refresh wallet data
  const refreshWallet = () => {
    if (blockchain.isConnected) {
      // This would typically refresh wallet data
      toast({
        title: "Refreshed",
        description: "Wallet data refreshed",
      })
    }
  }

  const transactions = [
    {
      id: 1,
      type: "earned",
      description: "Check-in at Stamford Bridge",
      amount: 200,
      date: "2 hours ago",
      status: "completed",
    },
    {
      id: 2,
      type: "earned",
      description: "Weekly challenge completed",
      amount: 500,
      date: "Yesterday",
      status: "completed",
    },
    {
      id: 3,
      type: "spent",
      description: "Official Chelsea jersey",
      amount: -800,
      date: "2 days ago",
      status: "completed",
    },
    {
      id: 4,
      type: "earned",
      description: "Post shared",
      amount: 50,
      date: "3 days ago",
      status: "completed",
    },
    {
      id: 5,
      type: "earned",
      description: "Official store purchase",
      amount: 150,
      date: "1 week ago",
      status: "completed",
    },
    {
      id: 6,
      type: "pending",
      description: "Loyalty bonus",
      amount: 300,
      date: "Processing",
      status: "pending",
    },
  ]

  const rewards = [
    {
      id: 1,
      name: "Official Jersey 2024",
      description: "Official Chelsea FC jersey 2024 season",
      price: 1200,
      image: "/placeholder.svg?height=100&width=100",
      category: "merchandise",
    },
    {
      id: 2,
      name: "VIP Ticket",
      description: "VIP ticket for the next game",
      price: 2000,
      image: "/placeholder.svg?height=100&width=100",
      category: "experience",
    },
    {
      id: 3,
      name: "20% Discount",
      description: "20% discount at official store",
      price: 500,
      image: "/placeholder.svg?height=100&width=100",
      category: "discount",
    },
    {
      id: 4,
      name: "Meet & Greet",
      description: "Meet the players experience",
      price: 5000,
      image: "/placeholder.svg?height=100&width=100",
      category: "experience",
    },
  ]

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "earned":
        return <ArrowUpRight className="h-4 w-4 text-black dark:text-white" />
      case "spent":
        return <ArrowDownLeft className="h-4 w-4 text-red-500" />
      case "pending":
        return <History className="h-4 w-4 text-yellow-500" />
      default:
        return <Coins className="h-4 w-4 text-gray-400" />
    }
  }

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "earned":
        return "text-black dark:text-white"
      case "spent":
        return "text-red-500"
      case "pending":
        return "text-yellow-500"
      default:
        return "text-gray-400"
    }
  }

  return (
    <div className="bg-white dark:bg-black text-gray-900 dark:text-white">
      {/* Header */}
      <header className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 p-4 shadow-sm dark:shadow-none">
        <div className="flex items-center justify-between">
          <Link href="/homepage">
            <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">My Wallet</h1>
          <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
            <ExternalLink className="h-6 w-6" />
          </Button>
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
                    onClick={refreshWallet}
                    className="border-gray-200 dark:border-gray-700"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
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

        {/* Wallet Balance */}
        <Card className="bg-gradient-to-r from-black/20 to-black/10 dark:from-white/30 dark:to-white/20 border-black dark:border-white">
          <CardContent className="p-6 text-center">
            <Wallet className="h-8 w-8 text-black dark:text-white" />
            <div className="mt-2">
              <div className="text-4xl font-bold text-black dark:text-white">{walletBalance.toLocaleString()}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">TRBE Tokens</div>

              {lockedTokens > 0 && (
                <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Locked Tokens:</span>
                    <span className="text-sm text-yellow-600 dark:text-yellow-400">{lockedTokens.toLocaleString()}</span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Released after activity confirmation</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-green-600 dark:text-green-400">+1,250</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">This month</div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
            <CardContent className="p-4 text-center">
              <TrendingDown className="h-6 w-6 text-red-500 mx-auto mb-2" />
              <div className="text-xl font-bold text-red-500">-800</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Spent</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="transactions" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-800">
            <TabsTrigger value="transactions" className="data-[state=active]:bg-black dark:data-[state=active]:bg-white data-[state=active]:text-white dark:data-[state=active]:text-black">
              Transactions
            </TabsTrigger>
            <TabsTrigger value="rewards" className="data-[state=active]:bg-black dark:data-[state=active]:bg-white data-[state=active]:text-white dark:data-[state=active]:text-black">
              Rewards
            </TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="space-y-3">
            {transactions.map((transaction) => (
              <Card key={transaction.id} className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        transaction.type === "earned" ? "bg-black/10 dark:bg-white/30" :
                        transaction.type === "spent" ? "bg-red-100 dark:bg-red-900/30" :
                        "bg-yellow-100 dark:bg-yellow-900/30"
                      }`}>
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{transaction.description}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{transaction.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-semibold ${getTransactionColor(transaction.type)}`}>
                        {transaction.amount > 0 ? "+" : ""}{transaction.amount.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">tokens</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="rewards" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {rewards.map((reward) => (
                <Card key={reward.id} className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
                  <CardContent className="p-4">
                    <div className="text-center space-y-3">
                      <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                        <ShoppingBag className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{reward.name}</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{reward.description}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-black dark:text-white">{reward.price.toLocaleString()}</span>
                        <Button size="sm" className="bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black">
                          Redeem
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
