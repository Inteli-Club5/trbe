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
      description: "Check-in no Maracanã",
      amount: 200,
      date: "Há 2 horas",
      status: "completed",
    },
    {
      id: 2,
      type: "earned",
      description: "Desafio semanal completado",
      amount: 500,
      date: "Ontem",
      status: "completed",
    },
    {
      id: 3,
      type: "spent",
      description: "Camisa oficial do Flamengo",
      amount: -800,
      date: "2 dias atrás",
      status: "completed",
    },
    {
      id: 4,
      type: "earned",
      description: "Post compartilhado",
      amount: 50,
      date: "3 dias atrás",
      status: "completed",
    },
    {
      id: 5,
      type: "earned",
      description: "Compra na loja oficial",
      amount: 150,
      date: "1 semana atrás",
      status: "completed",
    },
    {
      id: 6,
      type: "pending",
      description: "Bônus de fidelidade",
      amount: 300,
      date: "Processando",
      status: "pending",
    },
  ]

  const rewards = [
    {
      id: 1,
      name: "Camisa Oficial 2024",
      description: "Camisa oficial do Flamengo temporada 2024",
      price: 1200,
      image: "/placeholder.svg?height=100&width=100",
      category: "merchandise",
    },
    {
      id: 2,
      name: "Ingresso VIP",
      description: "Ingresso VIP para o próximo jogo",
      price: 2000,
      image: "/placeholder.svg?height=100&width=100",
      category: "experience",
    },
    {
      id: 3,
      name: "Desconto 20%",
      description: "20% de desconto na loja oficial",
      price: 500,
      image: "/placeholder.svg?height=100&width=100",
      category: "discount",
    },
    {
      id: 4,
      name: "Meet & Greet",
      description: "Encontro com jogadores do elenco",
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
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-black border-b border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-white">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">Minha Carteira</h1>
          <Button variant="ghost" size="icon" className="text-white">
            <ExternalLink className="h-6 w-6" />
          </Button>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Wallet Balance */}
        <Card className="bg-gradient-to-r from-[#28CA00]/20 to-[#28CA00]/10 border-[#28CA00]">
          <CardContent className="p-6">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Wallet className="h-8 w-8 text-[#28CA00]" />
                <span className="text-lg font-semibold text-white">Saldo Disponível</span>
              </div>
              <div className="text-4xl font-bold text-[#28CA00]">{walletBalance.toLocaleString()}</div>
              <div className="text-sm text-gray-300">TRBE Tokens</div>

              {lockedTokens > 0 && (
                <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Tokens Bloqueados:</span>
                    <span className="text-sm text-yellow-500">{lockedTokens.toLocaleString()}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Liberados após confirmação de atividades</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <div className="text-xl font-bold text-green-500">+1,250</div>
              <div className="text-sm text-gray-400">Este mês</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4 text-center">
              <TrendingDown className="h-6 w-6 text-red-500 mx-auto mb-2" />
              <div className="text-xl font-bold text-red-500">-800</div>
              <div className="text-sm text-gray-400">Gastos</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="transactions" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800">
            <TabsTrigger
              value="transactions"
              className="data-[state=active]:bg-[#28CA00] data-[state=active]:text-black"
            >
              Transações
            </TabsTrigger>
            <TabsTrigger value="rewards" className="data-[state=active]:bg-[#28CA00] data-[state=active]:text-black">
              Recompensas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="space-y-4">
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <Card key={transaction.id} className="bg-gray-900 border-gray-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-800 rounded-full">{getTransactionIcon(transaction.type)}</div>
                        <div>
                          <p className="font-medium text-white">{transaction.description}</p>
                          <p className="text-sm text-gray-400">{transaction.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                          {transaction.amount > 0 ? "+" : ""}
                          {transaction.amount}
                        </div>
                        <div className="text-xs text-gray-400">
                          {transaction.status === "pending" ? "Pendente" : "Concluído"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button variant="outline" className="w-full border-gray-700 text-gray-400 hover:text-white bg-transparent">
              Ver Histórico Completo
            </Button>
          </TabsContent>

          <TabsContent value="rewards" className="space-y-4">
            <div className="grid gap-4">
              {rewards.map((reward) => (
                <Card key={reward.id} className="bg-gray-900 border-gray-800">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={reward.image || "/placeholder.svg"}
                        alt={reward.name}
                        className="w-16 h-16 rounded-lg object-cover bg-gray-800"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{reward.name}</h3>
                        <p className="text-sm text-gray-400 mb-2">{reward.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Coins className="h-4 w-4 text-[#28CA00]" />
                            <span className="font-semibold text-[#28CA00]">{reward.price.toLocaleString()}</span>
                          </div>
                          <Button
                            size="sm"
                            className="bg-[#28CA00] hover:bg-[#20A000] text-black"
                            disabled={walletBalance < reward.price}
                          >
                            {walletBalance >= reward.price ? "Resgatar" : "Insuficiente"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-blue-900/20 border-blue-700">
              <CardContent className="p-4 text-center">
                <ShoppingBag className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white mb-1">Loja Socios.com</h3>
                <p className="text-sm text-gray-400 mb-3">Acesse a loja oficial para mais recompensas exclusivas</p>
                <Button variant="outline" className="border-blue-700 text-blue-400 hover:bg-blue-900/30 bg-transparent">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visitar Loja
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Blockchain Info */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white text-sm">Informações da Blockchain</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Rede:</span>
              <span className="text-white">Chiliz Chain</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Endereço:</span>
              <span className="text-white font-mono text-xs">0x742d...4f2a</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Última sincronização:</span>
              <span className="text-white">Há 5 min</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
