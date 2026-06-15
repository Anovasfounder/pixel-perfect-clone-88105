import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type BundleItem = {
  id: string;
  title: string;
  subtitle?: string;
  price: number; // in rupees
  image?: string;
  qty: number;
};

type Ctx = {
  items: BundleItem[];
  count: number;
  total: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (item: Omit<BundleItem, "qty">, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
};

const BundleCtx = createContext<Ctx | null>(null);

const KEY = "bundlebyte:bundle";

export function BundleProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BundleItem[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem(KEY) : null;
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items, hydrated]);

  const value = useMemo<Ctx>(() => {
    const count = items.reduce((s, i) => s + i.qty, 0);
    const total = items.reduce((s, i) => s + i.qty * i.price, 0);
    return {
      items,
      count,
      total,
      isOpen,
      open: () => setOpen(true),
      close: () => setOpen(false),
      add: (item, qty = 1) =>
        setItems((prev) => {
          const found = prev.find((p) => p.id === item.id);
          if (found) return prev.map((p) => (p.id === item.id ? { ...p, qty: p.qty + qty } : p));
          return [...prev, { ...item, qty }];
        }),
      remove: (id) => setItems((prev) => prev.filter((p) => p.id !== id)),
      setQty: (id, qty) =>
        setItems((prev) =>
          qty <= 0 ? prev.filter((p) => p.id !== id) : prev.map((p) => (p.id === id ? { ...p, qty } : p)),
        ),
      clear: () => setItems([]),
    };
  }, [items, isOpen]);

  return <BundleCtx.Provider value={value}>{children}</BundleCtx.Provider>;
}

export function useBundle() {
  const ctx = useContext(BundleCtx);
  if (!ctx) throw new Error("useBundle must be used within BundleProvider");
  return ctx;
}

export function formatINR(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}
