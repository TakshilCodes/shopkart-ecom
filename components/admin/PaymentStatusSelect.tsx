"use client";

import { PaymentStatus } from "@/app/generated/prisma";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

function getStatusStyles(status: PaymentStatus) {
  switch (status) {
    case "PAID":
      return "border-green-200 bg-green-50 text-green-700";
    case "FAILED":
      return "border-red-200 bg-red-50 text-red-700";
    case "CANCELLED":
      return "border-gray-300 bg-gray-100 text-gray-700";
    case "PENDING_PAYMENT":
    default:
      return "border-yellow-200 bg-yellow-50 text-yellow-700";
  }
}

function formatStatus(status: PaymentStatus) {
  switch (status) {
    case "PENDING_PAYMENT":
      return "Pending Payment";
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

export default function PaymentStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: PaymentStatus;
}) {
  const router = useRouter();
  const [value, setValue] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const currentStyle = useMemo(() => getStatusStyles(value), [value]);

  async function handleChange(nextValue: PaymentStatus) {
    const previousValue = value;

    try {
      setValue(nextValue);
      setLoading(true);

      const res = await fetch(`/api/admin/orders/${orderId}/payment-status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextValue }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to update payment status");
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
          onChange={(e) => handleChange(e.target.value as PaymentStatus)}
          className="h-11 w-full appearance-none rounded-2xl border border-black/10 bg-white px-4 pr-10 text-sm font-medium text-gray-800 outline-none transition focus:border-black/20 focus:ring-4 focus:ring-black/5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <option value="PENDING_PAYMENT">Pending</option>
          <option value="PAID">Paid</option>
          <option value="FAILED">Failed</option>
          <option value="CANCELLED">Cancelled</option>
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
        Change the payment state of this order.
      </p>
    </div>
  );
}