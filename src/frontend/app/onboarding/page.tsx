"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Shield, Trophy, Coins, ArrowRight, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedFanGroup, setSelectedFanGroup] = useState("")

  const fanGroups = [
    {
      name: "Blue Pride",
      members: 15420,
      description: "The largest organized supporter group of Chelsea FC, founded in 1998",
      requirements: "Approval required",
    },
    {
      name: "Blue Army",
      members: 8350,
      description: "Tradition and celebration in the stands since 1985",
      requirements: "Approval required",
    },
    {
      name: "Chelsea Faithful",
      members: 12100,
      description: "Passion and spirit in every game",
      requirements: "Approval required",
    },
  ]

  const steps = [
    {
      title: "Choose your Fan Group",
      description: "Select an organized fan group or continue as an independent supporter",
      content: (
        <div className="space-y-4">
          <div className="space-y-3">
            {fanGroups.map((fanGroup) => (
              <Card
                key={fanGroup.name}
                className={`cursor-pointer transition-all ${
                  selectedFanGroup === fanGroup.name
                    ? "bg-black/10 dark:bg-white/20 border-black dark:border-white"
                    : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                onClick={() => setSelectedFanGroup(fanGroup.name)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                                      <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{fanGroup.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{fanGroup.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                        <Users className="h-3 w-3 mr-1" />
                        {fanGroup.members.toLocaleString()} members
                      </Badge>
                      <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                        {fanGroup.requirements}
                      </Badge>
                    </div>
                  </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card
              className={`cursor-pointer transition-all ${
                selectedFanGroup === "independent"
                  ? "bg-black/10 dark:bg-white/20 border-black dark:border-white"
                  : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              onClick={() => setSelectedFanGroup("independent")}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Shield className="h-8 w-8 text-black dark:text-white" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Independent Supporter</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Support without organized group affiliations</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ),
    },
    {
      title: "How TRIBE Works",
      description: "Understand the token system and gamification",
      content: (
        <div className="space-y-6">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Coins className="h-8 w-8 text-black dark:text-white mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Token System</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    Earn tokens through activities like game attendance, social engagement, official purchases, and 
                    event participation. Use tokens to redeem exclusive rewards.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Trophy className="h-8 w-8 text-black dark:text-white mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Gamification</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    Level up, unlock badges, participate in rankings, and complete challenges. The more engaged 
                    you are, the greater the rewards!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Users className="h-8 w-8 text-black dark:text-white mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Community</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    Connect with other supporters, participate in exclusive events, and help build a more 
                    united and respectful fan community.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ),
    },
    {
      title: "Get Started",
      description: "Begin your TRIBE journey",
      content: (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Welcome to TRIBE!</h3>
            <p className="text-gray-600 dark:text-gray-400">You earned 100 welcome tokens</p>
          </div>

          <Card className="bg-black/10 dark:bg-white/20 border-black dark:border-white shadow-sm">
            <CardContent className="p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Your first tasks:</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-black dark:bg-white rounded-full"></div>
                  Complete your profile (+50 tokens)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-black dark:bg-white rounded-full"></div>
                  Make your first check-in (+200 tokens)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-black dark:bg-white rounded-full"></div>
                  Share a club post (+50 tokens)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-black dark:bg-white rounded-full"></div>
                  Connect your social media (+25 tokens)
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-black p-4 pb-28">
      <div className="max-w-md mx-auto">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm text-black dark:text-white">{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
            <div
              className="bg-black dark:bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {steps[currentStep].title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {steps[currentStep].description}
            </p>
          </div>

          {steps[currentStep].content}
        </div>

        {/* Navigation */}
        <div className="flex gap-3 mt-8">
          {currentStep > 0 && (
            <Button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              variant="outline"
              className="flex-1 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}

          {currentStep < steps.length - 1 ? (
            <Button
              onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
              className="flex-1 bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black"
              disabled={currentStep === 0 && !selectedFanGroup}
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Link href="/">
              <Button className="flex-1 bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black">
                Get Started
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
