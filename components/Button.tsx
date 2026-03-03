"use client";

import { decrementCartItem, incrementCartItem } from "@/actions/action.cart";
import { useState } from "react";

export default function Button({ children, disabled, productvariantId, initialquantity, max }: { children: string, disabled: boolean, productvariantId?: string, initialquantity?: number, max?: number }) {

  const [count, setCount] = useState(initialquantity ?? 0);

   const canIncrement = !disabled && !!productvariantId && count < max!;
   const canDecrement = !!productvariantId && count > 0;

  if (count >= 1) {
    return (
      <div className="inline-flex items-center h-11 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <button className="h-11 w-11 grid place-items-center text-lg font-semibold text-gray-900 hover:bg-gray-50 active:bg-gray-100 transition"
          disabled={canIncrement} onClick={() => { setCount((c) => c + 1); incrementCartItem(productvariantId!) }}>+</button>
        <p className="w-12 text-center text-sm font-medium text-gray-900 select-none">{count}</p>
        <button className="h-11 w-11 grid place-items-center text-lg font-semibold text-gray-900 hover:bg-gray-50 active:bg-gray-100 transition"
          disabled={canDecrement} onClick={() => { setCount((c) => Math.max(0, c - 1)); decrementCartItem(productvariantId!, count) }}>-</button>
      </div>
    );
  }

  if (count == 0) {
    return (
      <button
        onClick={() => { setCount((c) => (c + 1)); incrementCartItem(productvariantId!) }}
        disabled={disabled || !productvariantId}
        className={`w-full sm:w-auto inline-flex items-center justify-center h-11 px-6 rounded-xl text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-black/20 active:scale-[0.98] 
          ${disabled ? "bg-gray-300 cursor-not-allowed" : "bg-black text-white hover:bg-gray-900"}`}
      >
        {children}
      </button>
    );
  }
}
