import Filter from "@/components/Filter";
import Search from "@/components/Search";
import prisma from "@/lib/prisma";
import CategoryTabs from "@/components/CategoryTabs";
import ProductsGrid from "@/components/ProductsGrid";
import ProductsGridSkeleton from "@/components/ProductsGridSkeleton";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products | ShopKart",
  description:
    "Browse premium shoes, clothing, watches, and accessories on ShopKart.",
  alternates: {
    canonical: "https://shopkartsite.vercel.app/products",
  },
};

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

  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });

  const suspenseKey = JSON.stringify({
    page: currentPage,
    price,
    search,
    category: rawCategory ?? "",
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
            </div>
          </div>
        </div>

        {categories.length > 0 ? (
          <CategoryTabs
            categories={categories}
            initialCategory={hasCategory ? String(rawCategory) : null}
          />
        ) : null}

        <Suspense key={suspenseKey} fallback={<ProductsGridSkeleton />}>
          <ProductsGrid
            currentPage={currentPage}
            price={price}
            search={search}
            rawCategory={typeof rawCategory === "string" ? rawCategory : ""}
          />
        </Suspense>
      </main>
    </div>
  );
}