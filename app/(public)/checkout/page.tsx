import { redirect } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ArrowLeft from '@/assets/icons/left-arrow.png'
import PayButton from "@/components/PayButton";

type CheckoutPageProps = {
  searchParams?: Promise<{
    addressId?: string;
  }>;
};

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user.id) {
    redirect("/signin");
  }

  const user = await prisma.users.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      DisplayName: true,
      email: true,
      address: {
        orderBy: [
          { isDefault: "desc" },
          { createdAt: "desc" },
        ],
        select: {
          id: true,
          isDefault: true,
          phoneNumber: true,
          fullName: true,
          Country: true,
          AddressLine1: true,
          AddressLine2: true,
          City: true,
          State: true,
          pincode: true,
        },
      },
      cart: {
        orderBy: {
          createdAt: "desc",
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
                  id: true,
                  name: true,
                  slug: true,
                  prodImage: true,
                  price: true,
                  isPublished: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!user) {
    redirect("/signin?callbackUrl=/checkout");
  }

  const rawSearchParams = (await searchParams) ?? {};
  const addressId = rawSearchParams.addressId;

  const addresses = user.address ?? [];

  const selectedAddress =
    addresses.find((addr) => addr.id === addressId) ||
    addresses.find((addr) => addr.isDefault) ||
    addresses[0] ||
    null;

  const hasAddress = !!selectedAddress;

  const validCartItems =
    user.cart?.filter(
      (item) =>
        item.productvariant.product.isPublished &&
        item.productvariant.stockQuantity > 0
    ) ?? [];

  if (validCartItems.length === 0) {
    return (
      <main className="min-h-screen bg-[#f8f8f8]">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <Link
            href="/cart"
            className="inline-flex items-center text-sm text-gray-600 hover:text-black transition"
          >
            <img src={ArrowLeft.src} alt="Back" className="w-3" /> Back to Cart
          </Link>

          <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-10 text-center">
            <h1 className="text-2xl font-semibold text-black">Your cart is empty</h1>
            <p className="mt-2 text-gray-500">
              Add products to your cart before proceeding to checkout.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center justify-center mt-6 h-11 px-6 rounded-xl bg-black text-white font-medium hover:bg-gray-900 transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const subtotal = validCartItems.reduce((acc, item) => {
    const price = Number(item.productvariant.product.price);
    return acc + price * item.quantity;
  }, 0);

  const shipping = subtotal >= 1999 ? 0 : 99;
  const total = subtotal + shipping;

  const totalItems = validCartItems.reduce((acc, item) => acc + item.quantity, 0);

  function formatPrice(amount: number) {
    return `₹${amount.toLocaleString("en-IN")}`;
  }

  return (
    <main className="min-h-screen bg-[#f8f8f8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center text-sm text-gray-600 hover:text-black transition"
          >
            <img src={ArrowLeft.src} alt="Back" className="w-3" /> Back to Cart
          </Link>

          <h1 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-black">
            Checkout
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Confirm your delivery address and review your final order.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <section className="xl:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
              <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-black">Delivery Address</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Select the address where you want your order delivered.
                  </p>
                </div>

                <Link
                  href="#"
                  className="text-sm font-medium text-black underline underline-offset-4"
                >
                  Manage
                </Link>
              </div>

              <div className="p-5 sm:p-6">
                {selectedAddress ? (
                  <div className="rounded-2xl border border-gray-200 p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-black">
                        {selectedAddress.fullName}
                      </p>
                      {selectedAddress.isDefault && (
                        <span className="text-xs px-2 py-1 rounded-full bg-black text-white">
                          Default
                        </span>
                      )}
                    </div>

                    <div className="mt-3 text-sm text-gray-700 leading-6">
                      <p>{selectedAddress.phoneNumber}</p>
                      <p>{selectedAddress.AddressLine1}</p>
                      {selectedAddress.AddressLine2 ? (
                        <p>{selectedAddress.AddressLine2}</p>
                      ) : null}
                      <p>
                        {selectedAddress.City}, {selectedAddress.State} -{" "}
                        {selectedAddress.pincode}
                      </p>
                      {selectedAddress.Country ? <p>{selectedAddress.Country}</p> : null}
                    </div>

                    {addresses.length > 1 ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {addresses.map((address) => (
                          <Link
                            key={address.id}
                            href={`/checkout?addressId=${address.id}`}
                            className={`inline-flex items-center rounded-lg border px-3 py-2 text-sm transition ${selectedAddress.id === address.id
                              ? "border-black bg-black text-white"
                              : "border-gray-300 bg-white text-black hover:border-black"
                              }`}
                          >
                            {address.fullName} • {address.City}
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-gray-300 p-6">
                    <p className="text-sm text-gray-600">
                      No address found. Add an address before placing your order.
                    </p>
                    <Link
                      href="/address"
                      className="inline-flex items-center justify-center mt-4 h-10 px-4 rounded-xl bg-black text-white text-sm font-medium hover:bg-gray-900 transition"
                    >
                      Add Address
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
              <div className="p-5 sm:p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-black">Order Summary</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {totalItems} item{totalItems > 1 ? "s" : ""} in your order
                </p>
              </div>

              <div className="p-5 sm:p-6 space-y-5">
                {validCartItems.map((item) => {
                  const product = item.productvariant.product;
                  const itemTotal = Number(product.price) * item.quantity;

                  return (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row gap-4 border-b border-gray-100 pb-5 last:border-b-0 last:pb-0"
                    >
                      <Link
                        href={`/products/${product.slug}`}
                        className="w-full sm:w-28 h-28 rounded-xl overflow-hidden bg-gray-100 shrink-0"
                      >
                        <img
                          src={product.prodImage}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </Link>

                      <div className="flex-1 flex flex-col justify-between gap-3">
                        <div>
                          <Link
                            href={`/products/${product.slug}`}
                            className="text-base sm:text-lg font-semibold text-black hover:underline"
                          >
                            {product.name}
                          </Link>

                          <div className="mt-2 flex flex-wrap gap-2 text-xs sm:text-sm text-gray-500">
                            {item.productvariant.size ? (
                              <span className="px-2.5 py-1 rounded-full bg-gray-100">
                                Size: {item.productvariant.size}
                              </span>
                            ) : null}

                            <span className="px-2.5 py-1 rounded-full bg-gray-100">
                              Qty: {item.quantity}
                            </span>

                            <span className="px-2.5 py-1 rounded-full bg-gray-100">
                              Price: {formatPrice(Number(product.price))}
                            </span>
                          </div>
                        </div>

                        <p className="text-lg font-semibold text-black">
                          {formatPrice(itemTotal)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <aside className="xl:col-span-1">
            <div className="sticky top-6 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-black">Payment Details</h2>
                <p className="text-sm text-gray-500 mt-1">Final payable amount</p>
              </div>

              <div className="p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-black">{formatPrice(subtotal)}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-black">
                    {shipping === 0 ? "Free" : formatPrice(shipping)}
                  </span>
                </div>

                <div className="border-t border-dashed border-gray-200 pt-4 flex items-center justify-between">
                  <span className="text-base font-semibold text-black">Total</span>
                  <span className="text-2xl font-bold text-black">
                    {formatPrice(total)}
                  </span>
                </div>

                {hasAddress ? (
                  <>
                    <PayButton addressId={selectedAddress.id} total={total} />
                    <p className="text-xs leading-5 text-gray-500 text-center">
                      Your total is calculated securely on the server before payment.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="rounded-xl border border-dashed border-gray-300 p-4 text-center">
                      <p className="text-sm text-gray-600">
                        Add a delivery address before proceeding to payment.
                      </p>
                    </div>

                    <Link
                      href="/address"
                      className="inline-flex w-full items-center justify-center h-11 rounded-xl bg-black text-white text-sm font-medium hover:bg-gray-900 transition"
                    >
                      Add Address
                    </Link>
                  </>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}