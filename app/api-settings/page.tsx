"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertCircle, CheckCircle, Info } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"

export default function ApiSettingsPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading, authConfig, updateConfig, logout } = useAuth()
  const { toast } = useToast()

  const [phoneNumberId, setPhoneNumberId] = useState("")
  const [whatsappBusinessAccountId, setWhatsappBusinessAccountId] = useState("")
  const [accessToken, setAccessToken] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [testStatus, setTestStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  // Redirect if not authenticated
  // useEffect(() => {
  //   if (!authLoading && !isAuthenticated) {
  //     router.push("/login")
  //   }
  // }, [authLoading, isAuthenticated, router])

  // Load current config
  useEffect(() => {
    if (authConfig) {
      setPhoneNumberId(authConfig.phoneNumberId)
      setWhatsappBusinessAccountId(authConfig.whatsappBusinessAccountId)
      setAccessToken(authConfig.accessToken)
    }
  }, [authConfig])

  const handleSaveConfig = async () => {
    if (!phoneNumberId || !whatsappBusinessAccountId || !accessToken) {
      toast({
        title: "Validation Error",
        description: "All fields are required",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)

      // Update the auth config
      updateConfig({
        phoneNumberId,
        whatsappBusinessAccountId,
        accessToken,
      })

      toast({
        title: "Settings Updated",
        description: "Your API settings have been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating settings:", error)
      toast({
        title: "Update Failed",
        description: "There was an error updating your settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTestConnection = async () => {
    if (!phoneNumberId || !accessToken) {
      toast({
        title: "Validation Error",
        description: "Phone Number ID and Access Token are required for testing",
        variant: "destructive",
      })
      return
    }

    try {
      setTestStatus("loading")

      // In a real app, this would call the WhatsApp API
      // For this demo, we'll simulate a successful API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setTestStatus("success")
      toast({
        title: "Connection Successful",
        description: "Successfully connected to the WhatsApp Cloud API.",
      })
    } catch (error) {
      console.error("Error testing connection:", error)
      setTestStatus("error")
      toast({
        title: "Connection Failed",
        description: "Failed to connect to the WhatsApp Cloud API. Please check your credentials.",
        variant: "destructive",
      })
    }
  }

  const handleLogout = async () => {
    await fetch("process.env.REACT_APP_BACKEND_URL/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  
    // Then redirect
    window.location.href = "/login";
  }

  if (authLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">API Settings</h1>
      </div>

      <Tabs defaultValue="settings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="settings">API Configuration</TabsTrigger>
          <TabsTrigger value="webhook">Webhook Setup</TabsTrigger>
          <TabsTrigger value="logs">API Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>WhatsApp Cloud API Configuration</CardTitle>
              <CardDescription>Configure your WhatsApp Business API credentials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {authConfig?.phoneNumberId === "demo_phone_id" && (
                <Alert className="mb-4">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Demo Mode</AlertTitle>
                  <AlertDescription>
                    You are currently in demo mode. These settings will not affect any real WhatsApp accounts.
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="phoneNumberId">Phone Number ID</Label>
                <Input
                  id="phoneNumberId"
                  placeholder="Enter your Phone Number ID"
                  value={phoneNumberId}
                  onChange={(e) => setPhoneNumberId(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">The ID of your WhatsApp Business phone number</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsappBusinessAccountId">WhatsApp Business Account ID</Label>
                <Input
                  id="whatsappBusinessAccountId"
                  placeholder="Enter your WhatsApp Business Account ID"
                  value={whatsappBusinessAccountId}
                  onChange={(e) => setWhatsappBusinessAccountId(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">The ID of your WhatsApp Business account</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accessToken">Access Token</Label>
                <Input
                  id="accessToken"
                  type="password"
                  placeholder="Enter your Access Token"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Your WhatsApp Cloud API access token</p>
              </div>

              <div className="flex items-center gap-2 pt-4">
                <Button
                  onClick={handleTestConnection}
                  variant="outline"
                  disabled={isLoading || testStatus === "loading"}
                >
                  {testStatus === "loading" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Testing...
                    </>
                  ) : testStatus === "success" ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      Connection Successful
                    </>
                  ) : testStatus === "error" ? (
                    <>
                      <AlertCircle className="mr-2 h-4 w-4 text-red-500" />
                      Connection Failed
                    </>
                  ) : (
                    "Test Connection"
                  )}
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
              <Button onClick={handleSaveConfig} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="webhook">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Configuration</CardTitle>
              <CardDescription>Configure webhooks to receive real-time updates from WhatsApp</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Webhook Setup</AlertTitle>
                <AlertDescription>
                  To receive messages and status updates from WhatsApp, you need to set up a webhook in the Meta
                  Developer Console.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="webhookUrl">Webhook URL</Label>
                <div className="flex gap-2">
                  <Input id="webhookUrl" value="https://your-backend-url/webhook" readOnly />
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText("https://your-backend-url/webhook")
                      toast({
                        title: "Copied to clipboard",
                        description: "Webhook URL has been copied to clipboard",
                      })
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="verifyToken">Verify Token</Label>
                <div className="flex gap-2">
                  <Input id="verifyToken" value="your_verify_token_here" readOnly />
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText("your_verify_token_here")
                      toast({
                        title: "Copied to clipboard",
                        description: "Verify token has been copied to clipboard",
                      })
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </div>

              <div className="pt-4">
                <h3 className="text-lg font-medium mb-2">Webhook Setup Instructions</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>
                    Go to the{" "}
                    <a
                      href="https://developers.facebook.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Meta Developer Console
                    </a>
                  </li>
                  <li>Navigate to your WhatsApp Business app</li>
                  <li>Go to WhatsApp &gt; Configuration &gt; Webhooks</li>
                  <li>Click "Edit" and enter your Webhook URL and Verify Token</li>
                  <li>Subscribe to the following webhook fields: messages, message_status_updates</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>API Logs</CardTitle>
              <CardDescription>View recent API calls and errors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="bg-muted px-4 py-2 font-mono text-sm">
                  <p className="text-green-500">
                    [INFO] 2023-05-20 10:30:15 - Successfully authenticated with WhatsApp API
                  </p>
                  <p className="text-green-500">[INFO] 2023-05-20 10:32:22 - Message sent to +1234567890</p>
                  <p className="text-amber-500">[WARN] 2023-05-20 10:35:47 - Rate limit approaching (80% used)</p>
                  <p className="text-green-500">[INFO] 2023-05-20 10:40:12 - Template message sent to 5 recipients</p>
                  <p className="text-red-500">
                    [ERROR] 2023-05-20 10:45:33 - Failed to send message: Invalid phone number format
                  </p>
                  <p className="text-green-500">[INFO] 2023-05-20 10:50:18 - Webhook received: message status update</p>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm">
                  Download Logs
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

