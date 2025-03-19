"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search,
  Filter,
  MoreVertical,
  Paperclip,
  Send,
  Smile,
  ImageIcon,
  Mic,
  Loader2,
  CheckCircle,
  Check,
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useMessages } from "@/contexts/MessageContext"
import { useTemplates } from "@/contexts/TemplateContext"
import type { Contact, Message } from "@/lib/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function ConversationsPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const {
    messages,
    sendMessage,
    getMessageHistory,
    isLoading: messageLoading,
    currentContact,
    setCurrentContact,
  } = useMessages()
  const { templates } = useTemplates()

  const [newMessage, setNewMessage] = useState("")
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [contactMessages, setContactMessages] = useState<Message[]>([])
  const [bulkMessageOpen, setBulkMessageOpen] = useState(false)
  const [bulkMessage, setBulkMessage] = useState("")
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [authLoading, isAuthenticated, router])

  // Set selected contact from context if available
  useEffect(() => {
    if (currentContact && !selectedContact) {
      setSelectedContact(currentContact)
    }
  }, [currentContact, selectedContact])

  // Update messages when selected contact changes
  useEffect(() => {
    if (selectedContact) {
      const history = getMessageHistory(selectedContact.phone)
      setContactMessages(history)
    }
  }, [selectedContact, messages, getMessageHistory])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [contactMessages])

  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact)
    setCurrentContact(contact)
  }

  const handleSendMessage = async () => {
    if (!selectedContact || !newMessage.trim()) return

    await sendMessage(selectedContact.phone, newMessage)
    setNewMessage("")
  }

  const handleSendBulkMessage = async () => {
    if (!bulkMessage.trim() || selectedContacts.length === 0) return

    // In a real app, you would call the API to send bulk messages
    // For this demo, we'll just log it
    console.log(`Sending "${bulkMessage}" to ${selectedContacts.length} contacts`)

    setBulkMessage("")
    setSelectedContacts([])
    setBulkMessageOpen(false)
  }

  const handleSendTemplate = async (templateId: string) => {
    if (!selectedContact) return

    const template = templates.find((t) => t.id === templateId)
    if (!template) return

    // In a real app, you would call the API to send a template message
    // For this demo, we'll just send the template content
    await sendMessage(selectedContact.phone, `[Template: ${template.name}] ${template.content}`)
    setTemplateDialogOpen(false)
  }

  const toggleContactSelection = (phone: string) => {
    setSelectedContacts((prev) => (prev.includes(phone) ? prev.filter((p) => p !== phone) : [...prev, phone]))
  }

  if (authLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col md:flex-row">
      {/* Conversations List */}
      <div className="w-full border-r md:w-80 lg:w-96">
        <div className="flex h-14 items-center justify-between border-b px-4">
          <h2 className="font-semibold">Conversations</h2>
          <div className="flex items-center gap-2">
            <Dialog open={bulkMessageOpen} onOpenChange={setBulkMessageOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  Bulk Message
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Send Bulk Message</DialogTitle>
                  <DialogDescription>Send a message to multiple contacts at once.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="bulk-message">Message</Label>
                    <Textarea
                      id="bulk-message"
                      placeholder="Type your message here..."
                      value={bulkMessage}
                      onChange={(e) => setBulkMessage(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Select Contacts ({selectedContacts.length} selected)</Label>
                    <ScrollArea className="h-[200px] rounded-md border p-2">
                      {conversations.map((contact) => (
                        <div key={contact.id} className="flex items-center gap-2 py-2">
                          <input
                            type="checkbox"
                            id={`contact-${contact.id}`}
                            checked={selectedContacts.includes(contact.phone)}
                            onChange={() => toggleContactSelection(contact.phone)}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                          <Label htmlFor={`contact-${contact.id}`} className="flex items-center gap-2 cursor-pointer">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={contact.avatar} />
                              <AvatarFallback>{contact.initials}</AvatarFallback>
                            </Avatar>
                            <span>{contact.name}</span>
                          </Label>
                        </div>
                      ))}
                    </ScrollArea>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setBulkMessageOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSendBulkMessage}
                    disabled={!bulkMessage.trim() || selectedContacts.length === 0}
                  >
                    Send to {selectedContacts.length} contacts
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="ghost" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search conversations..." className="w-full bg-background pl-8 pr-4" />
          </div>
        </div>
        <Tabs defaultValue="all" className="px-4">
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">
              All
            </TabsTrigger>
            <TabsTrigger value="unread" className="flex-1">
              Unread
            </TabsTrigger>
            <TabsTrigger value="archived" className="flex-1">
              Archived
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4 space-y-2">
            {conversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isActive={selectedContact?.id === conversation.id}
                onSelect={() => handleContactSelect(conversation)}
                isSelected={selectedContacts.includes(conversation.phone)}
                onToggleSelect={() => toggleContactSelection(conversation.phone)}
                selectionMode={bulkMessageOpen}
              />
            ))}
          </TabsContent>
        </Tabs>
      </div>

      {/* Chat Area */}
      <div className="flex flex-1 flex-col">
        {selectedContact ? (
          <>
            <div className="flex h-14 items-center justify-between border-b px-4">
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={selectedContact.avatar} />
                  <AvatarFallback>{selectedContact.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{selectedContact.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {selectedContact.status === "Active" ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4">
              <div className="space-y-4">
                {contactMessages.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    <p>No messages yet. Start a conversation!</p>
                  </div>
                ) : (
                  contactMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.direction === "outbound" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.direction === "outbound" ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <div className="mt-1 flex items-center justify-end gap-1 text-xs opacity-70">
                          <span>
                            {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                          {message.direction === "outbound" && (
                            <span>
                              {message.status === "sent" && <Check className="h-3 w-3" />}
                              {message.status === "delivered" && <Check className="h-3 w-3" />}
                              {message.status === "read" && <CheckCircle className="h-3 w-3" />}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="border-t p-4">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <div className="relative flex-1">
                  <Input
                    placeholder="Type a message..."
                    className="pr-24"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Smile className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Mic className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Button
                  size="icon"
                  className="rounded-full"
                  onClick={handleSendMessage}
                  disabled={messageLoading || !newMessage.trim()}
                >
                  {messageLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  Quick Reply
                </Button>
                <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 text-xs">
                      Templates
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Select a Template</DialogTitle>
                      <DialogDescription>Choose a template to send to {selectedContact.name}</DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="h-[300px] rounded-md border p-4">
                      <div className="grid gap-4">
                        {templates
                          .filter((t) => t.status === "Approved")
                          .map((template) => (
                            <div
                              key={template.id}
                              className="rounded-lg border p-3 cursor-pointer hover:bg-muted"
                              onClick={() => handleSendTemplate(template.id)}
                            >
                              <h4 className="font-medium">{template.name}</h4>
                              <p className="text-sm text-muted-foreground">{template.content}</p>
                            </div>
                          ))}
                      </div>
                    </ScrollArea>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setTemplateDialogOpen(false)}>
                        Cancel
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  Assign
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-medium">Select a conversation</h3>
              <p className="text-muted-foreground">Choose a contact to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ConversationItem({ conversation, isActive, onSelect, isSelected, onToggleSelect, selectionMode }) {
  return (
    <div
      className={`flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors ${
        isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "hover:bg-muted/50"
      }`}
      onClick={selectionMode ? onToggleSelect : onSelect}
    >
      {selectionMode && (
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelect}
          className="h-4 w-4 rounded border-gray-300"
          onClick={(e) => e.stopPropagation()}
        />
      )}
      <Avatar>
        <AvatarImage src={conversation.avatar} />
        <AvatarFallback>{conversation.initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="font-medium truncate">{conversation.name}</p>
          <p className="text-xs text-muted-foreground">{conversation.time}</p>
        </div>
        <p className="text-xs text-muted-foreground truncate">{conversation.lastMessage}</p>
      </div>
      {conversation.unread > 0 && (
        <Badge className="ml-auto bg-primary text-primary-foreground">{conversation.unread}</Badge>
      )}
    </div>
  )
}

// Mock data for conversations
const conversations = [
  {
    id: 1,
    name: "Sarah Johnson",
    initials: "SJ",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Thanks for the quick response! The product works great.",
    time: "2m",
    unread: 2,
    phone: "+1234567890",
    email: "sarah.j@example.com",
    tags: ["Customer", "Premium"],
    status: "Active",
  },
  {
    id: 2,
    name: "Michael Chen",
    initials: "MC",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "I'm having trouble with my order #45678. Can you help?",
    time: "15m",
    unread: 1,
    phone: "+1987654321",
    email: "michael.c@example.com",
    tags: ["Customer", "Support"],
    status: "Active",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    initials: "ER",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Do you have this item in blue? I only see red on the website.",
    time: "1h",
    unread: 0,
    phone: "+1122334455",
    email: "emily.r@example.com",
    tags: ["Lead", "Retail"],
    status: "Inactive",
  },
  {
    id: 4,
    name: "David Kim",
    initials: "DK",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "When will my order ship? I placed it 2 days ago.",
    time: "3h",
    unread: 0,
    phone: "+1555666777",
    email: "david.k@example.com",
    tags: ["Customer", "Enterprise"],
    status: "Active",
  },
  {
    id: 5,
    name: "Lisa Wang",
    initials: "LW",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "I'd like to return this item. What's the process?",
    time: "5h",
    unread: 0,
    phone: "+1777888999",
    email: "lisa.w@example.com",
    tags: ["Lead", "E-commerce"],
    status: "Inactive",
  },
  {
    id: 6,
    name: "James Wilson",
    initials: "JW",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Is there a discount for bulk orders?",
    time: "1d",
    unread: 0,
    phone: "+1999000111",
    email: "james.w@example.com",
    tags: ["Lead", "Wholesale"],
    status: "Active",
  },
]

