"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, AlertCircle, Github, Linkedin, Facebook } from "lucide-react"
import { FcGoogle } from "react-icons/fc"
import usePostData from "@/hooks/api/usePostData"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading } = useAuth()
  const [ formData , setFormData] = useState({
    identifier:"",
    password:""
  })
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")

 const handleChange = (e)=>{
  const { name , value }= e.target;
  setFormData((prevdata)=>({
    ...prevdata,
    [name]:value
  }))
 }

  const { mutate, isError, data } = usePostData("https://bizwapp-back-end-khaki.vercel.app/api/auth/logIn");

  const {toast} = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("mutate function:", mutate);
    mutate(formData, {
      onSuccess: (data) => {
        toast({
          title: "Success",
          description: data.message,
        })
        router.push("/dashboard")
        console.log("Success:", data);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message || "Something went wrong!", // ✅ Show error message
        });
        console.error("Error:", error.message);
      },
    });
    setError("")

    if (!formData.identifier || !formData.password) {
      setError("Email/Phone and password are required")
      return
    }
  }

  const handleSocialLogin = async (provider: string) => {
    try {
      // In a real app, this would redirect to the OAuth flow
      console.log(`Logging in with ${provider}`)

      // For demo purposes, we'll just log in with demo credentials
      await login({
        phoneNumberId: "606836342508871",
        whatsappBusinessAccountId: "28995967470047562",
        accessToken: "EAAJdfKsroxoBO39zxdb5Ge9l0qTYXmUZCQn7J3ZBb5YbVZAfZAvu3N2P5GKjZCsF4zoEmhYM77Aovj2yzbj70revHFc1ESQSZCEOUWWN9N3u0fE7Wrpc63Lrx7fHzZCpoPSNo6zru2CkNx7iITnIlZBV4diOy73ijROalTu5mVlK8BTB7ewob4nUIFc6",
      })
      router.push("/dashboard")
    } catch (err) {
      setError(`${provider} login failed. Please try again.`)
    }
  }

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
          <p className="text-muted-foreground mt-2">Sign in to your account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="identifier">Email or Phone</Label>
                <Input
                  id="identifier"
                  type="text"
                  placeholder="Enter your email or phone"
                  name="identifier"
                  value={formData.identifier}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <label
                  htmlFor="remember-me"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </label>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={() => handleSocialLogin("Google")} className="w-full">
                  <FcGoogle className="mr-2 h-4 w-4" />
                  Google
                </Button>
                <Button variant="outline" onClick={() => handleSocialLogin("Facebook")} className="w-full">
                  <Facebook className="mr-2 h-4 w-4 text-blue-600" />
                  Facebook
                </Button>
                <Button variant="outline" onClick={() => handleSocialLogin("GitHub")} className="w-full">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </Button>
                <Button variant="outline" onClick={() => handleSocialLogin("LinkedIn")} className="w-full">
                  <Linkedin className="mr-2 h-4 w-4 text-blue-700" />
                  LinkedIn
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-2">
            <div className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

