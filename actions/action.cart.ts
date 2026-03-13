"use server"
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
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
        const totalCartItems = await prisma.cart.aggregate({
            where: {
                userId: user,
            },
            _sum: {
                quantity: true,
            },
        });

        revalidatePath("/cart");

        return {
            ok: true,
            error: null,
            count: totalCartItems._sum.quantity ?? 0,
        };
    } catch (e) {
        return { ok: false, error: e }
    }
}

export async function decrementCartItem(productVariantId: string) {
    try {
        const session = await getServerSession(authOptions);
        const userId = session?.user?.id;

        if (!userId) {
            redirect("/signin");
        }

        const cartItem = await prisma.cart.findUnique({
            where: {
                userId_productVariantId: {
                    userId,
                    productVariantId,
                },
            },
            select: {
                quantity: true,
            },
        });

        if (!cartItem) {
            return { ok: false, error: "Cart item not found", count: 0 };
        }

        if (cartItem.quantity <= 1) {
            await prisma.cart.delete({
                where: {
                    userId_productVariantId: {
                        userId,
                        productVariantId,
                    },
                },
            });
        } else {
            await prisma.cart.update({
                where: {
                    userId_productVariantId: {
                        userId,
                        productVariantId,
                    },
                },
                data: {
                    quantity: {
                        decrement: 1,
                    },
                },
            });
        }

        const totalCartItems = await prisma.cart.aggregate({
            where: {
                userId,
            },
            _sum: {
                quantity: true,
            },
        });

        revalidatePath("/cart");

        return {
            ok: true,
            error: null,
            count: totalCartItems._sum.quantity ?? 0,
        };
    } catch (e) {
        return { ok: false, error: "Something went wrong", count: 0 };
    }
}


export async function deleteCartItem(cartId: string) {
    try {
        const session = await getServerSession(authOptions);
        const userId = session?.user?.id;

        if (!userId) {
            redirect("/signin");
        }

        await prisma.cart.deleteMany({
            where: {
                id: cartId,
                userId: userId,
            },
        });

        const totalCartItems = await prisma.cart.aggregate({
            where: {
                userId,
            },
            _sum: {
                quantity: true,
            },
        });

        revalidatePath("/cart");

        return {
            ok: true,
            count: totalCartItems._sum.quantity ?? 0,
        };
    } catch {
        return {
            ok: false,
            count: 0,
        };
    }
}