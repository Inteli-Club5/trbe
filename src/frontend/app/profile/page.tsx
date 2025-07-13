"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit, 
  Save, 
  X, 
  Trophy, 
  Star, 
  Target,
  Award,
  Activity,
  Settings,
  Shield,
  Crown,
  Zap,
  TrendingUp,
  Users,
  CalendarDays,
  CheckCircle,
  Clock
} from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { ProtectedRoute } from "@/components/protected-route"
import { useToast } from "@/hooks/use-toast"
import { Sidebar } from "@/components/sidebar"
import { BottomNavigation } from "@/components/bottom-navigation"

export default function ProfilePage() {
  const { user, updateUser, isLoading } = useAuth()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    displayName: user?.displayName || "",
    bio: user?.bio || "",
    phoneNumber: user?.phoneNumber || "",
    location: user?.location || "",
    gender: user?.gender || "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    try {
      await updateUser(formData)
      setIsEditing(false)
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      })
    }
  }

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      displayName: user?.displayName || "",
      bio: user?.bio || "",
      phoneNumber: user?.phoneNumber || "",
      location: user?.location || "",
      gender: user?.gender || "",
    })
    setIsEditing(false)
  }

  const getLevelProgress = () => {
    if (!user) return 0
    return Math.min(100, (user.experience % 1000) / 10)
  }

  const getNextLevelExp = () => {
    if (!user) return 1000
    return user.level * 1000
  }

  const getReputationColor = (score: number) => {
    if (score >= 800) return "text-green-600 dark:text-green-400"
    if (score >= 600) return "text-blue-600 dark:text-blue-400"
    if (score >= 400) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const getReputationBadge = (score: number) => {
    if (score >= 800) return { text: "Legendary", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" }
    if (score >= 600) return { text: "Respected", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" }
    if (score >= 400) return { text: "Active", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" }
    return { text: "New", color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200" }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="bg-white dark:bg-black text-gray-900 dark:text-white min-h-screen">
        <div className="max-w-4xl mx-auto p-4 pb-28">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Profile</h1>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <User className="h-5 w-5" />
            </Button>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="stats">Stats</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Profile Card */}
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Personal Information</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      {isEditing ? <X className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                      {isEditing ? "Cancel" : "Edit"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback className="bg-black dark:bg-white text-white dark:text-black text-lg">
                        {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-xl font-semibold">
                          {isEditing ? (
                            <Input
                              value={formData.displayName}
                              onChange={(e) => handleInputChange("displayName", e.target.value)}
                              className="text-xl font-semibold"
                            />
                          ) : (
                            user?.displayName || `${user?.firstName} ${user?.lastName}`
                          )}
                        </h3>
                        <Badge variant="outline" className={getReputationBadge(user?.reputationScore || 0).color}>
                          {getReputationBadge(user?.reputationScore || 0).text}
                        </Badge>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">
                        @{user?.username}
                      </p>
                      {user?.bio && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          {isEditing ? (
                            <Textarea
                              value={formData.bio}
                              onChange={(e) => handleInputChange("bio", e.target.value)}
                              placeholder="Tell us about yourself..."
                              className="resize-none"
                            />
                          ) : (
                            user.bio
                          )}
                        </p>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">First Name</Label>
                      {isEditing ? (
                        <Input
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                        />
                      ) : (
                        <p className="text-sm">{user?.firstName}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Last Name</Label>
                      {isEditing ? (
                        <Input
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                        />
                      ) : (
                        <p className="text-sm">{user?.lastName}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Email</Label>
                      <p className="text-sm">{user?.email}</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Phone</Label>
                      {isEditing ? (
                        <Input
                          value={formData.phoneNumber}
                          onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                          placeholder="Enter phone number"
                        />
                      ) : (
                        <p className="text-sm">{user?.phoneNumber || "Not provided"}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Location</Label>
                      {isEditing ? (
                        <Input
                          value={formData.location}
                          onChange={(e) => handleInputChange("location", e.target.value)}
                          placeholder="Enter location"
                        />
                      ) : (
                        <p className="text-sm">{user?.location || "Not provided"}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Gender</Label>
                      {isEditing ? (
                        <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MALE">Male</SelectItem>
                            <SelectItem value="FEMALE">Female</SelectItem>
                            <SelectItem value="OTHER">Other</SelectItem>
                            <SelectItem value="PREFER_NOT_TO_SAY">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-sm">{user?.gender || "Not specified"}</p>
                      )}
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex space-x-2 pt-4">
                      <Button onClick={handleSave} className="flex-1">
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={handleCancel} className="flex-1">
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Level & Progress */}
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
                <CardHeader>
                  <CardTitle>Level & Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Crown className="h-5 w-5 text-yellow-500" />
                        <span className="font-semibold">Level {user?.level}</span>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {user?.experience} / {getNextLevelExp()} XP
                      </span>
                    </div>
                    <Progress value={getLevelProgress()} className="h-2" />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        {getNextLevelExp() - (user?.experience || 0)} XP to next level
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {getLevelProgress()}% complete
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stats" className="space-y-6">
              {/* Statistics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                      <div>
                        <p className="text-2xl font-bold">{user?.tokens || 0}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Tokens</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Star className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-2xl font-bold">{user?.reputationScore || 0}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Reputation</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="text-2xl font-bold">{user?.totalCheckIns || 0}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Check-ins</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Award className="h-5 w-5 text-purple-500" />
                      <div>
                        <p className="text-2xl font-bold">{user?.totalBadges || 0}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Badges</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Stats */}
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
                <CardHeader>
                  <CardTitle>Activity Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <CalendarDays className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">Total Events</span>
                        </div>
                        <span className="font-semibold">{user?.totalEvents || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Target className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">Total Tasks</span>
                        </div>
                        <span className="font-semibold">{user?.totalTasks || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">Social Shares</span>
                        </div>
                        <span className="font-semibold">{user?.totalSocialShares || 0}</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Zap className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">Current Streak</span>
                        </div>
                        <span className="font-semibold">{user?.currentStreak || 0} days</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">Longest Streak</span>
                        </div>
                        <span className="font-semibold">{user?.longestStreak || 0} days</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">Last Activity</span>
                        </div>
                        <span className="font-semibold text-sm">
                          {user?.lastActivityDate ? new Date(user.lastActivityDate).toLocaleDateString() : "Never"}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-6">
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
                <CardHeader>
                  <CardTitle>Achievements</CardTitle>
                  <CardDescription>Your earned badges and accomplishments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">No achievements yet</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      Complete tasks and participate in events to earn badges
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Receive updates via email
                        </p>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {user?.emailNotifications ? "Enabled" : "Disabled"}
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Receive push notifications
                        </p>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {user?.pushNotifications ? "Enabled" : "Disabled"}
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Auto Check-in</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Automatically check in at events
                        </p>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {user?.autoCheckIn ? "Enabled" : "Disabled"}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <BottomNavigation />
      </div>
    </ProtectedRoute>
  )
}
