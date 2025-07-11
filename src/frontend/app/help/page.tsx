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
      title: "Tokens and Rewards",
      questions: [
        {
          question: "How to earn tokens?",
          answer:
            "You can earn tokens by checking in at games, sharing posts on social media, completing challenges, and participating in fan group events.",
        },
        {
          question: "How to redeem rewards?",
          answer:
            "Access your wallet, go to the 'Rewards' tab and choose the item you want to redeem. Make sure you have enough tokens.",
        },
        {
          question: "Do tokens expire?",
          answer: "No, your tokens don't expire. They remain available in your wallet indefinitely.",
        },
      ],
    },
    {
      title: "Fan Groups",
      questions: [
        {
          question: "How to join a fan group?",
          answer:
            "Go to your club page, select the desired fan group and click 'Request to Join'. Wait for approval from the leadership.",
        },
        {
          question: "Can I leave a fan group?",
          answer:
            "Yes, you can leave at any time in your profile settings. However, you will lose exclusive member benefits.",
        },
        {
          question: "How to create events in the fan group?",
          answer:
            "Only approved members can create events. Access your fan group page and click 'Create Event'.",
        },
      ],
    },
    {
      title: "Reputation and Punishments",
      questions: [
        {
          question: "How to improve my reputation?",
          answer:
            "Actively participate in games, maintain respectful behavior, help other supporters, and complete challenges regularly.",
        },
        {
          question: "What happens if I get punished?",
          answer:
            "Depending on severity, you may receive warnings or temporary suspensions. Punishments affect your reputation and may restrict certain features.",
        },
        {
          question: "Can I appeal a punishment?",
          answer: "Yes, you can contact support through the help center to appeal punishments.",
        },
      ],
    },
  ]

  const contactOptions = [
    {
      title: "Live Chat",
      description: "Talk to us in real time",
      icon: MessageCircle,
      action: "Start Chat",
      available: "Online now",
    },
    {
      title: "Email",
      description: "Send your question by email",
      icon: Mail,
      action: "Send Email",
      available: "support@tribe.com",
    },
    {
      title: "WhatsApp",
      description: "WhatsApp support",
      icon: Phone,
      action: "Open WhatsApp",
      available: "(11) 99999-9999",
    },
  ]

  const guides = [
    {
      title: "Getting Started with TRIBE",
      description: "Complete guide for new users",
      duration: "5 min",
      icon: "🚀",
    },
    {
      title: "How to Maximize Your Tokens",
      description: "Tips to earn more tokens",
      duration: "3 min",
      icon: "💰",
    },
    {
      title: "Participating in Fan Groups",
      description: "Everything about organized fan groups",
      duration: "7 min",
      icon: "👥",
    },
    {
      title: "Reputation System",
      description: "Understand how reputation works",
      duration: "4 min",
      icon: "⭐",
    },
  ]

  return (
    <div className="bg-black text-white">
      {/* Header */}
      <header className="bg-black border-b border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-white">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">Help Center</h1>
          <div></div>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search for help..."
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
              Guides
            </TabsTrigger>
            <TabsTrigger value="contact" className="data-[state=active]:bg-[#28CA00] data-[state=active]:text-black">
              Contact
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
                        <span className="text-xs text-gray-500">{guide.duration} read</span>
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
                <CardTitle className="text-blue-400">Report Problem</CardTitle>
                <CardDescription className="text-gray-400">
                  Found a bug or have a suggestion? Let us know!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full border-blue-700 text-blue-400 hover:bg-blue-900/30 bg-transparent"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Report Problem
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
