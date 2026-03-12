"use client";

import { useEffect, useMemo, useState } from "react";
import Button from "@/components/Button";
import { useSession } from "next-auth/react";

type Variant = {
  id: string;
  size: string;
  stockQuantity: number;
};

type CartItem = {
  productVariantId: string;
  quantity: number;
};

type Props = {
  slug: string;
  variants: Variant[];
  initialSize: string | null;
  cartItems: CartItem[];
};

export default function ProductOptions({
  slug,
  variants,
  initialSize,
  cartItems,
}: Props) {
  const [selectedSize, setSelectedSize] = useState<string | null>(initialSize);

  useEffect(() => {
    setSelectedSize(initialSize);
  }, [initialSize]);

  const selectedVariant = useMemo(() => {
    if (!selectedSize) return null;
    return variants.find((v) => v.size === selectedSize) ?? null;
  }, [selectedSize, variants]);

  const initialQuantity = useMemo(() => {
    if (!selectedVariant) return 0;
    return (
      cartItems.find((item) => item.productVariantId === selectedVariant.id)
        ?.quantity ?? 0
    );
  }, [cartItems, selectedVariant]);

  const session = useSession();
  const canAdd = !!selectedVariant && selectedVariant.stockQuantity > 0 && session.status == "authenticated";

  function handleSelectSize(size: string) {
    setSelectedSize(size);

    const params = new URLSearchParams(window.location.search);
    params.set("size", size);

    window.history.replaceState(
      null,
      "",
      `/products/${slug}?${params.toString()}`
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="font-medium">Size</p>

        {selectedVariant ? (
          <div className="text-green-600">
            In stock: {selectedVariant.stockQuantity}
          </div>
        ) : (
          <div className="text-sm text-gray-500">Select a size</div>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        {variants.length > 0 ? (
          variants.map((variant) => (
            <button
              key={variant.id}
              type="button"
              onClick={() => handleSelectSize(variant.size)}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${
                selectedSize === variant.size
                  ? "bg-black text-white border border-black"
                  : "border border-gray-300 hover:border-black"
              }`}
            >
              {variant.size}
            </button>
          ))
        ) : (
          <div className="text-sm text-gray-500">No sizes available</div>
        )}
      </div>

      <div>
        <Button
          disabled={!canAdd}
          initialquantity={initialQuantity}
          productvariantId={selectedVariant?.id}
          max={selectedVariant?.stockQuantity}
        >
          Add to cart
        </Button>

        {session.status !== "authenticated" ? <p className="text-sm text-gray-500 mt-2">Please LogIn to add items in cart</p> : null}

        {!selectedSize && (
          <p className="text-sm text-gray-500 mt-2">Please select a size</p>
        )}

        {selectedVariant && selectedVariant.stockQuantity <= 0 && (
          <p className="text-sm text-red-500 mt-2">
            Selected size is out of stock
          </p>
        )}
      </div>
    </div>
  );
}