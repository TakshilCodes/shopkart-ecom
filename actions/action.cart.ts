"use server"
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export async function incrementCartItem(productVariantId: string) {
    try {
        const session = await getServerSession(authOptions)
        const user = session?.user.id;

        if (!user) {
            redirect('/signin')
        }

        await prisma.cart.upsert({
            where: {
                userId_productVariantId: {
                    userId: user,
                    productVariantId,
                }
            },
            update: {
                quantity: {
                    increment: 1
                }
            },
            create: {
                userId: user,
                productVariantId,
                quantity: 1
            }
        })
        return { ok: true, error: null }
    } catch (e) {
        return { ok: false, error: e }
    }
}

export async function decrementCartItem(productVariantId: string, currentQuantity: number) {
    try {
        const session = await getServerSession(authOptions)
        const user = session?.user?.id;

        if (!user) {
            redirect('/signin')
        }

        if (currentQuantity <= 1) {
            await prisma.cart.delete({
                where: {
                    userId_productVariantId: {
                        userId: user,
                        productVariantId,
                    }
                }
            })
        }
        else {
            await prisma.cart.update({
                where: {
                    userId_productVariantId:{
                        userId:user,
                        productVariantId,
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

export async function deleteCartItem(formData: FormData) {
  const cartId = formData.get("cartId") as string;

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId || !cartId) return;

  await prisma.cart.deleteMany({
    where: {
      id: cartId,
      userId: userId,
    },
  });

  redirect('/cart')
}