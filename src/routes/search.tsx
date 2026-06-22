import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { AnnouncementBar } from "@/components/site/AnnouncementBar";
import { ProductCard, type ProductCardData } from "@/components/site/ProductCard";
import { useProducts } from "@/lib/db";
import { ArrowLeft, Search as SearchIcon } from "lucide-react";

const schema = z.object({
  q: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/search")({
  validateSearch: zodValidator(schema),
  head: () => {
    const canonical = "https://glass-morph-vision.lovable.app/search";
    const description = "Search BundleByte's catalogue of verified digital keys, game codes, software licences and subscriptions across every platform.";
    return {
      meta: [
        { title: "Search digital keys & software — BundleByte" },
        { name: "description", content: description },
        { property: "og:title", content: "Search digital keys & software — BundleByte" },
        { property: "og:description", content: description },
        { property: "og:url", content: canonical },
        { name: "robots", content: "noindex,follow" },
      ],
      links: [{ rel: "canonical", href: canonical }],
    };
  },
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const navigate = useNavigate({ from: "/search" });
  const { items: products, loading } = useProducts();
  const [value, setValue] = useState(q);

  useEffect(() => {
    setValue(q);
  }, [q]);

  const term = q.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!term) return products;
    return products.filter((p) => {
      const hay = `${p.title} ${p.subtitle} ${p.description} ${p.platform ?? ""} ${p.region ?? ""}`.toLowerCase();
      return hay.includes(term);
    });
  }, [products, term]);

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
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-4">Search</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              navigate({ search: { q: value.trim() } });
            }}
            className="flex items-center bg-white/80 backdrop-blur-md border border-gray-200 rounded-full shadow-sm pl-2 pr-3 h-12 max-w-xl mb-6"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-400 to-fuchsia-500 flex items-center justify-center mr-2 shrink-0">
              <SearchIcon className="w-4 h-4 text-white" />
            </div>
            <input
              autoFocus
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Search products, keys, platforms…"
              className="flex-1 min-w-0 bg-transparent outline-none text-sm placeholder:text-gray-400"
            />
            <button className="ml-2 h-9 px-4 rounded-full text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600">
              Search
            </button>
          </form>
          <p className="text-sm text-gray-500 mb-6">
            {loading
              ? "Loading…"
              : term
              ? `${filtered.length} result${filtered.length === 1 ? "" : "s"} for "${q}"`
              : `${products.length} product${products.length === 1 ? "" : "s"}`}
          </p>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-gray-50 aspect-[4/5] animate-pulse" />
              ))}
            </div>
          ) : cards.length === 0 ? (
            <div className="text-center py-20 text-sm text-gray-500 rounded-3xl backdrop-blur-xl bg-white/60 border border-white/60">
              No products match your search.
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
