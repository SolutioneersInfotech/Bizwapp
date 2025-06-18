// pages/meta/callback.tsx or /meta/callback/page.tsx if using App Router
import { useRouter } from "next/router";
import { useEffect } from "react";
import usePostData from "@/hooks/api/usePostData";

export default function MetaCallback() {
  const router = useRouter();
  const { code, error, state } = router.query;
  const { mutate } = usePostData("https://api.bizwapp.com/api/auth/signup");

  useEffect(() => {
    if (error) {
      alert("Meta OAuth failed. Please try again.");
      router.push("/signup");
      return;
    }

    if (code && state) {
      const parsedFormData = JSON.parse(state);

      mutate(parsedFormData, {
        onSuccess: (data) => {
          const user = { ...data.user, token: data.token };
          localStorage.setItem("user", JSON.stringify(user));
          router.push("/dashboard");
        },
        onError: (error) => {
          console.error("Signup error:", error.message);
          alert("Signup failed. Please try again.");
          router.push("/signup");
        },
      });
    }
  }, [code, error, state]);

  return <div>Completing signup...</div>;
}
