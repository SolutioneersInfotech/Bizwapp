"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
import {
  Loader2,
  AlertCircle,
  Info,
  Github,
  Linkedin,
  Facebook,
  ArrowRight,
  ArrowLeft,
  Check,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import usePostData from "../../hooks/api/usePostData";
import { useToast } from "@/hooks/use-toast";
import { signIn } from "next-auth/react";

type formData = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
};

type Provider = "Google" | "Facebook" | "GitHub" | "LinkedIn";

export default function SignupPage() {
  const router = useRouter();
  const [phase, setPhase] = useState(1);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { mutate, isError, data } = usePostData<formData>(
    "https://api.bizwapp.com/api/auth/signup"
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validatePhase1 = () => {
    if (!formData.firstName) {
      setError("first Name is required");
      return false;
    }
    if (!formData.lastName) {
      setError("last Name is required");
      return false;
    }
    if (!formData.phone) {
      setError("phone is required");
      return false;
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      setError("Phone number must be 10 digits");
      return false;
    }
    if (!formData.email) {
      setError("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!formData.password) {
      setError("Password is required");
      return false;
    }
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;

    if (!strongPasswordRegex.test(formData.password)) {
      setError(
        "Password must be at least 8 characters long and include Alpha Numeric and special character."
      );
      return false;
    }
    if (formData.password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const { toast } = useToast();

  const handleSigUp = () => {
    console.log(("hsbhjsbvhsdbv"));
    
    setError("");

    if (!validatePhase1()) {
      return;
    }

    setIsLoading(true);

    mutate(formData, {
      onSuccess: (data) => {
        toast({
          title: "Success",
          description: data.message,
        });
        console.log("Success:", data);
        const user = { ...data.user, token: data.token };
        localStorage.setItem("user", JSON.stringify(user));
        router.push("/dashboard");
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
    setError("");
    // if (validatePhase1()) {
    //   setPhase(2)
    // }

    sessionStorage.setItem("signupFormData", JSON.stringify(formData));

    console.log(
      "process.env.NEXT_PUBLIC_META_APP_ID:",
      process.env.NEXT_PUBLIC_META_APP_ID
    );

    // const metaOAuthURL = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${process.env.NEXT_PUBLIC_META_APP_ID}&redirect_uri=https://bizwapp.com/meta/callback&state=secureRandom123&scope=email,public_profile`;
//     const metaOAuthURL = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${process.env.NEXT_PUBLIC_META_APP_ID}&redirect_uri=https://bizwapp.com/meta/callback&state=SOME_RANDOM_STRING&scope=whatsapp_business_management,business_management
// `;

//     window.location.href = metaOAuthURL;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
  };

  const handleSocialSignup = async (provider: Provider) => {
    console.log("Clicked provider:", provider); // should match e.g., "google"
    signIn(provider.toLowerCase(), { callbackUrl: "/dashboard" }); // like "google", "facebook", etc.
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
              {phase === 1
                ? "Enter your details to create an account"
                : "Connect your WhatsApp Business API"}
            </CardDescription>
            <div className="flex items-center justify-between mt-2"></div>
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
                  <Label htmlFor="username">Phone</Label>{" "}
                  <Input
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

                <div className="relative space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 top-6 px-3  text-muted-foreground"
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

                <div className="relative space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-muted-foreground"
                    onClick={() => setShowPassword((prev) => !prev)}
                    tabIndex={-1}
                  ></button>
                </div>

                <Button type="button" className="w-full" onClick={handleSigUp}>
                  {isLoading ? (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      ></path>
                    </svg>
                  ) : (
                    "Sign up"
                  )}
                </Button>
              </form>
            ) : (
              // Phase 2: WhatsApp API credentials
              <form onSubmit={handleSignup} className="space-y-4">
                {/*  */}
              </form>
            )}

            {phase === 1 && (
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      Or sign up with
                    </span>
                  </div>
                </div>

                <div className="mt-6 w-full">
                  <Button
                    variant="outline"
                    onClick={() => handleSocialSignup("Google")}
                    className="w-full"
                  >
                    <FcGoogle className="mr-2 h-4 w-4" />
                    Google
                  </Button>
                  {/* <Button
                    variant="outline"
                    onClick={() => handleSocialSignup("Facebook")}
                    className="w-full"
                  >
                    <Facebook className="mr-2 h-4 w-4 text-blue-600" />
                    Facebook
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSocialSignup("GitHub")}
                    className="w-full"
                  >
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSocialSignup("LinkedIn")}
                    className="w-full"
                  >
                    <Linkedin className="mr-2 h-4 w-4 text-blue-700" />
                    LinkedIn
                  </Button> */}
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
  );
}
