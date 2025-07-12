"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import apiClient from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

interface User {
  id: string
  email: string
  username: string
  firstName: string
  lastName: string
  displayName?: string
  avatar?: string
  bio?: string
  walletAddress?: string
  level: number
  experience: number
  tokens: number
  reputationScore: number
  rankingPosition?: number
  totalCheckIns: number
  totalEvents: number
  totalTasks: number
  totalBadges: number
  currentStreak: number
  longestStreak: number
  createdAt: string
  lastLoginAt?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (userData: any) => Promise<void>
  logout: () => Promise<void>
  updateUser: (data: Partial<User>) => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  const isAuthenticated = !!user

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (token) {
        const userData = await apiClient.getCurrentUser()
        setUser(userData.data)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('auth_token')
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const response = await apiClient.login(email, password)
      setUser(response.user)
      toast({
        title: "Welcome back!",
        description: `Hello ${response.user.firstName}!`,
      })
      router.push('/homepage')
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (userData: any) => {
    try {
      setIsLoading(true)
      const response = await apiClient.signup(userData)
      setUser(response.user)
      toast({
        title: "Account created!",
        description: "Welcome to TRBE!",
      })
      router.push('/homepage')
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await apiClient.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      localStorage.removeItem('auth_token')
      toast({
        title: "Logged out",
        description: "See you soon!",
      })
      router.push('/auth/login')
    }
  }

  const updateUser = async (data: Partial<User>) => {
    try {
      const response = await apiClient.updateUserProfile(data)
      setUser(response.data)
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      })
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      })
      throw error
    }
  }

  const refreshUser = async () => {
    try {
      const userData = await apiClient.getCurrentUser()
      setUser(userData.data)
    } catch (error) {
      console.error('Failed to refresh user:', error)
      // If refresh fails, user might be logged out
      setUser(null)
      localStorage.removeItem('auth_token')
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    signup,
    logout,
    updateUser,
    refreshUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 