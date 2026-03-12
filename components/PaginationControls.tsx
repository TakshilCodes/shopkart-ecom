"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

type Props = {
  currentPage: number;
  totalPages: number;
};

export default function PaginationControls({
  currentPage,
  totalPages,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pendingPage, setPendingPage] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  function goToPage(page: number) {
    setPendingPage(page);

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }

  const activePage = pendingPage ?? currentPage;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="mt-14 flex flex-wrap items-center justify-center gap-2">
      <button
        disabled={activePage <= 1 || isPending}
        onClick={() => goToPage(activePage - 1)}
        className="inline-flex h-10 items-center justify-center rounded-xl border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 transition hover:border-black hover:text-black disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400"
      >
        Prev
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => goToPage(page)}
          disabled={isPending}
          className={`inline-flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-medium transition ${
            activePage === page
              ? "border-black bg-black text-white"
              : "border-gray-300 bg-white text-gray-700 hover:border-black hover:text-black"
          } disabled:opacity-70`}
        >
          {page}
        </button>
      ))}

      <button
        disabled={activePage >= totalPages || isPending}
        onClick={() => goToPage(activePage + 1)}
        className="inline-flex h-10 items-center justify-center rounded-xl border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 transition hover:border-black hover:text-black disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400"
      >
        Next
      </button>
    </div>
  );
}