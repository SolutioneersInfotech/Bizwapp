"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2, CheckCircle, AlertCircle, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function GetCredentialsPage() {
  const { toast } = useToast()
  const [companyName, setCompanyName] = useState("")
  const [companyWebsite, setCompanyWebsite] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [countryCode, setCountryCode] = useState("1")
  const [isLoading, setIsLoading] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [credentials, setCredentials] = useState<{ accountId: string; phoneNumberId: string } | null>(null)
  const [errors, setErrors] = useState({
    companyName: "",
    companyWebsite: "",
    phoneNumber: "",
  })

  const validateForm = () => {
    const newErrors = {
      companyName: "",
      companyWebsite: "",
      phoneNumber: "",
    }
    let isValid = true

    if (!companyName.trim()) {
      newErrors.companyName = "Company name is required"
      isValid = false
    }

    if (!companyWebsite.trim()) {
      newErrors.companyWebsite = "Company website URL is required"
      isValid = false
    } else if (!/^(https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/\S*)?$/.test(companyWebsite)) {
      newErrors.companyWebsite = "Enter a valid website URL"
      isValid = false
    }

    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required"
      isValid = false
    } else if (!/^\d{10}$/.test(phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be 10 digits"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // In a real app, this would make an API call to get the credentials
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock response with generated IDs
      const mockAccountId = `${Math.floor(100000000 + Math.random() * 900000000)}`
      const mockPhoneNumberId = `${Math.floor(100000000 + Math.random() * 900000000)}`

      setCredentials({
        accountId: mockAccountId,
        phoneNumberId: mockPhoneNumberId,
      })

      setFormSubmitted(true)

      toast({
        title: "Credentials Generated",
        description: "Your WhatsApp Business API credentials have been generated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error generating your credentials. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setCompanyName("")
    setCompanyWebsite("")
    setPhoneNumber("")
    setCountryCode("1")
    setFormSubmitted(false)
    setCredentials(null)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col items-start mb-8">
          <Link href="/" className="text-sm text-primary hover:underline mb-4">
            &larr; Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold">Get WhatsApp Business API Credentials</h1>
          <p className="text-muted-foreground mt-2">
            Fill out the form below to get your WhatsApp Business Account ID and Phone Number ID
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>
              Provide your company details to generate WhatsApp Business API credentials
            </CardDescription>
          </CardHeader>
          <CardContent>
            {formSubmitted && credentials ? (
              <div className="space-y-6">
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle>Success!</AlertTitle>
                  <AlertDescription>
                    Your WhatsApp Business API credentials have been generated successfully.
                  </AlertDescription>
                </Alert>

                <div className="rounded-lg border p-4 space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">WhatsApp Business Account ID</h3>
                    <p className="text-lg font-mono mt-1">{credentials.accountId}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Phone Number ID</h3>
                    <p className="text-lg font-mono mt-1">{credentials.phoneNumberId}</p>
                  </div>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Important</AlertTitle>
                  <AlertDescription>
                    Keep these credentials secure. You'll need them to configure your WhatsApp Business API integration.
                  </AlertDescription>
                </Alert>

                <div className="flex flex-col space-y-2">
                  <Button onClick={() => navigator.clipboard.writeText(JSON.stringify(credentials, null, 2))}>
                    Copy Credentials
                  </Button>
                  <Button variant="outline" onClick={handleReset}>
                    Generate New Credentials
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">
                    Company Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="companyName"
                    placeholder="Enter your company name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className={errors.companyName ? "border-red-500" : ""}
                  />
                  {errors.companyName && <p className="text-xs text-red-500">{errors.companyName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyWebsite">
                    Company Website URL <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="companyWebsite"
                    placeholder="https://example.com"
                    value={companyWebsite}
                    onChange={(e) => setCompanyWebsite(e.target.value)}
                    className={errors.companyWebsite ? "border-red-500" : ""}
                  />
                  {errors.companyWebsite && <p className="text-xs text-red-500">{errors.companyWebsite}</p>}
                  <p className="text-xs text-muted-foreground">
                    Enter the full URL including https:// (e.g., https://example.com)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">
                    Business Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <div className="w-24">
                      <Select value={countryCode} onValueChange={setCountryCode}>
                        <SelectTrigger id="countryCode" className="h-10">
                          <SelectValue placeholder="+1" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">+1 (US)</SelectItem>
                          <SelectItem value="44">+44 (UK)</SelectItem>
                          <SelectItem value="91">+91 (IN)</SelectItem>
                          <SelectItem value="61">+61 (AU)</SelectItem>
                          <SelectItem value="49">+49 (DE)</SelectItem>
                          <SelectItem value="33">+33 (FR)</SelectItem>
                          <SelectItem value="81">+81 (JP)</SelectItem>
                          <SelectItem value="86">+86 (CN)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1">
                      <Input
                        id="phoneNumber"
                        type="tel"
                        placeholder="Enter phone number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className={errors.phoneNumber ? "border-red-500" : ""}
                      />
                    </div>
                  </div>
                  {errors.phoneNumber && <p className="text-xs text-red-500">{errors.phoneNumber}</p>}
                  <p className="text-xs text-muted-foreground">
                    This number will be used for WhatsApp Business API registration
                  </p>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Verification Required</AlertTitle>
                  <AlertDescription>
                    Meta will verify your business information before activating your WhatsApp Business API account.
                    Please ensure all details are accurate.
                  </AlertDescription>
                </Alert>
              </form>
            )}
          </CardContent>
          {!formSubmitted && (
            <CardFooter className="flex justify-end">
              <Button type="submit" onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
                  </>
                ) : (
                  <>
                    Generate Credentials <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          )}
        </Card>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">What happens next?</h2>
          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                1
              </div>
              <div>
                <h3 className="font-medium">Generate Credentials</h3>
                <p className="text-muted-foreground">
                  Fill out the form to get your WhatsApp Business Account ID and Phone Number ID
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                2
              </div>
              <div>
                <h3 className="font-medium">Configure API</h3>
                <p className="text-muted-foreground">
                  Use these credentials to configure your WhatsApp Business API integration
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                3
              </div>
              <div>
                <h3 className="font-medium">Verification</h3>
                <p className="text-muted-foreground">
                  Meta will verify your business information before activating your account
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                4
              </div>
              <div>
                <h3 className="font-medium">Start Messaging</h3>
                <p className="text-muted-foreground">
                  Once approved, you can start sending messages through the WhatsApp Business API
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
