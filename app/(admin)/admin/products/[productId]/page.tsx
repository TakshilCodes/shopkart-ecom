import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import EditProductForm from "@/components/admin/EditProductForm";
import ProductDeleteButton from "@/components/admin/ProductDeleteButton";
import ArrowLeft from '@/assets/icons/left-arrow.png'

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
        productvariant: true,
      },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  if (!product) return notFound();

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              href="/admin/products"
              className="mb-2 inline-flex text-sm font-medium text-gray-500 hover:text-black items-center"
            >
              <img src={ArrowLeft.src} alt="" className="w-3 h-3"/> <span>Back to Products</span>
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Edit Product
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Update product details, price, image, category and publish status.
            </p>
          </div>

          <div className="flex gap-3">
            <ProductDeleteButton
              productId={product.id}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-red-300 px-5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Delete
            </ProductDeleteButton>

            <button
              type="submit"
              form="edit-product-form"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-black px-5 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Save Changes
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <EditProductForm
            product={{
              id: product.id,
              name: product.name,
              slug: product.slug,
              prodImage: product.prodImage,
              price: product.price.toString(),
              categoryId: product.categoryId,
              isPublished: product.isPublished,
            }}
            categories={categories.map((cat) => ({
              id: cat.id,
              name: cat.name,
            }))}
            variants={product.productvariant.map((variant) => ({
              id: variant.id,
              size: variant.size,
              stockQuantity: variant.stockQuantity,
            }))}
          />

          <aside className="space-y-6">
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">
                Product Preview
              </h2>

              <div className="mt-5 overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
                {product.prodImage ? (
                  <img
                    src={product.prodImage}
                    alt={product.name}
                    className="h-64 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-64 w-full items-center justify-center text-sm text-gray-400">
                    No image
                  </div>
                )}
              </div>

              <div className="mt-4">
                <p className="text-lg font-semibold text-gray-900">
                  {product.name}
                </p>
                <p className="mt-1 text-sm text-gray-500">{product.slug}</p>
              </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">
                Product Summary
              </h2>

              <div className="mt-5 space-y-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Product ID</span>
                  <span className="max-w-37.5 truncate font-medium text-gray-900">
                    {product.id}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Category</span>
                  <span className="font-medium text-gray-900">
                    {product.category.name}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Variants</span>
                  <span className="font-medium text-gray-900">
                    {product.productvariant.length}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Status</span>
                  {product.isPublished ? (
                    <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      Published
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                      Draft
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Price</span>
                  <span className="font-medium text-gray-900">
                    ₹{Number(product.price).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">
                Quick Actions
              </h2>

              <div className="mt-5 flex flex-col gap-3">
                <Link
                  href={`/products/${product.slug}`}
                  target="_blank"
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-gray-300 px-4 text-sm font-medium text-gray-700 transition hover:border-black hover:text-black"
                >
                  View Live Product
                </Link>

                <button
                  type="submit"
                  form="edit-product-form"
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-black px-4 text-sm font-medium text-white transition hover:bg-gray-800"
                >
                  Save Product
                </button>

                <ProductDeleteButton
                  productId={product.id}
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-red-300 px-4 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  Delete Product
                </ProductDeleteButton>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}