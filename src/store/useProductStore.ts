import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "../domain/entities/Product";

export type CartItem = { product: Product; quantity: number };
export const priceInCents = (price: string) => {
  if (!/^\d+(\.\d{1,2})?$/.test(price)) return null;
  const [whole, fraction = ""] = price.split(".");
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  return Number.isSafeInteger(cents) ? cents : null;
};

interface ProductState {
  items: CartItem[];
  addProduct: (product: Product) => void;
  setQuantity: (id: number, quantity: number) => void;
  removeProduct: (id: number) => void;
  clearCart: () => void;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set) => ({
      items: [],
      addProduct: (product) => {
        if (priceInCents(product.price) === null) return;
        set((state) => {
          const existing = state.items.find(
            (item) => item.product.id === product.id,
          );
          return {
            items: existing
              ? state.items.map((item) =>
                  item.product.id === product.id
                    ? { product, quantity: Math.min(item.quantity + 1, 99) }
                    : item,
                )
              : [...state.items, { product, quantity: 1 }],
          };
        });
      },
      setQuantity: (id, quantity) => {
        if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99)
          return;
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === id ? { ...item, quantity } : item,
          ),
        }));
      },
      removeProduct: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== id),
        })),
      clearCart: () => set({ items: [] }),
    }),
    { name: "product-cart", partialize: (state) => ({ items: state.items }) },
  ),
);
