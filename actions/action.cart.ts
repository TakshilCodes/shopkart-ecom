"use server"
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export async function getQuantity(productId: string) {
    try {
        const session = await getServerSession(authOptions)
        const user = session?.user.id;

        if (!user) {
            redirect('/signin')
        }

        await prisma.cart.findUnique({
            where: {
                userId_productId: {
                    productId,
                    userId: user
                }
            }
        })

        return { ok: true, error: null }
    } catch (e) {
        return { ok: false, error: e }
    }
}

export async function incrementCartItem(productId: string) {
    try {
        const session = await getServerSession(authOptions)
        const user = session?.user.id;

        if (!user) {
            redirect('/signin')
        }

        await prisma.cart.upsert({
            where: {
                userId_productId: {
                    productId,
                    userId: user
                }
            },
            update: {
                quantity: {
                    increment: 1
                }
            },
            create: {
                userId: user,
                productId,
                quantity: 1
            }
        })
        return { ok: true, error: null }
    } catch (e) {
        return { ok: false, error: e }
    }
}

export async function decrementCartItem(productId: string, initialquantity: number) {
    try {
        const session = await getServerSession(authOptions)
        const user = session?.user?.id;

        if (!user) {
            redirect('/signin')
        }

        if (initialquantity <= 1) {
            await prisma.cart.delete({
                where: {
                    userId_productId: {
                        productId,
                        userId: user
                    }
                }
            })
        } 
        else {
            await prisma.cart.update({
                where: {
                    userId_productId: {
                        productId,
                        userId: user
                    }
                },
                data: {
                    quantity: {
                        decrement: 1
                    }
                }
            })
        }
        return { ok: true, error: null }
    } catch (e) {
        return { ok: false, error: "Something went wrong" }
    }
}