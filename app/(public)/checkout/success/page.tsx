import { redirect } from "next/navigation";

export default async function SuccessPage({
    searchParams,
}: {
    searchParams: Promise<{ order_id?: string }>;
}) {
    const params = await searchParams;
    const orderId = params.order_id;

    if (!orderId) {
        redirect("/checkout");
    }

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/cashfree/verify?orderId=${orderId}`,
        { cache: "no-store" }
    );
    const data = await res.json();

    return (
        <main className="max-w-4xl mx-auto px-6 py-20 flex items-center justify-center">
            <div className="w-full max-w-md bg-white border rounded-2xl shadow-sm p-10 text-center">

                {data.ok ? (
                    <>
                        {/* Success Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                                <svg
                                    className="w-8 h-8 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>

                        {/* Heading */}
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Payment Successful
                        </h1>

                        {/* Message */}
                        <p className="mt-3 text-gray-600">
                            Your payment has been processed successfully.
                        </p>

                        {/* Buttons */}
                        <div className="mt-8 flex flex-col gap-3">
                            <a
                                href="/orders"
                                className="w-full h-11 flex items-center justify-center rounded-xl bg-black text-white font-medium hover:bg-gray-900 transition"
                            >
                                View Orders
                            </a>

                            <a
                                href="/products"
                                className="w-full h-11 flex items-center justify-center rounded-xl border font-medium hover:bg-gray-50 transition"
                            >
                                Continue Shopping
                            </a>
                        </div>
                    </>
                ) : (
                    <>
                        <h1 className="text-2xl font-semibold text-red-600">
                            Payment Failed
                        </h1>

                        <p className="mt-4 text-gray-600">{data.error}</p>

                        <a
                            href="/cart"
                            className="mt-6 inline-flex items-center justify-center h-11 px-6 rounded-xl bg-black text-white font-medium hover:bg-gray-900 transition"
                        >
                            Return to Cart
                        </a>
                    </>
                )}
            </div>
        </main>
    );
}