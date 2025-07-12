"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Eye, EyeOff, Upload, Twitter } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import ConnectButton from "../../../hooks/ConnectButton"

export default function SignupPage() {

  const handleTwitterAuth = () => {
    window.open("http://localhost:5001", "_blank", "width=500,height=600");
  };

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    club: "",
    profilePhoto: null,
  })
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [acceptPrivacy, setAcceptPrivacy] = useState(false)
  const [acceptDataUsage, setAcceptDataUsage] = useState(false)

  const clubs = [
    "Chelsea FC",
    "Arsenal",
    "Manchester United",
    "Manchester City",
    "Liverpool",
    "Tottenham",
    "Newcastle United",
    "Brighton",
    "West Ham",
    "Aston Villa",
    "Real Madrid",
    "Barcelona",
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-black p-4 py-8 pb-28">
      <Card className="w-full max-w-md mx-auto bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <Image
              src="/logo.svg"
              alt="TRBE Logo"
              width={120}
              height={40}
              className="dark:hidden"
            />
            <Image
              src="/logo-black.svg"
              alt="TRBE Logo"
              width={120}
              height={40}
              className="hidden dark:block"
            />
          </div>
          <CardTitle className="text-gray-900 dark:text-white">Create account</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">Join the ultimate fan platform</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Profile Photo */}
          <div className="flex flex-col items-center space-y-2">
            <Avatar className="h-20 w-20">
              <AvatarImage src={formData.profilePhoto || "/placeholder.svg?height=80&width=80"} />
              <AvatarFallback className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                <Upload className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-transparent"
            >
              Add photo
            </Button>
          </div>

          <div className="space-y-4">
            <ConnectButton></ConnectButton>
            
            {/* Botão de conexão com Twitter */}
            <button
              onClick={handleTwitterAuth}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md bg-[#1DA1F2] hover:bg-[#1A91DA] text-white font-semibold transition-colors"
            >
              <Twitter className="h-5 w-5" />
              Conectar com Twitter
            </button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-gray-900 dark:text-white">
              Full name *
            </Label>
            <Input
              id="fullName"
              placeholder="Your full name"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-900 dark:text-white">
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="club" className="text-gray-900 dark:text-white">
              Favorite club *
            </Label>
            <Select value={formData.club} onValueChange={(value) => setFormData({ ...formData, club: value })}>
              <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
                <SelectValue placeholder="Select your club" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                {clubs.map((club) => (
                  <SelectItem key={club} value={club} className="text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700">
                    {club}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-900 dark:text-white">
              Password *
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 pr-10"
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

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-gray-900 dark:text-white">
              Confirm password *
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-gray-600 dark:hover:text-white"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={setAcceptTerms}
                className="border-gray-300 dark:border-gray-600 data-[state=checked]:bg-black dark:data-[state=checked]:bg-white data-[state=checked]:border-black dark:data-[state=checked]:border-white mt-1"
              />
              <Label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                I accept the{" "}
                <Link href="/terms" className="text-black dark:text-white hover:underline">
                  terms of service
                </Link>
              </Label>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="privacy"
                checked={acceptPrivacy}
                onCheckedChange={setAcceptPrivacy}
                className="border-gray-300 dark:border-gray-600 data-[state=checked]:bg-black dark:data-[state=checked]:bg-white data-[state=checked]:border-black dark:data-[state=checked]:border-white mt-1"
              />
              <Label htmlFor="privacy" className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                I accept the{" "}
                <Link href="/privacy" className="text-black dark:text-white hover:underline">
                  privacy policy
                </Link>
              </Label>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="dataUsage"
                checked={acceptDataUsage}
                onCheckedChange={setAcceptDataUsage}
                className="border-gray-300 dark:border-gray-600 data-[state=checked]:bg-black dark:data-[state=checked]:bg-white data-[state=checked]:border-black dark:data-[state=checked]:border-white mt-1"
              />
              <Label htmlFor="dataUsage" className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                I agree to the{" "}
                <Link href="/data-usage" className="text-black dark:text-white hover:underline">
                  data usage policy
                </Link>
              </Label>
            </div>
          </div>

          <Link href="/onboarding">
            <Button 
              className="w-full bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black font-semibold"
              disabled={!acceptTerms || !acceptPrivacy || !acceptDataUsage}
            >
              Create Account
            </Button>
          </Link>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200 dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400">Or continue with</span>
            </div>
          </div>

          <Button variant="outline" className="w-full border-gray-200 dark:border-gray-700 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 bg-transparent">
            <Twitter className="h-4 w-4 mr-2" />
            Twitter
          </Button>

          <div className="text-center">
            <span className="text-gray-600 dark:text-gray-400">Already have an account? </span>
            <Link href="/auth/login" className="text-black dark:text-white hover:underline">
              Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
