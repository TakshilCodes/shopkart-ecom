"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Category = {
  id: string;
  name: string;
  slug: string;
};

type Props = {
  categories: Category[];
  initialCategory: string | null;
};

export default function CategoryTabs({
  categories,
  initialCategory,
}: Props) {
  const [activeCategory, setActiveCategory] = useState<string | null>(
    initialCategory
  );
  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setActiveCategory(initialCategory);
  }, [initialCategory]);

  function handleCategoryClick(category: string | null) {
    setActiveCategory(category); // instant UI update

    const params = new URLSearchParams(searchParams.toString());

    // reset pagination when category changes
    params.delete("page");

    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }

  return (
    <div className="mb-8 flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
      <button
        type="button"
        onClick={() => handleCategoryClick(null)}
        className={`whitespace-nowrap rounded-full border px-5 py-2.5 text-sm font-medium transition ${
          !activeCategory
            ? "border-black bg-black text-white"
            : "border-gray-300 bg-white text-gray-700 hover:border-black hover:text-black"
        } ${isPending ? "opacity-80" : ""}`}
      >
        All
      </button>

      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => handleCategoryClick(category.slug)}
          className={`whitespace-nowrap rounded-full border px-5 py-2.5 text-sm font-medium transition ${
            activeCategory === category.slug
              ? "border-black bg-black text-white"
              : "border-gray-300 bg-white text-gray-700 hover:border-black hover:text-black"
          } ${isPending ? "opacity-80" : ""}`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}