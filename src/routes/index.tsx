import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Minus, Sparkles, Flame, Wallet, HelpCircle, Store } from "lucide-react";
import { useState, useMemo } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { AnnouncementBar } from "@/components/site/AnnouncementBar";
import { Reveal } from "@/components/site/Reveal";
import { ProductCard, type ProductCardData } from "@/components/site/ProductCard";
import { useProducts, useBudgets, useBrands } from "@/lib/db";

const HERO_BG = "https://i.ibb.co/21bcVVsW/Chat-GPT-Image-Jun-14-2026-11-36-52-AM.png";
const LABEL = "https://i.ibb.co/4RJ8gC2L/Chat-GPT-Image-Jun-14-2026-12-40-24-PM-1.png";
const SITE_URL = "https://glass-morph-vision.lovable.app";

const FAQS: Array<{ q: string; a: string }> = [
  {
    q: "What services do you offer?",
    a: "BundleByte specializes in officially licensed digital keys for apps, games and productivity software. We handle activation, support, and lifetime delivery.",
  },
  {
    q: "How long does a typical delivery take?",
    a: "Most keys are delivered to your inbox within 30 seconds of payment confirmation. Larger software bundles can take up to a few minutes.",
  },
  {
    q: "What's your pricing structure?",
    a: "We negotiate directly with publishers so prices stay 30-60% lower than retail. The price you see at checkout is the final price — no hidden fees.",
  },
  {
    q: "Do you provide ongoing support after purchase?",
    a: "Yes. Our team supports you end-to-end across activation, billing and product questions over chat and email.",
  },
  {
    q: "What platforms do you work with?",
    a: "We supply keys for Windows, macOS, Android, iOS, PlayStation, Xbox, Nintendo Switch and major web subscriptions.",
  },
  {
    q: "How do I redeem my key?",
    a: "Each delivery email includes platform-specific redemption steps. You can also reach out to support if anything blocks activation.",
  },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BundleByte — Digital Keys & Software Marketplace" },
      { name: "description", content: "Buy verified game keys, software licences and subscriptions at up to 60% off, with instant inbox delivery and dedicated support." },
      { property: "og:title", content: "BundleByte — Digital Keys & Software Marketplace" },
      { property: "og:description", content: "Buy verified game keys, software licences and subscriptions at up to 60% off, with instant inbox delivery." },
      { property: "og:url", content: SITE_URL + "/" },
      { property: "og:image", content: HERO_BG },
      { name: "twitter:image", content: HERO_BG },
    ],
    links: [
      { rel: "canonical", href: SITE_URL + "/" },
      { rel: "preload", as: "image", href: HERO_BG, fetchpriority: "high" } as any,
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: Index,
});

function SectionTitle({ icon: Icon, children }: { icon?: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Icon && <Icon className="w-5 h-5 text-fuchsia-600" />}
      <h2 className="text-center text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">{children}</h2>
    </div>
  );
}

