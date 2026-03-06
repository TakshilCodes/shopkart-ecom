"use server"

import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma";
import { error } from "console";
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation";

interface FormData {
    fullName: string,
    Country: string,
    AddressLine1: string,
    AddressLine2: string,
    City: string,
    State: string,
    pincode: string
    PhoneNumber: string
    isDefault: boolean
}

export async function AddAddress(data: FormData) {
    try {
        const session = await getServerSession(authOptions);
        const userId = session?.user.id

        if (!userId) {
            redirect('/signin')
        }

        if (data.isDefault) {
            await prisma.address.updateMany({
                where: {
                    userId
                },
                data: {
                    isDefault: false
                }
            })
        }

        const address = await prisma.address.create({
            data: {
                userId: userId,
                fullName: data.fullName,
                Country: data.Country,
                AddressLine1: data.AddressLine1,
                AddressLine2: data.AddressLine2 || null,
                City: data.City,
                State: data.State,
                pincode: data.pincode,
                isDefault: data.isDefault,
                phoneNumber: data.PhoneNumber
            }
        })

        if (!address) return { ok: false, error: "Something went wrong" }

        return { ok: true, error: null }
    } catch (e: any) {
        return { ok: false, error: e.message }
    }
}