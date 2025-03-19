"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { AuthConfig } from "@/lib/types"
import { setAuthToken } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface AuthContextType {
  isAuthenticated: boolean
  authConfig: AuthConfig | null
  isLoading: boolean
  login: (config: AuthConfig) => Promise<void>
  logout: () => void
  updateConfig: (config: Partial<AuthConfig>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [authConfig, setAuthConfig] = useState<AuthConfig | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { toast } = useToast()

  // Check for saved auth on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem("whatsapp_auth")
    if (savedAuth) {
      try {
        const parsedAuth = JSON.parse(savedAuth) as AuthConfig
        setAuthConfig(parsedAuth)
        setAuthToken(parsedAuth.accessToken)
        setIsAuthenticated(true)
      } catch (error) {
        console.error("Error parsing saved auth:", error)
        localStorage.removeItem("whatsapp_auth")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (config: AuthConfig) => {
    try {
      setIsLoading(true)
      // Set the auth token for API calls
      setAuthToken(config.accessToken)

      // In a real app, you would verify the token here by making an API call
      // For this example, we'll just simulate a successful login

      // Save auth to localStorage
      localStorage.setItem("whatsapp_auth", JSON.stringify(config))

      // Update state
      setAuthConfig(config)
      setIsAuthenticated(true)

      toast({
        title: "Authentication successful",
        description: "You are now connected to the WhatsApp Cloud API.",
      })
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Authentication failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("whatsapp_auth")
    setAuthToken("")
    setAuthConfig(null)
    setIsAuthenticated(false)

    toast({
      title: "Logged out",
      description: "You have been disconnected from the WhatsApp Cloud API.",
    })
  }

  const updateConfig = (config: Partial<AuthConfig>) => {
    if (!authConfig) return

    const updatedConfig = { ...authConfig, ...config }
    localStorage.setItem("whatsapp_auth", JSON.stringify(updatedConfig))
    setAuthConfig(updatedConfig)

    if (config.accessToken) {
      setAuthToken(config.accessToken)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        authConfig,
        isLoading,
        login,
        logout,
        updateConfig,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

