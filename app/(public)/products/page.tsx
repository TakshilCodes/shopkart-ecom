import Filter from "@/components/Filter";
import Search from "@/components/Search";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function Products(props: PageProps<"/products">) {
  const searchParams = await props.searchParams;

  const currentPageRaw = Array.isArray(searchParams?.page)
    ? searchParams.page[0]
    : searchParams?.page;
  const currentPage = Number(currentPageRaw ?? "1");

  const priceRaw = Array.isArray(searchParams?.price)
    ? searchParams.price[0]
    : searchParams?.price;
  const price = Number(priceRaw ?? "200000");

  const searchRaw = Array.isArray(searchParams?.search)
    ? searchParams.search[0]
    : searchParams?.search;
  const search = searchRaw ?? "";

  const rawCategory = Array.isArray(searchParams?.category)
    ? searchParams.category[0]
    : searchParams?.category;
  const hasCategory =
    typeof rawCategory === "string" && rawCategory.trim().length > 0;

  const categorys = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });

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
    ...(hasCategory ? { category: { slug: String(rawCategory) } } : {}),
  };

  const totalproducts = await prisma.product.count({
    where,
  });

  const totalpages = Math.ceil(totalproducts / 25);
  const totalpages_array = Array.from({ length: totalpages }, (_, i) => i + 1);

  const session = await getServerSession(authOptions);
  const user = session?.user.id;

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

  return (
    <div className="min-h-screen px-4 pb-12 pt-40 sm:px-6 lg:px-8">
      <main className="mx-auto max-w-7xl">
        <div className="mb-8 space-y-5">
          <Search />

          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900">
                Products
              </p>
              <p className="mt-2 text-sm sm:text-base text-gray-600">
                Explore premium styles, discover categories, and find your perfect pair.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Filter />
              <div className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 shadow-sm">
                {totalproducts} product{totalproducts !== 1 ? "s" : ""}
              </div>
            </div>
          </div>
        </div>

        {categorys.length > 0 ? (
          <div className="mb-8 flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <Link
              className={`whitespace-nowrap rounded-full border px-5 py-2.5 text-sm font-medium transition ${
                !hasCategory
                  ? "border-black bg-black text-white"
                  : "border-gray-300 bg-white text-gray-700 hover:border-black hover:text-black"
              }`}
              href="/products"
            >
              All
            </Link>

            {categorys.map((category) => (
              <Link
                key={category.slug}
                className={`whitespace-nowrap rounded-full border px-5 py-2.5 text-sm font-medium transition ${
                  rawCategory === category.slug
                    ? "border-black bg-black text-white"
                    : "border-gray-300 bg-white text-gray-700 hover:border-black hover:text-black"
                }`}
                href={`/products?category=${category.slug}`}
              >
                {category.name}
              </Link>
            ))}
          </div>
        ) : null}

        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {products.map((product) => {
                return (
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
                );
              })}
            </div>

            <div className="mt-14 flex flex-wrap items-center justify-center gap-2">
              {currentPage > 1 ? (
                search ? (
                  <Link
                    href={`/products?page=${currentPage - 1}&search=${search}`}
                    className="inline-flex h-10 items-center justify-center rounded-xl border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 transition hover:border-black hover:text-black"
                  >
                    Prev
                  </Link>
                ) : (
                  <Link
                    href={`/products?page=${currentPage - 1}`}
                    className="inline-flex h-10 items-center justify-center rounded-xl border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 transition hover:border-black hover:text-black"
                  >
                    Prev
                  </Link>
                )
              ) : (
                <button
                  disabled
                  className="inline-flex h-10 cursor-not-allowed items-center justify-center rounded-xl border border-gray-200 bg-gray-100 px-4 text-sm font-medium text-gray-400"
                >
                  Prev
                </button>
              )}

              {totalpages_array.map((page) => (
                <div key={page}>
                  {search ? (
                    hasCategory ? (
                      <Link
                        className={`inline-flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-medium transition ${
                          currentPage === page
                            ? "border-black bg-black text-white"
                            : "border-gray-300 bg-white text-gray-700 hover:border-black hover:text-black"
                        }`}
                        href={`/products?page=${page}&search=${search}&category=${rawCategory}`}
                      >
                        {page}
                      </Link>
                    ) : (
                      <Link
                        className={`inline-flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-medium transition ${
                          currentPage === page
                            ? "border-black bg-black text-white"
                            : "border-gray-300 bg-white text-gray-700 hover:border-black hover:text-black"
                        }`}
                        href={`/products?page=${page}&search=${search}`}
                      >
                        {page}
                      </Link>
                    )
                  ) : (
                    <Link
                      className={`inline-flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-medium transition ${
                        currentPage === page
                          ? "border-black bg-black text-white"
                          : "border-gray-300 bg-white text-gray-700 hover:border-black hover:text-black"
                      }`}
                      href={`/products?page=${page}${
                        hasCategory ? `&category=${rawCategory}` : ""
                      }`}
                    >
                      {page}
                    </Link>
                  )}
                </div>
              ))}

              {totalpages > 1 && currentPage !== totalpages ? (
                search ? (
                  <Link
                    href={`/products?page=${currentPage + 1}&search=${search}`}
                    className="inline-flex h-10 items-center justify-center rounded-xl border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 transition hover:border-black hover:text-black"
                  >
                    Next
                  </Link>
                ) : (
                  <Link
                    href={`/products?page=${currentPage + 1}`}
                    className="inline-flex h-10 items-center justify-center rounded-xl border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 transition hover:border-black hover:text-black"
                  >
                    Next
                  </Link>
                )
              ) : (
                <button
                  disabled
                  className="inline-flex h-10 cursor-not-allowed items-center justify-center rounded-xl border border-gray-200 bg-gray-100 px-4 text-sm font-medium text-gray-400"
                >
                  Next
                </button>
              )}
            </div>
          </>
        ) : search ? (
          <div className="flex justify-center items-center py-32">
            <div className="rounded-3xl border border-gray-200 bg-white px-10 py-12 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-xl">
                🔍
              </div>
              <p className="text-lg text-gray-700">
                No products matching{" "}
                <span className="font-semibold text-black">{search}</span>.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center py-32">
            <div className="rounded-3xl border border-gray-200 bg-white px-10 py-12 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-xl">
                📦
              </div>
              <p className="text-lg text-gray-700">No products.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}