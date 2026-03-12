import Button from "@/components/Button";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import Link from "next/link";
import deleteIcon from "@/assets/icons/delete.png";
import { deleteCartItem } from "@/actions/action.cart";

export default async function Cart() {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;

  const cartItems = await prisma.cart.findMany({
    where: {
      userId,
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
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const TotalCartItems = await prisma.cart.aggregate({
    where: {
      userId,
    },
    _sum: {
      quantity: true,
    },
  });

  const Subtotal = cartItems.reduce((sum, item) => {
    return sum + item.productvariant.product.price.toNumber() * item.quantity;
  }, 0);

  const DisplaySubtotal = Subtotal.toLocaleString();

  if (!session) {
    return (
      <main className="max-w-6xl mx-auto px-6 pb-12 pt-40">
        <section className="rounded-3xl border border-gray-200 bg-white px-6 py-14 shadow-sm">
          <div className="mx-auto flex max-w-lg flex-col items-center text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl">
              🛒
            </div>

            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900">
              Your Cart
            </h1>

            <p className="mt-3 text-sm sm:text-base text-gray-500 leading-7">
              Please sign in to view and manage your cart.
            </p>

            <Link
              href="/signin"
              className="mt-7 inline-flex items-center justify-center rounded-2xl bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-900"
            >
              Sign in
            </Link>
          </div>
        </section>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="max-w-6xl mx-auto px-6 pb-12 pt-40">
        <section className="rounded-3xl border border-gray-200 bg-white px-6 py-14 shadow-sm">
          <div className="mx-auto flex max-w-lg flex-col items-center text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl">
              📦
            </div>

            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900">
              Your Cart
            </h1>

            <p className="mt-3 text-sm sm:text-base text-gray-500 leading-7">
              Your cart is empty. Explore products and add your favorites.
            </p>

            <Link
              href="/products"
              className="mt-7 inline-flex items-center justify-center rounded-2xl bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-900"
            >
              Browse Products
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-6 pb-12 pt-40">
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900">
            Your Cart
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {TotalCartItems._sum.quantity} items in your bag
          </p>
        </div>

        <Link
          href="/products"
          className="text-sm font-medium text-gray-700 underline underline-offset-4 hover:text-black"
        >
          Continue shopping
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-start">
        <section className="lg:col-span-2 space-y-5">
          {cartItems.map((cartItem) => {
            const rawPrice = cartItem.productvariant.product.price.toNumber();
            const DisplayPrice = rawPrice.toLocaleString();

            return (
              <div
                key={cartItem.id}
                className="group rounded-3xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
                  <Link
                    href={`/products/${cartItem.productvariant.product.slug}`}
                    className="shrink-0 overflow-hidden rounded-2xl bg-gray-50"
                  >
                    <img
                      src={cartItem.productvariant.product.prodImage}
                      alt={cartItem.productvariant.product.name}
                      className="h-44 w-full object-cover transition duration-300 group-hover:scale-[1.03] sm:h-28 sm:w-28"
                    />
                  </Link>

                  <Link
                    href={`/products/${cartItem.productvariant.product.slug}`}
                    className="min-w-0 flex-1"
                  >
                    <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-gray-400">
                      {cartItem.productvariant.product.category.name}
                    </p>

                    <h2 className="line-clamp-2 text-base font-semibold text-gray-900 sm:text-lg">
                      {cartItem.productvariant.product.name}
                    </h2>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                        Size: {cartItem.productvariant.size}
                      </span>
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                        Stock: {cartItem.productvariant.stockQuantity}
                      </span>
                    </div>

                    <p className="mt-4 text-lg font-semibold text-gray-900">
                      ₹{DisplayPrice}
                    </p>
                  </Link>

                  <div className="flex items-center justify-between gap-3 sm:ml-auto sm:flex-col sm:items-end sm:justify-center sm:gap-6">
                    <form action={deleteCartItem}>
                      <input type="hidden" name="cartId" value={cartItem.id} />

                      <button
                        type="submit"
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white transition hover:bg-gray-50"
                      >
                        <img
                          src={deleteIcon.src}
                          alt="delete item"
                          className="w-5"
                        />
                      </button>
                    </form>

                    <div>
                      <Button
                        isCart={true}
                        disabled={false}
                        initialquantity={cartItem.quantity}
                        productvariantId={cartItem.productvariant.id}
                        max={cartItem.productvariant.stockQuantity}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        <aside className="sticky top-28 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
          <p className="mt-1 text-sm text-gray-500">
            Review your order before checkout
          </p>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span className="font-medium text-gray-900">₹{DisplaySubtotal}</span>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Shipping</span>
              <span className="font-medium text-green-600">Free</span>
            </div>

            <div className="border-t border-dashed pt-4">
              <div className="flex items-center justify-between text-base font-semibold text-gray-900">
                <span>Total</span>
                <span>₹{DisplaySubtotal}</span>
              </div>
            </div>
          </div>

          <Link
            href="/checkout"
            className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-black py-3 text-sm font-medium text-white transition hover:bg-gray-900"
          >
            Proceed to Checkout
          </Link>

          <p className="mt-3 text-center text-xs text-gray-400">
            Taxes and discounts will be calculated at checkout
          </p>
        </aside>
      </div>
    </main>
  );
}