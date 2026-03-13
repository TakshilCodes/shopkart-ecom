"use client";

import { deleteCartItem } from "@/actions/action.cart";
import useCartStore from "@/store/cartStore";
import { useRouter } from "next/navigation";
import deleteIcon from "@/assets/icons/delete.png";

export default function DeleteCartButton({ cartId }: { cartId: any }) {
  const router = useRouter();

  async function handleDelete() {
    const res:any = await deleteCartItem(cartId);

    if (!res?.ok) return;

    await useCartStore.getState().refreshCartCount();
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white transition hover:bg-gray-50"
    >
      <img src={deleteIcon.src} alt="delete item" className="w-5" />
    </button>
  );
}
