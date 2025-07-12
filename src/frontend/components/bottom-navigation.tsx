"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Trophy, CheckCircle, Flag, Shield, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"

export function BottomNavigation() {
  const pathname = usePathname()

  const navItems = [
    {
      href: "/homepage",
      icon: Trophy,
      label: "Home",
      isActive: pathname === "/homepage",
    },
    {
      href: "/tasks",
      icon: CheckCircle,
      label: "Tasks",
      isActive: pathname === "/tasks",
    },
    {
      href: "/club",
      icon: Flag,
      label: "Club",
      isActive: pathname.startsWith("/club"),
    },
    {
      href: "/reputation",
      icon: Shield,
      label: "Reputation",
      isActive: pathname === "/reputation",
    },
    {
      href: "/profile",
      icon: User,
      label: "Profile",
      isActive: pathname === "/profile",
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 p-4 z-50 shadow-lg dark:shadow-none">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const IconComponent = item.icon

          return (
            <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1">
              <div className={`p-2 rounded-full ${item.isActive ? "bg-black dark:bg-white" : ""}`}>
                <IconComponent className={`h-5 w-5 ${item.isActive ? "text-white dark:text-black" : "text-gray-500 dark:text-gray-400"}`} />
              </div>
              <span className={`text-xs ${item.isActive ? "text-black dark:text-white" : "text-gray-500 dark:text-gray-400"}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
} 