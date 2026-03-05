import Button from "@/components/Button";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import Link from "next/link";
import deleteIcon from "@/assets/icons/delete.png"
import { deleteCartItem } from "@/actions/action.cart";

export default async function Cart() {

    const session = await getServerSession(authOptions);
    const userId = session?.user.id

    const cartItems = await prisma.cart.findMany({
        where: {
            userId
        },
        select: {
            id: true,
            quantity: true,
            productvariant: {
                select: {
                    id: true,
                    size: true,
                    stockQuantity: true,
                    product: {
                        select: {
                            slug: true,
                            prodImage: true,
                            name: true,
                            price: true,
                            category: {
                                select: {
                                    name: true
                                }
                            }
                        },
                    },
                },
            },
        }
    });

    const TotalCartItems = await prisma.cart.aggregate({
        where: {
            userId,
        },
        _sum: {
            quantity: true
        },
    });

    const Subtotal = cartItems.reduce((sum, item) => {
        return sum + item.productvariant.product.price.toNumber() * item.quantity;
    }, 0);

    const DisplaySubtotal = Subtotal.toLocaleString()

    if (!session) {
        return (
            <main className="max-w-6xl mx-auto px-6 py-20 flex flex-col items-center text-center">
                <h1 className="text-3xl font-semibold mb-4">Your Cart</h1>

                <p className="text-gray-500 mb-6">
                    Please sign in to view and manage your cart.
                </p>

                <Link
                    href="/signin"
                    className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-900 transition"
                >
                    Sign in
                </Link>
            </main>
        );
    }

    if (cartItems.length === 0) {
        return (
            <main className="max-w-6xl mx-auto px-6 py-20 flex flex-col items-center text-center">
                <h1 className="text-3xl font-semibold mb-4">Your Cart</h1>

                <p className="text-gray-500 mb-6">
                    Your cart is empty.
                </p>

                <Link
                    href="/products"
                    className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-900 transition"
                >
                    Browse Products
                </Link>
            </main>
        );
    }

    return (
        <main className="max-w-6xl mx-auto px-6 py-10">
            <div className="flex items-center justify-start space-x-5 mb-8">
                <p className="text-3xl font-semibold">Your Cart</p>
                <p className="text-gray-500">{TotalCartItems._sum.quantity} items</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <section className="lg:col-span-2 space-y-6">
                    {cartItems.map((cartItem) => {
                        const rawPrice = cartItem.productvariant.product.price.toNumber()
                        const DisplayPrice = rawPrice.toLocaleString()

                        return (
                            <div
                                key={cartItem.id}
                                className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 border border-gray-200 rounded-xl p-4 bg-white shadow-sm"
                            >
                                <Link href={`/products/${cartItem.productvariant.product.slug}`} className="shrink-0">
                                    <img
                                        src={cartItem.productvariant.product.prodImage}
                                        alt={cartItem.productvariant.product.name}
                                        className="w-65 h-65 flex justify-center sm:block sm:w-24 sm:h-24 object-cover rounded-lg"
                                    />
                                </Link>

                                <Link
                                    href={`/products/${cartItem.productvariant.product.slug}`}
                                    className="flex-1 min-w-0"
                                >
                                    <h2 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2">
                                        {cartItem.productvariant.product.name}
                                    </h2>

                                    <div className="flex flex-wrap items-center mt-1 gap-x-3 gap-y-1">
                                        <p className="text-sm text-gray-500">Size: {cartItem.productvariant.size}</p>
                                        <p className="text-sm text-gray-500">Stock: {cartItem.productvariant.stockQuantity}</p>
                                    </div>

                                    <p className="text-sm text-gray-500">{cartItem.productvariant.product.category.name}</p>

                                    <p className="text-base font-medium text-gray-900 mt-2">
                                        ₹{DisplayPrice}
                                    </p>
                                </Link>

                                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 sm:gap-8 sm:ml-auto shrink-0">
                                    <form action={deleteCartItem}>
                                        <input type="hidden" name="cartId" value={cartItem.id} />

                                        <button type="submit">
                                            <img
                                                src={deleteIcon.src}
                                                alt="delete item"
                                                className="w-7 cursor-pointer"
                                            />
                                        </button>
                                    </form>

                                    <div className="order-1 sm:order-2">
                                        <Button isCart={true} disabled={false} initialquantity={cartItem.quantity} productvariantId={cartItem.productvariant.id} max={cartItem.productvariant.stockQuantity} />
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </section>
                <aside className="border rounded-xl p-6 h-fit space-y-4">

                    <h2 className="text-xl font-semibold">Order Summary</h2>

                    <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>₹{DisplaySubtotal}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                        <span>Shipping</span>
                        <span>Free</span>
                    </div>

                    <div className="border-t pt-4 flex justify-between font-medium">
                        <span>Total</span>
                        <span>₹{DisplaySubtotal}</span>
                    </div>

                    <button className="w-full bg-black text-white hover: py-3 rounded-xl hover:bg-gray-900 transition">
                        Checkout
                    </button>

                </aside>

            </div>
        </main>
    );
}