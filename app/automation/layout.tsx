import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Automate Your Message Sending | WhatsApp Business",
  description: "Set up automated messaging based on Google Sheets data with customizable timing and templates.",
}

export default function AutomationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
