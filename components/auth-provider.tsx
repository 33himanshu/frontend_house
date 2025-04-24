"use client"

import type React from "react"

import { createContext, useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: string
  username: string
  email: string
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<void>
  signup: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
  loading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        localStorage.removeItem("user")
      }
    }
    setLoading(false)
  }, [])

  const login = async (username: string, password: string) => {
    // In a real app, this would make an API call to your backend
    // For demo purposes, we'll simulate a successful login
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock user data
      const userData = {
        id: "user_" + Math.random().toString(36).substr(2, 9),
        username,
        email: `${username}@example.com`,
      }

      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))

      toast({
        title: "Login successful",
        description: `Welcome back, ${username}!`,
      })
    } catch (error) {
      console.error("Login error:", error)
      throw new Error("Invalid username or password")
    }
  }

  const signup = async (username: string, email: string, password: string) => {
    // In a real app, this would make an API call to your backend
    // For demo purposes, we'll simulate a successful signup
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock user creation
      const userData = {
        id: "user_" + Math.random().toString(36).substr(2, 9),
        username,
        email,
      }

      toast({
        title: "Account created",
        description: "Your account has been created successfully. Please log in.",
      })

      // In a real app, you might automatically log the user in here
      // For this demo, we'll just return and let them log in manually
    } catch (error) {
      console.error("Signup error:", error)
      throw new Error("Failed to create account")
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    })
  }

  return <AuthContext.Provider value={{ user, login, signup, logout, loading }}>{children}</AuthContext.Provider>
}
