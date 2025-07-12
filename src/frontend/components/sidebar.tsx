"use client"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Home,
  User,
  Trophy,
  Users,
  Coins,
  Shield,
  Settings,
  LogOut,
  X,
  Flag,
  Calendar,
  Star,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { ThemeToggle } from "./theme-toggle"
import { useTheme } from "./theme-provider"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { theme } = useTheme()
  const userInfo = {
    name: "John Smith",
    email: "john.smith@email.com",
    club: "Chelsea FC",
    fanGroup: "Blue Pride",
    level: 12,
    tokens: 15420,
    reputation: 850,
  }

  const menuItems = [
    { icon: Home, label: "Home", href: "/homepage", badge: null },
    { icon: User, label: "My Profile", href: "/profile", badge: null },
    { icon: Trophy, label: "Tasks", href: "/tasks", badge: "3" },
    { icon: Star, label: "Badges", href: "/badges", badge: null },
    { icon: Shield, label: "Reputation", href: "/reputation", badge: null },
    { icon: Users, label: "Rankings", href: "/ranking", badge: null },
    { icon: Coins, label: "Wallet", href: "/wallet", badge: null },
    { icon: Flag, label: "My Club", href: "/clubs", badge: null },
    { icon: Calendar, label: "Events", href: "/events", badge: "2" },
  ]

  const quickActions = [
    { icon: Star, label: "My Club", href: "/clubs" },
    { icon: TrendingUp, label: "Statistics", href: "/stats" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ]

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />

      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-50 transform transition-transform duration-300 ease-in-out shadow-lg">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Image 
                  src={theme === "light" ? "/logo-black.svg" : "/logo.svg"} 
                  alt="TRBE" 
                  width={80} 
                  height={26} 
                />
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  <X className="h-6 w-6" />
                </Button>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src="/placeholder.svg?height=48&width=48" />
                <AvatarFallback className="bg-black dark:bg-white text-white dark:text-black">JS</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">{userInfo.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {userInfo.club} • {userInfo.fanGroup}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-lg font-bold text-black dark:text-white">{userInfo.level}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Level</div>
              </div>
              <div>
                <div className="text-lg font-bold text-black dark:text-white">{userInfo.tokens}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Tokens</div>
              </div>
              <div>
                <div className="text-lg font-bold text-black dark:text-white">{userInfo.reputation}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Reputation</div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Main Menu</h4>
              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const IconComponent = item.icon
                  return (
                    <Link key={item.href} href={item.href} onClick={onClose}>
                      <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors">
                        <IconComponent className="h-5 w-5" />
                        <span className="flex-1">{item.label}</span>
                        {item.badge && <Badge className="bg-red-500 text-white text-xs">{item.badge}</Badge>}
                      </div>
                    </Link>
                  )
                })}
              </nav>
            </div>

            <Separator className="bg-gray-200 dark:bg-gray-800" />

            <div className="p-4">
              <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Quick Actions</h4>
              <nav className="space-y-1">
                {quickActions.map((item) => {
                  const IconComponent = item.icon
                  return (
                    <Link key={item.href} href={item.href} onClick={onClose}>
                      <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors">
                        <IconComponent className="h-5 w-5" />
                        <span>{item.label}</span>
                      </div>
                    </Link>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            

            <div className="mt-3 text-center text-xs text-gray-400 dark:text-gray-500">
              <Image 
                src={theme === "light" ? "/logo-black.svg" : "/logo.svg"} 
                alt="TRBE" 
                width={60} 
                height={20} 
                className="mx-auto mb-1" 
              />
              v1.0.0
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
