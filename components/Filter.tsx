"use client"

import { useState } from "react"
import closeImg from '@/assets/icons/close.png'
import { useRouter } from "next/navigation"

export default function Filter() {

    const [isOpen, setIsOpen] = useState(false)
    const [tofilterprice, setTofilterprice] = useState('')
    const [error, setError] = useState<string>()
    const router = useRouter()

    function handelPriceFilter() {
        if (tofilterprice === "" || /[^\d]/.test(tofilterprice)) {
            setError('Invalid Input');
        } else {
            setError(null);
            router.push(`/products?price=${tofilterprice}`);
            setIsOpen(false);
        }
    }
    return (
        <div>
            <button onClick={() => setIsOpen(true)} className="border px-5 py-3 rounded-2xl">Filter</button>

            {isOpen ?
                <div
                    className="fixed inset-0 backdrop-blur-xs flex items-center justify-center"
                >
                    <div
                        className="bg-white p-6 rounded-lg shadow-xl w-11/12 md:w-1/2 lg:w-1/4 max-w-lg"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Filter</h2>
                            <button className="text-gray-500 hover:text-gray-700" onClick={() => setIsOpen(false)}>
                                <img src={closeImg.src} alt="close" className="w-3" />
                            </button>
                        </div>

                        <div>
                            {error ? <div className="text-red-600">{error}</div> : null}
                            <div>
                                <p className="text-md font-bold">Filter by price</p>
                                <div className="flex justify-between">
                                    <div className="border w-full rounded-2xl p-2">
                                        <input type="text" onChange={(e) => setTofilterprice(e.target.value)} className="outline-none" placeholder="Enter price"/>
                                    </div>
                                    <button className="mx-5 px-4 border rounded-2xl bg-black text-white" onClick={handelPriceFilter}>Filter</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                : null
            }
        </div>
    )
}