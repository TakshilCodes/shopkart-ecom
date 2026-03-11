"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function OrdersFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || value === "ALL" || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    router.push(`/admin/orders?${params.toString()}`);
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();

    const params = new URLSearchParams(searchParams.toString());

    if (!search.trim()) {
      params.delete("search");
    } else {
      params.set("search", search.trim());
    }

    if (!minPrice) {
      params.delete("minPrice");
    } else {
      params.set("minPrice", minPrice);
    }

    if (!maxPrice) {
      params.delete("maxPrice");
    } else {
      params.set("maxPrice", maxPrice);
    }

    router.push(`/admin/orders?${params.toString()}`);
  }

  function clearFilters() {
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    router.push("/admin/orders");
  }

  return (
    <div className="rounded-[28px] border border-black/5 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Filter Orders</h3>
          <p className="mt-1 text-sm text-gray-500">
            Search and refine orders by payment, delivery, items, price and time.
          </p>
        </div>

        <button
          type="button"
          onClick={clearFilters}
          className="inline-flex h-11 items-center justify-center rounded-2xl border border-black/10 px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Clear filters
        </button>
      </div>

      <form onSubmit={handleSearchSubmit} className="space-y-5">
        <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr_1fr]">
          <div className="xl:col-span-1">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-400">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Order id, cashfree id, email, customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-12 w-full rounded-2xl border border-black/10 bg-white pl-4 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-black/20 focus:ring-4 focus:ring-black/5"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-400">
              Min Price
            </label>
            <input
              type="number"
              placeholder="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="h-12 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-black/20 focus:ring-4 focus:ring-black/5"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-400">
              Max Price
            </label>
            <input
              type="number"
              placeholder="5000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="h-12 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-black/20 focus:ring-4 focus:ring-black/5"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-400">
              Payment Status
            </label>
            <select
              defaultValue={searchParams.get("paymentStatus") || "ALL"}
              onChange={(e) => updateParam("paymentStatus", e.target.value)}
              className="h-12 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-black/20 focus:ring-4 focus:ring-black/5"
            >
              <option value="ALL">All Payment</option>
              <option value="PENDING_PAYMENT">Pending</option>
              <option value="PAID">Paid</option>
              <option value="FAILED">Failed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-400">
              Delivery Status
            </label>
            <select
              defaultValue={searchParams.get("orderStatus") || "ALL"}
              onChange={(e) => updateParam("orderStatus", e.target.value)}
              className="h-12 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-black/20 focus:ring-4 focus:ring-black/5"
            >
              <option value="ALL">All Delivery</option>
              <option value="Order_Received">Order Received</option>
              <option value="In_Transit">In Transit</option>
              <option value="Out_of_delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-400">
              Sort By
            </label>
            <select
              defaultValue={searchParams.get("sort") || "newest"}
              onChange={(e) => updateParam("sort", e.target.value)}
              className="h-12 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-black/20 focus:ring-4 focus:ring-black/5"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price_high">Price High → Low</option>
              <option value="price_low">Price Low → High</option>
              <option value="items_high">Items High → Low</option>
              <option value="items_low">Items Low → High</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-400">
              Item Count
            </label>
            <select
              defaultValue={searchParams.get("items") || "all"}
              onChange={(e) => updateParam("items", e.target.value)}
              className="h-12 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-black/20 focus:ring-4 focus:ring-black/5"
            >
              <option value="all">All Item Counts</option>
              <option value="less">Items ≤ 2</option>
              <option value="more">Items &gt; 2</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-black/5 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {searchParams.get("paymentStatus") && (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                Payment: {searchParams.get("paymentStatus")}
              </span>
            )}
            {searchParams.get("orderStatus") && (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                Delivery: {searchParams.get("orderStatus")}
              </span>
            )}
            {searchParams.get("sort") && (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                Sort: {searchParams.get("sort")}
              </span>
            )}
            {searchParams.get("items") && searchParams.get("items") !== "all" && (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                Items: {searchParams.get("items")}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-black px-6 text-sm font-semibold text-white transition hover:bg-neutral-800 active:scale-[0.99]"
          >
            Apply Filters
          </button>
        </div>
      </form>
    </div>
  );
}