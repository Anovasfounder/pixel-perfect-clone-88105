import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { AnnouncementBar } from "@/components/site/AnnouncementBar";
import { ProductCard, type ProductCardData } from "@/components/site/ProductCard";
import { useProducts } from "@/lib/db";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Store } from "lucide-react";

const sb = supabase as any;

const SITE_URL = "https://glass-morph-vision.lovable.app";

export const Route = createFileRoute("/brand/$id")({
  head: ({ params }) => {
    const canonical = `${SITE_URL}/brand/${params.id}`;
    const description = "Browse digital keys and software from this brand on BundleByte — verified licences with instant delivery.";
    return {
      meta: [
        { title: "Shop by brand — BundleByte" },
        { name: "description", content: description },
        { property: "og:title", content: "Shop by brand — BundleByte" },
        { property: "og:description", content: description },
        { property: "og:url", content: canonical },
      ],
      links: [{ rel: "canonical", href: canonical }],
    };
  },
  component: BrandPage,
});

function BrandPage() {
  const { id } = Route.useParams();
  const { items: products, loading } = useProducts();
  const { data: brand, isLoading: bLoading } = useQuery({
    queryKey: ["brand", id],
    queryFn: async () => {
      const { data, error } = await sb.from("brands").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data ? { id: data.id, name: data.name, icon: data.icon } : null;
    },
  });

  const filtered = useMemo(() => products.filter((p) => p.brandId === id), [products, id]);

  const cards: ProductCardData[] = filtered.map((p) => ({
    id: p.id,
    title: p.subtitle || p.title,
    subtitle: p.title,
    oldPrice: p.oldPrice ? `₹${p.oldPrice.toLocaleString("en-IN")}` : "",
    price: `₹${p.price.toLocaleString("en-IN")}`,
    image: p.image || undefined,
  }));

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <AnnouncementBar />
      <Header />
      <section className="px-4 sm:px-6 md:px-12 py-10">
        <div className="max-w-6xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-fuchsia-600 mb-4">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to home
          </Link>
          <div className="flex items-center gap-2 mb-2">
            {brand?.icon ? (
              <span className="text-2xl leading-none">{brand.icon}</span>
            ) : (
              <Store className="w-5 h-5 text-fuchsia-600" />
            )}
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {bLoading ? "Loading…" : brand?.name ?? "Brand"}
            </h1>
          </div>
          <p className="text-sm text-gray-500 mb-8">
            {loading ? "Loading products…" : `${filtered.length} product${filtered.length === 1 ? "" : "s"} available`}
          </p>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-gray-50 aspect-[4/5] animate-pulse" />
              ))}
            </div>
          ) : cards.length === 0 ? (
            <div className="text-center py-20 text-sm text-gray-500 rounded-3xl backdrop-blur-xl bg-white/60 border border-white/60">
              No products for this brand yet.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {cards.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
