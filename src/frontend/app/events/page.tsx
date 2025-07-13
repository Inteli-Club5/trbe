"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Star,
  Filter,
  Search,
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  TrendingUp,
  Award
} from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { ProtectedRoute } from "@/components/protected-route"
import { useToast } from "@/hooks/use-toast"
import { Sidebar } from "@/components/sidebar"
import { BottomNavigation } from "@/components/bottom-navigation"
import apiClient from "@/lib/api"

interface Event {
  id: string
  title: string
  description: string
  category: string
  type: string
  date: string
  time: string
  location: string
  latitude?: number
  longitude?: number
  maxParticipants?: number
  currentParticipants: number
  price?: number
  currency: string
  status: string
  isPublic: boolean
  image?: string
  tags: string[]
  createdAt: string
  updatedAt: string
  club?: {
    id: string
    name: string
    logo?: string
  }
  fanGroup?: {
    id: string
    name: string
    logo?: string
  }
}

interface EventParticipant {
  id: string
  userId: string
  eventId: string
  status: string
  registeredAt: string
  confirmedAt?: string
  attendedAt?: string
  cancelledAt?: string
  cancelledReason?: string
  event: Event
}

export default function EventsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [events, setEvents] = useState<Event[]>([])
  const [userEvents, setUserEvents] = useState<EventParticipant[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("upcoming")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchEvents()
    fetchUserEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await apiClient.getEvents()
      if (response.success) {
        setEvents(response.data.events || [])
      }
    } catch (error) {
      console.error('Failed to fetch events:', error)
      toast({
        title: "Error",
        description: "Failed to load events",
        variant: "destructive",
      })
    }
  }

  const fetchUserEvents = async () => {
    try {
      const response = await apiClient.getUserEvents()
      if (response.success) {
        setUserEvents(response.data.userEvents || [])
      }
    } catch (error) {
      console.error('Failed to fetch user events:', error)
    } finally {
      setLoading(false)
    }
  }

  const registerForEvent = async (eventId: string) => {
    try {
      const response = await apiClient.registerForEvent(eventId)
      if (response.success) {
        toast({
          title: "Event registration",
          description: "You've successfully registered for this event!",
        })
        fetchUserEvents() // Refresh user events
      }
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Failed to register for event",
        variant: "destructive",
      })
    }
  }

  const unregisterFromEvent = async (eventId: string) => {
    try {
      const response = await apiClient.unregisterFromEvent(eventId)
      if (response.success) {
        toast({
          title: "Event unregistration",
          description: "You've successfully unregistered from this event.",
        })
        fetchUserEvents() // Refresh user events
      }
    } catch (error: any) {
      toast({
        title: "Unregistration failed",
        description: error.message || "Failed to unregister from event",
        variant: "destructive",
      })
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'MATCH_DAY': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'MEETUP': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'CHARITY': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'TRAINING': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'TOURNAMENT': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'CELEBRATION': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
      case 'AWAY_TRIP': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'text-green-600 dark:text-green-400'
      case 'OPEN': return 'text-blue-600 dark:text-blue-400'
      case 'FULL': return 'text-orange-600 dark:text-orange-400'
      case 'CANCELLED': return 'text-red-600 dark:text-red-400'
      case 'FINISHED': return 'text-gray-600 dark:text-gray-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getParticipantStatusColor = (status: string) => {
    switch (status) {
      case 'registered': return 'text-blue-600 dark:text-blue-400'
      case 'confirmed': return 'text-green-600 dark:text-green-400'
      case 'attended': return 'text-green-600 dark:text-green-400'
      case 'cancelled': return 'text-red-600 dark:text-red-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const formatEventTime = (timeString: string) => {
    if (!timeString) return ''
    return timeString
  }

  const isUserRegistered = (eventId: string) => {
    return userEvents.some(ue => ue.eventId === eventId && ue.status !== 'cancelled')
  }

  const getUserEventStatus = (eventId: string) => {
    const userEvent = userEvents.find(ue => ue.eventId === eventId)
    return userEvent?.status || null
  }

  const upcomingEvents = events.filter(event => 
    new Date(event.date) > new Date() && 
    event.status === 'PUBLISHED' || event.status === 'OPEN'
  )

  const pastEvents = events.filter(event => 
    new Date(event.date) <= new Date() || 
    event.status === 'FINISHED'
  )

  const userRegisteredEvents = userEvents.filter(ue => 
    ue.status !== 'cancelled' && 
    new Date(ue.event.date) > new Date()
  )

  const filteredEvents = searchQuery 
    ? upcomingEvents.filter(event => 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : upcomingEvents

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading events...</p>
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
              <h1 className="text-2xl font-bold">Events</h1>
              <p className="text-gray-600 dark:text-gray-400">Discover and join exciting events</p>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <Calendar className="h-5 w-5" />
            </Button>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="my-events">My Events</TabsTrigger>
              <TabsTrigger value="past">Past Events</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4">
              {filteredEvents.length === 0 ? (
                <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
                  <CardContent className="p-8 text-center">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No upcoming events</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {searchQuery ? "No events match your search" : "Check back later for new events"}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredEvents.map((event) => (
                  <Card key={event.id} className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{event.title}</CardTitle>
                          <CardDescription className="mt-2">{event.description}</CardDescription>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <Badge className={getCategoryColor(event.category)}>
                            {event.category.replace('_', ' ')}
                          </Badge>
                          <Badge variant="outline" className={getStatusColor(event.status)}>
                            {event.status}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <span>{formatEventDate(event.date)}</span>
                            </div>
                            {event.time && (
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4 text-gray-500" />
                                <span>{formatEventTime(event.time)}</span>
                              </div>
                            )}
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4 text-gray-500" />
                              <span>{event.location}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4 text-gray-500" />
                            <span>{event.currentParticipants}</span>
                            {event.maxParticipants && (
                              <span>/ {event.maxParticipants}</span>
                            )}
                          </div>
                        </div>

                        {event.price && (
                          <div className="flex items-center space-x-1 text-sm">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span>Price: {event.price} {event.currency}</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {event.club && (
                              <Badge variant="outline" className="text-xs">
                                {event.club.name}
                              </Badge>
                            )}
                            {event.fanGroup && (
                              <Badge variant="outline" className="text-xs">
                                {event.fanGroup.name}
                              </Badge>
                            )}
                          </div>
                          {isUserRegistered(event.id) ? (
                            <Button 
                              variant="outline"
                              onClick={() => unregisterFromEvent(event.id)}
                              className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Unregister
                            </Button>
                          ) : (
                            <Button 
                              onClick={() => registerForEvent(event.id)}
                              disabled={event.status === 'FULL'}
                              className="bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              {event.status === 'FULL' ? 'Full' : 'Register'}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="my-events" className="space-y-4">
              {userRegisteredEvents.length === 0 ? (
                <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
                  <CardContent className="p-8 text-center">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No registered events</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Register for events to see them here
                    </p>
                  </CardContent>
                </Card>
              ) : (
                userRegisteredEvents.map((userEvent) => (
                  <Card key={userEvent.id} className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{userEvent.event.title}</CardTitle>
                          <CardDescription className="mt-2">{userEvent.event.description}</CardDescription>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <Badge className={getCategoryColor(userEvent.event.category)}>
                            {userEvent.event.category.replace('_', ' ')}
                          </Badge>
                          <Badge variant="outline" className={getParticipantStatusColor(userEvent.status)}>
                            {userEvent.status}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <span>{formatEventDate(userEvent.event.date)}</span>
                            </div>
                            {userEvent.event.time && (
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4 text-gray-500" />
                                <span>{formatEventTime(userEvent.event.time)}</span>
                              </div>
                            )}
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4 text-gray-500" />
                              <span>{userEvent.event.location}</span>
                            </div>
                          </div>
                          <div className="text-gray-600 dark:text-gray-400">
                            Registered {new Date(userEvent.registeredAt).toLocaleDateString()}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {userEvent.event.club && (
                              <Badge variant="outline" className="text-xs">
                                {userEvent.event.club.name}
                              </Badge>
                            )}
                            {userEvent.event.fanGroup && (
                              <Badge variant="outline" className="text-xs">
                                {userEvent.event.fanGroup.name}
                              </Badge>
                            )}
                          </div>
                          <Button 
                            variant="outline"
                            onClick={() => unregisterFromEvent(userEvent.event.id)}
                            className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Unregister
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-4">
              {pastEvents.length === 0 ? (
                <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
                  <CardContent className="p-8 text-center">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No past events</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Past events will appear here
                    </p>
                  </CardContent>
                </Card>
              ) : (
                pastEvents.map((event) => (
                  <Card key={event.id} className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{event.title}</CardTitle>
                          <CardDescription className="mt-2">{event.description}</CardDescription>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <Badge className={getCategoryColor(event.category)}>
                            {event.category.replace('_', ' ')}
                          </Badge>
                          <Badge variant="outline" className={getStatusColor(event.status)}>
                            {event.status}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <span>{formatEventDate(event.date)}</span>
                            </div>
                            {event.time && (
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4 text-gray-500" />
                                <span>{formatEventTime(event.time)}</span>
                              </div>
                            )}
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4 text-gray-500" />
                              <span>{event.location}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4 text-gray-500" />
                            <span>{event.currentParticipants}</span>
                            {event.maxParticipants && (
                              <span>/ {event.maxParticipants}</span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          {event.club && (
                            <Badge variant="outline" className="text-xs">
                              {event.club.name}
                            </Badge>
                          )}
                          {event.fanGroup && (
                            <Badge variant="outline" className="text-xs">
                              {event.fanGroup.name}
                            </Badge>
                          )}
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
