import { useEffect, useState, useCallback } from "react";

// ============== Types ==============
export type AdminProduct = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  categoryId: string;
  price: number;
  oldPrice?: number;
  image: string;
  paymentLink: string;
  createdAt: number;
};

export type AdminCategory = {
  id: string;
  name: string;
  icon?: string;
  createdAt: number;
};

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

// ============== Keys ==============
const K_PRODUCTS = "bb:admin:products";
const K_CATEGORIES = "bb:admin:categories";
const K_SALES = "bb:admin:sales";
const K_NEWSLETTER = "bb:admin:newsletter";
const K_SESSION = "bb:admin:session";

// Default credentials (demo). Admin can change later via backend.
export const ADMIN_USERNAME = "admin";
export const ADMIN_PASSWORD = "admin123";

// ============== Generic localStorage hook ==============
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

// ============== Seed defaults ==============
const SEED_CATEGORIES: AdminCategory[] = [
  { id: "cat-software", name: "Software", icon: "💻", createdAt: Date.now() },
  { id: "cat-games", name: "Games", icon: "🎮", createdAt: Date.now() },
  { id: "cat-streaming", name: "Streaming", icon: "📺", createdAt: Date.now() },
];

// ============== Hooks ==============
export function useProducts() {
  const [items, setItems] = useLS<AdminProduct[]>(K_PRODUCTS, []);
  const add = (p: Omit<AdminProduct, "id" | "createdAt">) =>
    setItems((prev) => [{ ...p, id: uid(), createdAt: Date.now() }, ...prev]);
  const remove = (id: string) => setItems((prev) => prev.filter((p) => p.id !== id));
  const update = (id: string, patch: Partial<AdminProduct>) =>
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  return { items, add, remove, update };
}

export function useCategories() {
  const [items, setItems] = useLS<AdminCategory[]>(K_CATEGORIES, SEED_CATEGORIES);
  const add = (c: Omit<AdminCategory, "id" | "createdAt">) =>
    setItems((prev) => [{ ...c, id: uid(), createdAt: Date.now() }, ...prev]);
  const remove = (id: string) => setItems((prev) => prev.filter((c) => c.id !== id));
  return { items, add, remove };
}

export function useSales() {
  const [items, setItems] = useLS<AdminSale[]>(K_SALES, []);
  const add = (s: Omit<AdminSale, "id" | "date">) =>
    setItems((prev) => [{ ...s, id: uid(), date: Date.now() }, ...prev]);
  return { items, add };
}

export function useNewsletter() {
  const [items, setItems] = useLS<NewsletterSubscriber[]>(K_NEWSLETTER, []);
  const add = (email: string) =>
    setItems((prev) => (prev.some((e) => e.email === email) ? prev : [{ id: uid(), email, date: Date.now() }, ...prev]));
  const remove = (id: string) => setItems((prev) => prev.filter((e) => e.id !== id));
  return { items, add, remove };
}

// ============== Auth ==============
export function useAdminAuth() {
  const [session, setSession] = useState<{ user: string } | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem(K_SESSION) : null;
      if (raw) setSession(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  const login = useCallback((username: string, password: string) => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const s = { user: username };
      window.localStorage.setItem(K_SESSION, JSON.stringify(s));
      setSession(s);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(K_SESSION);
    setSession(null);
  }, []);

  return { session, ready, login, logout, isAuthed: !!session };
}

// Convenience: add a subscriber from anywhere (used by footer form without hook prop drilling)
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
