import Button from "@/components/Button";
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
    <div className="bg-neutral-50 min-h-screen px-20 pb-10 pt-45">
      <main>
        <Search />
        <div className="flex justify-between items-center">
          <Filter />
          <p className="text-5xl">Products</p>
        </div>

        {categorys.length > 0 ? (
          <div className="flex justify-start 2xl:justify-center items-center flex-nowrap space-x-10 py-10 overflow-x-auto scroll-smooth scrollbar-hide">
            <Link
              className="py-2 px-5 border border-gray-300 hover:border-black rounded-xl"
              href="/products"
            >
              All
            </Link>
            {categorys.map((category) => (
              <div key={category.slug}>
                <Link
                  className="py-3 px-4 border border-gray-300 hover:border-black rounded-xl whitespace-nowrap"
                  href={`/products?category=${category.slug}`}
                >
                  {category.name}
                </Link>
              </div>
            ))}
          </div>
        ) : null}

        {products.length > 0 ? (
          <div>
            <div className="flex justify-center items-center flex-wrap gap-6 cursor-pointer py-10">
              {products.map((product) => {
                return (
                  <div key={product.slug}>
                    <div className="p-5 w-full sm:w-72 md:w-80 hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 transition-all ease-in-out duration-300 rounded-3xl">
                      <Link href={`/products/${product.slug}`}>
                        <img src={product.prodImage} alt={product.name} />
                      </Link>
                      <div className="overflow-auto pt-3">
                        <Link
                          href={`/products/${product.slug}`}
                          className="text-sm font-bold text-center"
                        >
                          {product.name.length > 20
                            ? product.name.slice(0, 22) + "..."
                            : product.name}
                        </Link>
                        <div className="flex justify-between items-center p-3 mx-5">
                          <Link
                            href={`/products/${product.slug}`}
                            className="font-bold"
                          >
                            ₹{String(product.price)}
                          </Link>
                          {product._count.productvariant > 0 ? (
                            <Link
                              href={`/products/${product.slug}`}
                              className="inline-flex items-center justify-center h-11 px-6 rounded-xl text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-black/20 active:scale-[0.98] bg-black text-white hover:bg-gray-900"
                            >
                              Select a Size
                            </Link>
                          ) : (
                            <button
                              disabled
                              className="inline-flex items-center justify-center h-11 px-6 rounded-xl text-sm font-medium bg-gray-300 cursor-not-allowed"
                            >
                              Unavailable
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center mt-20">
              {currentPage > 1 ? (
                search ? (
                  <Link href={`/products?page=${currentPage - 1}&search=${search}`}>
                    Prev
                  </Link>
                ) : (
                  <Link href={`/products?page=${currentPage - 1}`}>Prev</Link>
                )
              ) : (
                <button disabled>Prev</button>
              )}

              {totalpages_array.map((page) => (
                <div key={page}>
                  {search ? (
                    hasCategory ? (
                      <Link
                        className="cursor-pointer p-0.5 px-2 m-2 border"
                        href={`/products?page=${page}&search=${search}&category=${rawCategory}`}
                      >
                        {page}
                      </Link>
                    ) : (
                      <Link
                        className="cursor-pointer p-0.5 px-2 m-2 border"
                        href={`/products?page=${page}&search=${search}`}
                      >
                        {page}
                      </Link>
                    )
                  ) : (
                    <Link
                      className="cursor-pointer p-0.5 px-2 m-2 border"
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
                  <Link href={`/products?page=${currentPage + 1}&search=${search}`}>
                    Next
                  </Link>
                ) : (
                  <Link href={`/products?page=${currentPage + 1}`}>Next</Link>
                )
              ) : (
                <button disabled>Next</button>
              )}
            </div>
          </div>
        ) : search ? (
          <div className="flex justify-center items-center py-40">
            <div className="text-lg">
              No products matching{" "}
              <span className="font-bold text-blue-700">{search}</span>.
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center py-40">
            No products.
          </div>
        )}
      </main>
    </div>
  );
}