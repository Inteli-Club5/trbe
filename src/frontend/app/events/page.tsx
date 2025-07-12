"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Calendar, MapPin, Users, Star, Trophy, Gift, Flag, Filter, Search } from "lucide-react"
import Link from "next/link"

export default function EventsPage() {
  const [filter, setFilter] = useState("all")

  const events = [
    {
      id: 1,
      title: "Away Day to Manchester",
      description: "Organized trip for Chelsea vs Manchester United",
      date: "15/12/2024",
      time: "06:00",
      location: "Blue Pride HQ",
      organizer: "Blue Pride",
      participants: 45,
      maxParticipants: 50,
      price: "£120",
      category: "travel",
      status: "open",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 2,
      title: "End of Year Party",
      description: "Annual celebration with shows and prize draws",
      date: "20/12/2024",
      time: "19:00",
      location: "Chelsea Social Club",
      organizer: "Blue Pride",
      participants: 120,
      maxParticipants: 150,
      price: "£50",
      category: "social",
      status: "open",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 3,
      title: "Christmas Charity Drive",
      description: "Gift distribution for underprivileged children",
      date: "22/12/2024",
      time: "14:00",
      location: "Local Community Center",
      organizer: "Blue Army",
      participants: 25,
      maxParticipants: 30,
      price: "Free",
      category: "charity",
      status: "open",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 4,
      title: "Open Training Session",
      description: "Watch the team train at Cobham Training Centre",
      date: "18/12/2024",
      time: "10:00",
      location: "Cobham Training Centre",
      organizer: "Official Club",
      participants: 200,
      maxParticipants: 200,
      price: "£30",
      category: "official",
      status: "full",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 5,
      title: "Veterans Meetup",
      description: "Gathering of longtime Blue Pride members",
      date: "10/12/2024",
      time: "15:00",
      location: "Fan Group Headquarters",
      organizer: "Blue Pride",
      participants: 30,
      maxParticipants: 30,
      price: "Free",
      category: "social",
      status: "finished",
      image: "/placeholder.svg?height=100&width=100",
    },
  ]

  const categories = [
    { id: "all", name: "All", count: events.length },
    { id: "travel", name: "Travel", count: events.filter((e) => e.category === "travel").length },
    { id: "social", name: "Social", count: events.filter((e) => e.category === "social").length },
    { id: "charity", name: "Charity", count: events.filter((e) => e.category === "charity").length },
    { id: "official", name: "Official", count: events.filter((e) => e.category === "official").length },
  ]

  const filteredEvents = filter === "all" ? events : events.filter((event) => event.category === filter)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-black dark:bg-white text-white dark:text-black"
      case "full":
        return "bg-yellow-600 text-white"
      case "finished":
        return "bg-gray-600 text-white"
      default:
        return "bg-gray-600 text-white"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "open":
        return "Registration Open"
      case "full":
        return "Full"
      case "finished":
        return "Finished"
      default:
        return "Unavailable"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "travel":
        return <MapPin className="h-4 w-4" />
      case "social":
        return <Users className="h-4 w-4" />
      case "charity":
        return <Gift className="h-4 w-4" />
      case "official":
        return <Flag className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  return (
    <div className="bg-white dark:bg-black text-gray-900 dark:text-white">
      {/* Header */}
      <header className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 p-4 shadow-sm dark:shadow-none">
        <div className="flex items-center justify-between">
          <Link href="/homepage">
            <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Events</h1>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              <Search className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              <Filter className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-black dark:text-white">8</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">This Month</div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-500">3</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Registered</div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-500">12</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Attended</div>
            </CardContent>
          </Card>
        </div>

        {/* Category Filters */}
        <Tabs value={filter} onValueChange={setFilter} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-gray-100 dark:bg-gray-800">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="data-[state=active]:bg-black dark:data-[state=active]:bg-white data-[state=active]:text-white dark:data-[state=active]:text-black text-xs"
              >
                <div className="text-center">
                  <div>{category.name}</div>
                  <div className="text-xs opacity-70">({category.count})</div>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={filter} className="space-y-4 mt-6">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                      {getCategoryIcon(event.category)}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{event.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{event.description}</p>
                        </div>
                        <Badge className={getStatusColor(event.status)}>
                          {getStatusText(event.status)}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{event.date} • {event.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{event.participants}/{event.maxParticipants}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Organized by:</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{event.organizer}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-black dark:text-white">{event.price}</span>
                          <Button size="sm" className="bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black">
                            Register
                          </Button>
                        </div>
                      </div>

                      {event.status === "open" && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600 dark:text-gray-400">Registration Progress</span>
                            <span className="text-black dark:text-white">{Math.round((event.participants / event.maxParticipants) * 100)}%</span>
                          </div>
                          <Progress value={(event.participants / event.maxParticipants) * 100} className="h-2 bg-gray-200 dark:bg-gray-800">
                            <div
                              className="h-full bg-black dark:bg-white rounded-full transition-all"
                              style={{ width: `${(event.participants / event.maxParticipants) * 100}%` }}
                            />
                          </Progress>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
