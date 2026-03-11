"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import RevenueDoughnutChart from "@/components/charts/RevenueDoughnutChart";
import axios from "axios";

type DashboardStats = {
    totalOrders: number;
    totalProducts: number;
    totalUsers: number;
    totalRevenue: number | string;
    pendingOrders: number;
    outOfStockProducts: number;
};

type RecentOrder = {
    id: string;
    total: number | string;
    status: "PENDING_PAYMENT" | "PAID" | "FAILED" | "CANCELLED";
    createdAt: string;
    customerName: string | null;
    customerEmail: string;
    itemCount: number;
};

type RecentProduct = {
    id: string;
    name: string;
    prodImage: string;
    price: number | string;
    isPublished: boolean;
    category: {
        name: string;
    };
};

type LowStockVariant = {
    size: string;
    stockQuantity: number;
};

type LowStockProduct = {
    id: string;
    name: string;
    prodImage: string;
    category: {
        name: string;
    };
    productvariant: LowStockVariant[];
};

type RevenueSummary = {
    paid: number;
    pending: number;
    failed: number;
    cancelled: number;
};

type DashboardResponse = {
    ok: boolean;
    stats: DashboardStats;
    revenueSummary: RevenueSummary;
    recentOrders: RecentOrder[];
    recentProducts: RecentProduct[];
    lowStockProducts: LowStockProduct[];
    error: string | null;
};

function formatCurrency(value: number | string | null | undefined) {
    const amount = Number(value ?? 0);
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(amount);
}

function formatDate(value: string) {
    return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(value));
}

function getOrderStatusBadge(status: RecentOrder["status"]) {
    switch (status) {
        case "PAID":
            return "bg-emerald-100 text-emerald-700";
        case "PENDING_PAYMENT":
            return "bg-amber-100 text-amber-700";
        case "FAILED":
            return "bg-red-100 text-red-700";
        case "CANCELLED":
            return "bg-zinc-200 text-zinc-700";
        default:
            return "bg-zinc-100 text-zinc-700";
    }
}

function getOrderStatusLabel(status: RecentOrder["status"]) {
    switch (status) {
        case "PENDING_PAYMENT":
            return "Pending";
        case "PAID":
            return "Paid";
        case "FAILED":
            return "Failed";
        case "CANCELLED":
            return "Cancelled";
        default:
            return status;
    }
}

