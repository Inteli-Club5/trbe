"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Twitter } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 pb-28">
      <Card className="w-full max-w-md bg-gray-900 border-gray-800">
        <CardHeader className="text-center">
          <div className="text-4xl font-bold text-[#28CA00] mb-2">TRIBE</div>
          <CardTitle className="text-white">Welcome back</CardTitle>
          <CardDescription className="text-gray-400">Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
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
                onCheckedChange={setRememberMe}
                className="border-gray-600 data-[state=checked]:bg-[#28CA00] data-[state=checked]:border-[#28CA00]"
              />
              <Label htmlFor="remember" className="text-sm text-gray-400">
                Remember me
              </Label>
            </div>
            <Link href="/auth/forgot-password" className="text-sm text-[#28CA00] hover:underline">
              Forgot password
            </Link>
          </div>

          <Link href="/">
            <Button className="w-full bg-[#28CA00] hover:bg-[#20A000] text-black font-semibold">Sign In</Button>
          </Link>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-900 px-2 text-gray-400">Or continue with</span>
            </div>
          </div>

          <Button variant="outline" className="w-full border-gray-700 text-white hover:bg-gray-800 bg-transparent">
            <Twitter className="h-4 w-4 mr-2" />
            Twitter
          </Button>

          <div className="text-center">
            <span className="text-gray-400">Don't have an account? </span>
            <Link href="/auth/signup" className="text-[#28CA00] hover:underline">
              Sign Up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
