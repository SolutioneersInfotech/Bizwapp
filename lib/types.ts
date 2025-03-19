// API Authentication types
export interface AuthConfig {
  phoneNumberId: string
  whatsappBusinessAccountId: string
  accessToken: string
}

// Message types
export interface Message {
  id: string
  from: string
  to: string
  type: "text" | "image" | "document" | "template"
  content: string
  timestamp: string
  status: "sent" | "delivered" | "read" | "failed"
  direction: "inbound" | "outbound"
  metadata?: any
}

// Contact types
export interface Contact {
  id: string
  name: string
  phone: string
  email?: string
  avatar?: string
  initials?: string
  tags: string[]
  lastContact?: string
  status: "Active" | "Inactive" | "Blocked"
  notes?: string
}

// Template types
export interface Template {
  id: string
  name: string
  category: string
  content: string
  status: "Approved" | "Pending" | "Rejected"
  updated: string
  usageCount: number
  language?: string
  components?: TemplateComponent[]
}

export interface TemplateComponent {
  type: "header" | "body" | "footer" | "button"
  text?: string
  parameters?: TemplateParameter[]
}

export interface TemplateParameter {
  type: "text" | "currency" | "date_time" | "image" | "document"
  text?: string
  currency?: {
    code: string
    amount: number
  }
  date_time?: {
    fallback_value: string
  }
  image?: {
    link: string
  }
  document?: {
    link: string
  }
}

// Analytics types
export interface MessageAnalytics {
  totalSent: number
  totalDelivered: number
  totalRead: number
  totalFailed: number
  deliveryRate: number
  readRate: number
  dailyStats: DailyStats[]
}

export interface DailyStats {
  date: string
  sent: number
  delivered: number
  read: number
  failed: number
}

// Error types
export interface ApiError {
  id: string
  code: string
  title: string
  message: string
  timestamp: string
  details?: any
}

