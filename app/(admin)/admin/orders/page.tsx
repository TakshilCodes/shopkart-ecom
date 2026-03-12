import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import OrdersFilters from "@/components/admin/OrdersFilters";
import DeleteOrderButton from "@/components/admin/DeleteOrderButton";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";
import PaymentStatusSelect from "@/components/admin/PaymentStatusSelect";
import { OrderStatus, PaymentStatus } from "@/app/generated/prisma";
import { Prisma } from "@/app/generated/prisma/client";

type SearchParams = Promise<{
    search?: string;
    orderStatus?: OrderStatus | "ALL";
    paymentStatus?: PaymentStatus | "ALL";
    sort?: "newest" | "oldest" | "price_high" | "price_low" | "items_high" | "items_low";
    minPrice?: string;
    maxPrice?: string;
    items?: "less" | "more" | "all";
}>;

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

export default async function AdminOrdersPage({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "Admin") {
        redirect("/");
    }

    const params = await searchParams;

    const search = params.search?.trim() || "";
    const orderStatus = params.orderStatus || "ALL";
    const paymentStatus = params.paymentStatus || "ALL";
    const sort = params.sort || "newest";
    const minPrice = params.minPrice ? Number(params.minPrice) : undefined;
    const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined;
    const itemsFilter = params.items || "all";

    const where: Prisma.OrderWhereInput = {
        AND: [
            search
                ? {
                    OR: [
                        { id: { contains: search, mode: "insensitive" } },
                        { cashfreeOrderId: { contains: search, mode: "insensitive" } },
                        { user: { email: { contains: search, mode: "insensitive" } } },
                        { user: { DisplayName: { contains: search, mode: "insensitive" } } },
                        { address: { fullName: { contains: search, mode: "insensitive" } } },
                        { address: { phoneNumber: { contains: search, mode: "insensitive" } } },
                    ],
                }
                : {},
            orderStatus !== "ALL" ? { orderStatus } : {},
            paymentStatus !== "ALL" ? { status: paymentStatus } : {},
            minPrice !== undefined ? { total: { gte: minPrice } } : {},
            maxPrice !== undefined ? { total: { lte: maxPrice } } : {},
        ],
    };

    let orderBy: Prisma.OrderOrderByWithRelationInput = { createdAt: "desc" };

    if (sort === "oldest") orderBy = { createdAt: "asc" };
    if (sort === "price_high") orderBy = { total: "desc" };
    if (sort === "price_low") orderBy = { total: "asc" };

    const orders = await prisma.order.findMany({
        where,
        orderBy,
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    DisplayName: true,
                },
            },
            address: {
                select: {
                    id: true,
                    fullName: true,
                    phoneNumber: true,
                    City: true,
                    State: true,
                    pincode: true,
                },
            },
            items: {
                select: {
                    id: true,
                    quantity: true,
                    priceAtPurchase: true,
                },
            },
        },
    });

    let filteredOrders = orders.map((order) => {
        const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
        return {
            ...order,
            totalItems,
        };
    });

    if (itemsFilter === "less") {
        filteredOrders = filteredOrders.filter((order) => order.totalItems <= 2);
    }

    if (itemsFilter === "more") {
        filteredOrders = filteredOrders.filter((order) => order.totalItems > 2);
    }

    if (sort === "items_high") {
        filteredOrders = [...filteredOrders].sort((a, b) => b.totalItems - a.totalItems);
    }

    if (sort === "items_low") {
        filteredOrders = [...filteredOrders].sort((a, b) => a.totalItems - b.totalItems);
    }

    const totalRevenue = filteredOrders.reduce(
        (sum, order) => sum + Number(order.total),
        0
    );
    const paidCount = filteredOrders.filter((order) => order.status === "PAID").length;
    const deliveredCount = filteredOrders.filter(
        (order) => order.orderStatus === "Delivered"
    ).length;

    return (
        <main className="min-h-screen bg-[#f6f7fb] px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-6 rounded-[28px] bg-linear-to-r from-black to-neutral-800 px-6 py-7 text-white shadow-sm">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-sm text-white/70">Admin Panel</p>
                            <h1 className="mt-1 text-3xl font-semibold tracking-tight">Orders</h1>
                            <p className="mt-2 text-sm text-white/70">
                                Manage orders, payment status, delivery status, search, filter and cleanup.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                            <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm">
                                <p className="text-xs text-white/70">Orders</p>
                                <p className="mt-1 text-xl font-semibold">{filteredOrders.length}</p>
                            </div>
                            <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm">
                                <p className="text-xs text-white/70">Revenue</p>
                                <p className="mt-1 text-xl font-semibold">
                                    ₹{totalRevenue.toLocaleString("en-IN")}
                                </p>
                            </div>
                            <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm">
                                <p className="text-xs text-white/70">Paid</p>
                                <p className="mt-1 text-xl font-semibold">{paidCount}</p>
                            </div>
                            <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm">
                                <p className="text-xs text-white/70">Delivered</p>
                                <p className="mt-1 text-xl font-semibold">{deliveredCount}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-6 rounded-[28px] border border-black/5 bg-white p-4 shadow-sm">
                    <OrdersFilters />
                </div>

                <section className="overflow-hidden rounded-[28px] border border-black/5 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-black/5 px-5 py-4">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">All Orders</h2>
                            <p className="text-sm text-gray-500">
                                Click any order to open full details.
                            </p>
                        </div>
                    </div>

                    {filteredOrders.length === 0 ? (
                        <div className="px-6 py-20 text-center">
                            <div className="mx-auto max-w-md">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl">
                                    📦
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900">No orders found</h3>
                                <p className="mt-2 text-sm text-gray-500">
                                    Try changing filters, search text, item count or price range.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="hidden xl:block">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full">
                                        <thead className="bg-gray-50">
                                            <tr className="text-left text-sm text-gray-500">
                                                <th className="px-5 py-4 font-medium">Order</th>
                                                <th className="px-5 py-4 font-medium">Customer</th>
                                                <th className="px-5 py-4 font-medium">Items</th>
                                                <th className="px-5 py-4 font-medium">Amount</th>
                                                <th className="px-5 py-4 font-medium">Payment</th>
                                                <th className="px-5 py-4 font-medium">Delivery</th>
                                                <th className="px-5 py-4 font-medium">Created</th>
                                                <th className="px-5 py-4 font-medium">Actions</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {filteredOrders.map((order) => (
                                                <tr
                                                    key={order.id}
                                                    className="border-t border-black/5 align-top transition hover:bg-gray-50/70"
                                                >
                                                    <td className="px-5 py-5">
                                                        <Link
                                                            href={`/admin/orders/${order.id}`}
                                                            className="group inline-block"
                                                        >
                                                            <p className="font-semibold text-gray-900 group-hover:text-blue-600">
                                                                #{order.id.slice(0, 8)}
                                                            </p>
                                                            <p className="mt-1 text-xs text-gray-500">
                                                                {order.cashfreeOrderId || "No Cashfree order id"}
                                                            </p>
                                                        </Link>
                                                    </td>

                                                    <td className="px-5 py-5">
                                                        <p className="font-medium text-gray-900">
                                                            {order.user.DisplayName || order.address.fullName || "User"}
                                                        </p>
                                                        <p className="mt-1 text-sm text-gray-500">{order.user.email}</p>
                                                        <p className="mt-1 text-xs text-gray-400">
                                                            {order.address.City}, {order.address.State}
                                                        </p>
                                                    </td>

                                                    <td className="px-5 py-5">
                                                        <div className="inline-flex min-w-17.5 items-center justify-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                                                            {order.totalItems}
                                                        </div>
                                                    </td>

                                                    <td className="px-5 py-5">
                                                        <p className="font-semibold text-gray-900">
                                                            ₹{Number(order.total).toLocaleString("en-IN")}
                                                        </p>
                                                        <p className="mt-1 text-xs text-gray-500">
                                                            Subtotal ₹{Number(order.subtotal).toLocaleString("en-IN")}
                                                        </p>
                                                    </td>

                                                    <td className="px-5 py-5">
                                                        <div className="mb-3">
                                                        </div>
                                                        <PaymentStatusSelect
                                                            orderId={order.id}
                                                            currentStatus={order.status}
                                                        />
                                                    </td>

                                                    <td className="px-5 py-5">
                                                        <div className="mb-3">
                                                        </div>
                                                        <OrderStatusSelect
                                                            orderId={order.id}
                                                            currentStatus={order.orderStatus}
                                                        />
                                                    </td>

                                                    <td className="px-5 py-5">
                                                        <p className="text-sm font-medium text-gray-800">
                                                            {new Date(order.createdAt).toLocaleDateString("en-IN")}
                                                        </p>
                                                        <p className="mt-1 text-xs text-gray-500">
                                                            {new Date(order.createdAt).toLocaleTimeString("en-IN", {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            })}
                                                        </p>
                                                    </td>

                                                    <td className="px-5 py-5">
                                                        <div className="flex items-center gap-4 text-sm">

                                                            <Link
                                                                href={`/admin/orders/${order.id}`}
                                                                className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
                                                            >
                                                                View
                                                            </Link>

                                                            <span className="text-gray-300">|</span>

                                                            <DeleteOrderButton orderId={order.id} />

                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="grid gap-4 p-4 xl:hidden">
                                {filteredOrders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="rounded-3xl border border-black/5 bg-white p-4 shadow-sm"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <Link
                                                    href={`/admin/orders/${order.id}`}
                                                    className="text-lg font-semibold text-gray-900 hover:text-blue-600"
                                                >
                                                    #{order.id.slice(0, 8)}
                                                </Link>
                                                <p className="mt-1 text-sm text-gray-500">
                                                    {order.user.DisplayName || order.address.fullName || "User"}
                                                </p>
                                                <p className="text-sm text-gray-500">{order.user.email}</p>
                                            </div>

                                            <div className="text-right">
                                                <p className="text-lg font-semibold text-gray-900">
                                                    ₹{Number(order.total).toLocaleString("en-IN")}
                                                </p>
                                                <p className="text-xs text-gray-500">{order.totalItems} items</p>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex flex-wrap gap-2">
                                            <span
                                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getPaymentBadgeClasses(
                                                    order.status
                                                )}`}
                                            >
                                                {formatPaymentStatus(order.status)}
                                            </span>

                                            <span
                                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getOrderBadgeClasses(
                                                    order.orderStatus
                                                )}`}
                                            >
                                                {formatOrderStatus(order.orderStatus)}
                                            </span>
                                        </div>

                                        <div className="mt-4 grid gap-4 lg:grid-cols-2">
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

                                        <div className="mt-5 flex items-center justify-between gap-3">
                                            <p className="text-sm text-gray-500">
                                                {new Date(order.createdAt).toLocaleDateString("en-IN")}
                                            </p>

                                            <div className="flex items-center gap-4">
                                                <Link
                                                    href={`/admin/orders/${order.id}`}
                                                    className="text-sm font-medium text-blue-600 hover:underline"
                                                >
                                                    View
                                                </Link>
                                                <DeleteOrderButton orderId={order.id} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </section>
            </div>
        </main>
    );
}