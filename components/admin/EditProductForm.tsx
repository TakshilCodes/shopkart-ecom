"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import ProductVariantsManager from "@/components/admin/ProductVariantsManager";
import ProductImageUploader from "@/components/admin/ProductImageUploader";

type Category = {
  id: string;
  name: string;
};

type Variant = {
  id: string;
  size: string;
  stockQuantity: number;
};

type ProductData = {
  id: string;
  name: string;
  slug: string;
  prodImage: string;
  price: string;
  categoryId: string;
  isPublished: boolean;
};

export default function EditProductForm({
  mode = "edit",
  product,
  categories,
  variants,
}: {
  mode?: "create" | "edit";
  product: ProductData;
  categories: Category[];
  variants: Variant[];
}) {
  const router = useRouter();

  const [name, setName] = useState(product.name);
  const [slug, setSlug] = useState(product.slug);
  const [prodImage, setProdImage] = useState(product.prodImage);
  const [price, setPrice] = useState(product.price);
  const [categoryId, setCategoryId] = useState(product.categoryId);
  const [isPublished, setIsPublished] = useState(product.isPublished);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (mode === "create") {
        const res = await axios.post("/api/admin/products", {
          name,
          slug,
          prodImage,
          price,
          categoryId,
          isPublished,
        });

        if (res.data?.ok) {
          setSuccess("Product created successfully");
          router.push(`/admin/products/${res.data.product.id}`);
          router.refresh();
        }

        return;
      }

      const res = await axios.patch(`/api/admin/products/${product.id}`, {
        name,
        slug,
        prodImage,
        price,
        categoryId,
        isPublished,
      });

      if (res.data?.ok) {
        setSuccess("Product updated successfully");
        router.refresh();
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.error ||
          (mode === "create"
            ? "Failed to create product"
            : "Failed to update product")
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 lg:col-span-2">
      <form id="edit-product-form" onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Basic Information
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Main product details visible in admin.
          </p>

          {error ? (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          ) : null}

          {success ? (
            <div className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          ) : null}

          <div className="mt-6 grid gap-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Product Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11 w-full rounded-xl border border-gray-300 px-4 text-sm outline-none transition focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Slug
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="h-11 w-full rounded-xl border border-gray-300 px-4 text-sm outline-none transition focus:border-black"
              />
            </div>

            <ProductImageUploader value={prodImage} onChange={setProdImage} />
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Pricing & Category
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage product price, category and publish status.
          </p>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="h-11 w-full rounded-xl border border-gray-300 px-4 text-sm outline-none transition focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="h-11 w-full rounded-xl border border-gray-300 bg-white px-4 text-sm outline-none transition focus:border-black"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-gray-900">Published</p>
                <p className="text-sm text-gray-500">
                  Toggle whether this product is visible to customers.
                </p>
              </div>

              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="h-5 w-5 rounded border-gray-300"
              />
            </div>
          </div>
        </section>
      </form>

      {mode === "edit" ? (
        <ProductVariantsManager productId={product.id} variants={variants} />
      ) : null}
    </div>
  );
}