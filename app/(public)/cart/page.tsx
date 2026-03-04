import Button from "@/components/Button";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

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
                        },
                    },
                },
            },
        }
    });

    const Subtotal = cartItems.reduce((sum, item) => {
        return sum + item.productvariant.product.price.toNumber() * item.quantity;
    }, 0);

    const DisplaySubtotal = Subtotal.toLocaleString()
    
    return (
        <main className="max-w-6xl mx-auto px-6 py-10">
            <h1 className="text-3xl font-semibold mb-8">Your Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <section className="lg:col-span-2 space-y-6">
                    {cartItems.map((cartItem) => {
                        const rawPrice = cartItem.productvariant.product.price.toNumber()
                        const DisplayPrice = rawPrice.toLocaleString()

                        return (
                            <div key={cartItem.id} className="flex items-center gap-6 border border-gray-200 rounded-xl p-4 bg-white shadow-sm">

                                <img src={cartItem.productvariant.product.prodImage}
                                    alt={cartItem.productvariant.product.name}
                                    className="w-24 h-24 object-cover rounded-lg"
                                />

                                <div className="flex-1">
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        {cartItem.productvariant.product.name}
                                    </h2>

                                    <p className="text-sm text-gray-500 mt-1">
                                        Size: {cartItem.productvariant.size}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        Stock: {cartItem.productvariant.stockQuantity}
                                    </p>

                                    <p className="text-base font-medium text-gray-900 mt-2">
                                        ₹{DisplayPrice}
                                    </p>
                                </div>
                                <Button isCart={true} disabled={false} initialquantity={cartItem.quantity} productvariantId={cartItem.productvariant.id} max={cartItem.productvariant.stockQuantity} />
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

                    <button className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-900 transition">
                        Checkout
                    </button>

                </aside>

            </div>
        </main>
    );
}