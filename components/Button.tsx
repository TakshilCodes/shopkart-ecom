"use client";

import { decrementCartItem, incrementCartItem } from "@/actions/action.cart";
import useCartStore from "@/store/cartStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Button({
  children,
  disabled,
  productvariantId,
  initialquantity,
  max,
  isCart,
}: {
  children?: string;
  disabled: boolean;
  productvariantId?: string;
  initialquantity?: number;
  max?: number;
  isCart?: boolean;
}) {
  const [count, setCount] = useState(initialquantity ?? 0);
  const [pending, setPending] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setCount(initialquantity ?? 0);
  }, [productvariantId, initialquantity]);

  const canIncrement =
    !pending && !disabled && !!productvariantId && (max == null || count < max);

  const canDecrement = !pending && !!productvariantId && count > 0;

  async function handleIncrement() {
    if (!productvariantId || !canIncrement) return;

    const prevCount = count;
    setPending(true);
    setCount((c) => c + 1);

    const res = await incrementCartItem(productvariantId);

    if (!res?.ok) {
      setCount(prevCount);
      setPending(false);
      if (isCart) router.refresh();
      return;
    }

    useCartStore.getState().setCartCount(res.count ?? 0);

    if (isCart) {
      router.refresh();
    }

    setPending(false);
  }

  async function handleDecrement() {
    if (!productvariantId || !canDecrement) return;

    const prevCount = count;
    setPending(true);
    setCount((c) => Math.max(0, c - 1));

    const res = await decrementCartItem(productvariantId);

    if (!res?.ok) {
      setCount(prevCount);
      setPending(false);
      if (isCart) router.refresh();
      return;
    }

    useCartStore.getState().setCartCount(res.count);

    if (isCart) {
      router.refresh();
    }

    setPending(false);
  }

  if (count > 0) {
    return (
      <div className="inline-flex items-center h-11 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <button
          className="h-11 w-11 grid place-items-center text-lg font-semibold text-gray-900 hover:bg-gray-50 active:bg-gray-100 transition disabled:opacity-50"
          disabled={!canIncrement}
          onClick={handleIncrement}
        >
          +
        </button>

        <p className="w-12 text-center text-sm font-medium text-gray-900 select-none">
          {count}
        </p>

        <button
          className="h-11 w-11 grid place-items-center text-lg font-semibold text-gray-900 hover:bg-gray-50 active:bg-gray-100 transition disabled:opacity-50"
          disabled={!canDecrement}
          onClick={handleDecrement}
        >
          -
        </button>
      </div>
    );
  }

  if (count === 0 && isCart) {
    return (
      <div className="h-11 w-24 rounded-xl border border-gray-200 bg-gray-50 animate-pulse" />
    );
  }

  return (
    <button
      onClick={handleIncrement}
      disabled={disabled || !productvariantId || pending}
      className={`w-full sm:w-auto inline-flex items-center justify-center h-11 px-6 rounded-xl text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-black/20 active:scale-[0.98]
        ${disabled || pending ? "bg-gray-300 cursor-not-allowed" : "bg-black text-white hover:bg-gray-900"}`}
    >
      {children}
    </button>
  );
}
