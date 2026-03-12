"use client";

import useDebounced from "@/Hooks/useDebounced";
import searchImg from "@/assets/icons/search.png";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Search() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounced(search);
  const router = useRouter();

  const userTyped = useRef(false);

  useEffect(() => {
    if (!userTyped.current) return;

    const params = new URLSearchParams(window.location.search);

    if (debouncedSearch.trim()) {
      params.set("search", debouncedSearch.trim());
    } else {
      params.delete("search");
    }

    router.replace(params.toString() ? `/products?${params}` : "/products");
  }, [debouncedSearch, router]);

  return (
    <div className="flex justify-center pb-16">
      <div className="relative w-full max-w-xl">

        {/* Search Icon */}
        <img
          src={searchImg.src}
          alt="search"
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-70"
        />

        {/* Input */}
        <input
          type="text"
          value={search}
          placeholder="Search products..."
          onChange={(e) => {
            userTyped.current = true;
            setSearch(e.target.value);
          }}
          className="w-full pl-12 pr-10 py-3 rounded-3xl border border-gray-300 bg-white text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
        />

        {/* Clear Button */}
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black text-lg"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}