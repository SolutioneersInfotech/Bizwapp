import axios from "axios"

// Create an axios instance with default config
const api = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
})

// Set the auth token when available
export const setAuthToken = (token: string) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common["Authorization"]
  }
}

// WhatsApp API endpoints
export const whatsappApi = {
  // Verify authentication and get business profile
  getBusinessProfile: async (phoneNumberId: string) => {
    try {
      const response = await api.get(`https://graph.facebook.com/v18.0/${phoneNumberId}/whatsapp_business_profile`)
      return response.data
    } catch (error) {
      console.error("Error fetching business profile:", error)
      throw error
    }
  },

  // Send a text message
  sendTextMessage: async (phoneNumberId: string, to: string, message: string) => {
    try {
      const response = await api.post(`https://graph.facebook.com/v18.0/${phoneNumberId}/messages`, {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to,
        type: "text",
        text: { body: message },
      })
      return response.data
    } catch (error) {
      console.error("Error sending message:", error)
      throw error
    }
  },

  // Send bulk messages
  sendBulkMessages: async (phoneNumberId: string, recipients: string[], message: string) => {
    try {
      const promises = recipients.map((recipient) => whatsappApi.sendTextMessage(phoneNumberId, recipient, message))
      return Promise.all(promises)
    } catch (error) {
      console.error("Error sending  messages:", error)
      throw error
    }
  },

  // Send a template message
  sendTemplateMessage: async (
    phoneNumberId: string,
    to: string,
    templateName: string,
    language = "en_US",
    components: any[] = [],
  ) => {
    try {
      const response = await api.post(`https://graph.facebook.com/v18.0/${phoneNumberId}/messages`, {
        messaging_product: "whatsapp",
        to,
        type: "template",
        template: {
          name: templateName,
          language: { code: language },
          components,
        },
      })
      return response.data
    } catch (error) {
      console.error("Error sending template message:", error)
      throw error
    }
  },

  // Get approved templates
  getTemplates: async (whatsappBusinessAccountId: string) => {
    try {
      const response = await api.get(`https://graph.facebook.com/v18.0/${whatsappBusinessAccountId}/message_templates`)
      return response.data
    } catch (error) {
      console.error("Error fetching templates:", error)
      throw error
    }
  },

  // Get message status
  getMessageStatus: async (messageId: string) => {
    try {
      const response = await api.get(`https://graph.facebook.com/v18.0/${messageId}`)
      return response.data
    } catch (error) {
      console.error("Error fetching message status:", error)
      throw error
    }
  },

  // Get API errors
  getApiErrors: async (phoneNumberId: string) => {
    try {
      const response = await api.get(`https://graph.facebook.com/v18.0/${phoneNumberId}/errors`)
      return response.data
    } catch (error) {
      console.error("Error fetching API errors:", error)
      throw error
    }
  },
}

export default api