function FaqItem({ q, a, defaultOpen = false }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={`${open ? "Collapse" : "Expand"} answer for: ${q}`}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="text-sm font-medium text-gray-900">{q}</span>
        {open ? <Minus className="w-4 h-4 text-gray-500" /> : <Plus className="w-4 h-4 text-gray-500" />}
      </button>
      <div className={`grid transition-all duration-300 ease-out ${open ? "grid-rows-[1fr] opacity-100 pb-4" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">
          <p className="text-sm text-gray-700 leading-relaxed pr-6">{a}</p>
        </div>
      </div>
    </div>
  );
}

function Index() {
  const { items: dbProducts, loading } = useProducts();
  const { items: budgets } = useBudgets();
  const { items: brands } = useBrands();

  const toCard = (p: typeof dbProducts[number]): ProductCardData => ({
    id: p.id,
    title: p.subtitle || p.title,
    subtitle: p.title,
    oldPrice: p.oldPrice ? `₹${p.oldPrice.toLocaleString("en-IN")}` : "",
    price: `₹${p.price.toLocaleString("en-IN")}`,
    image: p.image || undefined,
  });

  const products = useMemo(() => dbProducts.filter((p) => !p.isKey).map(toCard), [dbProducts]);
  const trendingProducts = useMemo(() => dbProducts.filter((p) => p.isTrending).map(toCard), [dbProducts]);
  const hasProducts = products.length > 0;
  const hasTrending = trendingProducts.length > 0;

  const SkeletonCard = () => (
    <div className="rounded-2xl bg-white/60 border border-white/60 shadow-sm aspect-[4/5] animate-pulse" />
  );
  const EmptyState = ({ label }: { label: string }) => (
    <div className="col-span-full text-center text-sm text-gray-500 py-10 rounded-3xl backdrop-blur-xl bg-white/60 border border-white/60">
      {label}
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <AnnouncementBar />
      <Header />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden isolate">
          <img
            src={HERO_BG}
            alt=""
            width={1920}
            height={900}
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-32 md:w-56 z-[1] bg-gradient-to-r from-white/85 via-white/40 to-transparent backdrop-blur-[2px]" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-32 md:w-56 z-[1] bg-gradient-to-l from-white/85 via-white/40 to-transparent backdrop-blur-[2px]" />

          <div className="relative z-10 px-4 sm:px-6 md:px-12 py-10 sm:py-14">
            <Reveal>
              <h1 className="text-center text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-wide text-white drop-shadow-lg mb-8 sm:mb-10 flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" /> BundleByte — Digital Keys &amp; Software Marketplace
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

        {/* Trending Now */}
        <section className="px-4 sm:px-6 md:px-12 py-10 sm:py-14">
          <Reveal><SectionTitle icon={Flame}>Trending Now</SectionTitle></Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5 max-w-6xl mx-auto mt-8 sm:mt-10">
            {loading && !hasTrending
              ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
              : hasTrending
              ? trendingProducts.slice(0, 10).map((p, i) => (
                  <Reveal key={p.id + "-t"} delay={i * 60}>
                    <ProductCard product={p} />
                  </Reveal>
                ))
              : <EmptyState label="Nothing trending yet — pick featured products from the Trending Now admin section." />}
          </div>
        </section>

        {/* Shop by brand */}
        <section className="px-4 sm:px-6 md:px-12 py-10 border-t border-gray-100">
          <Reveal><SectionTitle icon={Store}>Shop by brand</SectionTitle></Reveal>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-8 max-w-5xl mx-auto">
            {brands.length === 0 ? (
              <EmptyState label="Brands will appear here once the admin adds them." />
            ) : (
              brands.map((b, i) => (
                <Reveal key={b.id} delay={i * 50}>
                  <Link
                    to="/brand/$id"
                    params={{ id: b.id }}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl backdrop-blur-xl bg-white/60 border border-white/60 shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_32px_rgba(168,85,247,0.18)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col items-center justify-center gap-1 text-gray-700 text-[11px] sm:text-xs font-bold tracking-tight text-center px-2"
                  >
                    <span className="text-xl">{b.icon || "🏷️"}</span>
                    <span className="truncate w-full">{b.name}</span>
                  </Link>
                </Reveal>
              ))
            )}
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
            {budgets.length === 0 ? (
              <EmptyState label="Budget tiers will appear once the admin adds them." />
            ) : (
              budgets.map((b, i) => (
                <Reveal key={b.id} delay={i * 60}>
                  <Link
                    to="/budget/$id"
                    params={{ id: b.id }}
                    className="block rounded-2xl px-5 py-4 backdrop-blur-2xl bg-white/60 border border-white/60 shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 hover:shadow-lg transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-800">
                        UPTO :<br />
                        <span className="text-base">{b.label}</span>
                      </span>
                      <img src={LABEL} alt="" loading="lazy" decoding="async" className="w-12 h-10 object-cover rounded" />
                    </div>
                  </Link>
                </Reveal>
              ))
            )}
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
                {FAQS.map((f, i) => (
                  <FaqItem key={f.q} q={f.q} a={f.a} defaultOpen={i === 0} />
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
