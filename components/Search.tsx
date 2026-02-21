"use client"
import useDebounced from "@/Hooks/useDebounced"
import searchImg from "@/assets/icons/search.png"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Search() {

    const [search, setSearch] = useState('')
    const debouncedSearch = useDebounced(search)
    const router = useRouter()

    useEffect(() => {
        if(debouncedSearch !== ""){
            router.push(`/products?search=${debouncedSearch}`)
        }else{
            router.push(`/products`)
        }
    }, [debouncedSearch]);


    return (
        <div className="flex justify-center pb-20">
            <div className="border rounded-4xl mx-auto w-100 flex justify-between items-center px-2">
                <input type="text" onChange={(e) => setSearch(e.target.value)} className="outline-none w-full text-lg" />
                <img src={searchImg.src} alt="search" className="w-5 h-5"/>
            </div>
        </div>
    )
}