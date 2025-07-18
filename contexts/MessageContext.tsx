"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Message, Contact } from "@/lib/types"
// import { useAuth } from "./AuthContext"
import { useToast } from "@/hooks/use-toast"

interface MessageContextType {
  messages: Record<string, Message[]> // Keyed by contact phone number
  sendMessage: (to: string, message: string) => Promise<void>
  sendBulkMessages: (recipients: string[], message: string) => Promise<void>
  sendTemplateMessage: (to: string, templateName: string, components: any[]) => Promise<void>
  getMessageHistory: (contactPhone: string) => Message[]
  isLoading: boolean
  currentContact: Contact | null
  setCurrentContact: (contact: Contact | null) => void
}

const MessageContext = createContext<MessageContextType | undefined>(undefined)

export const MessageProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<Record<string, Message[]>>({})
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [currentContact, setCurrentContact] = useState<Contact | null>(null)
  // const { authConfig } = useAuth()
  const { toast } = useToast()

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem("whatsapp_messages")
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages))
      } catch (error) {
        console.error("Error parsing saved messages:", error)
      }
    }
  }, [])

  // Save messages to localStorage when they change
  useEffect(() => {
    if (Object.keys(messages).length > 0) {
      localStorage.setItem("whatsapp_messages", JSON.stringify(messages))
    }
  }, [messages])

  const sendMessage = async (to: string, message: string) => {
    if (!authConfig) {
      toast({
        title: "Authentication required",
        description: "Please authenticate with WhatsApp Cloud API first.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // In a real app, this would call the WhatsApp API
      // For this demo, we'll simulate a successful API call
      const messageId = `msg_${Date.now()}`

      // Add message to state
      const newMessage: Message = {
        id: messageId,
        from: authConfig.phoneNumberId,
        to,
        type: "text",
        content: message,
        timestamp: new Date().toISOString(),
        status: "sent",
        direction: "outbound",
      }

      setMessages((prev) => {
        const contactMessages = prev[to] || []
        return {
          ...prev,
          [to]: [...contactMessages, newMessage],
        }
      })

      // Simulate API call
      setTimeout(() => {
        // Update message status to delivered
        setMessages((prev) => {
          const contactMessages = prev[to] || []
          return {
            ...prev,
            [to]: contactMessages.map((msg) => (msg.id === messageId ? { ...msg, status: "delivered" } : msg)),
          }
        })

        // After another delay, update to read
        setTimeout(() => {
          setMessages((prev) => {
            const contactMessages = prev[to] || []
            return {
              ...prev,
              [to]: contactMessages.map((msg) => (msg.id === messageId ? { ...msg, status: "read" } : msg)),
            }
          })
        }, 2000)
      }, 1500)

      toast({
        title: "Message sent",
        description: "Your message has been sent successfully.",
      })
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Failed to send message",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const sendBulkMessages = async (recipients: string[], message: string) => {
    if (!authConfig) {
      toast({
        title: "Authentication required",
        description: "Please authenticate with WhatsApp Cloud API first.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // Send message to each recipient
      for (const recipient of recipients) {
        await sendMessage(recipient, message)
      }

      toast({
        title: " messages sent",
        description: `Successfully sent messages to ${recipients.length} recipients.`,
      })
    } catch (error) {
      console.error("Error sending  messages:", error)
      toast({
        title: "Failed to send  messages",
        description: "There was an error sending your messages. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const sendTemplateMessage = async (to: string, templateName: string, components: any[] = []) => {
    if (!authConfig) {
      toast({
        title: "Authentication required",
        description: "Please authenticate with WhatsApp Cloud API first.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // In a real app, this would call the WhatsApp API
      // For this demo, we'll simulate a successful API call
      const messageId = `msg_${Date.now()}`

      // Add message to state
      const newMessage: Message = {
        id: messageId,
        from: authConfig.phoneNumberId,
        to,
        type: "template",
        content: `Template: ${templateName}`,
        timestamp: new Date().toISOString(),
        status: "sent",
        direction: "outbound",
        metadata: { templateName, components },
      }

      setMessages((prev) => {
        const contactMessages = prev[to] || []
        return {
          ...prev,
          [to]: [...contactMessages, newMessage],
        }
      })

      // Simulate API call
      setTimeout(() => {
        // Update message status to delivered
        setMessages((prev) => {
          const contactMessages = prev[to] || []
          return {
            ...prev,
            [to]: contactMessages.map((msg) => (msg.id === messageId ? { ...msg, status: "delivered" } : msg)),
          }
        })
      }, 1500)

      toast({
        title: "Template message sent",
        description: `Your template "${templateName}" has been sent successfully.`,
      })
    } catch (error) {
      console.error("Error sending template message:", error)
      toast({
        title: "Failed to send template message",
        description: "There was an error sending your template message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getMessageHistory = (contactPhone: string): Message[] => {
    return messages[contactPhone] || []
  }

  return (
    <MessageContext.Provider
      value={{
        messages,
        sendMessage,
        sendBulkMessages,
        sendTemplateMessage,
        getMessageHistory,
        isLoading,
        currentContact,
        setCurrentContact,
      }}
    >
      {children}
    </MessageContext.Provider>
  )
}

export const useMessages = () => {
  const context = useContext(MessageContext)
  if (context === undefined) {
    throw new Error("useMessages must be used within a MessageProvider")
  }
  return context
}

