"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, AlertCircle, Github, Linkedin, Facebook } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import usePostData from "@/hooks/api/usePostData";
import { useToast } from "@/hooks/use-toast";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [ isLoading , setIsLoading ] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevdata) => ({
      ...prevdata,
      [name]: value,
    }));
  };

  const { mutate, isError, data } = usePostData(
    "https://api.bizwapp.com/api/auth/login"
  );

  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { identifier, password } = formData;
  
    // Basic validation FIRST
    if (!identifier || !password) {
      setError("Email/Phone and password are required");
      return;
    }
  
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
    const isPhone = /^[0-9]{10}$/.test(identifier);
  
    if (!isEmail && !isPhone) {
      setError("Please enter a valid email or 10-digit phone number");
      return;
    }
  
    setIsLoading(true);
    setError("");
  
    try {
      mutate(
        { ...formData, rememberMe },
        {
          onSuccess: (data) => {
            toast({
              title: "Success",
              description: data.message,
            });
            console.log("Success:", data);
        const user = { ...data.user, token: data.token };
        localStorage.setItem("user", JSON.stringify(user));
            setTimeout(() => {
              router.push("/dashboard");
            }, 500);
            console.log("Login Success:", data);
          },
          onError: (error) => {
            setIsLoading(false);
            toast({
              title: "Error",
              description: error.message || "Something went wrong!",
            });
            console.error("Error:", error.message);
          },
        }
      );
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
  window.location.href = 'https://bizwapp-backend-2.onrender.com/api/auth/auth/google';
};
  
const handleFacebookLogin = () => {
    window.location.href = "https://bizwapp-backend-2.onrender.com/api/auth/auth/facebook";
  };

  const handleSocialLogin = async (provider: string) => {
    try {
      await signIn(provider.toLowerCase(), { callbackUrl: "/dashboard" });
    } catch (err) {
      setError(`${provider} login failed. Please try again.`);
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
          <p className="text-muted-foreground mt-2">Sign in to your account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
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
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-muted-foreground"
                    onClick={() => setShowPassword((prev) => !prev)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={(checked) =>
                    setRememberMe(checked as boolean)
                  }
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
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
          ) : (
            'Login'
          )}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 w-full">
                <Button
                  variant="outline"
                  onClick={handleGoogleLogin}
                  className="w-full"
                >
                  <FcGoogle className="mr-2 h-4 w-4" />
                  Google
                </Button>
                {/* <Button
                  variant="outline"
                  onClick={handleFacebookLogin}
                  className="w-full"
                >
                  <Facebook className="mr-2 h-4 w-4 text-blue-600" />
                  Facebook
                </Button> */}
                {/* <Button
                  variant="outline"
                  onClick={() => handleSocialLogin("github")}
                  className="w-full"
                >
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </Button> */}
                {/* <Button
                  variant="outline"
                  onClick={() => handleSocialLogin("linkedin")}
                  className="w-full"
                >
                  <Linkedin className="mr-2 h-4 w-4 text-blue-700" />
                  LinkedIn
                </Button> */}
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
  );
}
