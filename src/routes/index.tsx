import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Minus, Sparkles, Tag, Flame, Wallet, HelpCircle, Store } from "lucide-react";
import { useState, useMemo } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { AnnouncementBar } from "@/components/site/AnnouncementBar";
import { Reveal } from "@/components/site/Reveal";
import { ProductCard, type ProductCardData } from "@/components/site/ProductCard";
import { useProducts, useBudgets } from "@/lib/db";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BundleByte — Digital Keys & Software Marketplace" },
      { name: "description", content: "Trending apps, games and software keys with instant delivery at unbeatable prices." },
    ],
  }),
  component: Index,
});

const HERO_BG = "https://i.ibb.co/21bcVVsW/Chat-GPT-Image-Jun-14-2026-11-36-52-AM.png";
const LABEL = "https://i.ibb.co/4RJ8gC2L/Chat-GPT-Image-Jun-14-2026-12-40-24-PM-1.png";

function SectionTitle({ icon: Icon, children }: { icon?: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Icon && <Icon className="w-5 h-5 text-fuchsia-600" />}
      <h2 className="text-center text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">{children}</h2>
    </div>
  );
}

function FaqItem({ q, a, defaultOpen = false }: { q: string; a?: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center justify-between py-4 text-left">
        <span className="text-sm font-medium text-gray-900">{q}</span>
        {open ? <Minus className="w-4 h-4 text-gray-500" /> : <Plus className="w-4 h-4 text-gray-500" />}
      </button>
      <div className={`grid transition-all duration-300 ease-out ${open ? "grid-rows-[1fr] opacity-100 pb-4" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">
          <p className="text-sm text-gray-700 leading-relaxed pr-6">
            {a ?? "BundleByte delivers verified digital keys instantly to your inbox after purchase. Our team supports you end-to-end across activation, billing and product questions."}
          </p>
        </div>
      </div>
    </div>
  );
}

function Index() {
  const { items: dbProducts, loading } = useProducts();
  const { items: budgets } = useBudgets();

  const toCard = (p: typeof dbProducts[number]): ProductCardData => ({
    id: p.id,
    title: p.subtitle || p.title,
    subtitle: p.title,
    oldPrice: p.oldPrice ? `₹${p.oldPrice.toLocaleString("en-IN")}` : "",
    price: `₹${p.price.toLocaleString("en-IN")}`,
    image: p.image || undefined,
  });

  const products = useMemo(() => dbProducts.filter((p) => !p.isKey).map(toCard), [dbProducts]);
  const keyProducts = useMemo(() => dbProducts.filter((p) => p.isKey).map(toCard), [dbProducts]);
  const hasProducts = products.length > 0;
  const hasKeys = keyProducts.length > 0;

  const SkeletonCard = () => (
    <div className="rounded-2xl bg-white/60 border border-white/60 shadow-sm aspect-[4/5] animate-pulse" />
  );
  const EmptyState = ({ label }: { label: string }) => (
    <div className="col-span-full text-center text-sm text-gray-500 py-10 rounded-3xl backdrop-blur-xl bg-white/60 border border-white/60">
      {label}
    </div>
  );

  const brands = ["Xbox", "PlayStation", "Unlock", "AI", "Switch", "Joy-Con"];
  const faqs = [
    "How long does a typical delivery take?",
    "What's your pricing structure?",
    "Do you provide ongoing support after purchase?",
    "What platforms do you work with?",
    "How do I redeem my key?",
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <AnnouncementBar />
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden isolate">
        <img src={HERO_BG} alt="" className="absolute inset-0 w-full h-full object-cover z-0" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-32 md:w-56 z-[1] bg-gradient-to-r from-white/85 via-white/40 to-transparent backdrop-blur-[2px]" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-32 md:w-56 z-[1] bg-gradient-to-l from-white/85 via-white/40 to-transparent backdrop-blur-[2px]" />

        <div className="relative z-10 px-4 sm:px-6 md:px-12 py-10 sm:py-14">
          <Reveal>
            <h1 className="text-center text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-wide text-white drop-shadow-lg mb-8 sm:mb-10 flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5" /> BROWSE BY CATEGORIES
            </h1>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 max-w-6xl mx-auto">
            {loading && !hasProducts
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              : hasProducts
              ? products.slice(0, 4).map((p, i) => (
                  <Reveal key={p.id} delay={i * 80}>
                    <div className="rounded-3xl p-3 backdrop-blur-2xl bg-white/60 border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.18)]">
                      <ProductCard product={p} />
                    </div>
                  </Reveal>
                ))
              : <EmptyState label="No products yet — add some from the admin panel." />}
          </div>
        </div>
      </section>

      {/* Random keys */}
      <section className="px-4 sm:px-6 md:px-12 py-10 sm:py-14">
        <Reveal><SectionTitle icon={Tag}>Random keys</SectionTitle></Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5 max-w-6xl mx-auto mt-8 sm:mt-10">
          {loading && !hasProducts
            ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
            : hasProducts
            ? products.slice(0, 5).map((p, i) => (
                <Reveal key={p.id + "-r"} delay={i * 60}>
                  <ProductCard product={p} />
                </Reveal>
              ))
            : <EmptyState label="No products to show yet." />}
        </div>
      </section>

      {/* Shop by brand */}
      <section className="px-4 sm:px-6 md:px-12 py-10 border-t border-gray-100">
        <Reveal><SectionTitle icon={Store}>Shop by brand</SectionTitle></Reveal>
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-8 max-w-5xl mx-auto">
          {brands.map((b, i) => (
            <Reveal key={b} delay={i * 50}>
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl backdrop-blur-xl bg-white/60 border border-white/60 shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_32px_rgba(168,85,247,0.18)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center text-gray-700 text-xs sm:text-sm font-bold tracking-tight">
                {b}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Best sellers — bento */}
      <section className="px-4 sm:px-6 md:px-12 py-14 border-t border-gray-100">
        <Reveal><SectionTitle icon={Flame}>BEST SELLERS</SectionTitle></Reveal>
        <div className="mt-10 max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 md:grid-rows-2 gap-4 md:auto-rows-fr">
          {loading && !hasProducts ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          ) : hasProducts ? (
            <>
              <Reveal className="md:col-span-2 md:row-span-2">
                <div className="h-full rounded-3xl p-4 backdrop-blur-2xl bg-gradient-to-br from-violet-100/80 via-pink-100/70 to-blue-100/80 border border-white/60 shadow-[0_12px_40px_-10px_rgba(168,85,247,0.35)]">
                  <ProductCard product={products[0]} />
                </div>
              </Reveal>
              {products.slice(1, 4).map((p, i) => (
                <Reveal key={p.id + "-bs"} delay={i * 80}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </>
          ) : (
            <EmptyState label="Best sellers will appear here once you add products." />
          )}
        </div>
      </section>

      {/* Budget */}
      <section className="px-4 sm:px-6 md:px-12 py-14 border-t border-gray-100">
        <Reveal><SectionTitle icon={Wallet}>Budget</SectionTitle></Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-5xl mx-auto mt-10">
          {budgets.map((b, i) => (
            <Reveal key={b} delay={i * 60}>
              <div className="rounded-2xl px-5 py-4 backdrop-blur-2xl bg-white/60 border border-white/60 shadow-[0_8px_24px_rgba(0,0,0,0.08)] flex items-center justify-between hover:-translate-y-0.5 transition">
                <span className="text-sm font-semibold text-gray-800">
                  UPTO :<br />
                  <span className="text-base">{b}</span>
                </span>
                <img src={LABEL} alt="" className="w-12 h-10 object-cover rounded" />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="px-4 sm:px-6 md:px-12 py-14 border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <h2 className="text-center text-2xl font-bold border-y border-gray-200 py-3 flex items-center justify-center gap-2">
              <HelpCircle className="w-5 h-5 text-fuchsia-600" /> FAQS
            </h2>
          </Reveal>

          <Reveal>
            <div className="mt-6 rounded-2xl backdrop-blur-2xl bg-white/70 border border-white/60 shadow-lg px-5">
              <FaqItem q="What services do you offer?" a="BundleByte specializes in officially licensed digital keys for apps, games and productivity software. We handle activation, support, and lifetime delivery." />
              {faqs.map((q) => <FaqItem key={q} q={q} />)}
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
