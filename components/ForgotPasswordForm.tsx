"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ClipLoader } from "react-spinners";

export default function ForgotPasswordForm() {
  const router = useRouter();

  const [step, setStep] = useState<"form" | "otp">("form");

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSendOtp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!email || !newPassword || !confirmPassword) {
      setError("Please fill all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("/api/password/request-otp", {
        mode: "forgot",
        email,
        newPassword,
      });

      setSuccess(
        res.data.msg || "If an account exists for this email, an OTP has been sent."
      );
      setStep("otp");
    } catch (e: any) {
      setError(e?.response?.data?.error || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      setVerifyLoading(true);

      const res = await axios.post("/api/password/verify-otp", {
        mode: "forgot",
        email,
        otp,
      });

      setSuccess(res.data.msg || "Password updated successfully");

      setTimeout(() => {
        router.push("/signin");
        router.refresh();
      }, 1000);
    } catch (e: any) {
      setError(e?.response?.data?.error || "OTP verification failed");
    } finally {
      setVerifyLoading(false);
    }
  }

  return (
    <div>
      {error ? (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      ) : null}

      {step === "form" ? (
        <form onSubmit={handleSendOtp} className="space-y-5">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-neutral-700">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
              required
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-neutral-700">
              New Password
            </label>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
              required
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-neutral-700">
              Confirm New Password
            </label>
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
              required
            />
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-neutral-800 transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? <ClipLoader color="#fff" size={20} /> : "Send OTP"}
          </button>

          <p className="text-sm text-center text-neutral-500">
            Remember your password?{" "}
            <Link href="/signin" className="text-black font-medium hover:underline">
              Sign In
            </Link>
          </p>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-5">
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3">
            <p className="text-sm text-neutral-600">We sent a 6-digit OTP to:</p>
            <p className="mt-1 font-medium text-neutral-900 break-all">{email}</p>
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-neutral-700">OTP</label>
            <input
              type="text"
              maxLength={6}
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
              required
            />
          </div>

          <div className="flex gap-3">
            <button
              disabled={verifyLoading}
              type="submit"
              className="flex-1 bg-black text-white py-3 rounded-xl font-semibold hover:bg-neutral-800 transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {verifyLoading ? <ClipLoader color="#fff" size={20} /> : "Verify OTP"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep("form");
                setOtp("");
                setError("");
                setSuccess("");
              }}
              className="px-5 py-3 rounded-xl border border-neutral-300 font-semibold hover:bg-neutral-100 transition"
            >
              Back
            </button>
          </div>
        </form>
      )}
    </div>
  );
}