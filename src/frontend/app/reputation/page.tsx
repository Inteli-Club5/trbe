"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sidebar } from "@/components/sidebar"
import {
  Menu,
  Shield,
  AlertTriangle,
  CheckCircle,
  Trophy,
  Star,
  Gift,
  Crown,
  TrendingUp,
  Clock,
  X,
  Info,
  Lock,
  Users,
  Award,
  Zap,
  Heart,
  Target,
} from "lucide-react"
import Link from "next/link"

export default function ReputationPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const reputationScore = 850
  const maxScore = 1000

  // Rainbow Six Siege style reputation levels
  const reputationLevels = [
    {
      name: "Dishonorable",
      minScore: 0,
      maxScore: 200,
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      borderColor: "border-red-500",
      icon: X,
      description: "Lowest reputation level - significant restrictions apply",
      isCurrent: reputationScore <= 200,
    },
    {
      name: "Needs Work",
      minScore: 201,
      maxScore: 400,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      borderColor: "border-orange-500",
      icon: AlertTriangle,
      description: "Below average reputation - some restrictions apply",
      isCurrent: reputationScore > 200 && reputationScore <= 400,
    },
    {
      name: "Respectable",
      minScore: 401,
      maxScore: 600,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      borderColor: "border-yellow-500",
      icon: Shield,
      description: "Target ideal reputation level - standard experience",
      isCurrent: reputationScore > 400 && reputationScore <= 600,
    },
    {
      name: "Commendable",
      minScore: 601,
      maxScore: 800,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-500",
      icon: Star,
      description: "Above average reputation - some benefits apply",
      isCurrent: reputationScore > 600 && reputationScore <= 800,
    },
    {
      name: "Exemplary",
      minScore: 801,
      maxScore: 1000,
      color: "text-[#28CA00]",
      bgColor: "bg-[#28CA00]/10 dark:bg-[#28CA00]/20",
      borderColor: "border-[#28CA00]",
      icon: Crown,
      description: "Highest reputation level - maximum benefits apply",
      isCurrent: reputationScore > 800,
    },
  ]

  const currentLevel = reputationLevels.find(level => level.isCurrent) || reputationLevels[2] // Default to Respectable

  const reputationBenefits = {
    dishonorable: {
      restrictions: [
        { icon: Lock, text: "Cannot participate in ranked matches", color: "text-red-600" },
        { icon: Users, text: "Cannot join fan groups", color: "text-red-600" },
        { icon: Trophy, text: "Reduced token rewards (-50%)", color: "text-red-600" },
        { icon: Clock, text: "Longer cooldowns between activities", color: "text-red-600" },
      ],
      benefits: []
    },
    needsWork: {
      restrictions: [
        { icon: Lock, text: "Cannot access VIP events", color: "text-orange-600" },
        { icon: Trophy, text: "Reduced token rewards (-25%)", color: "text-orange-600" },
      ],
      benefits: [
        { icon: Shield, text: "Standard access to most features", color: "text-green-600" },
      ]
    },
    respectable: {
      restrictions: [],
      benefits: [
        { icon: Shield, text: "Full access to all standard features", color: "text-green-600" },
        { icon: Trophy, text: "Standard token rewards", color: "text-green-600" },
        { icon: Users, text: "Can join and create fan groups", color: "text-green-600" },
      ]
    },
    commendable: {
      restrictions: [],
      benefits: [
        { icon: Star, text: "All Respectable benefits", color: "text-green-600" },
        { icon: Zap, text: "Faster activity cooldowns", color: "text-blue-600" },
        { icon: Gift, text: "Access to exclusive rewards", color: "text-blue-600" },
        { icon: Heart, text: "Priority support", color: "text-blue-600" },
      ]
    },
    exemplary: {
      restrictions: [],
      benefits: [
        { icon: Crown, text: "All Commendable benefits", color: "text-green-600" },
        { icon: Trophy, text: "Bonus token rewards (+25%)", color: "text-[#28CA00]" },
        { icon: Target, text: "Exclusive badges and titles", color: "text-[#28CA00]" },
        { icon: Star, text: "VIP access to all events", color: "text-[#28CA00]" },
      ]
    }
  }

  const recentActions = [
    {
      id: 1,
      action: "Stadium check-in",
      impact: "+15",
      date: "2 hours ago",
      type: "positive",
      category: "attendance",
    },
    {
      id: 2,
      action: "Helped another supporter",
      impact: "+20",
      date: "Yesterday",
      type: "positive",
      category: "community",
    },
    {
      id: 3,
      action: "Warning for inappropriate language",
      impact: "-50",
      date: "3 days ago",
      type: "negative",
      category: "behavior",
    },
    {
      id: 4,
      action: "Event participation",
      impact: "+25",
      date: "1 week ago",
      type: "positive",
      category: "engagement",
    },
    {
      id: 5,
      action: "Accidental team damage",
      impact: "-10",
      date: "2 weeks ago",
      type: "negative",
      category: "accident",
    },
  ]

  const getLevelKey = (levelName: string) => {
    return levelName.toLowerCase().replace(/\s+/g, '') as keyof typeof reputationBenefits
  }

  const getCurrentBenefits = () => {
    const levelKey = getLevelKey(currentLevel.name)
    return reputationBenefits[levelKey]
  }

  const getNextLevel = () => {
    const currentIndex = reputationLevels.findIndex(level => level.isCurrent)
    return currentIndex < reputationLevels.length - 1 ? reputationLevels[currentIndex + 1] : null
  }

  const getProgressToNext = () => {
    const nextLevel = getNextLevel()
    if (!nextLevel) return 100

    const currentLevelMax = currentLevel.maxScore
    const nextLevelMin = nextLevel.minScore
    const progress = ((reputationScore - currentLevelMax) / (nextLevelMin - currentLevelMax)) * 100
    return Math.max(0, Math.min(100, progress))
  }

  return (
    <div className="bg-white dark:bg-black text-gray-900 dark:text-white">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Header */}
      <header className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 p-4 shadow-sm dark:shadow-none">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Reputation System</h1>
          <div></div>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Reputation Score Card */}
        <Card className={`${currentLevel.bgColor} ${currentLevel.borderColor} border-2`}>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 mb-4">
                <currentLevel.icon className={`h-8 w-8 ${currentLevel.color}`} />
                <span className="text-lg font-semibold text-gray-900 dark:text-white">Reputation Score</span>
              </div>

              <div className="space-y-2">
                <div className={`text-4xl font-bold ${currentLevel.color}`}>{reputationScore}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">of {maxScore} points</div>
                <Badge className={`${currentLevel.color} bg-transparent border-current text-lg px-4 py-2`}>
                  {currentLevel.name}
                </Badge>
                <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  {currentLevel.description}
                </p>
              </div>

              {getNextLevel() && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Progress to {getNextLevel()?.name}</span>
                    <span className={currentLevel.color}>{Math.round(getProgressToNext())}%</span>
                  </div>
                  <Progress value={getProgressToNext()} className="h-3 bg-gray-200 dark:bg-gray-800">
                    <div
                      className={`h-full ${currentLevel.color.replace('text-', 'bg-')} rounded-full transition-all`}
                      style={{ width: `${getProgressToNext()}%` }}
                    />
                  </Progress>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Reputation Levels Overview */}
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-[#28CA00]" />
              Reputation Levels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Reputation Progress Bar */}
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">0</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">1000</span>
                </div>
                
                {/* Main Progress Bar */}
                <div className="relative h-8 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                  {/* Level Segments */}
                  <div className="absolute inset-0 flex">
                    <div className="flex-1 bg-red-500"></div>
                    <div className="flex-1 bg-orange-500"></div>
                    <div className="flex-1 bg-yellow-500"></div>
                    <div className="flex-1 bg-blue-500"></div>
                    <div className="flex-1 bg-[#28CA00]"></div>
                  </div>
                  
                  {/* Level Labels */}
                  <div className="absolute inset-0 flex justify-between items-center px-2">
                    {reputationLevels.map((level, index) => {
                      const IconComponent = level.icon
                      return (
                        <div key={level.name} className="flex flex-col items-center">
                          <IconComponent className={`h-4 w-4 ${level.color} drop-shadow-sm`} />
                          <span className={`text-xs font-medium ${level.color} drop-shadow-sm`}>
                            {level.name}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                  
                  {/* User Position Indicator */}
                  <div 
                    className="absolute top-0 bottom-0 w-1 bg-black dark:bg-white rounded-full shadow-lg"
                    style={{ 
                      left: `${(reputationScore / maxScore) * 100}%`,
                      transform: 'translateX(-50%)'
                    }}
                  >
                    <div className="absolute -top-2 -left-2 w-5 h-5 bg-black dark:bg-white rounded-full border-2 border-white dark:border-black flex items-center justify-center">
                      <div className="w-2 h-2 bg-white dark:bg-black rounded-full"></div>
                    </div>
                  </div>
                </div>
                
                {/* Current Level Info */}
                <div className="mt-3 text-center">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${currentLevel.bgColor} ${currentLevel.borderColor} border`}>
                    <currentLevel.icon className={`h-4 w-4 ${currentLevel.color}`} />
                    <span className={`text-sm font-semibold ${currentLevel.color}`}>
                      {currentLevel.name} - {reputationScore} points
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Level Descriptions */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-xs">
                {reputationLevels.map((level) => (
                  <div key={level.name} className="text-center">
                    <div className={`font-medium ${level.color}`}>{level.name}</div>
                    <div className="text-gray-500 dark:text-gray-400">
                      {level.minScore}-{level.maxScore}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="benefits" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-800">
            <TabsTrigger value="benefits" className="data-[state=active]:bg-[#28CA00] data-[state=active]:text-black">
              Benefits & Penalties
            </TabsTrigger>
            <TabsTrigger value="how-it-works" className="data-[state=active]:bg-[#28CA00] data-[state=active]:text-black">
              How It Works
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-[#28CA00] data-[state=active]:text-black">
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="benefits" className="space-y-4">
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <currentLevel.icon className={`h-5 w-5 ${currentLevel.color}`} />
                  {currentLevel.name} Level Benefits & Penalties
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {getCurrentBenefits().benefits.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-green-600 dark:text-green-400 mb-3 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Benefits
                    </h4>
                    <div className="space-y-2">
                      {getCurrentBenefits().benefits.map((benefit, index) => {
                        const IconComponent = benefit.icon
                        return (
                          <div key={index} className="flex items-center gap-3 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <IconComponent className={`h-4 w-4 ${benefit.color}`} />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{benefit.text}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {getCurrentBenefits().restrictions.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-red-600 dark:text-red-400 mb-3 flex items-center gap-2">
                      <X className="h-4 w-4" />
                      Restrictions
                    </h4>
                    <div className="space-y-2">
                      {getCurrentBenefits().restrictions.map((restriction, index) => {
                        const IconComponent = restriction.icon
                        return (
                          <div key={index} className="flex items-center gap-3 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                            <IconComponent className={`h-4 w-4 ${restriction.color}`} />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{restriction.text}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {getCurrentBenefits().benefits.length === 0 && getCurrentBenefits().restrictions.length === 0 && (
                  <div className="text-center py-4">
                    <Shield className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 dark:text-gray-400">Standard access with no special benefits or restrictions.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="how-it-works" className="space-y-4">
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <Info className="h-5 w-5 text-[#28CA00]" />
                  How the Reputation System Works
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Positive Actions</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Stadium check-ins, helping other supporters, event participation, and positive community behavior increase your reputation.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                      <X className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Negative Actions</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Inappropriate language, unsporting behavior, and repeated violations decrease your reputation.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                      <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Protection Against Abuse</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        The system detects and ignores false reports from players who report everyone they encounter.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                      <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Recovery Time</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Reputation changes gradually over time. Consistent positive behavior helps you recover from negative actions.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Important Notes:</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Accidental actions (like team damage) have minimal impact on reputation</li>
                    <li>• Repeated violations result in more significant penalties</li>
                    <li>• The system focuses on behavior patterns, not individual incidents</li>
                    <li>• Higher reputation levels provide access to exclusive features and rewards</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-3">
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Recent Reputation Changes</CardTitle>
              </CardHeader>
              <CardContent>
                {recentActions.map((action) => (
                  <div key={action.id} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        action.type === "positive" ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"
                      }`}>
                        {action.type === "positive" ? (
                          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <X className="h-4 w-4 text-red-600 dark:text-red-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{action.action}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{action.date}</p>
                      </div>
                    </div>
                    <div className={`text-sm font-semibold ${
                      action.type === "positive" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                    }`}>
                      {action.impact}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
