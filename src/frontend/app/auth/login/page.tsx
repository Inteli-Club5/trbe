"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Twitter, Loader2 } from "lucide-react"
import ConnectButton from "../../../hooks/connection-button"
import Link from "next/link"
import { useTheme } from "@/components/theme-provider"
import { useAuth } from "@/context/auth-context"
import Image from "next/image"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isTwitterLoading, setIsTwitterLoading] = useState(false)
  const { theme } = useTheme()
  const { login, loginWithTwitter } = useAuth()

  // Listen for Twitter OAuth success
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.data.type === 'twitter-auth-success') {
        setIsTwitterLoading(true)
        try {
          await loginWithTwitter(event.data.userId)
        } catch (error) {
          console.error('Twitter login failed:', error)
        } finally {
          setIsTwitterLoading(false)
        }
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [loginWithTwitter])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return

    setIsLoading(true)
    try {
      await login(email, password)
    } catch (error) {
      // Error is handled by the auth context
    } finally {
      setIsLoading(false)
    }
  }

  const handleTwitterLogin = () => {
    setIsTwitterLoading(true)
    // Open Twitter OAuth window
    const authWindow = window.open(
      'http://localhost:5000/auth/twitter/start',
      'twitter-auth',
      'width=600,height=600,scrollbars=yes,resizable=yes'
    )

    // Check if window was blocked
    if (!authWindow) {
      alert('Please allow popups for this site to login with Twitter')
      setIsTwitterLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-4 pb-28">
      <Card className="w-full max-w-md bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <Image
              src={theme === "dark" ? "/logo.svg" : "/logo-black.svg"}
              alt="TRBE Logo"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
          </div>
          <CardTitle className="text-gray-900 dark:text-white">Welcome back</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">Sign in to your account to continue</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-900 dark:text-white">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-900 dark:text-white">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-gray-600 dark:hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                  className="border-gray-300 dark:border-gray-600 data-[state=checked]:bg-black dark:data-[state=checked]:bg-white data-[state=checked]:border-black dark:data-[state=checked]:border-white"
                />
                <Label htmlFor="remember" className="text-sm text-gray-600 dark:text-gray-400">
                  Remember me
                </Label>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400 cursor-pointer hover:underline">
                Forgot password
              </span>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200 dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400">Or continue with</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full border-gray-200 dark:border-gray-700 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 bg-transparent"
            onClick={handleTwitterLogin}
            disabled={isTwitterLoading}
          >
            {isTwitterLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Twitter className="h-4 w-4 mr-2" />
                Twitter
              </>
            )}
          </Button>
          <center>
            <ConnectButton></ConnectButton>
          </center>

          <div className="text-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">Don't have an account? </span>
            <Link href="/auth/signup" className="text-black dark:text-white hover:underline">
              Sign Up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
