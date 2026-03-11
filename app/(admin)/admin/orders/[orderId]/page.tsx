import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import leftArrow from "@/assets/icons/left-arrow.png";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";
import PaymentStatusSelect from "@/components/admin/PaymentStatusSelect";
import DeleteOrderButton from "@/components/admin/DeleteOrderButton";
import { OrderStatus, PaymentStatus } from "@/app/generated/prisma/enums";

function getPaymentBadgeClasses(status: PaymentStatus) {
  switch (status) {
    case "PAID":
      return "bg-green-50 text-green-700 ring-1 ring-green-200";
    case "FAILED":
      return "bg-red-50 text-red-700 ring-1 ring-red-200";
    case "CANCELLED":
      return "bg-gray-100 text-gray-700 ring-1 ring-gray-200";
    case "PENDING_PAYMENT":
    default:
      return "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200";
  }
}

function getOrderBadgeClasses(status: OrderStatus) {
  switch (status) {
    case "Delivered":
      return "bg-green-50 text-green-700 ring-1 ring-green-200";
    case "Out_of_delivery":
      return "bg-blue-50 text-blue-700 ring-1 ring-blue-200";
    case "In_Transit":
      return "bg-purple-50 text-purple-700 ring-1 ring-purple-200";
    case "Order_Received":
    default:
      return "bg-gray-100 text-gray-700 ring-1 ring-gray-200";
  }
}

function formatOrderStatus(status: OrderStatus) {
  if (status === "Out_of_delivery") return "Out for delivery";
  if (status === "Order_Received") return "Order received";
  if (status === "In_Transit") return "In transit";
  return status;
}

function formatPaymentStatus(status: PaymentStatus) {
  if (status === "PENDING_PAYMENT") return "Pending";
  return status.charAt(0) + status.slice(1).toLowerCase();
}

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "Admin") {
    redirect("/");
  }

  const { orderId } = await params;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          DisplayName: true,
        },
      },
      address: true,
      items: true,
    },
  });

  if (!order) {
    notFound();
  }

  const productIds = order.items.map((item) => item.productId);
  const variantIds = order.items.map((item) => item.variantId);

  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds },
    },
    select: {
      id: true,
      name: true,
      prodImage: true,
      slug: true,
    },
  });

  const variants = await prisma.productVariant.findMany({
    where: {
      id: { in: variantIds },
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

  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main className="min-h-screen bg-[#f6f7fb] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-2 rounded-2xl border border-black/5 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              <Image
                src={leftArrow}
                alt="Back"
                width={16}
                height={16}
                className="object-contain"
              />
              Back to orders
            </Link>

            <div className="mt-4">
              <p className="text-sm text-gray-500">Order details</p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                #{order.id.slice(0, 8)}
              </h1>
              <p className="mt-2 text-sm text-gray-500 break-all">
                Full Order ID: {order.id}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${getPaymentBadgeClasses(
                order.status
              )}`}
            >
              {formatPaymentStatus(order.status)}
            </span>

            <span
              className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${getOrderBadgeClasses(
                order.orderStatus
              )}`}
            >
              {formatOrderStatus(order.orderStatus)}
            </span>

            <DeleteOrderButton orderId={order.id} />
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
          <section className="space-y-6">
            <div className="rounded-[28px] border border-black/5 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Ordered Items</h2>
                  <p className="text-sm text-gray-500">
                    {totalItems} item{totalItems > 1 ? "s" : ""} in this order
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {enrichedItems.map((item) => {
                  const itemTotal = Number(item.priceAtPurchase) * item.quantity;

                  return (
                    <div
                      key={item.id}
                      className="flex flex-col gap-4 rounded-[24px] border border-black/5 p-4 sm:flex-row sm:items-center"
                    >
                      <div className="h-24 w-24 overflow-hidden rounded-2xl bg-gray-100">
                        <img
                          src={item.product?.prodImage || "/placeholder.png"}
                          alt={item.product?.name || "Product"}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-lg font-semibold text-gray-900">
                              {item.product?.name || "Deleted Product"}
                            </p>

                            {item.product?.slug && (
                              <Link
                                href={`/products/${item.product.slug}`}
                                target="_blank"
                                className="mt-1 inline-block text-sm text-blue-600 hover:underline"
                              >
                                Open product page
                              </Link>
                            )}
                          </div>

                          <div className="text-left sm:text-right">
                            <p className="text-lg font-semibold text-gray-900">
                              ₹{itemTotal.toLocaleString("en-IN")}
                            </p>
                            <p className="text-sm text-gray-500">
                              ₹{Number(item.priceAtPurchase).toLocaleString("en-IN")} ×{" "}
                              {item.quantity}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                            Qty: {item.quantity}
                          </span>
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                            Size: {item.variant?.size || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-[28px] border border-black/5 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Update Status</h2>

              <div className="mt-5 space-y-5">
                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
                    Payment Status
                  </p>
                  <PaymentStatusSelect
                    orderId={order.id}
                    currentStatus={order.status}
                  />
                </div>

                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
                    Delivery Status
                  </p>
                  <OrderStatusSelect
                    orderId={order.id}
                    currentStatus={order.orderStatus}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-black/5 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Pricing</h2>

              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium text-gray-900">
                    ₹{Number(order.subtotal).toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-medium text-gray-900">
                    ₹{Number(order.shipping).toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Items</span>
                  <span className="font-medium text-gray-900">{totalItems}</span>
                </div>

                <div className="border-t border-dashed border-black/10 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold text-gray-900">Total</span>
                    <span className="text-xl font-semibold text-gray-900">
                      ₹{Number(order.total).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-black/5 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Customer</h2>

              <div className="mt-5 space-y-3 text-sm">
                <div>
                  <p className="text-gray-400">Name</p>
                  <p className="mt-1 font-medium text-gray-900">
                    {order.address.fullName || order.user.DisplayName || "User"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400">Email</p>
                  <p className="mt-1 break-all font-medium text-gray-900">
                    {order.user.email}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400">Phone</p>
                  <p className="mt-1 font-medium text-gray-900">
                    {order.address.phoneNumber}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-black/5 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Shipping Address</h2>

              <div className="mt-5 space-y-2 text-sm text-gray-700">
                <p>{order.address.AddressLine1}</p>
                {order.address.AddressLine2 ? <p>{order.address.AddressLine2}</p> : null}
                <p>
                  {order.address.City}, {order.address.State} - {order.address.pincode}
                </p>
                <p>{order.address.Country}</p>
              </div>
            </div>

            <div className="rounded-[28px] border border-black/5 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Meta</h2>

              <div className="mt-5 space-y-3 text-sm">
                <div>
                  <p className="text-gray-400">Cashfree Order ID</p>
                  <p className="mt-1 break-all font-medium text-gray-900">
                    {order.cashfreeOrderId || "Not available"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400">Payment Session ID</p>
                  <p className="mt-1 break-all font-medium text-gray-900">
                    {order.paymentSessionId || "Not available"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400">Created At</p>
                  <p className="mt-1 font-medium text-gray-900">
                    {new Date(order.createdAt).toLocaleString("en-IN")}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400">Updated At</p>
                  <p className="mt-1 font-medium text-gray-900">
                    {new Date(order.updatedAt).toLocaleString("en-IN")}
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