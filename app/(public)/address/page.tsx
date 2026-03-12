"use client"
import { AddAddress } from "@/actions/action.address"
import { AddressZod } from "@/lib/validators/address"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface FormData {
    fullName: string
    Country: string
    AddressLine1: string
    AddressLine2: string
    City: string
    State: string
    pincode: string
    PhoneNumber: string
    isDefault: boolean
}

export default function AddressForm() {

    const formdata: FormData = {
        fullName: "",
        Country: "India",
        AddressLine1: "",
        AddressLine2: "",
        City: "",
        State: "",
        pincode: "",
        PhoneNumber: "",
        isDefault: true
    }

    const [data, setData] = useState<FormData>(formdata)
    const [ZodErr, setZodErr] = useState<FormData>(formdata)
    const [error, setError] = useState('')
    const [confrim, setConfirm] = useState('')

    async function handelSubmit(e: any) {
        e.preventDefault()
        setZodErr(formdata)

        const validate = AddressZod.safeParse(data)

        if (!validate.success) {
            const err = validate.error.flatten().fieldErrors
            setZodErr({
                fullName: err.fullName?.[0] || "",
                Country: "India",
                AddressLine1: err.AddressLine1?.[0] || "",
                AddressLine2: err.AddressLine2?.[0] || "",
                City: err.City?.[0] || "",
                State: err.State?.[0] || "",
                pincode: err.pincode?.[0] || "",
                PhoneNumber: err.PhoneNumber?.[0] || "",
                isDefault: false
            })
            return
        }

        const res = await AddAddress(data)
        if(!res.ok ){
            setError(res.error)
            return
        }

        setConfirm("Done, your address is added")
        router.push('/profile')
        return
    }

    const router = useRouter()
    return (
        <div className="pb-10 pt-35">
        <div className="max-w-3xl mx-auto rounded-3xl border border-gray-200 bg-white p-8 shadow-[0_10px_40px_rgba(0,0,0,0.06)] mt-2">
            <div className="mb-8">
                <p className="text-sm font-medium tracking-wide text-gray-500 uppercase">Add address</p>
                <h2 className="mt-2 text-3xl font-semibold text-gray-900">Shipping Address</h2>
                <p className="mt-2 text-sm text-gray-500">Enter the address where you want your order delivered.</p>
                {error ? <div className="text-red-500">{error}</div> : null}
                {confrim ? <div className="text-green-500">{confrim}</div> : null}
            </div>

            <form className="space-y-6" onSubmit={handelSubmit}>
                <div>
                    {ZodErr.PhoneNumber ? <div className="text-red-500">{ZodErr.PhoneNumber}</div> : null}
                    <label className="mb-2 block text-sm font-medium text-gray-700">Phone Number</label>

                    <div className="flex items-center rounded-2xl border border-gray-200 bg-gray-50 focus-within:ring-4 focus-within:ring-black/5 focus-within:border-black transition">
                        <span className="px-4 text-sm text-gray-600 border-r border-gray-200">+91</span>
                        <input
                            type="tel"
                            placeholder="98765 43210"
                            className="h-12 w-full bg-transparent px-4 text-sm text-gray-900 outline-none"
                            onChange={(e) => setData((prev) => ({
                                ...prev,
                                PhoneNumber: e.target.value
                            }))}
                        />
                    </div>

                    <p className="mt-2 text-xs text-gray-500">
                        We will only call you if there are questions regarding your order.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        {ZodErr.fullName ? <div className="text-red-500">{ZodErr.fullName}</div> : null}
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Full Name
                        </label>
                        <input
                            onChange={(e) => setData((prev) => ({
                                ...prev,
                                fullName: e.target.value
                            }))}
                            type="text"
                            placeholder="Enter your full name"
                            className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 outline-none transition focus:border-black focus:bg-white focus:ring-4 focus:ring-black/5"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Country
                        </label>
                        <select className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 outline-none transition focus:border-black focus:bg-white focus:ring-4 focus:ring-black/5">
                            <option>India</option>
                        </select>
                    </div>
                </div>

                <div>
                    {ZodErr.AddressLine1 ? <div className="text-red-500">{ZodErr.AddressLine1}</div> : null}
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Address Line 1
                    </label>
                    <input
                        onChange={(e) => setData((prev) => ({
                            ...prev,
                            AddressLine1: e.target.value
                        }))}
                        type="text"
                        placeholder="Street address, house number, company name"
                        className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 outline-none transition focus:border-black focus:bg-white focus:ring-4 focus:ring-black/5"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                        Street address, P.O. box, company name, c/o
                    </p>
                </div>

                <div>
                    {ZodErr.AddressLine2 ? <div className="text-red-500">{ZodErr.AddressLine2}</div> : null}
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Address Line 2
                    </label>
                    <input
                        onChange={(e) => setData((prev) => ({
                            ...prev,
                            AddressLine2: e.target.value
                        }))}
                        type="text"
                        placeholder="Apartment, suite, unit, building, floor"
                        className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 outline-none transition focus:border-black focus:bg-white focus:ring-4 focus:ring-black/5"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                        Apartment, suite, unit, building, floor, etc.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div>
                        {ZodErr.City ? <div className="text-red-500">{ZodErr.City}</div> : null}
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            City
                        </label>
                        <input
                            onChange={(e) => setData((prev) => ({
                                ...prev,
                                City: e.target.value
                            }))}
                            type="text"
                            placeholder="City"
                            className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 outline-none transition focus:border-black focus:bg-white focus:ring-4 focus:ring-black/5"
                        />
                    </div>

                    <div>
                        {ZodErr.State ? <div className="text-red-500">{ZodErr.State}</div> : null}
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            State / Region
                        </label>
                        <input
                            onChange={(e) => setData((prev) => ({
                                ...prev,
                                State: e.target.value
                            }))}
                            type="text"
                            placeholder="State"
                            className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 outline-none transition focus:border-black focus:bg-white focus:ring-4 focus:ring-black/5"
                        />
                    </div>

                    <div>
                        {ZodErr.pincode ? <div className="text-red-500">{ZodErr.pincode}</div> : null}
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            ZIP / Postal Code
                        </label>
                        <input
                            onChange={(e) => setData((prev) => ({
                                ...prev,
                                pincode: e.target.value
                            }))}
                            type="text"
                            placeholder="Postal code"
                            className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 outline-none transition focus:border-black focus:bg-white focus:ring-4 focus:ring-black/5"
                        />
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            className="peer sr-only"
                            checked={data.isDefault}
                            onChange={(e) =>
                                setData((prev) => ({
                                    ...prev,
                                    isDefault: e.target.checked,
                                }))
                            }
                        />

                        <div
                            className="relative h-6 w-11 rounded-full bg-gray-300 transition-colors duration-200 peer-checked:bg-black after:absolute after:left-0.5 after:top-0.5 after:h-5 
                            after:w-5 after:rounded-full after:bg-white after:transition-transform after:duration-200 peer-checked:after:translate-x-5"
                        ></div>

                        <span className="text-sm font-medium text-gray-700">
                            Set as default address
                        </span>
                    </label>
                </div>

                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                    <button
                        type="submit"
                        className="inline-flex h-12 items-center justify-center rounded-2xl bg-black px-6 text-sm font-medium text-white transition hover:bg-gray-900 active:scale-[0.98] cursor-pointer"
                    >
                        Save Address
                    </button>

                    <button
                        onClick={() => router.push('/cart')}
                        type="button"
                        className="inline-flex h-12 items-center justify-center rounded-2xl border border-gray-200 bg-white px-6 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
        </div>
    )
}