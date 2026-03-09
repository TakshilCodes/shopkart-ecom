"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"

export default function Admin(){

    const session = useSession()

    if(session.status === "unauthenticated"){
         redirect('/admin/signin')
    }

    if(session.data?.user.role !== 'Admin'){
        redirect('/')
    }
    return(
        <div className="flex justify-center items-center min-h-screen">Admin</div>
    )
}