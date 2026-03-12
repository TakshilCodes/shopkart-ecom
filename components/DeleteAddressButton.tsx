"use client";

import { deleteAddress } from "@/actions/action.address";
import { useState } from "react";
import { toast } from "sonner";

export default function DeleteAddressButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);

    const res = await deleteAddress(id);

    if (res.ok) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }

    setLoading(false);
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="inline-flex items-center justify-center h-10 px-4 rounded-xl border border-red-200 text-sm font-medium text-red-600 hover:bg-red-50 transition"
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}