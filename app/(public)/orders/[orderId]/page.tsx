import Link from "next/link";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import ArrowLeft from '@/assets/icons/left-arrow.png'

function getStatusStyles(status: string) {
  switch (status) {
    case "PAID":
      return "bg-green-100 text-green-700 border-green-200";
    case "PENDING_PAYMENT":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "FAILED":
      return "bg-red-100 text-red-700 border-red-200";
    case "CANCELLED":
      return "bg-gray-100 text-gray-700 border-gray-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
}

function formatPrice(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/signin");
  }

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId,
    },
    include: {
      address: true,
      items: true,
    },
  });

  if (!order) {
    notFound();
  }

  const productIds = [...new Set(order.items.map((item) => item.productId))];
  const variantIds = [...new Set(order.items.map((item) => item.variantId))];

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
    select: {
      id: true,
      name: true,
      slug: true,
      prodImage: true,
    },
  });

  const variants = await prisma.productVariant.findMany({
    where: {
      id: {
        in: variantIds,
      },
    },
    select: {
      id: true,
      size: true,
    },
  });

  const productMap = new Map(products.map((product) => [product.id, product]));
  const variantMap = new Map(variants.map((variant) => [variant.id, variant]));

  const enrichedItems = order.items.map((item) => ({
    ...item,
    product: productMap.get(item.productId),
    variant: variantMap.get(item.variantId),
  }));

  return (
    <main className="max-w-6xl mx-auto px-6 pb-10 pt-45">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Link
            href="/orders"
            className="inline-flex items-center text-sm text-gray-600 hover:text-black transition"
          >
            <img src={ArrowLeft.src} alt="Back" className="w-3" /> Back to Cart
          </Link>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold text-gray-900">
              Order #{order.id.slice(0, 8).toUpperCase()}
            </h1>

            <span
              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${getStatusStyles(
                order.status
              )}`}
            >
              {order.status.replaceAll("_", " ")}
            </span>
          </div>

          <p className="mt-2 text-gray-600">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <section className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-5">
              Ordered Items
            </h2>

            <div className="space-y-5">
              {enrichedItems.map((item) => {
                const product = item.product;
                const variant = item.variant;
                const itemTotal =
                  Number(item.priceAtPurchase) * Number(item.quantity);

                return (
                  <div
                    key={item.id}
                    className="flex flex-col gap-4 border-b pb-5 last:border-b-0 last:pb-0 sm:flex-row"
                  >
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100 border">
                      {product?.prodImage ? (
                        <img
                          src={product.prodImage}
                          alt={product.name ?? "Product image"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-gray-500">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {product?.name ?? "Product"}
                          </h3>

                          <div className="mt-2 space-y-1 text-sm text-gray-600">
                            <p>Size: {variant?.size ?? "N/A"}</p>
                            <p>Quantity: {item.quantity}</p>
                            <p>
                              Price per item:{" "}
                              {formatPrice(Number(item.priceAtPurchase))}
                            </p>
                          </div>

                          {product?.slug && (
                            <Link
                              href={`/products/${product.slug}`}
                              className="mt-3 inline-block text-sm font-medium text-black hover:underline"
                            >
                              View product
                            </Link>
                          )}
                        </div>

                        <div className="text-left sm:text-right">
                          <p className="text-sm text-gray-500">Item Total</p>
                          <p className="mt-1 text-lg font-semibold text-gray-900">
                            {formatPrice(itemTotal)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(Number(order.subtotal))}</span>
              </div>

              <div className="flex items-center justify-between text-gray-600">
                <span>Shipping</span>
                <span>{formatPrice(Number(order.shipping))}</span>
              </div>

              <div className="border-t pt-3 flex items-center justify-between text-base font-semibold text-gray-900">
                <span>Total</span>
                <span>{formatPrice(Number(order.total))}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Delivery Address
            </h2>

            <div className="space-y-1 text-sm text-gray-600">
              <p className="font-medium text-gray-900">{order.address.fullName}</p>
              <p>{order.address.AddressLine1}</p>
              {order.address.AddressLine2 && <p>{order.address.AddressLine2}</p>}
              <p>
                {order.address.City}, {order.address.State}
              </p>
              <p>{order.address.Country}</p>
              <p>{order.address.pincode}</p>
              <p className="pt-2">Phone: {order.address.phoneNumber}</p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}