export default function AdminDashboard() {
    const router = useRouter();
    const { data: session, status } = useSession();

    const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
    const [dashboardLoading, setDashboardLoading] = useState(true);
    const [dashboardError, setDashboardError] = useState<string | null>(null);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.replace("/admin/signin");
            return;
        }

        if (status === "authenticated" && session?.user.role !== "Admin") {
            router.replace("/");
        }
    }, [status, session, router]);

    useEffect(() => {
        async function loadDashboard() {
            if (status !== "authenticated" || session?.user.role !== "Admin") return;

            try {
                setDashboardLoading(true);
                setDashboardError(null);

                const res = await axios.get('/api/admin/dashboard', {
                    headers: {
                        'Cache-Control': 'no-store'
                    }
                })

                const data: DashboardResponse = await res.data;

                if (!res.data.ok || !data.ok) {
                    throw new Error(data.error || "Failed to load dashboard");
                }

                setDashboard(data);
            } catch (error) {
                setDashboardError(
                    error instanceof Error ? error.message : "Failed to load dashboard"
                );
            } finally {
                setDashboardLoading(false);
            }
        }

        loadDashboard();
    }, [status, session]);

    const adminName = useMemo(() => {
        return session?.user?.name || "Admin";
    }, [session]);

    if (status === "loading") {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-50">
                <div className="rounded-2xl border border-zinc-200 bg-white px-6 py-4 text-sm font-medium text-zinc-600 shadow-sm">
                    Checking access...
                </div>
            </div>
        );
    }

    if (status === "unauthenticated" || session?.user.role !== "Admin") {
        return null;
    }

    if (dashboardLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-50">
                <div className="rounded-2xl border border-zinc-200 bg-white px-6 py-4 text-sm font-medium text-zinc-600 shadow-sm">
                    Loading dashboard...
                </div>
            </div>
        );
    }

    if (dashboardError || !dashboard) {
        return (
            <div className="min-h-screen bg-zinc-50 p-6 md:p-8">
                <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700 shadow-sm">
                    {dashboardError || "Failed to load dashboard"}
                </div>
            </div>
        );
    }

    const { stats, revenueSummary, recentOrders, recentProducts, lowStockProducts } = dashboard;

    return (
        <div className="min-h-screen bg-zinc-50 p-6 md:p-8">
            <div className="mb-8 flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
                    Dashboard
                </h1>
                <p className="text-sm text-zinc-500">
                    Welcome back, {adminName}. Here’s what’s happening in ShopKart today.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
                <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-zinc-500">Total Orders</p>
                    <h2 className="mt-3 text-3xl font-bold text-zinc-900">
                        {stats.totalOrders}
                    </h2>
                    <p className="mt-2 text-xs text-zinc-400">All-time orders</p>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-zinc-500">Total Products</p>
                    <h2 className="mt-3 text-3xl font-bold text-zinc-900">
                        {stats.totalProducts}
                    </h2>
                    <p className="mt-2 text-xs text-zinc-400">Products in store</p>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-zinc-500">Total Users</p>
                    <h2 className="mt-3 text-3xl font-bold text-zinc-900">
                        {stats.totalUsers}
                    </h2>
                    <p className="mt-2 text-xs text-zinc-400">Registered customers</p>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-zinc-500">Revenue</p>
                    <h2 className="mt-3 text-3xl font-bold text-zinc-900">
                        {formatCurrency(stats.totalRevenue)}
                    </h2>
                    <p className="mt-2 text-xs text-zinc-400">Paid orders only</p>
                </div>

                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
                    <p className="text-sm font-medium text-amber-700">Pending Orders</p>
                    <h2 className="mt-3 text-3xl font-bold text-zinc-900">
                        {stats.pendingOrders}
                    </h2>
                    <p className="mt-2 text-xs text-amber-700">Needs attention</p>
                </div>

                <div className="rounded-2xl border border-red-200 bg-red-50 p-5 shadow-sm">
                    <p className="text-sm font-medium text-red-700">Out of Stock</p>
                    <h2 className="mt-3 text-3xl font-bold text-zinc-900">
                        {stats.outOfStockProducts}
                    </h2>
                    <p className="mt-2 text-xs text-red-700">All variants unavailable</p>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
                <div className="xl:col-span-2 rounded-2xl border border-zinc-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
                        <div>
                            <h3 className="text-lg font-semibold text-zinc-900">Recent Orders</h3>
                            <p className="text-sm text-zinc-500">Latest customer purchases</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left">
                            <thead className="bg-zinc-50">
                                <tr className="text-sm text-zinc-500">
                                    <th className="px-5 py-3 font-medium">Order</th>
                                    <th className="px-5 py-3 font-medium">Customer</th>
                                    <th className="px-5 py-3 font-medium">Items</th>
                                    <th className="px-5 py-3 font-medium">Amount</th>
                                    <th className="px-5 py-3 font-medium">Payment</th>
                                    <th className="px-5 py-3 font-medium">Date</th>
                                </tr>
                            </thead>

                            <tbody>
                                {recentOrders.length > 0 ? (
                                    recentOrders.map((order) => (
                                        <tr key={order.id} className="border-t border-zinc-100 text-sm">
                                            <td className="px-5 py-4 font-medium text-zinc-900">
                                                #{order.id.slice(0, 8).toUpperCase()}
                                            </td>
                                            <td className="px-5 py-4 text-zinc-600">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-zinc-900">
                                                        {order.customerName || "Unknown User"}
                                                    </span>
                                                    <span className="text-xs text-zinc-500">
                                                        {order.customerEmail}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-zinc-700">{order.itemCount}</td>
                                            <td className="px-5 py-4 text-zinc-900">
                                                {formatCurrency(order.total)}
                                            </td>
                                            <td className="px-5 py-4">
                                                <span
                                                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${getOrderStatusBadge(
                                                        order.status
                                                    )}`}
                                                >
                                                    {getOrderStatusLabel(order.status)}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-zinc-600">
                                                {formatDate(order.createdAt)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-5 py-8 text-center text-sm text-zinc-500"
                                        >
                                            No recent orders found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-semibold text-zinc-900">Revenue Summary</h3>
                            <p className="text-sm text-zinc-500">
                                Revenue split by payment status
                            </p>
                        </div>

                        <div className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
                            Live overview
                        </div>
                    </div>

                    <div className="mt-6">
                        <RevenueDoughnutChart
                            paid={Number(revenueSummary.paid ?? 0)}
                            pending={Number(revenueSummary.pending ?? 0)}
                            failed={Number(revenueSummary.failed ?? 0)}
                            cancelled={Number(revenueSummary.cancelled ?? 0)}
                        />
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div className="rounded-xl bg-zinc-50 p-4">
                            <p className="text-sm text-zinc-500">Paid Revenue</p>
                            <p className="mt-1 text-2xl font-bold text-zinc-900">
                                {formatCurrency(revenueSummary.paid)}
                            </p>
                        </div>

                        <div className="rounded-xl bg-zinc-50 p-4">
                            <p className="text-sm text-zinc-500">Avg. Order Value</p>
                            <p className="mt-1 text-2xl font-bold text-zinc-900">
                                {stats.totalOrders > 0
                                    ? formatCurrency(Number(stats.totalRevenue) / stats.totalOrders)
                                    : formatCurrency(0)}
                            </p>
                        </div>

                        <div className="rounded-xl bg-zinc-50 p-4">
                            <p className="text-sm text-zinc-500">Pending Orders</p>
                            <p className="mt-1 text-2xl font-bold text-zinc-900">
                                {stats.pendingOrders}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
                <div className="xl:col-span-2 rounded-2xl border border-zinc-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
                        <div>
                            <h3 className="text-lg font-semibold text-zinc-900">Recent Products</h3>
                            <p className="text-sm text-zinc-500">Latest products added to your store</p>
                        </div>
                    </div>

                    <div className="space-y-4 p-5">
                        {recentProducts.length > 0 ? (
                            recentProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="flex items-center justify-between rounded-xl border border-zinc-200 p-4"
                                >
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={product.prodImage}
                                            alt={product.name}
                                            className="h-14 w-14 rounded-xl object-cover bg-zinc-100"
                                        />
                                        <div>
                                            <p className="font-medium text-zinc-900">{product.name}</p>
                                            <p className="text-sm text-zinc-500">
                                                {product.category.name} • {formatCurrency(product.price)}
                                            </p>
                                        </div>
                                    </div>

                                    <span
                                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${product.isPublished
                                            ? "bg-emerald-100 text-emerald-700"
                                            : "bg-zinc-100 text-zinc-700"
                                            }`}
                                    >
                                        {product.isPublished ? "Active" : "Draft"}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="py-8 text-center text-sm text-zinc-500">
                                No recent products found.
                            </div>
                        )}
                    </div>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
                    <div className="border-b border-zinc-200 px-5 py-4">
                        <h3 className="text-lg font-semibold text-zinc-900">Low Stock Alerts</h3>
                        <p className="text-sm text-zinc-500">Products that need restocking</p>
                    </div>

                    <div className="space-y-4 p-5">
                        {lowStockProducts.length > 0 ? (
                            lowStockProducts.map((product) => {
                                const lowestVariant = [...product.productvariant].sort(
                                    (a, b) => a.stockQuantity - b.stockQuantity
                                )[0];

                                const isCritical = lowestVariant?.stockQuantity <= 2;

                                return (
                                    <div
                                        key={product.id}
                                        className={`flex items-center justify-between rounded-xl p-3 ${isCritical
                                            ? "border border-red-100 bg-red-50"
                                            : "border border-amber-100 bg-amber-50"
                                            }`}
                                    >
                                        <div className="min-w-0">
                                            <p className="truncate font-medium text-zinc-900">
                                                {product.name}
                                            </p>
                                            <p className="text-sm text-zinc-500">
                                                {product.category.name}
                                                {lowestVariant ? ` • Size ${lowestVariant.size}` : ""}
                                            </p>
                                        </div>

                                        <span
                                            className={`ml-3 rounded-full px-2.5 py-1 text-xs font-semibold ${isCritical
                                                ? "bg-red-100 text-red-700"
                                                : "bg-amber-100 text-amber-700"
                                                }`}
                                        >
                                            {lowestVariant?.stockQuantity ?? 0} left
                                        </span>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="py-8 text-center text-sm text-zinc-500">
                                No low stock products found.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}