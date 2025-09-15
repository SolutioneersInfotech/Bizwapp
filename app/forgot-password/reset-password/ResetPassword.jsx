// app/forgot-password/reset-password/ResetPassword.jsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setErr("");

    if (password !== confirm) {
      return setErr("Passwords do not match");
    }

    try {
      const res = await axios.post(
        "https://api.bizwapp.com/api/auth/reset-password",
        { token, password }
      );
      setMsg(res.data.message);
      setTimeout(() => router.push("/login"), 2000);
    } catch (error) {
      setErr(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="items-center  min-h-screen px-4 bg-green-100">
      <div className="flex flex-col items-center gap-8">
        {/* Logo + Heading */}
        <div className="flex items-center gap-4 p-80 ">
          <Image
            src="/BIZWAPP.png"
            alt="Biz Wapp Logo"
            width={108}
            height={108}
            className="mt-8"
          />
          
        </div>

        <span className="text-3xl font-semibold mb-6" style={{ color: "#105a01" }}>
            Reset Password
          </span>

        {/* Reset password card */}
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <input
              type="password"
              placeholder="Confirm password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              type="submit"
              className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
            >
              Reset Password
            </button>
          </form>
          {msg && <p className="text-green-600 mt-3 text-center">{msg}</p>}
          {err && <p className="text-red-600 mt-3 text-center">{err}</p>}
        </div>
      </div>
    </div>
  );
}
