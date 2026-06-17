// Sales + newsletter remain in localStorage for now (frontend demo data).
// Products & Categories live in Supabase — see src/lib/db.ts
import { useEffect, useState } from "react";

export type AdminSale = {
  id: string;
  productId: string;
  productTitle: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  date: number;
};

export type NewsletterSubscriber = {
  id: string;
  email: string;
  date: number;
};

const K_SALES = "bb:admin:sales";
const K_NEWSLETTER = "bb:admin:newsletter";

function useLS<T>(key: string, initial: T): [T, (v: T | ((p: T) => T)) => void] {
  const [val, setVal] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
      if (raw) setVal(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, [key]);
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(val));
    } catch {}
  }, [key, val, hydrated]);
  return [val, setVal];
}

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

export function useSales() {
  const [items, setItems] = useLS<AdminSale[]>(K_SALES, []);
  const add = (s: Omit<AdminSale, "id" | "date">) =>
    setItems((prev) => [{ ...s, id: uid(), date: Date.now() }, ...prev]);
  return { items, add };
}

export function useNewsletter() {
  const [items, setItems] = useLS<NewsletterSubscriber[]>(K_NEWSLETTER, []);
  const add = (email: string) =>
    setItems((prev) =>
      prev.some((e) => e.email === email) ? prev : [{ id: uid(), email, date: Date.now() }, ...prev],
    );
  const remove = (id: string) => setItems((prev) => prev.filter((e) => e.id !== id));
  return { items, add, remove };
}

export function addNewsletterEmail(email: string) {
  try {
    const raw = window.localStorage.getItem(K_NEWSLETTER);
    const list: NewsletterSubscriber[] = raw ? JSON.parse(raw) : [];
    if (list.some((e) => e.email === email)) return;
    list.unshift({ id: uid(), email, date: Date.now() });
    window.localStorage.setItem(K_NEWSLETTER, JSON.stringify(list));
  } catch {}
}

export function addSale(s: Omit<AdminSale, "id" | "date">) {
  try {
    const raw = window.localStorage.getItem(K_SALES);
    const list: AdminSale[] = raw ? JSON.parse(raw) : [];
    list.unshift({ ...s, id: uid(), date: Date.now() });
    window.localStorage.setItem(K_SALES, JSON.stringify(list));
  } catch {}
}
