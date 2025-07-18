"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, MessageSquare, Mail, Phone, Video, ChevronRight, Loader2, Send } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";

export default function HelpSupportPage() {
  const { toast } = useToast();
const pickerRef = useRef<HTMLInputElement>(null);

  const [searchQuery, setSearchQuery] = useState("")
  const [contactName, setContactName] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [contactSubject, setContactSubject] = useState("")
  const [contactMessage, setContactMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactSubmit = async (e) => {
    e.preventDefault()

    if (!contactName || !contactEmail || !contactSubject || !contactMessage) {
      toast({
        title: "Validation Error",
        description: "All fields are required",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // In a real app, this would submit the form to an API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Message Sent",
        description: "We've received your message and will respond shortly",
      })

      // Reset form
      setContactName("")
      setContactEmail("")
      setContactSubject("")
      setContactMessage("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send your message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    description: '',
    date: new Date(),
  })

  const [isLoading, setIsLoading] = useState(false);

 useEffect(() => {
  if (!pickerRef.current) return;

  const stopClick = (e: MouseEvent) => e.stopPropagation();
  const inputEl = pickerRef.current;

  inputEl.addEventListener("mousedown", stopClick);
  return () => inputEl.removeEventListener("mousedown", stopClick);
}, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate submission
    setTimeout(() => {
      console.log('Submitted:', formData)
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="container mx-auto pb-8 pt-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold pl-4">Help & Support</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>How can we help you?</CardTitle>
              {/* <CardDescription>Search our knowledge base or browse frequently asked questions</CardDescription> */}
            </CardHeader>
            <CardContent>
              {/* <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search for help..."
                  className="w-full pl-8 pr-4"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button type="submit" className="absolute right-1 top-1">
                  Search
                </Button>
              </form> */}
            </CardContent>
          </Card>

          <Tabs defaultValue="faq" className="space-y-4">
            <TabsList>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
              <TabsTrigger value="guides">Guides</TabsTrigger>
              <TabsTrigger value="api">API Documentation</TabsTrigger>
            </TabsList>

            <TabsContent value="faq" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                  <CardDescription>Common questions about WhatsApp Business API</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>How do I connect to the WhatsApp Business API?</AccordionTrigger>
                      <AccordionContent>
                        <p>To connect to the WhatsApp Business API, you need to:</p>
                        <ol className="list-decimal list-inside space-y-2 mt-2">
                          <li>Create a Meta Developer account</li>
                          <li>Set up a WhatsApp Business Account</li>
                          <li>Register a phone number</li>
                          <li>Generate an access token</li>
                          <li>Enter these credentials in the API Settings page</li>
                        </ol>
                        <p className="mt-2">
                          For detailed instructions, check our{" "}
                          <a href="#" className="text-primary hover:underline">
                            Getting Started Guide
                          </a>
                          .
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                      <AccordionTrigger>What are message templates and how do I create them?</AccordionTrigger>
                      <AccordionContent>
                        <p>
                          Message templates are pre-approved message formats that allow you to send notifications to
                          customers outside the 24-hour messaging window. To create a template:
                        </p>
                        <ol className="list-decimal list-inside space-y-2 mt-2">
                          <li>Go to the Templates page</li>
                          <li>Click "New Template"</li>
                          <li>Choose a category and enter your content</li>
                          <li>Submit for approval</li>
                        </ol>
                        <p className="mt-2">Templates typically take 1-2 business days for approval by WhatsApp.</p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                      <AccordionTrigger>What are the messaging limits for WhatsApp Business API?</AccordionTrigger>
                      <AccordionContent>
                        <p>WhatsApp Business API has several messaging limits:</p>
                        <ul className="list-disc list-inside space-y-2 mt-2">
                          <li>24-hour customer service window for free-form messaging</li>
                          <li>Template messages for notifications outside the 24-hour window</li>
                          <li>Quality rating that affects message throughput</li>
                          <li>Phone number limits based on your quality rating</li>
                        </ul>
                        <p className="mt-2">
                          These limits are designed to prevent spam and ensure a good user experience.
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4">
                      <AccordionTrigger>How do I set up webhooks to receive messages?</AccordionTrigger>
                      <AccordionContent>
                        <p>To receive incoming messages and status updates, you need to set up webhooks:</p>
                        <ol className="list-decimal list-inside space-y-2 mt-2">
                          <li>Go to API Settings</li>
                          <li>Configure your webhook URL and verify token</li>
                          <li>Set up a server to handle webhook requests</li>
                          <li>Subscribe to relevant webhook fields (messages, message_status_updates)</li>
                        </ol>
                        <p className="mt-2">
                          For detailed webhook implementation, see our{" "}
                          <a href="#" className="text-primary hover:underline">
                            Webhook Guide
                          </a>
                          .
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-5">
                      <AccordionTrigger>What are the costs associated with WhatsApp Business API?</AccordionTrigger>
                      <AccordionContent>
                        <p>WhatsApp Business API pricing is based on conversation-based pricing:</p>
                        <ul className="list-disc list-inside space-y-2 mt-2">
                          <li>User-initiated conversations: Lower cost for 24 hours of messaging</li>
                          <li>Business-initiated conversations: Higher cost for template messages</li>
                          <li>Pricing varies by recipient's country</li>
                        </ul>
                        <p className="mt-2">
                          For current pricing details, visit the{" "}
                          <a
                            href="https://developers.facebook.com/docs/whatsapp/pricing"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            Meta Developer Pricing Page
                          </a>
                          .
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="guides" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Guides & Tutorials</CardTitle>
                  <CardDescription>Step-by-step instructions for common tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card className="overflow-hidden">
                      <CardHeader className="p-4">
                        <CardTitle className="text-base">Getting Started Guide</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-muted-foreground">
                          Learn how to set up your WhatsApp Business account and send your first message
                        </p>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button variant="outline" className="w-full" size="sm">
                          Read Guide
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>

                    <Card className="overflow-hidden">
                      <CardHeader className="p-4">
                        <CardTitle className="text-base">Creating Effective Templates</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-muted-foreground">
                          Best practices for creating templates that get approved and drive engagement
                        </p>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button variant="outline" className="w-full" size="sm">
                          Read Guide
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>

                    <Card className="overflow-hidden">
                      <CardHeader className="p-4">
                        <CardTitle className="text-base">Webhook Implementation</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-muted-foreground">
                          Technical guide to setting up and handling webhooks for incoming messages
                        </p>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button variant="outline" className="w-full" size="sm">
                          Read Guide
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>

                    <Card className="overflow-hidden">
                      <CardHeader className="p-4">
                        <CardTitle className="text-base"> Message Sending Strategies</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-muted-foreground">
                          How to effectively send messages to multiple contacts while maintaining quality
                        </p>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button variant="outline" className="w-full" size="sm">
                          Read Guide
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="api" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>API Documentation</CardTitle>
                  <CardDescription>Technical resources for developers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <h3 className="text-lg font-medium">WhatsApp Cloud API Reference</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Complete API reference for all WhatsApp Business API endpoints
                      </p>
                      <div className="mt-4">
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href="https://developers.facebook.com/docs/whatsapp/cloud-api/reference"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Documentation
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </div>

                    <div className="rounded-lg border p-4">
                      <h3 className="text-lg font-medium">Webhook Events Reference</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Detailed information about webhook payloads and event types
                      </p>
                      <div className="mt-4">
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href="https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Documentation
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </div>

                    <div className="rounded-lg border p-4">
                      <h3 className="text-lg font-medium">SDK Documentation</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Resources for using our JavaScript SDK for WhatsApp integration
                      </p>
                      <div className="mt-4">
                        <Button variant="outline" size="sm">
                          View Documentation
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>Get help from our support team</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="Your email address"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    placeholder="What's this about?"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="How can we help you?"
                    rows={5}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Other Ways to Get Help</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Live Chat</h3>
                  <p className="text-sm text-muted-foreground">Chat with our support team</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Email Support</h3>
                  <p className="text-sm text-muted-foreground">bizwapp@solutioneers.in</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Phone Support</h3>
                  <p className="text-sm text-muted-foreground">+91 7376700783</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Video className="h-5 w-5 text-primary" />
                </div>
                 <Dialog>
      <DialogTrigger asChild>
        <div className="cursor-pointer">
          <h3 className="font-medium">Schedule a Demo</h3>
          <p className="text-sm text-muted-foreground">Get a personalized walkthrough</p>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule a Demo</DialogTitle>
          <DialogDescription> by filling this form</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Briefly describe your needs"
            />
          </div>

          <div className="space-y-2 space-x-2">
            <Label htmlFor="date">Date & Time</Label>
  <Flatpickr
  ref={pickerRef}
  options={{
    enableTime: true,
    dateFormat: "Y-m-d H:i",
    appendTo: typeof window !== "undefined" ? document.body : undefined,
    allowInput: true,
    clickOpens: true,
  }}
  value={formData.date}
  onChange={(selectedDates) => {
    setFormData((prev) => ({
      ...prev,
      date: selectedDates[0],
    }));
  }}
  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white"
/>


          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            ) : (
              'Submit'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

