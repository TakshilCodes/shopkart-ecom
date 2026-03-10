"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProductDeleteButton({
  productId,
  className,
  children,
}: {
  productId: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      setLoading(true);

      const res = await axios.delete(`/api/admin/products/${productId}`);

      if (res.data?.ok) {
        router.push("/admin/products");
        router.refresh();
      }
    } catch (error: any) {
      alert(error?.response?.data?.error || "Failed to delete product");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className={className}
    >
      {loading ? "Deleting..." : children || "Delete"}
    </button>
  );
}