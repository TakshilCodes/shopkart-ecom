"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

type Props = {
  email: string;
};

type Mode = "change" | "forgot";
type Step = "form" | "otp";

export default function ChangePasswordForm({ email }: Props) {
  const router = useRouter();

  const [mode, setMode] = useState<Mode>("change");
  const [step, setStep] = useState<Step>("form");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function resetMessages() {
    setError("");
    setSuccess("");
  }

  function resetOtpState() {
    setStep("form");
    setOtp("");
    resetMessages();
  }

  function switchMode(nextMode: Mode) {
    setMode(nextMode);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    resetOtpState();
  }

  async function handleRequestOtp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    resetMessages();

    if (!newPassword || !confirmPassword) {
      setError("Please fill all required fields");
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

    if (mode === "change" && !currentPassword) {
      setError("Current password is required");
      return;
    }

    setLoading(true);

    try {
      const payload =
        mode === "change"
          ? {
              mode: "change",
              currentPassword,
              newPassword,
            }
          : {
              mode: "forgot",
              email,
              newPassword,
            };

      const res = await axios.post("/api/password/request-otp", payload);

      setSuccess(res.data.msg || "OTP sent successfully");
      setStep("otp");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    resetMessages();
    setVerifyLoading(true);

    try {
      const res = await axios.post("/api/password/verify-otp", {
        mode,
        email,
        otp,
      });

      setSuccess(res.data.msg || "Password updated successfully");
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
        <h2 className="text-xl font-semibold text-black">Update Password</h2>
        <p className="mt-1 text-sm text-gray-500">
          Choose the method you want to use.
        </p>

        <div className="mt-5 inline-flex rounded-xl border border-gray-200 bg-gray-50 p-1">
          <button
            type="button"
            onClick={() => switchMode("change")}
            className={`h-10 px-4 rounded-lg text-sm font-medium transition ${
              mode === "change"
                ? "bg-black text-white"
                : "text-black hover:bg-white"
            }`}
          >
            Change Password
          </button>

          <button
            type="button"
            onClick={() => switchMode("forgot")}
            className={`h-10 px-4 rounded-lg text-sm font-medium transition ${
              mode === "forgot"
                ? "bg-black text-white"
                : "text-black hover:bg-white"
            }`}
          >
            Forgot Current Password
          </button>
        </div>
      </div>

      <div className="p-5 sm:p-6">
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
          <form onSubmit={handleRequestOtp} className="space-y-5">
            {mode === "change" ? (
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full h-12 rounded-xl border border-gray-300 px-4 text-sm outline-none transition focus:border-black"
                  placeholder="Enter current password"
                />
              </div>
            ) : (
              <div className="rounded-2xl border border-gray-200 bg-[#fafafa] p-4">
                <p className="text-sm text-gray-600">
                  We will send a verification OTP to:
                </p>
                <p className="mt-1 font-semibold text-black break-all">
                  {email}
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full h-12 rounded-xl border border-gray-300 px-4 text-sm outline-none transition focus:border-black"
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-12 rounded-xl border border-gray-300 px-4 text-sm outline-none transition focus:border-black"
                placeholder="Confirm new password"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center h-11 px-6 rounded-xl bg-black text-white text-sm font-medium hover:bg-gray-900 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="rounded-2xl border border-gray-200 bg-[#fafafa] p-4">
              <p className="text-sm text-gray-700">We sent a 6-digit OTP to:</p>
              <p className="mt-1 font-semibold text-black break-all">{email}</p>
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
                onClick={resetOtpState}
                className="inline-flex items-center justify-center h-11 px-6 rounded-xl border border-gray-300 text-sm font-medium text-black hover:border-black hover:bg-gray-50 transition"
              >
                Back
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}