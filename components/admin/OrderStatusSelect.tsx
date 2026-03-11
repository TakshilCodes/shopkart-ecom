"use client";

import { OrderStatus } from "@/app/generated/prisma/enums";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

function getStatusStyles(status: OrderStatus) {
  switch (status) {
    case "Delivered":
      return "border-green-200 bg-green-50 text-green-700";
    case "Out_of_delivery":
      return "border-blue-200 bg-blue-50 text-blue-700";
    case "In_Transit":
      return "border-purple-200 bg-purple-50 text-purple-700";
    case "Order_Received":
    default:
      return "border-gray-200 bg-gray-50 text-gray-700";
  }
}

function formatStatus(status: OrderStatus) {
  switch (status) {
    case "Order_Received":
      return "Order Received";
    case "In_Transit":
      return "In Transit";
    case "Out_of_delivery":
      return "Out for Delivery";
    case "Delivered":
      return "Delivered";
    default:
      return status;
  }
}

export default function OrderStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const router = useRouter();
  const [value, setValue] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const currentStyle = useMemo(() => getStatusStyles(value), [value]);

  async function handleChange(nextValue: OrderStatus) {
    const previousValue = value;

    try {
      setValue(nextValue);
      setLoading(true);

      const res = await fetch(`/api/admin/orders/${orderId}/order-status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: nextValue }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to update order status");
        setValue(previousValue);
        return;
      }

      router.refresh();
    } catch {
      setValue(previousValue);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <div
        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${currentStyle}`}
      >
        {loading ? "Updating..." : formatStatus(value)}
      </div>

      <div className="relative">
        <select
          value={value}
          disabled={loading}
          onChange={(e) => handleChange(e.target.value as OrderStatus)}
          className="h-11 w-full appearance-none rounded-2xl border border-black/10 bg-white px-4 pr-10 text-sm font-medium text-gray-800 outline-none transition focus:border-black/20 focus:ring-4 focus:ring-black/5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <option value="Order_Received">Order Received</option>
          <option value="In_Transit">In Transit</option>
          <option value="Out_of_delivery">Out for Delivery</option>
          <option value="Delivered">Delivered</option>
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.51a.75.75 0 01-1.08 0l-4.25-4.51a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      <p className="text-xs text-gray-400">
        Change the delivery progress of this order.
      </p>
    </div>
  );
}