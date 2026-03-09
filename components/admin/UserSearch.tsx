"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialValue = searchParams.get("q") || "";
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (value.trim()) {
        params.set("q", value.trim());
      } else {
        params.delete("q");
      }

      router.replace(`/admin/users?${params.toString()}`);
    }, 400);

    return () => clearTimeout(timer);
  }, [value, router, searchParams]);

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Search by name or email..."
      className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none transition focus:border-zinc-400"
    />
  );
}