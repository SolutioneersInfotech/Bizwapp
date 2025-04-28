"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image";
// import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Loader2, AlertCircle, Info, Github, Linkedin, Facebook, ArrowRight, ArrowLeft, Check } from "lucide-react"
import { FcGoogle } from "react-icons/fc"
import usePostData from "../../hooks/api/usePostData"
import { useToast } from "@/hooks/use-toast"
import { signIn } from "next-auth/react";

export default function SignupPage() {
  const router = useRouter()
  // const { login, isLoading } = useAuth()
  const [phase, setPhase] = useState(1)
  const [error, setError] = useState("")

  // Phase 1 form fields
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
  })
  const [confirmPassword, setConfirmPassword] = useState("")

  // Phase 2 form fields (WhatsApp API credentials)
  const [phoneNumberId, setPhoneNumberId] = useState("")
  const [whatsappBusinessAccountId, setWhatsappBusinessAccountId] = useState("")
  const [accessToken, setAccessToken] = useState("")
  const [isLoading, setIsLoading] = useState(false);


  const { mutate, isError, data } = usePostData("https://api.bizwapp.com/api/auth/signup");


  const handleChange = (e) => {
    console.log("e.target.name", e.target.name)
    console.log("e.target.value", e.target.value)
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const validatePhase1 = () => {
    if (!formData.firstName) {
      setError("first Name is required")
      return false
    }
    if (!formData.lastName) {
      setError("last Name is required")
      return false
    }
    if (!formData.phone) {
      setError("phone is required")
      return false
    }
    if (!/^\d{10}$/.test(formData.phone)) {
    setError("Phone number must be 10 digits");
    return false;
  }
    if (!formData.email) {
      setError("Email is required")
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!formData.password) {
      setError("Password is required")
      return false
    }
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;

if (!strongPasswordRegex.test(formData.password)) {
  setError("Password must be at least 8 characters long and include Alpha Numeric and special character.");
  return false;
}
    if (formData.password !== confirmPassword) {
      setError("Passwords do not match")
      return false
    }
    return true
  }

  const {toast} = useToast()

  const handleSigUp = () => {
    setError("");

    if (!validatePhase1()) {
      return; // 🛑 Stop execution if validation fails
    }

    setIsLoading(true);

    mutate(formData, {
      onSuccess: (data) => {
        toast({
          title: "Success",
          description: data.message
        })
        console.log("Success:", data);
        const user = { ...data.user, token : data.token}
        localStorage.setItem("user", JSON.stringify(user));
        router.push("/dashboard")
      },
      onError: (error) => {
        setIsLoading(false);
        toast({
          title: "Error",
          description: error.message || "Something went wrong!",
        });
        console.error("Error:", error.message);
      },
    });
    setError("")
    // if (validatePhase1()) {
    //   setPhase(2)
    // }
  }

  const handlePreviousPhase = () => {
    setPhase(1)
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      // In a real app, you would register the user here
      // For demo purposes, we'll just log in with demo credentials
      await login({
        phoneNumberId: "606836342508871",
        whatsappBusinessAccountId: "28995967470047562",
        accessToken: "EAAJdfKsroxoBO39zxdb5Ge9l0qTYXmUZCQn7J3ZBb5YbVZAfZAvu3N2P5GKjZCsF4zoEmhYM77Aovj2yzbj70revHFc1ESQSZCEOUWWN9N3u0fE7Wrpc63Lrx7fHzZCpoPSNo6zru2CkNx7iITnIlZBV4diOy73ijROalTu5mVlK8BTB7ewob4nUIFc6",
      })
      router.push("/dashboard")
    } catch (err) {
      setError("Registration failed. Please try again.")
    }
  }


  const handleSocialSignup = async (provider) => {
    console.log("Clicked provider:", provider); // should match e.g., "google"
    signIn(provider.toLowerCase()); // like "google", "facebook", etc.
    try {
      // In a real app, this would redirect to the OAuth flow
      console.log(`Signing up with ${provider}`)

      // For demo purposes, we'll just log in with demo credentials
      await login({
        phoneNumberId: "demo_phone_id",
        whatsappBusinessAccountId: "demo_account_id",
        accessToken: "demo_token",
      })
      router.push("/dashboard")
    } catch (err) {
      setError(`${provider} signup failed. Please try again.`)
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Image
                        src="/BIZWAPP.png"
                        alt="Biz Wapp Logo"
                        width={64}
                        height={64}
                      />
          <h1 className="text-3xl font-bold">BizWApp Messaging</h1>
          <p className="text-muted-foreground mt-2">Create your account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>
              {phase === 1 ? "Enter your details to create an account" : "Connect your WhatsApp Business API"}
            </CardDescription>
            <div className="flex items-center justify-between mt-2">
              {/* <div className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${phase >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                >
                  {phase > 1 ? <Check className="h-4 w-4" /> : "1"}
                </div>
                <div className={`h-1 w-8 ${phase > 1 ? "bg-primary" : "bg-muted"}`}></div>
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${phase >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                >
                  2
                </div>
              </div> */}
              {/* <div className="text-sm text-muted-foreground">Step {phase} of 2</div> */}
            </div>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {phase === 1 ? (
              // Phase 1: Basic user information
              <form className="space-y-4">
                <div className="flex gap-x-4">
                  <div className="w-1/2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      name="firstName"
                      placeholder="Enter your First Name"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="w-1/2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      name="lastName"
                      placeholder="Enter your Last Name"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Phone</Label>                  <Input
                    id="phone"
                    type="text"
                    name="phone"
                    placeholder="Enter your phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <Button type="button" className="w-full" onClick={handleSigUp}>
                  { isLoading ? (
                       <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                     </svg>
                  ) : (
                     'Login'
                  )}
                </Button>
              </form>
            ) : (
              // Phase 2: WhatsApp API credentials
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumberId">Phone Number ID</Label>
                  <Input
                    id="phoneNumberId"
                    type="text"
                    placeholder="Enter your Phone Number ID"
                    value={phoneNumberId}
                    onChange={(e) => setPhoneNumberId(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsappBusinessAccountId">WhatsApp Business Account ID</Label>
                  <Input
                    id="whatsappBusinessAccountId"
                    type="text"
                    placeholder="Enter your WhatsApp Business Account ID"
                    value={whatsappBusinessAccountId}
                    onChange={(e) => setWhatsappBusinessAccountId(e.target.value)}
                  />
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
                </div>

                <Alert className="mt-2">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Optional</AlertTitle>
                  <AlertDescription>
                    You can skip this step and configure your WhatsApp API credentials later.
                  </AlertDescription>
                </Alert>

                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={handlePreviousPhase}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </div>
              </form>
            )}

            {phase === 1 && (
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or sign up with</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <Button variant="outline" onClick={() => handleSocialSignup("Google")} className="w-full">
                    <FcGoogle className="mr-2 h-4 w-4" />
                    Google
                  </Button>
                  <Button variant="outline" onClick={() => handleSocialSignup("Facebook")} className="w-full">
                    <Facebook className="mr-2 h-4 w-4 text-blue-600" />
                    Facebook
                  </Button>
                  <Button variant="outline" onClick={() => handleSocialSignup("GitHub")} className="w-full">
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </Button>
                  <Button variant="outline" onClick={() => handleSocialSignup("LinkedIn")} className="w-full">
                    <Linkedin className="mr-2 h-4 w-4 text-blue-700" />
                    LinkedIn
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-2">
            <div className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

