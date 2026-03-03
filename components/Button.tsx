"use client";

import { decrementCartItem, incrementCartItem } from "@/actions/action.cart";
import { useEffect, useState } from "react";

export default function Button({ children, disabled, productvariantId, initialquantity, max }: { children: string, disabled: boolean, productvariantId?: string, initialquantity?: number, max?: number }) {

  const [count, setCount] = useState(initialquantity ?? 0);

  useEffect(() => {
    setCount(initialquantity ?? 0);
  }, [productvariantId, initialquantity]);

  const canIncrement = !disabled && !!productvariantId && (max == null || count < max); 

  const canDecrement = !!productvariantId && count > 0;

  async function handleIncrement() {
    if (!productvariantId || !canIncrement) return;
    setCount((c) => c + 1);
    const res = await incrementCartItem(productvariantId);
    if (res?.ok) window.dispatchEvent(new Event("cart:updated"));
  }

  async function handleDecrement() {
    if (!productvariantId || !canDecrement) return;

    const current = count;
    setCount((c) => Math.max(0, c - 1));
    const res = await decrementCartItem(productvariantId, current);

    if (res?.ok) window.dispatchEvent(new Event("cart:updated"))
  }

  if (count >= 1) {
    return (
      <div className="inline-flex items-center h-11 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <button className="h-11 w-11 grid place-items-center text-lg font-semibold text-gray-900 hover:bg-gray-50 active:bg-gray-100 transition"
          disabled={!canIncrement} onClick={handleIncrement}>+</button>
        <p className="w-12 text-center text-sm font-medium text-gray-900 select-none">{count}</p>
        <button className="h-11 w-11 grid place-items-center text-lg font-semibold text-gray-900 hover:bg-gray-50 active:bg-gray-100 transition"
          disabled={!canDecrement} onClick={handleDecrement}>-</button>
      </div>
    );
  }

  if (count == 0) {
    return (
      <button
        onClick={handleIncrement}
        disabled={disabled || !productvariantId}
        className={`w-full sm:w-auto inline-flex items-center justify-center h-11 px-6 rounded-xl text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-black/20 active:scale-[0.98] 
          ${disabled ? "bg-gray-300 cursor-not-allowed" : "bg-black text-white hover:bg-gray-900"}`}
      >
        {children}
      </button>
    );
  }
}
