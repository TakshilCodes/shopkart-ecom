import Link from "next/link";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import ArrowLeft from "@/assets/icons/left-arrow.png";

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
    <main className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 pt-40">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Link
              href="/orders"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-black"
            >
              <img src={ArrowLeft.src} alt="Back" className="w-3" />
              Back to Orders
            </Link>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900">
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

            <p className="mt-2 text-sm sm:text-base text-gray-600">
              Placed on{" "}
              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          <div className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 shadow-sm">
            {enrichedItems.length} product{enrichedItems.length > 1 ? "s" : ""}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <section className="lg:col-span-2 space-y-6">
            <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 p-5 sm:p-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Ordered Items
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Review the items included in this order.
                </p>
              </div>

              <div className="p-5 sm:p-6 space-y-5">
                {enrichedItems.map((item) => {
                  const product = item.product;
                  const variant = item.variant;
                  const itemTotal =
                    Number(item.priceAtPurchase) * Number(item.quantity);

                  return (
                    <div
                      key={item.id}
                      className="flex flex-col gap-4 rounded-2xl border border-gray-100 p-4 transition hover:border-gray-200 hover:bg-gray-50/60 sm:flex-row"
                    >
                      <div className="h-24 w-full sm:w-24 shrink-0 overflow-hidden rounded-2xl bg-gray-100 border border-gray-200">
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
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {product?.name ?? "Product"}
                            </h3>

                            <div className="mt-3 flex flex-wrap gap-2 text-xs sm:text-sm text-gray-600">
                              <span className="rounded-full bg-gray-100 px-3 py-1.5">
                                Size: {variant?.size ?? "N/A"}
                              </span>
                              <span className="rounded-full bg-gray-100 px-3 py-1.5">
                                Quantity: {item.quantity}
                              </span>
                              <span className="rounded-full bg-gray-100 px-3 py-1.5">
                                Price: {formatPrice(Number(item.priceAtPurchase))}
                              </span>
                            </div>

                            {product?.slug && (
                              <Link
                                href={`/products/${product.slug}`}
                                className="mt-4 inline-block text-sm font-medium text-black underline-offset-4 hover:underline"
                              >
                                View product
                              </Link>
                            )}
                          </div>

                          <div className="shrink-0 rounded-2xl bg-gray-50 px-4 py-3 text-left sm:min-w-[140px] sm:text-right">
                            <p className="text-xs uppercase tracking-wide text-gray-400">
                              Item Total
                            </p>
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
            <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 p-5 sm:p-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Order Summary
                </h2>
              </div>

              <div className="p-5 sm:p-6">
                <div className="rounded-2xl bg-gray-50 p-4">
                  <div className="flex items-center justify-between py-2 text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-900">
                      {formatPrice(Number(order.subtotal))}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2 text-sm text-gray-600">
                    <span>Shipping</span>
                    <span className="font-medium text-gray-900">
                      {formatPrice(Number(order.shipping))}
                    </span>
                  </div>

                  <div className="mt-2 border-t border-dashed border-gray-200 pt-4 flex items-center justify-between">
                    <span className="text-base font-semibold text-gray-900">
                      Total
                    </span>
                    <span className="text-2xl font-bold tracking-tight text-gray-900">
                      {formatPrice(Number(order.total))}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 p-5 sm:p-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Delivery Address
                </h2>
              </div>

              <div className="p-5 sm:p-6">
                <div className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-600 space-y-1 leading-6">
                  <p className="font-semibold text-gray-900">
                    {order.address.fullName}
                  </p>
                  <p>{order.address.AddressLine1}</p>
                  {order.address.AddressLine2 && <p>{order.address.AddressLine2}</p>}
                  <p>
                    {order.address.City}, {order.address.State}
                  </p>
                  <p>{order.address.Country}</p>
                  <p>{order.address.pincode}</p>
                  <p className="pt-2">
                    <span className="font-medium text-gray-900">Phone:</span>{" "}
                    {order.address.phoneNumber}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}