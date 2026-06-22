import { useEffect, useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Cast supabase to any for tables not yet in generated types
const sb = supabase as any;

// Columns safe for public consumption (payment_link intentionally excluded — it
// is fetched on demand via the get_product_payment_link RPC at checkout time).
const PRODUCT_PUBLIC_COLUMNS =
  "id,title,subtitle,description,category_id,price,old_price,image,is_key,platform,region,created_at";

export async function fetchProductPaymentLink(productId: string): Promise<string> {
  const { data, error } = await sb.rpc("get_product_payment_link", { p_id: productId });
  if (error) throw error;
  return typeof data === "string" ? data : "";
}

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
  isKey: boolean;
  platform: string | null;
  region: string | null;
  createdAt: string;
};

export type Budget = {
  id: string;
  label: string;
  maxAmount: number;
  sortOrder: number;
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
    isKey: !!row.is_key,
    platform: row.platform ?? null,
    region: row.region ?? null,
    createdAt: row.created_at,
  };
}
function mapBudget(row: any): Budget {
  return {
    id: row.id,
    label: row.label,
    maxAmount: Number(row.max_amount ?? 0),
    sortOrder: Number(row.sort_order ?? 0),
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
    staleTime: 60_000,
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
      const { data, error } = await sb.from("products").select(PRODUCT_PUBLIC_COLUMNS).order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapProduct);
    },
    staleTime: 30_000,
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
      isKey?: boolean;
      platform?: string;
      region?: string;
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
        is_key: !!input.isKey,
        platform: input.platform ?? null,
        region: input.region ?? null,
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

// ============== Budgets ==============
export function useBudgets() {
  const qc = useQueryClient();
  const q = useQuery<Budget[]>({
    queryKey: ["budgets"],
    queryFn: async () => {
      const { data, error } = await sb.from("budgets").select("*").order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []).map(mapBudget);
    },
    staleTime: 60_000,
  });
  const add = useMutation({
    mutationFn: async (input: { label: string; maxAmount: number; sortOrder?: number }) => {
      const { error } = await sb.from("budgets").insert({
        label: input.label,
        max_amount: input.maxAmount,
        sort_order: input.sortOrder ?? 0,
      });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["budgets"] }),
  });
  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await sb.from("budgets").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["budgets"] }),
  });
  return { items: q.data ?? [], loading: q.isLoading, add, remove };
}

export function useBudget(id: string | undefined) {
  return useQuery<Budget | null>({
    queryKey: ["budget", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await sb.from("budgets").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data ? mapBudget(data) : null;
    },
  });
}

// ============== Announcements ==============
export type Announcement = {
  id: string;
  message: string;
  sortOrder: number;
  active: boolean;
  createdAt: string;
};
function mapAnnouncement(row: any): Announcement {
  return {
    id: row.id,
    message: row.message,
    sortOrder: Number(row.sort_order ?? 0),
    active: !!row.active,
    createdAt: row.created_at,
  };
}
export function useAnnouncements(opts?: { activeOnly?: boolean }) {
  const qc = useQueryClient();
  const activeOnly = opts?.activeOnly ?? false;
  const q = useQuery<Announcement[]>({
    queryKey: ["announcements", { activeOnly }],
    queryFn: async () => {
      let query = sb.from("announcements").select("*").order("sort_order", { ascending: true });
      if (activeOnly) query = query.eq("active", true);
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []).map(mapAnnouncement);
    },
    staleTime: 60_000,
  });
  const add = useMutation({
    mutationFn: async (input: { message: string; sortOrder?: number; active?: boolean }) => {
      const { error } = await sb.from("announcements").insert({
        message: input.message,
        sort_order: input.sortOrder ?? 0,
        active: input.active ?? true,
      });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["announcements"] }),
  });
  const toggle = useMutation({
    mutationFn: async (input: { id: string; active: boolean }) => {
      const { error } = await sb.from("announcements").update({ active: input.active }).eq("id", input.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["announcements"] }),
  });
  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await sb.from("announcements").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["announcements"] }),
  });
  return { items: q.data ?? [], loading: q.isLoading, add, toggle, remove };
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

// ============== Auth (Supabase) — admin role verified server-side ==============
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
    const uid = session?.user?.id;
    if (!uid) {
      setIsAdmin(false);
      return;
    }
    // Verify admin status against user_roles via the SECURITY DEFINER has_role
    // RPC. The flag is informational for UI gating only — every sensitive write
    // is re-checked server-side by RLS using has_role(auth.uid(), 'admin').
    sb.rpc("has_role", { _user_id: uid, _role: "admin" }).then(({ data, error }: any) => {
      if (cancelled) return;
      setIsAdmin(!error && data === true);
    });
    return () => {
      cancelled = true;
    };
  }, [session]);

  const signIn = useCallback(async (email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) throw new Error("Enter your email and password");
    const { error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
    if (error) throw error;
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
