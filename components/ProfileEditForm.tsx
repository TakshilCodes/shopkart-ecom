"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Props = {
  defaultDisplayName: string;
  defaultEmail: string;
};

export default function ProfileEditForm({
  defaultDisplayName,
  defaultEmail,
}: Props) {
  const router = useRouter();

  const [displayName, setDisplayName] = useState(defaultDisplayName);
  const [email, setEmail] = useState(defaultEmail);
  const [otp, setOtp] = useState("");

  const [requiresOtp, setRequiresOtp] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post("/api/profile/update", {
        displayName,
        email,
      });

      if (res.data.requiresOtp) {
        setRequiresOtp(true);
        setPendingEmail(res.data.email);
        setSuccess(res.data.msg || "OTP sent successfully");
      } else {
        setSuccess(res.data.msg || "Profile updated successfully");
        router.push("/profile");
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setVerifyLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post("/api/profile/email-change/verify", {
        otp,
      });

      setSuccess(res.data.msg || "Email updated successfully");
      router.push("/profile");
      router.refresh();
    } catch (err: any) {
      setError(err?.response?.data?.error || "OTP verification failed");
    } finally {
      setVerifyLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-5 sm:p-6 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-black">Profile Details</h2>
        <p className="mt-1 text-sm text-gray-500">
          Change your name or email. If you change your email, we will send an OTP
          to verify it.
        </p>
      </div>

      <div className="p-5 sm:p-6">
        {error ? (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {typeof error === "string" ? error : "Please check your inputs"}
          </div>
        ) : null}

        {success ? (
          <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        ) : null}

        {!requiresOtp ? (
          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full h-12 rounded-xl border border-gray-300 px-4 text-sm outline-none transition focus:border-black"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 rounded-xl border border-gray-300 px-4 text-sm outline-none transition focus:border-black"
                placeholder="Enter your email"
              />
            </div>

            <div className="flex space-x-5">
              <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center h-11 px-6 rounded-xl bg-black text-white text-sm font-medium hover:bg-gray-900 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>

            <Link
              href="/profile"
              className="inline-flex items-center justify-center h-11 px-6 rounded-xl border border-gray-300 text-sm font-medium text-black hover:border-black hover:bg-gray-50 transition"
            >
              Cancel
            </Link>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="rounded-2xl border border-gray-200 bg-[#fafafa] p-4">
              <p className="text-sm text-gray-700">
                We sent a 6-digit OTP to:
              </p>
              <p className="mt-1 font-semibold text-black break-all">
                {pendingEmail}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Enter OTP
              </label>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full h-12 rounded-xl border border-gray-300 px-4 text-sm outline-none transition focus:border-black"
                placeholder="Enter 6-digit OTP"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={verifyLoading}
                className="inline-flex items-center justify-center h-11 px-6 rounded-xl bg-black text-white text-sm font-medium hover:bg-gray-900 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {verifyLoading ? "Verifying..." : "Verify OTP"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setRequiresOtp(false);
                  setOtp("");
                  setError("");
                  setSuccess("");
                }}
                className="inline-flex items-center justify-center h-11 px-6 rounded-xl border border-gray-300 text-sm font-medium text-black hover:border-black hover:bg-gray-50 transition"
              >
                Go Back
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}