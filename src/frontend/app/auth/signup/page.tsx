"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
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
import ConnectButton from "../../../hooks/connection-button"
import { useAppKit } from "@reown/appkit/react"
import { useAppKitAccount } from "@reown/appkit/react"

function SignupForm() {
  const searchParams = useSearchParams();
  
  const [oauthProvider, setOauthProvider] = useState("");
  const [oauthId, setOauthId] = useState("");

  useEffect(() => {
    const provider = searchParams.get("oauthProvider");
    const id = searchParams.get("oauthId");
    if (provider && id) {
      setOauthProvider(provider);
      setOauthId(id);
    }
  }, [searchParams]);

  const { open } = useAppKit()
  const { address, isConnected } = useAppKitAccount({ namespace: "eip155" }) // Ethereum namespace

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    clubId: "",
    profilePhoto: "",
  })

  const [acceptTerms, setAcceptTerms] = useState(false)
  const [acceptPrivacy, setAcceptPrivacy] = useState(false)
  const [acceptDataUsage, setAcceptDataUsage] = useState(false)

  const handleTwitterAuth = () => {
    const popup = window.open(
      "http://localhost:5001/auth/twitter/start",
      "TwitterAuth",
      "width=600,height=700"
    )
  
    const listener = (event: MessageEvent) => {
      if (event.origin !== "http://localhost:5001") return
      if (event.data.type === "twitter-auth-success") {
        setOauthProvider("twitter")
        setOauthId(event.data.userId)
        popup?.close()
        window.removeEventListener("message", listener)
      }
    }
  
    window.addEventListener("message", listener)
  }
  

  const handleOpenWalletModal = () => {
    open({ view: "Connect", namespace: "eip155" }) // abre modal para conectar wallets Ethereum
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch("http://localhost:5001/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          walletAddress: address,
          oauthProvider,
          oauthId,
          acceptTerms,
          acceptPrivacy,
          acceptDataUsage,
        }),
      })

      const result = await res.json()
      if (res.ok) {
        alert("Conta criada com sucesso!")
      } else {
        alert("Erro ao criar conta: " + (result.message || "Erro desconhecido"))
      }
    } catch (err) {
      console.error(err)
      alert("Erro inesperado ao criar conta")
    }
  }

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
          <form onSubmit={handleSubmit}>
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

            <br></br>

            <div className="space-y-4">
              {/* Botão para abrir modal de conexão da carteira */}
              <Button onClick={handleOpenWalletModal} className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md bg-gray-800 text-white font-semibold hover:bg-gray-700">
                {isConnected && address ? (
                  <span>Wallet connected: {address.substring(0, 6)}...{address.substring(address.length - 4)}</span>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                    Connect Wallet
                  </>
                )}
              </Button>

              {oauthId ? (
                <div className="flex items-center justify-center gap-2 py-2 px-4 rounded-md bg-[#1DA1F2] text-white font-semibold">
                  <Twitter className="h-5 w-5" />
                  <span>Twitter connected (ID: {oauthId})</span>
                </div>
              ) : (
                <Button
                  type="button"
                  onClick={handleTwitterAuth}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md bg-[#1DA1F2] text-white font-semibold hover:bg-[#1991DA]"
                >
                  <Twitter className="h-5 w-5" />
                  <span>Connect Twitter</span>
                </Button>
              )}


            </div>

            {/* Campos de formulário */}
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-gray-900 dark:text-white">
                First name *
              </Label>
              <Input
                id="firstName"
                placeholder="Your first name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-gray-900 dark:text-white">
                Last name *
              </Label>
              <Input
                id="lastName"
                placeholder="Your last name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-900 dark:text-white">
                Username *
              </Label>
              <Input
                id="username"
                placeholder="Chosen username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
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
              <Label htmlFor="clubId" className="text-gray-900 dark:text-white">
                Favorite club *
              </Label>
              <Select value={formData.clubId} onValueChange={(value) => setFormData({ ...formData, clubId: value })}>
                <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
                  <SelectValue placeholder="Select your club" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  {clubs.map((clubId) => (
                    <SelectItem
                      key={clubId}
                      value={clubId}
                      className="text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      {clubId}
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
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
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
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                />
                <Label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400">
                  I accept the{" "}
                  <Link href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">
                    Terms of Service
                  </Link>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="privacy"
                  checked={acceptPrivacy}
                  onCheckedChange={(checked) => setAcceptPrivacy(checked as boolean)}
                />
                <Label htmlFor="privacy" className="text-sm text-gray-600 dark:text-gray-400">
                  I accept the{" "}
                  <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="dataUsage"
                  checked={acceptDataUsage}
                  onCheckedChange={(checked) => setAcceptDataUsage(checked as boolean)}
                />
                <Label htmlFor="dataUsage" className="text-sm text-gray-600 dark:text-gray-400">
                  I agree to the{" "}
                  <Link href="/data-usage" className="text-blue-600 dark:text-blue-400 hover:underline">
                    Data Usage Policy
                  </Link>
                </Label>
              </div>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Create account
            </Button>
          </form>

          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-blue-600 dark:text-blue-400 hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white dark:bg-black p-4 py-8 pb-28 flex items-center justify-center">Loading...</div>}>
      <SignupForm />
    </Suspense>
  )
}
