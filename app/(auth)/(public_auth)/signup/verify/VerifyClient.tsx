"use client";

import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ClipLoader } from "react-spinners";
import z from "zod";

export default function VerifyClient() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();
  const params = useSearchParams();
  const pendingEmail = params.get("verify");

  const otpValidation = z.string().trim().length(6, "Invalid OTP");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      setLoading(true);
      setError("");
      setSuccess("");

      if (!pendingEmail) {
        setError("Email missing. Please sign up again.");
        setLoading(false);
        return;
      }

      const validate = otpValidation.safeParse(otp);

      if (!validate.success) {
        setError("Invalid OTP");
        setLoading(false);
        return;
      }

      const res = await axios.post("/api/auth/signup/verify", {
        pendingEmail,
        otp,
      });

      if (!res.data.ok) {
        setError(res.data.error);
        setLoading(false);
        return;
      }

      router.push("/signin");
      setLoading(false);
    } catch (e: any) {
      setError(e?.response?.data?.error || e?.message || "Something went wrong");
      setLoading(false);
    }
  }

  async function handleResendOtp() {
    try {
      if (!pendingEmail) {
        setError("Email missing. Please sign up again.");
        return;
      }

      setResendLoading(true);
      setError("");
      setSuccess("");

      const res = await axios.post("/api/auth/signup/resend-otp", {
        email: pendingEmail,
      });

      if (!res.data.ok) {
        setError(res.data.error || "Failed to resend OTP");
        setResendLoading(false);
        return;
      }

      setSuccess(res.data.msg || "OTP resent successfully");
      setResendLoading(false);
    } catch (e: any) {
      setError(e?.response?.data?.error || "Failed to resend OTP");
      setResendLoading(false);
    }
  }

  function handleChangeEmail() {
    router.push("/signup");
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-slate-50 flex items-center justify-center px-4 pb-10 pt-45">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-white shadow-[0_10px_30px_rgba(2,6,23,0.08)] border border-slate-200">
          <div className="p-6 sm:p-7">
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">
              Verify with OTP
            </h1>

            <p className="mt-2 text-sm text-slate-600">
              We’ve sent a 6-digit code to{" "}
              <span className="font-medium text-slate-900 break-all">
                {pendingEmail || "your email"}
              </span>
              . Enter it below to continue.
            </p>

            <div className="mt-2">
              <form onSubmit={handleSubmit}>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Enter OTP
                </label>

                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full h-12 rounded-lg border border-slate-300 px-4 text-base text-slate-900 outline-none shadow-sm focus:border-black focus:ring-2 focus:ring-black/10"
                />

                {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
                {success ? <p className="mt-2 text-sm text-green-600">{success}</p> : null}

                <div className="mt-3 text-xs text-slate-500">
                  Tip: check Spam/Promotions if you don’t see it.
                </div>

                <button
                  className="mt-6 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 active:bg-slate-950 focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? <ClipLoader color="#fff" size={20} /> : "Verify"}
                </button>
              </form>

              <div className="mt-5 flex items-center justify-between text-sm gap-4">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="font-medium text-slate-700 hover:text-slate-900 disabled:text-slate-400 disabled:cursor-not-allowed flex items-center gap-2"
                  disabled={resendLoading}
                >
                  {resendLoading ? (
                    <>
                      <ClipLoader color="#334155" size={14} />
                      Sending...
                    </>
                  ) : (
                    "Resend code"
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleChangeEmail}
                  className="font-medium text-slate-700 hover:text-slate-900"
                >
                  Change email
                </button>
              </div>

              <div className="border-t border-slate-200 px-6 sm:px-7 py-4 text-xs text-slate-500 mt-6">
                By continuing, you agree to our{" "}
                <span className="underline underline-offset-2 hover:text-slate-700 cursor-pointer">
                  Terms
                </span>{" "}
                &{" "}
                <span className="underline underline-offset-2 hover:text-slate-700 cursor-pointer">
                  Privacy Policy
                </span>
                .
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}