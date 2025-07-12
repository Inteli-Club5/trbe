"use client"

import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please log in to access this page
          </p>
          <div className="space-x-4">
            <Link href="/auth/login">
              <Button className="bg-black dark:bg-white text-white dark:text-black">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button variant="outline" className="border-gray-300 dark:border-gray-600">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
} 