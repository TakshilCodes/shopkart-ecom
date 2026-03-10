"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Variant = {
  id: string;
  size: string;
  stockQuantity: number;
};

export default function ProductVariantsManager({
  productId,
  variants,
}: {
  productId: string;
  variants: Variant[];
}) {
  const router = useRouter();

  const [newSize, setNewSize] = useState("");
  const [newStock, setNewStock] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editSize, setEditSize] = useState("");
  const [editStock, setEditStock] = useState("");

  async function handleAddVariant(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      await axios.post("/api/admin/products/variants", {
        productId,
        size: newSize,
        stockQuantity: Number(newStock),
      });

      setNewSize("");
      setNewStock("");
      router.refresh();
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to add size");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateVariant(variantId: string) {
    try {
      setLoading(true);
      setError("");

      await axios.patch(`/api/admin/products/variants/${variantId}`, {
        size: editSize,
        stockQuantity: Number(editStock),
      });

      setEditingId(null);
      setEditSize("");
      setEditStock("");
      router.refresh();
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to update size");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteVariant(variantId: string) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this size?"
    );

    if (!confirmDelete) return;

    try {
      setLoading(true);
      setError("");

      await axios.delete(`/api/admin/products/variants/${variantId}`);
      router.refresh();
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to delete size");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">Product Sizes</h2>
      <p className="mt-1 text-sm text-gray-500">
        Add, edit and delete product sizes with stock.
      </p>

      {error ? (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      <form
        onSubmit={handleAddVariant}
        className="mt-6 grid gap-3 md:grid-cols-[1fr_1fr_auto]"
      >
        <input
          type="text"
          placeholder="Size (S, M, L, XL)"
          value={newSize}
          onChange={(e) => setNewSize(e.target.value)}
          className="h-11 rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-black"
        />

        <input
          type="number"
          placeholder="Stock quantity"
          value={newStock}
          onChange={(e) => setNewStock(e.target.value)}
          className="h-11 rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-black"
        />

        <button
          type="submit"
          disabled={loading}
          className="h-11 rounded-xl bg-black px-5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          Add Size
        </button>
      </form>

      <div className="mt-6 space-y-3">
        {variants.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 p-4 text-sm text-gray-500">
            No sizes added yet.
          </div>
        ) : (
          variants.map((variant) => {
            const isEditing = editingId === variant.id;

            return (
              <div
                key={variant.id}
                className="rounded-2xl border border-gray-200 p-4"
              >
                {isEditing ? (
                  <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto_auto]">
                    <input
                      type="text"
                      value={editSize}
                      onChange={(e) => setEditSize(e.target.value)}
                      className="h-11 rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-black"
                    />

                    <input
                      type="number"
                      value={editStock}
                      onChange={(e) => setEditStock(e.target.value)}
                      className="h-11 rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-black"
                    />

                    <button
                      type="button"
                      onClick={() => handleUpdateVariant(variant.id)}
                      disabled={loading}
                      className="h-11 rounded-xl bg-black px-4 text-sm font-medium text-white transition hover:bg-gray-800"
                    >
                      Save
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setEditSize("");
                        setEditStock("");
                      }}
                      className="h-11 rounded-xl border border-gray-300 px-4 text-sm font-medium text-gray-700 transition hover:border-black hover:text-black"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">
                        Size: {variant.size}
                      </p>
                      <p className="text-sm text-gray-500">
                        Stock: {variant.stockQuantity}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(variant.id);
                          setEditSize(variant.size);
                          setEditStock(String(variant.stockQuantity));
                        }}
                        className="h-10 rounded-xl border border-gray-300 px-4 text-sm font-medium text-gray-700 transition hover:border-black hover:text-black"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteVariant(variant.id)}
                        className="h-10 rounded-xl border border-red-300 px-4 text-sm font-medium text-red-600 transition hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}