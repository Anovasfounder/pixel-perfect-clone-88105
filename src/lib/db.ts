import { useEffect, useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Cast supabase to any for tables not yet in generated types
const sb = supabase as any;

// ============== Fixed admin credentials ==============
export const ADMIN_EMAIL = "bundlebyte@gmail.com";
export const ADMIN_PASSWORD = "7992193730";

// ============== Types ==============
export type Category = {
  id: string;
  name: string;
  icon: string | null;
  createdAt: string;
};

export type Product = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  categoryId: string | null;
  price: number;
  oldPrice: number | null;
  image: string;
  paymentLink: string;
  createdAt: string;
};

export type NewsletterRow = { id: string; email: string; createdAt: string };
export type SaleRow = {
  id: string;
  productId: string | null;
  productTitle: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  createdAt: string;
};

function mapCategory(row: any): Category {
  return { id: row.id, name: row.name, icon: row.icon, createdAt: row.created_at };
}
function mapProduct(row: any): Product {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle ?? "",
    description: row.description ?? "",
    categoryId: row.category_id,
    price: Number(row.price ?? 0),
    oldPrice: row.old_price !== null && row.old_price !== undefined ? Number(row.old_price) : null,
    image: row.image ?? "",
    paymentLink: row.payment_link ?? "",
    createdAt: row.created_at,
  };
}

// ============== Categories ==============
export function useCategories() {
  const qc = useQueryClient();
  const q = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await sb.from("categories").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapCategory);
    },
  });
  const add = useMutation({
    mutationFn: async (input: { name: string; icon?: string }) => {
      const { error } = await sb.from("categories").insert({ name: input.name, icon: input.icon ?? null });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await sb.from("categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
  return { items: q.data ?? [], loading: q.isLoading, error: q.error as Error | null, add, remove };
}

// ============== Products ==============
export function useProducts() {
  const qc = useQueryClient();
  const q = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await sb.from("products").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapProduct);
    },
  });
  const add = useMutation({
    mutationFn: async (input: {
      title: string;
      subtitle: string;
      description: string;
      categoryId: string;
      price: number;
      oldPrice?: number;
      image: string;
      paymentLink: string;
    }) => {
      const { error } = await sb.from("products").insert({
        title: input.title,
        subtitle: input.subtitle,
        description: input.description,
        category_id: input.categoryId,
        price: input.price,
        old_price: input.oldPrice ?? null,
        image: input.image,
        payment_link: input.paymentLink,
      });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await sb.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
  return {
    items: q.data ?? [],
    loading: q.isLoading,
    loaded: q.isFetched && !q.isLoading,
    error: q.error as Error | null,
    add,
    remove,
  };
}

export function useProduct(id: string | undefined) {
  return useQuery<Product | null>({
    queryKey: ["product", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await sb.from("products").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data ? mapProduct(data) : null;
    },
  });
}

// ============== Newsletter ==============
export function useNewsletter() {
  const qc = useQueryClient();
  const q = useQuery<NewsletterRow[]>({
    queryKey: ["newsletter"],
    queryFn: async () => {
      const { data, error } = await sb
        .from("newsletter_subscribers")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((r: any) => ({ id: r.id, email: r.email, createdAt: r.created_at }));
    },
  });
  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await sb.from("newsletter_subscribers").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["newsletter"] }),
  });
  return { items: q.data ?? [], loading: q.isLoading, remove };
}

export async function subscribeEmail(email: string) {
  const { error } = await sb.from("newsletter_subscribers").insert({ email });
  // Ignore unique violation so users get a friendly success even if they re-subscribe
  if (error && (error.code === "23505" || /duplicate/i.test(error.message ?? ""))) return;
  if (error) throw error;
}

// ============== Sales ==============
export function useSales() {
  const q = useQuery<SaleRow[]>({
    queryKey: ["sales"],
    queryFn: async () => {
      const { data, error } = await sb.from("sales").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((r: any) => ({
        id: r.id,
        productId: r.product_id,
        productTitle: r.product_title,
        customerName: r.customer_name,
        customerEmail: r.customer_email,
        amount: Number(r.amount ?? 0),
        createdAt: r.created_at,
      }));
    },
  });
  return { items: q.data ?? [], loading: q.isLoading };
}

export async function recordSale(input: {
  productId: string | null;
  productTitle: string;
  customerName: string;
  customerEmail: string;
  amount: number;
}) {
  const { error } = await sb.from("sales").insert({
    product_id: input.productId,
    product_title: input.productTitle,
    customer_name: input.customerName,
    customer_email: input.customerEmail,
    amount: input.amount,
  });
  if (error) throw error;
}

// ============== Auth (Supabase) — fixed single admin account ==============
export function useSupabaseAuth() {
  const [session, setSession] = useState<any>(null);
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!session?.user) {
      setIsAdmin(false);
      return;
    }
    sb.from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .eq("role", "admin")
      .maybeSingle()
      .then(({ data }: any) => {
        if (!cancelled) setIsAdmin(!!data);
      });
    return () => {
      cancelled = true;
    };
  }, [session]);

  // Sign in with the fixed admin email/password. On first ever attempt the
  // account doesn't exist yet — auto-bootstrap it. The DB trigger grants
  // admin role to the first signup.
  const signIn = useCallback(async (email: string, password: string) => {
    if (email.trim().toLowerCase() !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      throw new Error("Invalid credentials");
    }
    const { error } = await supabase.auth.signInWithPassword({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
    if (!error) return;
    const msg = (error.message ?? "").toLowerCase();
    if (msg.includes("invalid") || msg.includes("not found") || msg.includes("credentials")) {
      const { error: suErr } = await supabase.auth.signUp({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        options: { emailRedirectTo: typeof window !== "undefined" ? window.location.origin + "/admin" : undefined },
      });
      if (suErr) throw suErr;
      const { error: siErr } = await supabase.auth.signInWithPassword({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
      if (siErr) throw siErr;
      return;
    }
    throw error;
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return {
    session,
    user: session?.user ?? null,
    isAuthed: !!session,
    isAdmin,
    ready,
    signIn,
    signOut,
  };
}
