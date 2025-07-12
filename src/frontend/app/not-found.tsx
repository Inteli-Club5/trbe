"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTheme } from "@/components/theme-provider"
import Image from "next/image"
import Link from "next/link"
import { Home, ArrowLeft, Search } from "lucide-react"

export default function NotFound() {
  const { theme } = useTheme()

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center p-4">
      {/* Logo at the top */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
        <Image
          src={theme === "dark" ? "/logo.svg" : "/logo-black.svg"}
          alt="TRBE Logo"
          width={120}
          height={40}
          className="h-8 w-auto"
        />
      </div>
      
      <Card className="w-full max-w-md bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
        <CardHeader className="text-center">
          {/* 404 Number */}
          <div className="text-8xl font-bold text-gray-200 dark:text-gray-800 mb-4">
            404
          </div>
          
          <CardTitle className="text-2xl text-gray-900 dark:text-white mb-2">
            Page Not Found
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Action buttons */}
          <div className="space-y-3">
            <Link href="/homepage">
              <Button className="w-full bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black font-semibold">
                <Home className="h-4 w-4 mr-2" />
                Go to Homepage
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              className="w-full border-gray-200 dark:border-gray-700 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 bg-transparent"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
          
        </CardContent>
      </Card>
    </div>
  )
} 