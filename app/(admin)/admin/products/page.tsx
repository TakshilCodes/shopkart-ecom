import Link from "next/link";
import prisma from "@/lib/prisma";

type SearchParams = Promise<{
  search?: string;
}>;

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const search = params.search?.trim() || "";

  const products = await prisma.product.findMany({
    where: search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { slug: { contains: search, mode: "insensitive" } },
          ],
        }
      : {},
    include: {
      category: true,
      _count: {
        select: {
          productvariant: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Products
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage all products, stock variants, and publishing status.
            </p>
          </div>

          <Link
            href="/admin/products/new"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-black px-5 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            + Add Product
          </Link>
        </div>

        {/* Search */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <form className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Search by product name or slug..."
              className="h-11 w-full rounded-xl border border-gray-300 bg-white px-4 text-sm outline-none transition focus:border-black"
            />
            <button
              type="submit"
              className="h-11 rounded-xl border border-black px-5 text-sm font-medium text-black transition hover:bg-black hover:text-white"
            >
              Search
            </button>
          </form>
        </div>

        {/* Products list */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {products.length === 0 ? (
            <div className="flex min-h-75 flex-col items-center justify-center px-6 text-center">
              <h2 className="text-lg font-semibold text-gray-900">
                No products found
              </h2>
              <p className="mt-2 max-w-md text-sm text-gray-500">
                Try a different search term or add your first product to get
                started.
              </p>
              <Link
                href="/admin/products/new"
                className="mt-5 inline-flex h-11 items-center justify-center rounded-xl bg-black px-5 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                Add Product
              </Link>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr className="text-left text-sm font-semibold text-gray-600">
                      <th className="px-6 py-4">Product</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4">Variants</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="h-14 w-14 overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
                              {product.prodImage ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={product.prodImage}
                                  alt={product.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                                  No image
                                </div>
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate font-semibold text-gray-900">
                                {product.name}
                              </p>
                              <p className="mt-1 text-sm text-gray-500">
                                Created product
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-700">
                          {product.category?.name || "—"}
                        </td>

                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          ₹{Number(product.price).toLocaleString("en-IN")}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-700">
                          {product._count.productvariant}
                        </td>

                        <td className="px-6 py-4">
                          {product.isPublished ? (
                            <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                              Published
                            </span>
                          ) : (
                            <span className="inline-flex rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                              Draft
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex justify-end">
                            <Link
                              href={`/admin/products/${product.id}`}
                              className="inline-flex h-10 items-center justify-center rounded-xl border border-gray-300 px-4 text-sm font-medium text-gray-700 transition hover:border-black hover:text-black"
                            >
                              Edit
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="grid gap-4 p-4 lg:hidden">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="rounded-2xl border border-gray-200 p-4"
                  >
                    <div className="flex gap-4">
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
                        {product.prodImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={product.prodImage}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                            No image
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h2 className="truncate font-semibold text-gray-900">
                              {product.name}
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                              {product.category?.name || "No category"}
                            </p>
                          </div>

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

                        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-gray-500">Price</p>
                            <p className="font-medium text-gray-900">
                              ₹{Number(product.price).toLocaleString("en-IN")}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Variants</p>
                            <p className="font-medium text-gray-900">
                              {product._count.productvariant}
                            </p>
                          </div>
                        </div>

                        <Link
                          href={`/admin/products/${product.id}`}
                          className="mt-4 inline-flex h-10 items-center justify-center rounded-xl border border-gray-300 px-4 text-sm font-medium text-gray-700 transition hover:border-black hover:text-black"
                        >
                          Edit Product
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}