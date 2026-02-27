"use client"
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react"
import { ClipLoader } from "react-spinners";
import z from "zod";

export default function Verify() {
    const [otp, setOtp] = useState('')
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('')

    const router = useRouter();

    const params = useSearchParams();
    const pendingEmail = params.get("verify");

    const otpValidation = z.string().min(6).max(6)

    async function handleSubmit(e: any) {
        try {
            e.preventDefault()
            setLoading(true);
            setError("");

            if (!pendingEmail) {
                setError("Email missing. Please SignUp/SignIn again.");
                setLoading(false);
                return;
            }

            const validate = otpValidation.safeParse(otp)

            if (!validate.success) {
                setError('Invalid Otp')
                return setLoading(false)
            }

            const res = await axios.post('/api/auth/signup/verify', { pendingEmail, otp })

            if (!res.data.ok) {
                setError(res.data.error)
                return setLoading(false)
            }

            router.push('/')
            return setLoading(false)
        } catch (e: any) {
            setError(e?.response?.data?.error || e?.message || "Something went wrong");
            return setLoading(false)
        }
    }
    return (
        <div className="min-h-screen bg-linear-to-b from-white to-slate-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="rounded-2xl bg-white shadow-[0_10px_30px_rgba(2,6,23,0.08)] border border-slate-200">
                    <div className="p-6 sm:p-7">
                        <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">
                            Verify with OTP
                        </h1>
                        <p className="mt-2 text-sm text-slate-600">We’ve sent a 6-digit code to{" "}<span className="font-medium text-slate-900">your email</span>.Enter it below to continue.</p>

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
                                    className="w-full h-12 rounded-lg border border-slate-300 px-4 text-base text-slate-900 outline-none shadow-sm focus:border-black focus:ring-2 focus:ring-black/10"
                                    onChange={(e) => setOtp(e.target.value)}
                                />

                                {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}

                                <div className="mt-3 text-xs text-slate-500">Tip: check Spam/Promotions if you don’t see it.</div>

                                <button
                                    className="mt-6 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 active:bg-slate-950 focus:outline-none focus:ring-4 
                                                    focus:ring-slate-200 disabled:opacity-60 disabled:cursor-not-allowed"
                                    type="submit"
                                    disabled={loading}
                                >

                                    {loading ? <ClipLoader color={"#fff"} loading={loading} /> : "Verify"}
                                </button>
                            </form>

                            <div className="mt-5 flex items-center justify-between text-sm">
                                <button className="font-medium text-slate-700 hover:text-slate-900 disabled:text-slate-400 disabled:cursor-not-allowed" disabled>Resend code</button>

                                <button className="font-medium text-slate-700 hover:text-slate-900">Change email</button>
                            </div>

                            <div className="border-t border-slate-200 px-6 sm:px-7 py-4 text-xs text-slate-500 mt-6">By continuing, you agree to our{" "}
                                <span className="underline underline-offset-2 hover:text-slate-700 cursor-pointer">Terms</span>
                                {" "}&{" "}
                                <span className="underline underline-offset-2 hover:text-slate-700 cursor-pointer">Privacy Policy</span>.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}