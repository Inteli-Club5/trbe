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
      color: "text-black dark:text-white",
      bgColor: "bg-black/10 dark:bg-white/20",
      borderColor: "border-black dark:border-white",
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
        { icon: Shield, text: "Standard access to most features", color: "text-black dark:text-white" },
      ]
    },
    respectable: {
      restrictions: [],
      benefits: [
        { icon: Shield, text: "Full access to all standard features", color: "text-black dark:text-white" },
        { icon: Trophy, text: "Standard token rewards", color: "text-black dark:text-white" },
        { icon: Users, text: "Can join and create fan groups", color: "text-black dark:text-white" },
      ]
    },
    commendable: {
      restrictions: [],
      benefits: [
        { icon: Star, text: "All Respectable benefits", color: "text-black dark:text-white" },
        { icon: Zap, text: "Faster activity cooldowns", color: "text-blue-600" },
        { icon: Gift, text: "Access to exclusive rewards", color: "text-blue-600" },
        { icon: Heart, text: "Priority support", color: "text-blue-600" },
      ]
    },
    exemplary: {
      restrictions: [],
      benefits: [
        { icon: Crown, text: "All Commendable benefits", color: "text-black dark:text-white" },
        { icon: Trophy, text: "Bonus token rewards (+25%)", color: "text-black dark:text-white" },
        { icon: Target, text: "Exclusive badges and titles", color: "text-black dark:text-white" },
        { icon: Star, text: "VIP access to all events", color: "text-black dark:text-white" },
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
    const levelMap: Record<string, keyof typeof reputationBenefits> = {
      'Dishonorable': 'dishonorable',
      'Needs Work': 'needsWork',
      'Respectable': 'respectable',
      'Commendable': 'commendable',
      'Exemplary': 'exemplary'
    }
    return levelMap[levelName] || 'respectable'
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

        {/* Tabs */}
        <Tabs defaultValue="benefits" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-800">
            <TabsTrigger value="benefits" className="data-[state=active]:bg-black dark:data-[state=active]:bg-white data-[state=active]:text-white dark:data-[state=active]:text-black">
              Benefits & Penalties
            </TabsTrigger>
            <TabsTrigger value="how-it-works" className="data-[state=active]:bg-black dark:data-[state=active]:bg-white data-[state=active]:text-white dark:data-[state=active]:text-black">
              How It Works
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-black dark:data-[state=active]:bg-white data-[state=active]:text-white dark:data-[state=active]:text-black">
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
                    <h4 className="font-semibold text-black dark:text-white mb-3 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Benefits
                    </h4>
                    <div className="space-y-2">
                      {getCurrentBenefits().benefits.map((benefit, index) => {
                        const IconComponent = benefit.icon
                        return (
                          <div key={index} className="flex items-center gap-3 p-2 bg-black/5 dark:bg-white/20 rounded-lg">
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
                  <Info className="h-5 w-5 text-black dark:text-white" />
                  How the Reputation System Works
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-black/10 dark:bg-white/30 rounded-full">
                      <CheckCircle className="h-4 w-4 text-black dark:text-white" />
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

                {/* Reputation Levels Section */}
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Award className="h-5 w-5 text-black dark:text-white" />
                    Reputation Levels Explained
                  </h4>
                  <div className="space-y-3">
                    {reputationLevels.map((level) => {
                      const IconComponent = level.icon
                      const isCurrent = level.isCurrent
                      const levelKey = getLevelKey(level.name)
                      const levelBenefits = reputationBenefits[levelKey]
                      
                      return (
                        <div 
                          key={level.name} 
                          className={`p-4 rounded-lg border ${
                            isCurrent 
                              ? "bg-black/10 dark:bg-white/20 border-black dark:border-white" 
                              : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                          }`}
                        >
                          <div className="flex items-start gap-3 mb-3">
                            <div className={`p-2 rounded-full ${
                              isCurrent 
                                ? "bg-black dark:bg-white" 
                                : "bg-gray-100 dark:bg-gray-700"
                            }`}>
                              <IconComponent className={`h-5 w-5 ${
                                isCurrent 
                                  ? "text-white dark:text-black" 
                                  : level.color
                              }`} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h5 className={`font-semibold ${
                                  isCurrent 
                                    ? "text-black dark:text-white" 
                                    : "text-gray-900 dark:text-white"
                                }`}>
                                  {level.name}
                                </h5>
                                {isCurrent && (
                                  <Badge className="bg-black dark:bg-white text-white dark:text-black text-xs">
                                    Current Level
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                {level.minScore} - {level.maxScore} points
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {level.description}
                              </p>
                            </div>
                          </div>

                          {/* Level Benefits & Restrictions */}
                          <div className="space-y-2">
                            {levelBenefits.benefits.length > 0 && (
                              <div>
                                <h6 className="text-xs font-medium text-green-600 dark:text-green-400 mb-1 flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3" />
                                  Benefits
                                </h6>
                                <div className="space-y-1">
                                  {levelBenefits.benefits.map((benefit, index) => {
                                    const BenefitIcon = benefit.icon
                                    return (
                                      <div key={index} className="flex items-center gap-2 text-xs">
                                        <BenefitIcon className={`h-3 w-3 ${benefit.color}`} />
                                        <span className="text-gray-600 dark:text-gray-400">{benefit.text}</span>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            )}

                            {levelBenefits.restrictions.length > 0 && (
                              <div>
                                <h6 className="text-xs font-medium text-red-600 dark:text-red-400 mb-1 flex items-center gap-1">
                                  <X className="h-3 w-3" />
                                  Restrictions
                                </h6>
                                <div className="space-y-1">
                                  {levelBenefits.restrictions.map((restriction, index) => {
                                    const RestrictionIcon = restriction.icon
                                    return (
                                      <div key={index} className="flex items-center gap-2 text-xs">
                                        <RestrictionIcon className={`h-3 w-3 ${restriction.color}`} />
                                        <span className="text-gray-600 dark:text-gray-400">{restriction.text}</span>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            )}

                            {levelBenefits.benefits.length === 0 && levelBenefits.restrictions.length === 0 && (
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                Standard access with no special benefits or restrictions.
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
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
                        action.type === "positive" ? "bg-black/10 dark:bg-white/30" : "bg-red-100 dark:bg-red-900/30"
                      }`}>
                        {action.type === "positive" ? (
                          <CheckCircle className="h-4 w-4 text-black dark:text-white" />
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
                      action.type === "positive" ? "text-black dark:text-white" : "text-red-600 dark:text-red-400"
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
