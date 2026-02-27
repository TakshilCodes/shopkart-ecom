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
                        {loading ? <ClipLoader color={"#fff"} loading={loading} /> : "Sign up"}
                    </button>

                    <p className="text-sm text-center text-neutral-500">Don't have an account?{" "}<Link href={`/signup`} className="text-black font-medium cursor-pointer hover:underline">Sign Up</Link></p>
                </form>
            </div>
        </div>
    );
}