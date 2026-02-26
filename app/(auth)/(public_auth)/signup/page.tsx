"use client"
import { SignupZod } from "@/lib/validators/auth";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";

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
            return setLoading(false)
        }catch(e : any){
            setLoading(false)
            return setError(e?.response.data)
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
                        {loading ? <ClipLoader color={"#fff"} loading={loading} /> : "Sign up"}
                    </button>

                    <p className="text-sm text-center text-neutral-500">Already have an account?{" "}<span className="text-black font-medium cursor-pointer hover:underline">Sign In</span></p>
                </form>
            </div>
        </div>
    );
}