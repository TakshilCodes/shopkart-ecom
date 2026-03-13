import { create } from "zustand";

type CartStore = {
  cartCount: number;
  setCartCount: (count: number) => void;
  clearCartCount: () => void;
  refreshCartCount: () => Promise<void>;
};

const useCartStore = create<CartStore>((set) => ({
  cartCount: 0,

  setCartCount: (count) => set({ cartCount: count }),

  clearCartCount: () => set({ cartCount: 0 }),

  refreshCartCount: async () => {
    try {
      const res = await fetch("/api/cart/count", { cache: "no-store" });
      const data = await res.json();
      set({ cartCount: data?.count ?? 0 });
    } catch {
      set({ cartCount: 0 });
    }
  },
}));

export default useCartStore;
