"use client";

import { load } from "@cashfreepayments/cashfree-js";
import { useState } from "react";

type PayButtonProps = {
  addressId: string;
  total: number;
};

export default function PayButton({ addressId, total }: PayButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handlePay() {
    try {
      setLoading(true);

      const createOrderRes = await fetch(`/api/order/create?addressId=${addressId}`, {
        method: "POST",
      });

      const createOrderData = await createOrderRes.json();

      if (!createOrderRes.ok || !createOrderData.ok) {
        alert(createOrderData.error || "Failed to create order");
        return;
      }

      const sessionRes = await fetch("/api/payment/cashfree/create-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: createOrderData.orderId,
        }),
      });

      const sessionData = await sessionRes.json();

      if (!sessionRes.ok || !sessionData.ok) {
        alert(sessionData.error || "Failed to start payment");
        return;
      }

      const cashfree = await load({
        mode: "sandbox",
      });

      await cashfree?.checkout({
        paymentSessionId: sessionData.paymentSessionId,
        redirectTarget: "_self",
      });
    } catch (error) {
      alert("Something went wrong while starting payment");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function formatPrice(amount: number) {
    return `₹${amount.toLocaleString("en-IN")}`;
  }

  return (
    <button
      type="button"
      onClick={handlePay}
      disabled={loading || !addressId}
      className="w-full mt-2 h-12 rounded-xl bg-black text-white font-medium hover:bg-gray-900 transition active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? "Processing..." : `Pay ${formatPrice(total)}`}
    </button>
  );
}