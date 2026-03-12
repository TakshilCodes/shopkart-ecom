import { redirect } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ArrowLeft from "@/assets/icons/left-arrow.png";
import PayButton from "@/components/PayButton";

type CheckoutPageProps = {
  searchParams?: Promise<{
    addressId?: string;
  }>;
};

export default async function Checkout({ searchParams }: CheckoutPageProps) {
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
        orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
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
      <main className="min-h-screen">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-10 pt-40">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-black"
          >
            <img src={ArrowLeft.src} alt="Back" className="w-3" />
            Back to Cart
          </Link>

          <div className="mt-8 rounded-3xl border border-gray-200 bg-white px-6 py-14 text-center shadow-sm sm:px-10">
            <div className="mx-auto flex max-w-md flex-col items-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl">
                🛍️
              </div>

              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-black">
                Your cart is empty
              </h1>

              <p className="mt-3 text-sm sm:text-base leading-7 text-gray-500">
                Add products to your cart before proceeding to checkout.
              </p>

              <Link
                href="/products"
                className="mt-7 inline-flex h-11 items-center justify-center rounded-2xl bg-black px-6 text-sm font-medium text-white transition hover:bg-gray-900"
              >
                Continue Shopping
              </Link>
            </div>
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
    <main className="min-h-screen bg-[#fafafa]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-10 pt-40">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link
              href="/cart"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-black"
            >
              <img src={ArrowLeft.src} alt="Back" className="w-3" />
              Back to Cart
            </Link>

            <h1 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight text-black">
              Checkout
            </h1>
            <p className="mt-2 max-w-2xl text-sm sm:text-base text-gray-500">
              Confirm your delivery address and review your final order before payment.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 shadow-sm">
              {totalItems} item{totalItems > 1 ? "s" : ""}
            </div>
            <div className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 shadow-sm">
              Secure checkout
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
          <section className="xl:col-span-2 space-y-6">
            <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-start justify-between gap-4 border-b border-gray-100 p-5 sm:p-6">
                <div>
                  <h2 className="text-xl font-semibold text-black">Delivery Address</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Select the address where you want your order delivered.
                  </p>
                </div>

                <Link
                  href="/profile"
                  className="shrink-0 text-sm font-medium text-black underline underline-offset-4"
                >
                  Manage
                </Link>
              </div>

              <div className="p-5 sm:p-6">
                {selectedAddress ? (
                  <div className="rounded-2xl border border-gray-200 bg-linear-to-br from-white to-gray-50 p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-base font-semibold text-black">
                        {selectedAddress.fullName}
                      </p>

                      {selectedAddress.isDefault && (
                        <span className="rounded-full bg-black px-2.5 py-1 text-xs font-medium text-white">
                          Default
                        </span>
                      )}
                    </div>

                    <div className="mt-4 space-y-1 text-sm leading-6 text-gray-700">
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
                      <div className="mt-5">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                          Choose another address
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {addresses.map((address) => (
                            <Link
                              key={address.id}
                              href={`/checkout?addressId=${address.id}`}
                              className={`inline-flex items-center rounded-xl border px-3 py-2 text-sm transition ${
                                selectedAddress.id === address.id
                                  ? "border-black bg-black text-white"
                                  : "border-gray-300 bg-white text-black hover:border-black"
                              }`}
                            >
                              {address.fullName} • {address.City}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6">
                    <p className="text-sm leading-6 text-gray-600">
                      No address found. Add an address before placing your order.
                    </p>
                    <Link
                      href="/address"
                      className="mt-4 inline-flex h-10 items-center justify-center rounded-xl bg-black px-4 text-sm font-medium text-white transition hover:bg-gray-900"
                    >
                      Add Address
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 p-5 sm:p-6">
                <h2 className="text-xl font-semibold text-black">Order Summary</h2>
                <p className="mt-1 text-sm text-gray-500">
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
                      className="flex flex-col gap-4 rounded-2xl border border-gray-100 p-4 transition hover:border-gray-200 hover:bg-gray-50/50 sm:flex-row"
                    >
                      <Link
                        href={`/products/${product.slug}`}
                        className="h-28 w-full overflow-hidden rounded-2xl bg-gray-100 sm:w-28 shrink-0"
                      >
                        <img
                          src={product.prodImage}
                          alt={product.name}
                          className="h-full w-full object-cover transition duration-300 hover:scale-[1.03]"
                        />
                      </Link>

                      <div className="flex flex-1 flex-col justify-between gap-3">
                        <div>
                          <Link
                            href={`/products/${product.slug}`}
                            className="text-base sm:text-lg font-semibold text-black hover:underline"
                          >
                            {product.name}
                          </Link>

                          <div className="mt-3 flex flex-wrap gap-2 text-xs sm:text-sm text-gray-600">
                            {item.productvariant.size ? (
                              <span className="rounded-full bg-gray-100 px-3 py-1.5">
                                Size: {item.productvariant.size}
                              </span>
                            ) : null}

                            <span className="rounded-full bg-gray-100 px-3 py-1.5">
                              Qty: {item.quantity}
                            </span>

                            <span className="rounded-full bg-gray-100 px-3 py-1.5">
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
            <div className="sticky top-28 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 p-5 sm:p-6">
                <h2 className="text-xl font-semibold text-black">Payment Details</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Final payable amount
                </p>
              </div>

              <div className="p-5 sm:p-6">
                <div className="rounded-2xl bg-gray-50 p-4">
                  <div className="flex items-center justify-between py-2 text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-black">{formatPrice(subtotal)}</span>
                  </div>

                  <div className="flex items-center justify-between py-2 text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span
                      className={`font-medium ${
                        shipping === 0 ? "text-green-600" : "text-black"
                      }`}
                    >
                      {shipping === 0 ? "Free" : formatPrice(shipping)}
                    </span>
                  </div>

                  <div className="mt-2 border-t border-dashed border-gray-200 pt-4 flex items-center justify-between">
                    <span className="text-base font-semibold text-black">Total</span>
                    <span className="text-2xl font-bold tracking-tight text-black">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  {hasAddress ? (
                    <>
                      <PayButton addressId={selectedAddress.id} total={total} />
                      <p className="text-center text-xs leading-5 text-gray-500">
                        Your total is calculated securely on the server before payment.
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-4 text-center">
                        <p className="text-sm text-gray-600">
                          Add a delivery address before proceeding to payment.
                        </p>
                      </div>

                      <Link
                        href="/address"
                        className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-black text-sm font-medium text-white transition hover:bg-gray-900"
                      >
                        Add Address
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}