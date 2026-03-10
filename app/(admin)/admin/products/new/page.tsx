import Link from "next/link";
import prisma from "@/lib/prisma";
import EditProductForm from "@/components/admin/EditProductForm";
import ArrowLeft from '@/assets/icons/left-arrow.png'

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              href="/admin/products"
              className="mb-2 inline-flex items-center text-sm font-medium text-gray-500 hover:text-black"
            >
              <img src={ArrowLeft.src} alt="back" className="w-3 h-3" /> 
              <span>Back to Products</span>
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Add Product
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Create a new product and upload its image.
            </p>
          </div>

          <button
            type="submit"
            form="edit-product-form"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-black px-5 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Create Product
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <EditProductForm
            mode="create"
            product={{
              id: "",
              name: "",
              slug: "",
              prodImage: "",
              price: "",
              categoryId: categories[0]?.id || "",
              isPublished: true,
            }}
            categories={categories.map((cat) => ({
              id: cat.id,
              name: cat.name,
            }))}
            variants={[]}
          />

          <aside className="space-y-6">
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">
                Product Preview
              </h2>

              <div className="mt-5 flex h-64 items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 text-sm text-gray-400">
                Product preview will appear after image upload
              </div>

              <div className="mt-4">
                <p className="text-lg font-semibold text-gray-900">
                  New Product
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Fill product details and save
                </p>
              </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">
                Quick Actions
              </h2>

              <div className="mt-5 flex flex-col gap-3">
                <button
                  type="submit"
                  form="edit-product-form"
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-black px-4 text-sm font-medium text-white transition hover:bg-gray-800"
                >
                  Create Product
                </button>

                <Link
                  href="/admin/products"
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-gray-300 px-4 text-sm font-medium text-gray-700 transition hover:border-black hover:text-black"
                >
                  Cancel
                </Link>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}