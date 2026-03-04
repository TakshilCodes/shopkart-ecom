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
    router.replace(params ? `/products?${params}` : "/products");
  }, [debouncedSearch, router]);

  return (
    <div className="flex justify-center pb-20">
      <div className="border rounded-4xl mx-auto w-100 flex justify-between items-center px-2">
        <input
          type="text"
          value={search}
          onChange={(e) => {userTyped.current = true; setSearch(e.target.value);}}
          className="outline-none w-full text-lg"
        />
        <img src={searchImg.src} alt="search" className="w-5 h-5 m-2" />
      </div>
    </div>
  );
}