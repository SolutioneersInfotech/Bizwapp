"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";

function AuthCallbackInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    const token = searchParams?.get("token");

    if (!token) {
      setError("Authentication failed. No token received.");
      setTimeout(() => router.push("/login"), 3000);
      return;
    }

    fetch("https://bizwapp-backend-production-2354.up.railway.app/api/auth/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user profile");
        return res.json();
      })
      .then((data) => {
        const user = { ...data.user, token };
        localStorage.setItem("user", JSON.stringify(user));
        router.push("/dashboard");
      })
      .catch(() => {
        setError("Authentication failed. Redirecting to login...");
        setTimeout(() => router.push("/login"), 3000);
      });
  }, [searchParams, router]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted gap-4">
        <p className="text-destructive text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted gap-6">
      <Image src="/BIZWAPP.png" alt="BizWApp Logo" width={56} height={56} />
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
        <p className="text-muted-foreground text-sm">Completing sign in...</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
        </div>
      }
    >
      <AuthCallbackInner />
    </Suspense>
  );
}
