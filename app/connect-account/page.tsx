"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Loader2 } from "lucide-react"

export default function SignupPhase2Page() {
  const router = useRouter()
  const { toast } = useToast()
  const [businessName, setBusinessName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [countryCode, setCountryCode] = useState("IN")
  const [businessWebsite, setBusinessWebsite] = useState("")
  const [businessCategory, setBusinessCategory] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [signupData, setSignupData] = useState(null)
  const [errors, setErrors] = useState({
    businessName: "",
    phoneNumber: "",
    businessWebsite: "",
    businessCategory: "",
  })

//   useEffect(() => {
//     // Retrieve data from phase 1
//     const storedData = sessionStorage.getItem("signupData")
//     if (storedData) {
//       setSignupData(JSON.parse(storedData))
//     } else {
//       // If no data, redirect back to phase 1
//       toast({
//         title: "Information missing",
//         description: "Please complete step 1 first",
//         variant: "destructive",
//       })
//       router.push("/signup/phase1")
//     }
//   }, [router, toast])

  const validateForm = () => {
    const newErrors = {
      businessName: "",
      phoneNumber: "",
      businessWebsite: "",
      businessCategory: "",
    }
    let isValid = true

    if (!businessName.trim()) {
      newErrors.businessName = "Business name is required"
      isValid = false
    }

    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required"
      isValid = false
    } else if (!/^\d{10}$/.test(phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be 10 digits"
      isValid = false
    }

    if (!businessWebsite.trim()) {
      newErrors.businessWebsite = "Business website is required"
      isValid = false
    } else if (!/^(https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/\S*)?$/.test(businessWebsite)) {
      newErrors.businessWebsite = "Enter a valid website URL"
      isValid = false
    }

    if (!businessCategory) {
      newErrors.businessCategory = "Business category is required"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // In a real app, this would submit all form data to an API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Combine data from both phases
      const completeSignupData = {
        ...signupData,
        businessName,
        phoneNumber: `+${countryCode}${phoneNumber}`,
        businessWebsite,
        businessCategory,
      }

      // Clear session storage
      sessionStorage.removeItem("signupData")

      toast({
        title: "Registration successful",
        description: "Your account has been created successfully",
      })

      // Navigate to dashboard or verification page
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error creating your account",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary-foreground"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <span className="text-lg font-semibold">WhatsApp Business</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Already have an account?</span>
            <Button variant="outline" asChild>
              <Link href="/login">Log In</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="flex flex-col items-center mb-8 text-center">
            <h1 className="text-2xl font-bold mb-2">Create your account</h1>
            <p className="text-muted-foreground">Step 2 of 2: Business Details</p>

            <div className="flex items-center w-full mt-6 mb-2">
              <div className="flex-1 h-1 bg-primary"></div>
              <div className="flex-1 h-1 bg-primary"></div>
            </div>
            <div className="flex w-full justify-between text-xs">
              <span className="text-primary">Account Information</span>
              <span className="text-primary">Business Details</span>
            </div>
          </div>

          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">
                    Business Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="businessName"
                    placeholder="Enter your business name"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className={errors.businessName ? "border-red-500" : ""}
                  />
                  {errors.businessName && <p className="text-xs text-red-500">{errors.businessName}</p>}
                  <p className="text-xs text-muted-foreground">
                    This is what your customers will see displayed on your WhatsApp business account.
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
                          <SelectValue placeholder="Code" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">+1 (US)</SelectItem>
                          <SelectItem value="44">+44 (UK)</SelectItem>
                          <SelectItem value="91">+91 (IN)</SelectItem>
                          <SelectItem value="61">+61 (AU)</SelectItem>
                          <SelectItem value="49">+49 (DE)</SelectItem>
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
                    This number will be used for WhatsApp Business API registration. Phone number that is NOT linked with your existing WhatsApp Business account or any other personal WhatsApp account.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessWebsite">
                    Business Website <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="businessWebsite"
                    placeholder="https://example.com"
                    value={businessWebsite}
                    onChange={(e) => setBusinessWebsite(e.target.value)}
                    className={errors.businessWebsite ? "border-red-500" : ""}
                  />
                  {errors.businessWebsite && <p className="text-xs text-red-500">{errors.businessWebsite}</p>}
                  <p className="text-xs text-muted-foreground">
                    For account approval, Meta requires a legitimate website URL.Please provide the URL of your active website.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessCategory">
                    Business Category <span className="text-red-500">*</span>
                  </Label>
                  <Select value={businessCategory} onValueChange={setBusinessCategory}>
                    <SelectTrigger id="businessCategory" className={errors.businessCategory ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Shopping and Retail">Shopping and Retail</SelectItem>
                      <SelectItem value="Food and Beverage">Food and Beverage</SelectItem>
                      <SelectItem value="Health and Beauty">Health and Beauty</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Professional Services">Professional Services</SelectItem>
                      <SelectItem value="Travel and Transportation">Travel and Transportation</SelectItem>
                      <SelectItem value="Entertainment">Entertainment</SelectItem>
                      <SelectItem value="Others">Others</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.businessCategory && <p className="text-xs text-red-500">{errors.businessCategory}</p>}
                  <p className="text-xs text-muted-foreground">
                  Select the category that best describes your business. This is shown to consumers when they view your profile.
                  </p>
                </div>

                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Account...
                      </>
                    ) : (
                      "Complete Registration"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
