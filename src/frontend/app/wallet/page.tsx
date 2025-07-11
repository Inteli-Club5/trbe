"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
} from "lucide-react"
import Link from "next/link"

export default function WalletPage() {
  const [walletBalance] = useState(15420)
  const [lockedTokens] = useState(500)

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
        return <ArrowUpRight className="h-4 w-4 text-green-500" />
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
        return "text-green-500"
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
          <Link href="/">
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
        {/* Wallet Balance */}
        <Card className="bg-gradient-to-r from-[#28CA00]/20 to-[#28CA00]/10 dark:from-[#28CA00]/30 dark:to-[#28CA00]/20 border-[#28CA00]">
          <CardContent className="p-6">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Wallet className="h-8 w-8 text-[#28CA00]" />
                <span className="text-lg font-semibold text-gray-900 dark:text-white">Available Balance</span>
              </div>
              <div className="text-4xl font-bold text-[#28CA00]">{walletBalance.toLocaleString()}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">TRIBE Tokens</div>

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
              <TrendingUp className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <div className="text-xl font-bold text-green-500">+1,250</div>
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
            <TabsTrigger value="transactions" className="data-[state=active]:bg-[#28CA00] data-[state=active]:text-black">
              Transactions
            </TabsTrigger>
            <TabsTrigger value="rewards" className="data-[state=active]:bg-[#28CA00] data-[state=active]:text-black">
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
                        transaction.type === "earned" ? "bg-green-100 dark:bg-green-900/30" :
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
                        <span className="text-lg font-bold text-[#28CA00]">{reward.price.toLocaleString()}</span>
                        <Button size="sm" className="bg-[#28CA00] hover:bg-[#20A000] text-black">
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
