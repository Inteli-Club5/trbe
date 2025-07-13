"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Target, 
  Trophy, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Star,
  Calendar,
  Users,
  MapPin,
  Zap,
  TrendingUp,
  Award,
  Filter,
  Search
} from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { ProtectedRoute } from "@/components/protected-route"
import { useToast } from "@/hooks/use-toast"
import { Sidebar } from "@/components/sidebar"
import { BottomNavigation } from "@/components/bottom-navigation"
import apiClient from "@/lib/api"

interface Task {
  id: string
  title: string
  description: string
  category: string
  difficulty: string
  type: string
  maxProgress: number
  timeLimit?: number
  deadline?: string
  tokens: number
  experience: number
  reputationPoints: number
  isActive: boolean
  isRepeatable: boolean
  createdAt: string
  expiresAt?: string
}

interface UserTask {
  id: string
  taskId: string
  status: string
  progress: number
  completedAt?: string
  failedAt?: string
  failedReason?: string
  createdAt: string
  updatedAt: string
  task: Task
}

export default function TasksPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const [userTasks, setUserTasks] = useState<UserTask[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("available")

  useEffect(() => {
    fetchTasks()
    fetchUserTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await apiClient.getTasks()
      if (response.success) {
        setTasks(response.data.tasks || [])
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
      toast({
        title: "Error",
        description: "Failed to load tasks",
        variant: "destructive",
      })
    }
  }

  const fetchUserTasks = async () => {
    try {
      const response = await apiClient.getUserTasks()
      if (response.success) {
        setUserTasks(response.data.userTasks || [])
      }
    } catch (error) {
      console.error('Failed to fetch user tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const startTask = async (taskId: string) => {
    try {
      const response = await apiClient.assignTaskToUser(taskId)
      if (response.success) {
        toast({
          title: "Task started",
          description: "You've successfully started this task!",
        })
        fetchUserTasks() // Refresh user tasks
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to start task",
        variant: "destructive",
      })
    }
  }

  const updateTaskProgress = async (taskId: string, progress: number) => {
    try {
      const response = await apiClient.updateTaskProgress(taskId, progress)
      if (response.success) {
        toast({
          title: "Progress updated",
          description: "Your task progress has been updated!",
        })
        fetchUserTasks() // Refresh user tasks
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update progress",
        variant: "destructive",
      })
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'HARD': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'EXPERT': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'PRESENCE': return <MapPin className="h-4 w-4" />
      case 'SOCIAL': return <Users className="h-4 w-4" />
      case 'PURCHASE': return <Trophy className="h-4 w-4" />
      case 'ENGAGEMENT': return <Zap className="h-4 w-4" />
      case 'COMMUNITY': return <Users className="h-4 w-4" />
      case 'SPECIAL': return <Star className="h-4 w-4" />
      default: return <Target className="h-4 w-4" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'IN_PROGRESS': return <Clock className="h-4 w-4 text-blue-500" />
      case 'FAILED': return <XCircle className="h-4 w-4 text-red-500" />
      default: return <Target className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'text-green-600 dark:text-green-400'
      case 'IN_PROGRESS': return 'text-blue-600 dark:text-blue-400'
      case 'FAILED': return 'text-red-600 dark:text-red-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  const availableTasks = tasks.filter(task => 
    task.isActive && 
    !userTasks.some(ut => ut.taskId === task.id && ['AVAILABLE', 'IN_PROGRESS', 'COMPLETED'].includes(ut.status))
  )

  const inProgressTasks = userTasks.filter(ut => ut.status === 'IN_PROGRESS')
  const completedTasks = userTasks.filter(ut => ut.status === 'COMPLETED')

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading tasks...</p>
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
            <div>
              <h1 className="text-2xl font-bold">Tasks</h1>
              <p className="text-gray-600 dark:text-gray-400">Complete tasks to earn rewards</p>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <Target className="h-5 w-5" />
            </Button>
          </div>

          {/* Task Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{availableTasks.length}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Available</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="text-2xl font-bold">{inProgressTasks.length}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">In Progress</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">{completedTasks.length}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-2xl font-bold">{user?.totalTasks || 0}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="available">Available</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value="available" className="space-y-4">
              {availableTasks.length === 0 ? (
                <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
                  <CardContent className="p-8 text-center">
                    <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No tasks available</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Check back later for new tasks or complete existing ones
                    </p>
                  </CardContent>
                </Card>
              ) : (
                availableTasks.map((task) => (
                  <Card key={task.id} className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{task.title}</CardTitle>
                          <CardDescription className="mt-2">{task.description}</CardDescription>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <Badge className={getDifficultyColor(task.difficulty)}>
                            {task.difficulty}
                          </Badge>
                          <Badge variant="outline">
                            {getCategoryIcon(task.category)}
                            <span className="ml-1">{task.category}</span>
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Trophy className="h-4 w-4 text-yellow-500" />
                              <span>{task.tokens} tokens</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-blue-500" />
                              <span>{task.experience} XP</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <TrendingUp className="h-4 w-4 text-green-500" />
                              <span>{task.reputationPoints} reputation</span>
                            </div>
                          </div>
                          {task.deadline && (
                            <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                              <Calendar className="h-4 w-4" />
                              <span>Due {new Date(task.deadline).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                        <Button 
                          onClick={() => startTask(task.id)}
                          className="w-full bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black"
                        >
                          <Target className="h-4 w-4 mr-2" />
                          Start Task
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="in-progress" className="space-y-4">
              {inProgressTasks.length === 0 ? (
                <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
                  <CardContent className="p-8 text-center">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No tasks in progress</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Start a task from the available tab to see it here
                    </p>
                  </CardContent>
                </Card>
              ) : (
                inProgressTasks.map((userTask) => (
                  <Card key={userTask.id} className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{userTask.task.title}</CardTitle>
                          <CardDescription className="mt-2">{userTask.task.description}</CardDescription>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          {getStatusIcon(userTask.status)}
                          <span className={getStatusColor(userTask.status)}>
                            {userTask.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Progress</span>
                            <span>{userTask.progress} / {userTask.task.maxProgress}</span>
                          </div>
                          <Progress 
                            value={(userTask.progress / userTask.task.maxProgress) * 100} 
                            className="h-2" 
                          />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Trophy className="h-4 w-4 text-yellow-500" />
                              <span>{userTask.task.tokens} tokens</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-blue-500" />
                              <span>{userTask.task.experience} XP</span>
                            </div>
                          </div>
                          <Button 
                            onClick={() => updateTaskProgress(userTask.task.id, userTask.progress + 1)}
                            disabled={userTask.progress >= userTask.task.maxProgress}
                            size="sm"
                          >
                            Update Progress
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {completedTasks.length === 0 ? (
                <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
                  <CardContent className="p-8 text-center">
                    <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No completed tasks</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Complete tasks to see your achievements here
                    </p>
                  </CardContent>
                </Card>
              ) : (
                completedTasks.map((userTask) => (
                  <Card key={userTask.id} className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{userTask.task.title}</CardTitle>
                          <CardDescription className="mt-2">{userTask.task.description}</CardDescription>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          {getStatusIcon(userTask.status)}
                          <span className={getStatusColor(userTask.status)}>
                            {userTask.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Trophy className="h-4 w-4 text-yellow-500" />
                              <span>+{userTask.task.tokens} tokens earned</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-blue-500" />
                              <span>+{userTask.task.experience} XP earned</span>
                            </div>
                          </div>
                          <div className="text-gray-600 dark:text-gray-400">
                            Completed {userTask.completedAt ? new Date(userTask.completedAt).toLocaleDateString() : 'Recently'}
                          </div>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                          <div className="flex items-center space-x-2">
                            <Award className="h-4 w-4 text-green-500" />
                            <span className="text-sm font-medium text-green-800 dark:text-green-200">
                              Task completed successfully!
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>

        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <BottomNavigation />
      </div>
    </ProtectedRoute>
  )
}
