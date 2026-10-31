"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartLine = {
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  stock: number;
};

type CartContextValue = {
  items: CartLine[];
  ready: boolean;
  addItem: (item: Omit<CartLine, "quantity"> & { quantity?: number }) => void;
  updateQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clear: () => void;
  count: number;
  subtotal: number;
};

const STORAGE_KEY = "mkfa_cart";
const CartContext = createContext<CartContextValue | null>(null);

export function lineKey(item: Pick<CartLine, "productId" | "size" | "color">) {
  return [item.productId, item.size || "", item.color || ""].join(":");
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartLine[]);
    } catch {
      setItems([]);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  const value = useMemo<CartContextValue>(() => {
    const addItem: CartContextValue["addItem"] = (item) => {
      setItems((current) => {
        const key = lineKey(item);
        const existing = current.find((row) => lineKey(row) === key);
        const quantity = item.quantity ?? 1;
        if (existing) {
          return current.map((row) =>
            lineKey(row) === key
              ? { ...row, quantity: Math.min(row.stock, row.quantity + quantity) }
              : row,
          );
        }
        return [...current, { ...item, quantity: Math.min(item.stock, quantity) }];
      });
    };

    return {
      items,
      ready,
      addItem,
      updateQuantity(key, quantity) {
        setItems((current) =>
          current
            .map((row) =>
              lineKey(row) === key ? { ...row, quantity: Math.min(row.stock, Math.max(1, quantity)) } : row,
            )
            .filter((row) => row.quantity > 0),
        );
      },
      removeItem(key) {
        setItems((current) => current.filter((row) => lineKey(row) !== key));
      },
      clear() {
        setItems([]);
      },
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    };
  }, [items, ready]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
