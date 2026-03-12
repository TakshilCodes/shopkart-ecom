"use client"

import { useState } from "react"
import closeImg from '@/assets/icons/close.png'
import { useRouter } from "next/navigation"

export default function Filter() {

    const [isOpen, setIsOpen] = useState(false)
    const [tofilterprice, setTofilterprice] = useState('')
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)

    function handelPriceFilter() {
        if (tofilterprice === "" || /[^\d]/.test(tofilterprice)) {
            setError("Please enter a valid price")
        } else {
            setError(null)
            router.push(`/products?price=${tofilterprice}`)
            setIsOpen(false)
        }
    }

    return (
        <div>
            {/* Filter Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="border border-gray-300 px-6 py-3 rounded-2xl text-sm font-medium hover:border-black hover:bg-gray-50 transition"
            >
                Filter
            </button>

            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                >
                    {/* Modal */}
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white w-[90%] md:w-[420px] rounded-3xl shadow-2xl p-6"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold">Filter Products</h2>

                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 rounded-full hover:bg-gray-100 transition"
                            >
                                <img src={closeImg.src} alt="close" className="w-3" />
                            </button>
                        </div>

                        {/* Filter Content */}
                        <div className="space-y-4">

                            <div>
                                <p className="text-sm font-medium text-gray-700 mb-2">
                                    Maximum Price
                                </p>

                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        placeholder="Enter price"
                                        value={tofilterprice}
                                        onChange={(e) => setTofilterprice(e.target.value)}
                                        className="flex-1 border border-gray-300 rounded-xl px-4 py-2 text-sm outline-none focus:border-black"
                                    />

                                    <button
                                        onClick={handelPriceFilter}
                                        className="px-5 py-2 rounded-xl bg-black text-white text-sm font-medium hover:bg-gray-900 transition"
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <p className="text-sm text-red-500">
                                    {error}
                                </p>
                            )}

                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}