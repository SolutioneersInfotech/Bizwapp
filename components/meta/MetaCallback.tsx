"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import usePostData from "@/hooks/api/usePostData";

export default function MetaCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const code = searchParams?.get("code");
  const error = searchParams?.get("error");
  const state = searchParams?.get("state");

  const { mutate } = usePostData("https://api.bizwapp.com/api/auth/signup");

  useEffect(() => {
    if (error) {
      alert("Meta OAuth failed: " + error);
      router.push("/signup");
      return;
    }

    if (code) {
      const formDataRaw = sessionStorage.getItem("signupFormData");
      if (!formDataRaw) {
        alert("Session expired or missing form data. Please try again.");
        router.push("/signup");
        return;
      }

      const formData = JSON.parse(formDataRaw);

      mutate(formData, {
        onSuccess: (data) => {
          localStorage.setItem("user", JSON.stringify({ ...data.user, token: data.token }));
          sessionStorage.removeItem("signupFormData");
          router.push("/dashboard");
        },
        onError: (err) => {
          alert("Signup failed: " + err.message);
          router.push("/signup");
        },
      });
    }
  }, [code, error]);

  return <div>Completing Meta authentication...</div>;
}
