"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ArrowLeft,
  Shield,
  Palette,
  Globe,
  LogOut,
  User,
  Lock,
  CreditCard,
  Download,
  Trash2,
} from "lucide-react"

export default function SettingsPage() {
  const [pushNotifications, setPushNotifications] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(false)
  const [darkMode, setDarkMode] = useState(true)
  const [autoCheckIn, setAutoCheckIn] = useState(false)

  const accountSettings = [
    {
      title: "Edit Profile",
      description: "Update your personal information",
      icon: User,
      href: "/profile",
    }
  ]

  return (
    <div className="bg-white dark:bg-black text-gray-900 dark:text-white">
      {/* Header */}
      <header className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <Link href="/homepage">
            <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Settings</h1>
          <div className="w-10"></div>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* User Profile Summary */}
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="/placeholder.svg?height=64&width=64" />
                <AvatarFallback className="bg-black dark:bg-white text-white dark:text-black text-xl">JS</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">John Smith</h2>
                <p className="text-gray-600 dark:text-gray-400">john.smith@email.com</p>
                <div className="flex items-center gap-4 mt-2">
                  <Badge className="bg-black dark:bg-white text-white dark:text-black">Level 12</Badge>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Member since Jan 2024</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-black dark:text-white" />
              Account Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {accountSettings.map((item) => (
              <div key={item.title} className="flex items-center justify-between">
                <div>
                  <h3 className="text-gray-900 dark:text-white">{item.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                </div>
                <Link href={item.href}>
                  <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                    {item.icon && <item.icon className="h-4 w-4 mr-2" />}
                    Manage
                  </Button>
                </Link>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700 shadow-sm">
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">Irreversible actions - proceed with caution</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 justify-start bg-transparent"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account
            </Button>

            <Button
              variant="outline"
              className="w-full border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 justify-start bg-transparent"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out of All Devices
            </Button>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
          <CardContent className="p-4 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>TRBE v1.0.0</p>
            <p>© 2025 TRBE. All rights reserved.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
