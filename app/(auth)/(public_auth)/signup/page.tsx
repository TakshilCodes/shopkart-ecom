"use client"
import { SignupZod } from "@/lib/validators/auth";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";
import Link from "next/link";
import { signIn } from "next-auth/react";

type SignupForm = {
    email?: string,
    displayName?: string,
    password?: string
}

export default function Signup() {

    const [data, setData] = useState<SignupForm>({
        email: '',
        displayName: '',
        password: ''
    })

    const [zodError, setZodError] = useState<SignupForm>({
        email: '',
        displayName: '',
        password: ''
    })

    const [error, setError] = useState('')

    const [loading, setLoading] = useState(false);

    const router = useRouter()

    async function handleSubmit(e: any) {
        try {
            e.preventDefault();

            setLoading(true)
            setZodError({})
            setError('')

            const valid = SignupZod.safeParse(data)

            if (!valid.success) {
                const err = valid.error.flatten().fieldErrors
                setZodError({ email: err.email?.[0], displayName: err.displayName?.[0], password: err.password?.[0] })
                return setLoading(false)
            }

            const res = await axios.post('/api/auth/signup/init', {
                displayName: valid.data?.displayName,
                email: valid.data?.email,
                password: valid.data?.password
            })

            if (!res.data.ok) {
                setError(res.data.error)
                return setLoading(false)
            }

            router.push(`/signup/verify?verify=${data.email}`)
            return setLoading(false)

        } catch (e: any) {
            setLoading(false)
            return setError(e?.response.data || 'something went wrong!')
        }
    }

    return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">

            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

                <h1 className="text-3xl font-bold text-center text-neutral-800">Create Account</h1>
                <p className="text-center text-sm text-neutral-500 mt-2">Join ShopKart and step into style 👟</p>
                {error ? <div>{error}</div> : null}

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    <div className="flex flex-col space-y-2">
                        <label className="text-sm font-medium text-neutral-700">Display Name</label>
                        {zodError?.displayName ? <div className="text-red-600">{zodError.displayName}</div> : null}
                        <input
                            type="text"
                            placeholder="Enter your name"
                            className="px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                            onChange={(e) => setData((prev) => ({ ...prev, displayName: e.target.value }))}
                            required
                        />
                    </div>

                    <div className="flex flex-col space-y-2">
                        <label className="text-sm font-medium text-neutral-700">Email</label>
                        {zodError?.email ? <div className="text-red-600">{zodError.email}</div> : null}
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                            onChange={(e) => setData((prev) => ({ ...prev, email: e.target.value }))}
                            required
                        />
                    </div>

                    <div className="flex flex-col space-y-2">
                        <label className="text-sm font-medium text-neutral-700">Password</label>
                        {zodError?.password ? <div className="text-red-600">{zodError.password}</div> : null}
                        <input
                            type="password"
                            placeholder="Enter your password"
                            className="px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                            onChange={(e) => setData((prev) => ({ ...prev, password: e.target.value }))}
                            required
                        />
                    </div>

                    <button disabled={loading} type="submit" className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-neutral-800 transition duration-200">
                        {loading ? <ClipLoader color={"#fff"} loading={loading} /> : "Sign In"}
                    </button>

                    <div className="flex items-center my-6">
                        <div className="grow h-px bg-neutral-300"></div>
                        <span className="px-4 text-sm text-neutral-500">OR</span>
                        <div className="grow h-px bg-neutral-300"></div>
                    </div>

                    <button
                        type="button"
                        onClick={() => signIn("google", { callbackUrl: "/" })}
                        className="w-full flex items-center justify-center gap-3 border border-neutral-300 bg-white py-3 rounded-xl text-sm font-medium text-neutral-800 hover:bg-neutral-100 hover:shadow-md
                                            active:scale-[0.99] transition-all duration-200"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 48 48">
                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.6l6.85-6.85C35.96 2.7 30.36 0 24 0 14.63 0 6.51 5.38 2.56 13.22l7.98 6.19C12.36 13.1 17.73 9.5 24 9.5z" />
                            <path fill="#4285F4" d="M46.14 24.5c0-1.64-.14-3.22-.41-4.75H24v9h12.44c-.54 2.9-2.18 5.36-4.65 7.04l7.18 5.58C43.98 37.03 46.14 31.3 46.14 24.5z" />
                            <path fill="#FBBC05" d="M10.54 28.41A14.48 14.48 0 019.5 24c0-1.54.26-3.03.74-4.41l-7.98-6.19A23.93 23.93 0 000 24c0 3.84.92 7.47 2.56 10.6l7.98-6.19z" />
                            <path fill="#34A853" d="M24 48c6.36 0 11.72-2.1 15.63-5.73l-7.18-5.58c-2 1.35-4.56 2.15-8.45 2.15-6.27 0-11.64-3.6-13.46-8.91l-7.98 6.19C6.51 42.62 14.63 48 24 48z" />
                        </svg>
                        Continue with Google
                    </button>
                    <p className="text-sm text-center text-neutral-500">Already have an account?{" "}<Link href={`/signin`} className="text-black font-medium cursor-pointer hover:underline">Sign In</Link></p>
                </form>
            </div>
        </div>
    );
}