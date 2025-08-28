"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, CheckCircle2, Clock, FileSpreadsheet, MessageSquare, Zap } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useWhatsAppTemplates } from "@/hooks/api/getTemplate"
import usePostData from "@/hooks/api/usePostData"

interface AutomationFormData {
  googleSheetUrl: string
  mode: "immediate" | "frequency"
  intervalNumber: number
  intervalUnit: "minutes" | "hours" | "days"
  templateName: string
}

export default function AutomationPage() {
  const [formData, setFormData] = useState<AutomationFormData>({
    googleSheetUrl: "",
    mode: "immediate",
    intervalNumber: 1,
    intervalUnit: "hours",
    templateName: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errors, setErrors] = useState<Partial<AutomationFormData>>({});
  const [template , setTemplate] = useState(null);
  const [userId , setUserId] = useState(null);

  // Mock template data - in real app, this would come from API
  // const templates = [
  //   { id: "template1", name: "Welcome Message", description: "Greeting for new contacts" },
  //   { id: "template2", name: "Follow-up Message", description: "Follow-up after initial contact" },
  //   { id: "template3", name: "Promotional Message", description: "Product promotion template" },
  //   { id: "template4", name: "Support Message", description: "Customer support template" },
  // ];

    const { data: whatsappTemplates } = useWhatsAppTemplates();

    useEffect(()=>{
      setTemplate(whatsappTemplates?.data)
    },[whatsappTemplates]);

    const { mutate } = usePostData('https://api.bizwapp.com/api/auth/add-google-sheet-contacts-send-temp');

     useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      const id = userData.id || userData.user?._id || null;
      setUserId(id);
    }
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Partial<AutomationFormData> = {}

    if (!formData.googleSheetUrl.trim()) {
      newErrors.googleSheetUrl = "Google Sheet URL is required"
    } else if (!isValidGoogleSheetUrl(formData.googleSheetUrl)) {
      newErrors.googleSheetUrl = "Please enter a valid Google Sheet URL"
    }

    if (!formData.templateName) {
      newErrors.templateName = "Please select a template"
    }

    if (formData.mode === "frequency") {
      if (formData.intervalNumber < 1) {
        newErrors.intervalNumber = "Interval must be at least 1"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidGoogleSheetUrl = (url: string): boolean => {
    const googleSheetRegex = /^https:\/\/docs\.google\.com\/spreadsheets\/d\/[a-zA-Z0-9-_]+/
    return googleSheetRegex.test(url)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      // Simulate API call
      const payload = {
        userId,
        sheetUrl: formData.googleSheetUrl,
        mode: formData.mode,
        ...(formData.mode === "frequency" && {
          interval: {
            number: formData.intervalNumber,
            unit: formData.intervalUnit,
          },
        }),
        templateName: formData.templateName,
        createdAt: new Date().toISOString(),
      }

      console.log("Submitting automation config:", payload);

      mutate(payload , {
        onSuccess(data){
          console.log("success" , data);
          
        },
        onError(err){
          console.log('Error' ,err);
          
        }
      });

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate success
      setSubmitStatus("success")

      // Reset form after success
      setTimeout(() => {
        setFormData({
          googleSheetUrl: "",
          mode: "immediate",
          intervalNumber: 1,
          intervalUnit: "hours",
          templateName: "",
        })
        setSubmitStatus("idle")
      }, 3000)
    } catch (error) {
      console.error("Error submitting automation:", error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getIntervalText = () => {
    if (formData.mode === "frequency") {
      return `Every ${formData.intervalNumber} ${formData.intervalUnit}`
    }
    return "Immediately"
  }

  console.log("template",template);
  

  return (
    <div className="container mx-auto p-6 max-w-full">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Automate Your Message Sending</h1>
            <p className="text-muted-foreground">Set up automated messaging based on Google Sheets data</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Automation Configuration
              </CardTitle>
              <CardDescription>
                Configure how and when messages should be sent to contacts from your Google Sheet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Google Sheet URL Input */}
                <div className="space-y-2">
                  <Label htmlFor="googleSheetUrl" className="flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4" />
                    Google Sheet URL
                  </Label>
                  <Input
                    id="googleSheetUrl"
                    type="url"
                    placeholder="https://docs.google.com/spreadsheets/d/your-sheet-id"
                    value={formData.googleSheetUrl}
                    onChange={(e) => setFormData({ ...formData, googleSheetUrl: e.target.value })}
                    className={errors.googleSheetUrl ? "border-destructive" : ""}
                  />
                  {errors.googleSheetUrl && <p className="text-sm text-destructive">{errors.googleSheetUrl}</p>}
                  <p className="text-sm text-muted-foreground">
                    Make sure your Google Sheet is publicly accessible or shared with our service account
                  </p>
                </div>

                <Separator />

                {/* Mode Selection */}
                <div className="space-y-4">
                  <Label className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Sending Mode
                  </Label>
                  <RadioGroup
                    value={formData.mode}
                    onValueChange={(value: "immediate" | "frequency") => setFormData({ ...formData, mode: value })}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-3 rounded-lg border p-4">
                      <RadioGroupItem value="immediate" id="immediate" />
                      <div className="flex-1">
                        <Label htmlFor="immediate" className="font-medium">
                          Send immediately when contact added
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Messages will be sent as soon as a new contact is detected in the sheet
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 rounded-lg border p-4">
                      <RadioGroupItem value="frequency" id="frequency" />
                      <div className="flex-1">
                        <Label htmlFor="frequency" className="font-medium">
                          Send with time frequency
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Messages will be sent at regular intervals to new contacts
                        </p>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                {/* Conditional Interval Input */}
                {formData.mode === "frequency" && (
                  <div className="space-y-4 rounded-lg border bg-muted/50 p-4">
                    <Label className="text-sm font-medium">Frequency Settings</Label>
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <Label htmlFor="intervalNumber" className="text-sm">
                          Every
                        </Label>
                        <Input
                          id="intervalNumber"
                          type="number"
                          min="1"
                          max="999"
                          value={formData.intervalNumber}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              intervalNumber: Number.parseInt(e.target.value) || 1,
                            })
                          }
                          className={errors.intervalNumber ? "border-destructive" : ""}
                        />
                        {errors.intervalNumber && (
                          <p className="text-sm text-destructive mt-1">{errors.intervalNumber}</p>
                        )}
                      </div>
                      <div className="flex-1">
                        <Label htmlFor="intervalUnit" className="text-sm">
                          Unit
                        </Label>
                        <Select
                          value={formData.intervalUnit}
                          onValueChange={(value: "minutes" | "hours" | "days") =>
                            setFormData({ ...formData, intervalUnit: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="minutes">Minutes</SelectItem>
                            <SelectItem value="hours">Hours</SelectItem>
                            <SelectItem value="days">Days</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                <Separator />

                {/* Template Selection */}
                <div className="space-y-2">
                  <Label htmlFor="templateName">Message Template</Label>
                  <Select
                    value={formData.templateName}
                    onValueChange={(value) => setFormData({ ...formData, templateName: value })}
                  >
                    <SelectTrigger className={errors.templateName ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select a template" />
                    </SelectTrigger>
                    <SelectContent>
                      {template?.map((template) => (
                        <SelectItem key={template.id} value={template.name}>
                          <div className="flex flex-col">
                            <span className="font-medium">{template.name}</span>
                            <span className="text-sm text-muted-foreground">{template.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.templateName && <p className="text-sm text-destructive">{errors.templateName}</p>}
                </div>

                {/* Submit Status */}
                {submitStatus === "success" && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Automation configured successfully! Your messages will be sent according to the settings.
                    </AlertDescription>
                  </Alert>
                )}

                {submitStatus === "error" && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Failed to configure automation. Please try again or contact support.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Submit Button */}
                <Button type="submit" className="w-full" disabled={isSubmitting} size="lg">
                  {isSubmitting ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                      Configuring Automation...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      Start Automation
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Preview Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Configuration Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Data Source</Label>
                <p className="text-sm">{formData.googleSheetUrl ? "Google Sheet Connected" : "No sheet connected"}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Sending Mode</Label>
                <div className="flex items-center gap-2">
                  <Badge variant={formData.mode === "immediate" ? "default" : "secondary"}>{getIntervalText()}</Badge>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Template</Label>
                <p className="text-sm">{formData.templateName || "No template selected"}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How it Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  1
                </div>
                <p>Connect your Google Sheet with contact information</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  2
                </div>
                <p>Choose when to send messages (immediately or with intervals)</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  3
                </div>
                <p>Select the message template to send</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  4
                </div>
                <p>Messages are automatically sent to new contacts</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
