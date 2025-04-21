"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Template } from "@/lib/types"
// import { useAuth } from "./AuthContext"
import { useToast } from "@/hooks/use-toast"

interface TemplateContextType {
  templates: Template[]
  fetchTemplates: () => Promise<void>
  createTemplate: (template: Omit<Template, "id">) => Promise<void>
  updateTemplate: (id: string, template: Partial<Template>) => Promise<void>
  deleteTemplate: (id: string) => Promise<void>
  isLoading: boolean
}

const TemplateContext = createContext<TemplateContextType | undefined>(undefined)

export const TemplateProvider = ({ children }: { children: React.ReactNode }) => {
  const [templates, setTemplates] = useState<Template[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  // const { authConfig } = useAuth()
  const { toast } = useToast()

  // Load templates from localStorage on mount
  useEffect(() => {
    const savedTemplates = localStorage.getItem("whatsapp_templates")
    if (savedTemplates) {
      try {
        setTemplates(JSON.parse(savedTemplates))
      } catch (error) {
        console.error("Error parsing saved templates:", error)
      }
    } else {
      // If no saved templates, use the mock data
      setTemplates(mockTemplates)
      localStorage.setItem("whatsapp_templates", JSON.stringify(mockTemplates))
    }
  }, [])

  // Save templates to localStorage when they change
  useEffect(() => {
    if (templates.length > 0) {
      localStorage.setItem("whatsapp_templates", JSON.stringify(templates))
    }
  }, [templates])

  const fetchTemplates = async () => {
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
      // For this demo, we'll use mock data
      setTemplates(mockTemplates)

      toast({
        title: "Templates loaded",
        description: `Successfully loaded ${mockTemplates.length} templates.`,
      })
    } catch (error) {
      console.error("Error fetching templates:", error)
      toast({
        title: "Failed to load templates",
        description: "There was an error loading your templates. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const createTemplate = async (template: Omit<Template, "id">) => {
    setIsLoading(true)
    try {
      // In a real app, this would call the WhatsApp API
      // For this demo, we'll simulate a successful API call
      const newTemplate: Template = {
        ...template,
        id: `template_${Date.now()}`,
        updated: new Date().toISOString(),
        usageCount: 0,
      }

      setTemplates((prev) => [...prev, newTemplate])
    } catch (error) {
      console.error("Error creating template:", error)
      toast({
        title: "Failed to create template",
        description: "There was an error creating your template. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateTemplate = async (id: string, template: Partial<Template>) => {
    setIsLoading(true)
    try {
      // In a real app, this would call the WhatsApp API
      // For this demo, we'll simulate a successful API call
      setTemplates((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...template, updated: new Date().toISOString() } : t)),
      )

      toast({
        title: "Template updated",
        description: "Your template has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating template:", error)
      toast({
        title: "Failed to update template",
        description: "There was an error updating your template. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const deleteTemplate = async (id: string) => {
    setIsLoading(true)
    try {
      // In a real app, this would call the WhatsApp API
      // For this demo, we'll simulate a successful API call
      setTemplates((prev) => prev.filter((t) => t.id !== id))

      toast({
        title: "Template deleted",
        description: "Your template has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting template:", error)
      toast({
        title: "Failed to delete template",
        description: "There was an error deleting your template. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <TemplateContext.Provider
      value={{
        templates,
        fetchTemplates,
        createTemplate,
        updateTemplate,
        deleteTemplate,
        isLoading,
      }}
    >
      {children}
    </TemplateContext.Provider>
  )
}

export const useTemplates = () => {
  const context = useContext(TemplateContext)
  if (context === undefined) {
    throw new Error("useTemplates must be used within a TemplateProvider")
  }
  return context
}

// Mock data for templates
const mockTemplates: Template[] = [
  {
    id: "template_1",
    name: "Welcome Message",
    category: "Onboarding",
    content: "Hello {{1}}, thank you for contacting us! How can we assist you today?",
    status: "Approved",
    updated: "2023-05-15T10:30:00Z",
    usageCount: 245,
    language: "en_US",
    components: [
      {
        type: "body",
        parameters: [
          {
            type: "text",
            text: "{{1}}",
          },
        ],
      },
    ],
  },
  {
    id: "template_2",
    name: "Order Confirmation",
    category: "Transactional",
    content:
      "Your order #{{1}} has been confirmed and is being processed. Expected delivery: {{2}}. Thank you for shopping with us!",
    status: "Approved",
    updated: "2023-05-10T14:20:00Z",
    usageCount: 189,
    language: "en_US",
    components: [
      {
        type: "body",
        parameters: [
          {
            type: "text",
            text: "{{1}}",
          },
          {
            type: "text",
            text: "{{2}}",
          },
        ],
      },
    ],
  },
  {
    id: "template_3",
    name: "Support Follow-up",
    category: "Customer Support",
    content:
      "Hi {{1}}, we wanted to follow up on your recent support request. Has your issue been resolved to your satisfaction?",
    status: "Pending",
    updated: "2023-05-18T09:15:00Z",
    usageCount: 56,
    language: "en_US",
    components: [
      {
        type: "body",
        parameters: [
          {
            type: "text",
            text: "{{1}}",
          },
        ],
      },
    ],
  },
  {
    id: "template_4",
    name: "Appointment Reminder",
    category: "Scheduling",
    content:
      "Reminder: You have an appointment scheduled for {{1}} at {{2}}. Please reply YES to confirm or NO to reschedule.",
    status: "Approved",
    updated: "2023-05-12T11:45:00Z",
    usageCount: 132,
    language: "en_US",
    components: [
      {
        type: "body",
        parameters: [
          {
            type: "text",
            text: "{{1}}",
          },
          {
            type: "text",
            text: "{{2}}",
          },
        ],
      },
    ],
  },
  {
    id: "template_5",
    name: "Feedback Request",
    category: "Engagement",
    content: "We value your opinion! Please rate your recent experience with us from 1-5, with 5 being excellent.",
    status: "Rejected",
    updated: "2023-05-19T16:30:00Z",
    usageCount: 0,
    language: "en_US",
  },
  {
    id: "template_6",
    name: "Product Restock",
    category: "Marketing",
    content: "Good news! The {{1}} you were interested in is back in stock. Shop now before it sells out again!",
    status: "Pending",
    updated: "2023-05-17T13:10:00Z",
    usageCount: 0,
    language: "en_US",
    components: [
      {
        type: "body",
        parameters: [
          {
            type: "text",
            text: "{{1}}",
          },
        ],
      },
    ],
  },
]

