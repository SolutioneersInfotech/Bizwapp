"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/AuthContext"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserNav } from "@/components/user-nav"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // const router = useRouter()
  const { isAuthenticated, isLoading, authConfig } = useAuth()

  // useEffect(() => {
  //   if (!isLoading && !isAuthenticated) {
  //     router.push("/login")
  //   }
  // }, [isLoading, isAuthenticated, router])

  // if (isLoading) {
  //   return <div className="flex h-screen items-center justify-center">Loading...</div>
  // }

  // if (!isAuthenticated) {
  //   return null
  // }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
            <SidebarTrigger />
            <div className="w-full flex items-center justify-between">
              <h1 className="text-xl font-semibold">WhatsApp Business</h1>
              <div className="flex items-center gap-4">
                <div className="text-sm text-muted-foreground hidden md:block">
                  {authConfig?.phoneNumberId === "demo_phone_id" ? (
                    <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-md text-xs font-medium">
                      Demo Mode
                    </span>
                  ) : (
                    <span>Connected to WhatsApp API</span>
                  )}
                </div>
                <ThemeToggle />
                <UserNav />
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}

