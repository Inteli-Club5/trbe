"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  HelpCircle,
  MessageCircle,
  Book,
  Phone,
  Mail,
  Search,
  ChevronRight,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"

export default function HelpPage() {
  const faqCategories = [
    {
      title: "Tokens e Recompensas",
      questions: [
        {
          question: "Como ganhar tokens?",
          answer:
            "Você pode ganhar tokens fazendo check-in nos jogos, compartilhando posts nas redes sociais, completando desafios e participando de eventos da torcida.",
        },
        {
          question: "Como resgatar recompensas?",
          answer:
            "Acesse sua carteira, vá na aba 'Recompensas' e escolha o item que deseja resgatar. Certifique-se de ter tokens suficientes.",
        },
        {
          question: "Os tokens expiram?",
          answer: "Não, seus tokens não expiram. Eles ficam disponíveis em sua carteira indefinidamente.",
        },
      ],
    },
    {
      title: "Torcidas Organizadas",
      questions: [
        {
          question: "Como entrar em uma torcida organizada?",
          answer:
            "Vá na página do seu clube, selecione a torcida desejada e clique em 'Solicitar Ingresso'. Aguarde a aprovação da liderança.",
        },
        {
          question: "Posso sair de uma torcida?",
          answer:
            "Sim, você pode sair a qualquer momento nas configurações do seu perfil. Porém, perderá os benefícios exclusivos de membro.",
        },
        {
          question: "Como criar eventos na torcida?",
          answer:
            "Apenas membros aprovados podem criar eventos. Acesse a página da sua torcida e clique em 'Criar Evento'.",
        },
      ],
    },
    {
      title: "Reputação e Punições",
      questions: [
        {
          question: "Como melhorar minha reputação?",
          answer:
            "Participe ativamente dos jogos, mantenha comportamento respeitoso, ajude outros torcedores e complete desafios regularmente.",
        },
        {
          question: "O que acontece se eu for punido?",
          answer:
            "Dependendo da gravidade, você pode receber advertências ou suspensões temporárias. Punições afetam sua reputação e podem restringir certas funcionalidades.",
        },
        {
          question: "Posso contestar uma punição?",
          answer: "Sim, você pode entrar em contato com o suporte através da central de ajuda para contestar punições.",
        },
      ],
    },
  ]

  const contactOptions = [
    {
      title: "Chat ao Vivo",
      description: "Fale conosco em tempo real",
      icon: MessageCircle,
      action: "Iniciar Chat",
      available: "Online agora",
    },
    {
      title: "E-mail",
      description: "Envie sua dúvida por e-mail",
      icon: Mail,
      action: "Enviar E-mail",
      available: "suporte@trbe.com",
    },
    {
      title: "WhatsApp",
      description: "Atendimento via WhatsApp",
      icon: Phone,
      action: "Abrir WhatsApp",
      available: "(11) 99999-9999",
    },
  ]

  const guides = [
    {
      title: "Primeiros Passos no TRBE",
      description: "Guia completo para novos usuários",
      duration: "5 min",
      icon: "🚀",
    },
    {
      title: "Como Maximizar seus Tokens",
      description: "Dicas para ganhar mais tokens",
      duration: "3 min",
      icon: "💰",
    },
    {
      title: "Participando de Torcidas",
      description: "Tudo sobre torcidas organizadas",
      duration: "7 min",
      icon: "👥",
    },
    {
      title: "Sistema de Reputação",
      description: "Entenda como funciona a reputação",
      duration: "4 min",
      icon: "⭐",
    },
  ]

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
          <h1 className="text-xl font-semibold">Central de Ajuda</h1>
          <div></div>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Buscar ajuda..."
            className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-4">
          {contactOptions.map((option, index) => {
            const IconComponent = option.icon
            return (
              <Card
                key={index}
                className="bg-gray-900 border-gray-800 cursor-pointer hover:bg-gray-800 transition-colors"
              >
                <CardContent className="p-4 text-center">
                  <IconComponent className="h-8 w-8 text-[#28CA00] mx-auto mb-2" />
                  <h3 className="font-semibold text-white text-sm">{option.title}</h3>
                  <p className="text-xs text-gray-400 mt-1">{option.available}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="faq" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800">
            <TabsTrigger value="faq" className="data-[state=active]:bg-[#28CA00] data-[state=active]:text-black">
              FAQ
            </TabsTrigger>
            <TabsTrigger value="guides" className="data-[state=active]:bg-[#28CA00] data-[state=active]:text-black">
              Guias
            </TabsTrigger>
            <TabsTrigger value="contact" className="data-[state=active]:bg-[#28CA00] data-[state=active]:text-black">
              Contato
            </TabsTrigger>
          </TabsList>

          <TabsContent value="faq" className="space-y-6">
            {faqCategories.map((category, categoryIndex) => (
              <Card key={categoryIndex} className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-[#28CA00]" />
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {category.questions.map((faq, faqIndex) => (
                    <div key={faqIndex} className="space-y-2">
                      <h4 className="font-medium text-white">{faq.question}</h4>
                      <p className="text-sm text-gray-400 leading-relaxed">{faq.answer}</p>
                      {faqIndex < category.questions.length - 1 && <hr className="border-gray-700" />}
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="guides" className="space-y-4">
            {guides.map((guide, index) => (
              <Card
                key={index}
                className="bg-gray-900 border-gray-800 cursor-pointer hover:bg-gray-800 transition-colors"
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{guide.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{guide.title}</h3>
                      <p className="text-sm text-gray-400">{guide.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Book className="h-4 w-4 text-gray-500" />
                        <span className="text-xs text-gray-500">{guide.duration} de leitura</span>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="contact" className="space-y-4">
            {contactOptions.map((option, index) => {
              const IconComponent = option.icon
              return (
                <Card key={index} className="bg-gray-900 border-gray-800">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-[#28CA00]/10 rounded-full">
                        <IconComponent className="h-6 w-6 text-[#28CA00]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{option.title}</h3>
                        <p className="text-sm text-gray-400">{option.description}</p>
                        <p className="text-sm text-[#28CA00] mt-1">{option.available}</p>
                      </div>
                      <Button size="sm" className="bg-[#28CA00] hover:bg-[#20A000] text-black">
                        {option.action}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            <Card className="bg-blue-900/20 border-blue-700">
              <CardHeader>
                <CardTitle className="text-blue-400">Reportar Problema</CardTitle>
                <CardDescription className="text-gray-400">
                  Encontrou um bug ou tem uma sugestão? Nos conte!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full border-blue-700 text-blue-400 hover:bg-blue-900/30 bg-transparent"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Reportar Problema
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
