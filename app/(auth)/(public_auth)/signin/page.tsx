"use client"
import { SignInZod } from "@/lib/validators/auth";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";
import Link from "next/link";

type SignupForm = {
    email?: string,
    password?: string
}

export default function SignIn() {

    const [data, setData] = useState<SignupForm>({
        email: '',
        password: ''
    })

    const [zodError, setZodError] = useState<SignupForm>({
        email: '',
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

            const valid = SignInZod.safeParse(data)

            if (!valid.success) {
                const err = valid.error.flatten().fieldErrors
                setZodError({ email: err.email?.[0], password: err.password?.[0] })
                return setLoading(false)
            }

            const email = data.email
            const password = data.password

            const res = await signIn("credentials", {
                email,
                password,
                redirect: false
            });

            if (!res) {
                setError("Something went wrong. Try again.");
                return;
            }

            if (res?.error) {
                setError("Invalid email or password");
                setLoading(false);
                return;
            }

            router.push(`/`)
            return setLoading(false)

        } catch (e: any) {
            setLoading(false)
            return setError('Something went wrong!')
        }
    }

    return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">

            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

                <h1 className="text-3xl font-bold text-center text-neutral-800">Sign In</h1>
                {error ? <div className="text-red-600 mt-3">{error}</div> : null}

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">

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

                    <p className="text-sm text-center text-neutral-500">Don't have an account?{" "}<Link href={`/signup`} className="text-black font-medium cursor-pointer hover:underline">Sign Up</Link></p>
                </form>
            </div>
        </div>
    );
}