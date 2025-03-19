"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import type { MessageAnalytics, DailyStats } from "@/lib/types"
import { useAuth } from "./AuthContext"
import { useMessages } from "./MessageContext"

interface AnalyticsContextType {
  analytics: MessageAnalytics
  refreshAnalytics: () => void
  isLoading: boolean
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined)

export const AnalyticsProvider = ({ children }: { children: React.ReactNode }) => {
  const [analytics, setAnalytics] = useState<MessageAnalytics>({
    totalSent: 0,
    totalDelivered: 0,
    totalRead: 0,
    totalFailed: 0,
    deliveryRate: 0,
    readRate: 0,
    dailyStats: [],
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { authConfig } = useAuth()
  const { messages } = useMessages()

  // Calculate analytics based on messages
  const refreshAnalytics = useCallback(() => {
    setIsLoading(true)

    try {
      // Flatten all messages
      const allMessages = Object.values(messages).flat()

      // Count by status
      const totalSent = allMessages.filter((m) => m.direction === "outbound").length
      const totalDelivered = allMessages.filter((m) => m.status === "delivered" || m.status === "read").length
      const totalRead = allMessages.filter((m) => m.status === "read").length
      const totalFailed = allMessages.filter((m) => m.status === "failed").length

      // Calculate rates
      const deliveryRate = totalSent > 0 ? (totalDelivered / totalSent) * 100 : 0
      const readRate = totalDelivered > 0 ? (totalRead / totalDelivered) * 100 : 0

      // Group by date for daily stats
      const messagesByDate = allMessages.reduce(
        (acc, message) => {
          const date = new Date(message.timestamp).toISOString().split("T")[0]
          if (!acc[date]) {
            acc[date] = {
              sent: 0,
              delivered: 0,
              read: 0,
              failed: 0,
            }
          }

          if (message.direction === "outbound") {
            acc[date].sent++

            if (message.status === "delivered" || message.status === "read") {
              acc[date].delivered++
            }

            if (message.status === "read") {
              acc[date].read++
            }

            if (message.status === "failed") {
              acc[date].failed++
            }
          }

          return acc
        },
        {} as Record<string, { sent: number; delivered: number; read: number; failed: number }>,
      )

      // Convert to array and sort by date
      const dailyStats: DailyStats[] = Object.entries(messagesByDate)
        .map(([date, stats]) => ({
          date,
          ...stats,
        }))
        .sort((a, b) => a.date.localeCompare(b.date))

      setAnalytics({
        totalSent,
        totalDelivered,
        totalRead,
        totalFailed,
        deliveryRate,
        readRate,
        dailyStats,
      })
    } catch (error) {
      console.error("Error calculating analytics:", error)
    } finally {
      setIsLoading(false)
    }
  }, [messages])

  // Refresh analytics when messages change
  // useEffect(() => {
  //   refreshAnalytics()
  // }, [messages])

  return (
    <AnalyticsContext.Provider
      value={{
        analytics,
        refreshAnalytics,
        isLoading,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  )
}

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext)
  if (context === undefined) {
    throw new Error("useAnalytics must be used within an AnalyticsProvider")
  }
  return context
}

