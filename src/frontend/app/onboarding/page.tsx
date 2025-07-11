"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Shield, Trophy, Coins, ArrowRight, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedTorcida, setSelectedTorcida] = useState("")

  const torcidas = [
    {
      name: "Torcida Jovem",
      members: 15420,
      description: "A maior torcida organizada do Flamengo, fundada em 1967",
      requirements: "Aprovação necessária",
    },
    {
      name: "Charanga Rubro-Negra",
      members: 8350,
      description: "Tradição e festa nas arquibancadas desde 1942",
      requirements: "Aprovação necessária",
    },
    {
      name: "Raça Rubro-Negra",
      members: 12100,
      description: "Paixão e garra em cada jogo",
      requirements: "Aprovação necessária",
    },
  ]

  const steps = [
    {
      title: "Escolha sua Torcida",
      description: "Selecione uma torcida organizada ou continue como torcedor independente",
      content: (
        <div className="space-y-4">
          <div className="space-y-3">
            {torcidas.map((torcida) => (
              <Card
                key={torcida.name}
                className={`cursor-pointer transition-all ${
                  selectedTorcida === torcida.name
                    ? "bg-[#28CA00]/10 border-[#28CA00]"
                    : "bg-gray-800 border-gray-700 hover:bg-gray-750"
                }`}
                onClick={() => setSelectedTorcida(torcida.name)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{torcida.name}</h3>
                      <p className="text-sm text-gray-400 mt-1">{torcida.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                          <Users className="h-3 w-3 mr-1" />
                          {torcida.members.toLocaleString()} membros
                        </Badge>
                        <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                          {torcida.requirements}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card
              className={`cursor-pointer transition-all ${
                selectedTorcida === "independente"
                  ? "bg-[#28CA00]/10 border-[#28CA00]"
                  : "bg-gray-800 border-gray-700 hover:bg-gray-750"
              }`}
              onClick={() => setSelectedTorcida("independente")}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Shield className="h-8 w-8 text-[#28CA00]" />
                  <div>
                    <h3 className="font-semibold text-white">Torcedor Independente</h3>
                    <p className="text-sm text-gray-400">Torça sem vínculos com organizadas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ),
    },
    {
      title: "Como funciona o TRBE",
      description: "Entenda o sistema de tokens e gamificação",
      content: (
        <div className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Coins className="h-8 w-8 text-[#28CA00] mt-1" />
                <div>
                  <h3 className="font-semibold text-white mb-2">Sistema de Tokens</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Ganhe tokens por atividades como presença nos jogos, engajamento social, compras oficiais e
                    participação em eventos. Use os tokens para resgatar recompensas exclusivas.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Trophy className="h-8 w-8 text-[#28CA00] mt-1" />
                <div>
                  <h3 className="font-semibold text-white mb-2">Gamificação</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Suba de nível, desbloqueie badges, participe de rankings e complete desafios. Quanto mais engajado,
                    maiores as recompensas!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Users className="h-8 w-8 text-[#28CA00] mt-1" />
                <div>
                  <h3 className="font-semibold text-white mb-2">Comunidade</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Conecte-se com outros torcedores, participe de eventos exclusivos e ajude a construir uma torcida
                    mais unida e respeitosa.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ),
    },
    {
      title: "Primeiros Passos",
      description: "Comece sua jornada no TRBE",
      content: (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-xl font-semibold text-white mb-2">Bem-vindo ao TRBE!</h3>
            <p className="text-gray-400">Você ganhou 100 tokens de boas-vindas</p>
          </div>

          <Card className="bg-[#28CA00]/10 border-[#28CA00]">
            <CardContent className="p-4">
              <h4 className="font-semibold text-white mb-3">Suas primeiras tarefas:</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#28CA00] rounded-full"></div>
                  Complete seu perfil (+50 tokens)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#28CA00] rounded-full"></div>
                  Faça seu primeiro check-in (+200 tokens)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#28CA00] rounded-full"></div>
                  Compartilhe um post do clube (+50 tokens)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#28CA00] rounded-full"></div>
                  Conecte suas redes sociais (+25 tokens)
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-md mx-auto">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">
              Passo {currentStep + 1} de {steps.length}
            </span>
            <span className="text-sm text-[#28CA00]">{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className="bg-[#28CA00] h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">{steps[currentStep].title}</CardTitle>
            <CardDescription className="text-gray-400">{steps[currentStep].description}</CardDescription>
          </CardHeader>
          <CardContent>{steps[currentStep].content}</CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="border-gray-700 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button
              onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
              className="bg-[#28CA00] hover:bg-[#20A000] text-black"
              disabled={currentStep === 0 && !selectedTorcida}
            >
              Próximo
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Link href="/">
              <Button className="bg-[#28CA00] hover:bg-[#20A000] text-black">
                Começar
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
