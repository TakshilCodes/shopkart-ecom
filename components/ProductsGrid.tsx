import prisma from "@/lib/prisma";
import Link from "next/link";
import PaginationControls from "./PaginationControls";

type Props = {
  currentPage: number;
  price: number;
  search: string;
  rawCategory: string;
};

export default async function ProductsGrid({
  currentPage,
  price,
  search,
  rawCategory,
}: Props) {
  const hasCategory = rawCategory.trim().length > 0;
  const toSkipItems = (currentPage - 1) * 25;

  const where = {
    isPublished: true,
    price: {
      lte: price,
    },
    name: {
      contains: search,
      mode: "insensitive" as const,
    },
    ...(hasCategory ? { category: { slug: rawCategory } } : {}),
  };

  const totalProducts = await prisma.product.count({ where });

  const products = await prisma.product.findMany({
    where,
    select: {
      id: true,
      name: true,
      prodImage: true,
      price: true,
      isPublished: true,
      slug: true,
      category: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          productvariant: true,
        },
      },
    },
    skip: toSkipItems,
    take: 25,
  });

  const totalPages = Math.ceil(totalProducts / 25);

  if (products.length === 0) {
    return search ? (
      <div className="flex justify-center items-center py-32">
        <div className="rounded-3xl border border-gray-200 bg-white px-10 py-12 text-center shadow-sm">
          <p className="text-lg text-gray-700">
            No products matching <span className="font-semibold text-black">{search}</span>.
          </p>
        </div>
      </div>
    ) : (
      <div className="flex justify-center items-center py-32">
        <div className="rounded-3xl border border-gray-200 bg-white px-10 py-12 text-center shadow-sm">
          <p className="text-lg text-gray-700">No products.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex justify-end">
        <div className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 shadow-sm">
          {totalProducts} product{totalProducts !== 1 ? "s" : ""}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {products.map((product) => (
          <div
            key={product.slug}
            className="group overflow-hidden rounded-3xl border border-gray-200 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <Link
              href={`/products/${product.slug}`}
              className="block overflow-hidden rounded-2xl bg-gray-50"
            >
              <img
                src={product.prodImage}
                alt={product.name}
                className="h-64 w-full object-cover transition duration-300 group-hover:scale-[1.04]"
              />
            </Link>

            <div className="pt-4">
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-gray-400">
                {product.category.name}
              </p>

              <Link
                href={`/products/${product.slug}`}
                className="line-clamp-2 text-base font-semibold text-gray-900 hover:text-black"
              >
                {product.name.length > 20
                  ? product.name.slice(0, 22) + "..."
                  : product.name}
              </Link>

              <div className="mt-5 flex items-center justify-between gap-3">
                <Link
                  href={`/products/${product.slug}`}
                  className="text-lg font-semibold tracking-tight text-gray-900"
                >
                  ₹{String(product.price)}
                </Link>

                {product._count.productvariant > 0 ? (
                  <Link
                    href={`/products/${product.slug}`}
                    className="inline-flex h-11 items-center justify-center rounded-xl bg-black px-5 text-sm font-medium text-white transition hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-black/20 active:scale-[0.98]"
                  >
                    Select Size
                  </Link>
                ) : (
                  <button
                    disabled
                    className="inline-flex h-11 cursor-not-allowed items-center justify-center rounded-xl bg-gray-200 px-5 text-sm font-medium text-gray-500"
                  >
                    Unavailable
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </>
  );
}