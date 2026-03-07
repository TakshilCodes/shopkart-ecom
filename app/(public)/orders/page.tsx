import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

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

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/signin");
  }

  const orders = await prisma.order.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      address: true,
      items: true,
    },
  });

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">My Orders</h1>
        <p className="mt-2 text-gray-600">
          Track your orders and view purchased items.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="border rounded-2xl bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <svg
              className="w-8 h-8 text-gray-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.2 6.2A1 1 0 006.8 20h10.4a1 1 0 001-.8L19 13M9 20a1 1 0 100 2 1 1 0 000-2zm8 0a1 1 0 100 2 1 1 0 000-2z"
              />
            </svg>
          </div>

          <h2 className="text-xl font-semibold text-gray-900">
            No orders yet
          </h2>
          <p className="mt-2 text-gray-600">
            You haven’t placed any orders yet.
          </p>

          <Link
            href="/products"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-black px-6 text-sm font-medium text-white transition hover:bg-gray-900"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => {
            const totalItems = order.items.reduce(
              (sum, item) => sum + item.quantity,
              0
            );

            return (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="block rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md hover:border-gray-300"
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-lg font-semibold text-gray-900">
                        Order #{order.id.slice(0, 8).toUpperCase()}
                      </h2>

                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${getStatusStyles(
                          order.status
                        )}`}
                      >
                        {order.status.replaceAll("_", " ")}
                      </span>
                    </div>

                    <div className="grid gap-2 text-sm text-gray-600 sm:grid-cols-2">
                      <p>
                        <span className="font-medium text-gray-900">Date:</span>{" "}
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>

                      <p>
                        <span className="font-medium text-gray-900">Items:</span>{" "}
                        {totalItems}
                      </p>

                      <p>
                        <span className="font-medium text-gray-900">City:</span>{" "}
                        {order.address.City}
                      </p>

                      <p>
                        <span className="font-medium text-gray-900">State:</span>{" "}
                        {order.address.State}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 text-left md:text-right">
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">
                      {formatPrice(Number(order.total))}
                    </p>

                    <p className="mt-3 text-sm font-medium text-black">
                      View details →
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}