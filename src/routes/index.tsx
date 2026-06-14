import { createFileRoute } from "@tanstack/react-router";
import { Search, ChevronDown, ChevronLeft, ChevronRight, Plus, Minus } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Digital Keys & Software Marketplace" },
      { name: "description", content: "Browse trending apps, games, software keys and best sellers at unbeatable prices." },
    ],
  }),
  component: Index,
});

const HERO_BG = "https://i.ibb.co/21bcVVsW/Chat-GPT-Image-Jun-14-2026-11-36-52-AM.png";
const LOGO = "https://i.ibb.co/DDkjtbgG/Whats-App-Image-2026-06-12-at-15-44-39.jpg";
const LABEL = "https://i.ibb.co/4RJ8gC2L/Chat-GPT-Image-Jun-14-2026-12-40-24-PM-1.png";
const PRODUCT_IMG = "https://i.ibb.co/F1zdP7n/Rectangle-207.png";

const product = {
  title: "LinkedIn Recruiter Lite",
  subtitle: "LinkedIn Premium Sales Navigator",
  oldPrice: "$40",
  price: "$30",
};

function ProductCard() {
  return (
    <div className="bg-white border border-gray-200 shadow-sm p-3 flex flex-col rounded-2xl">
      <div className="aspect-square w-full rounded-xl overflow-hidden mb-3">
        <img src={PRODUCT_IMG} alt={product.subtitle} className="w-full h-full object-cover" />
      </div>
      <p className="text-[13px] font-semibold text-gray-900 leading-tight">{product.subtitle}</p>
      <p className="text-[11px] text-gray-500 mt-0.5">{product.title}</p>
      <div className="flex items-center gap-2 mt-1.5 text-[13px]">
        <span className="line-through text-gray-400">{product.oldPrice}</span>
        <span className="text-red-500 font-semibold">{product.price}</span>
      </div>
      <button className="mt-3 w-full py-2 rounded-full text-[12px] font-semibold tracking-wide text-gray-900 bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 hover:opacity-90 transition">
        BUY NOW
      </button>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-center text-2xl md:text-3xl font-bold text-gray-900">{children}</h2>;
}

const ANNOUNCEMENTS = [
  "✨ Free shipping on digital keys — instant delivery worldwide",
  "🔥 Flash sale: Up to 60% OFF on premium software keys",
  "🎮 New game keys added daily — check the trending section",
  "💎 Premium subscriptions starting at just $5",
];

function AnnouncementBar() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % ANNOUNCEMENTS.length), 4000);
    return () => clearInterval(t);
  }, []);
  const prev = () => setI((p) => (p - 1 + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length);
  const next = () => setI((p) => (p + 1) % ANNOUNCEMENTS.length);
  return (
    <div className="w-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500 text-white text-[12px] py-2 px-4 flex items-center justify-center gap-3 relative overflow-hidden">
      <button onClick={prev} aria-label="Previous announcement" className="hover:bg-white/15 rounded-full p-0.5 transition">
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>
      <div className="overflow-hidden h-4 min-w-[260px] md:min-w-[420px] text-center">
        <div
          className="transition-transform duration-500 ease-out"
          style={{ transform: `translateY(-${i * 16}px)` }}
        >
          {ANNOUNCEMENTS.map((a, k) => (
            <div key={k} className="h-4 leading-4 whitespace-nowrap font-medium tracking-wide">
              {a}
            </div>
          ))}
        </div>
      </div>
      <button onClick={next} aria-label="Next announcement" className="hover:bg-white/15 rounded-full p-0.5 transition">
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

function FaqItem({ q, a, defaultOpen = false }: { q: string; a?: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="text-sm font-medium text-gray-900">{q}</span>
        {open ? <Minus className="w-4 h-4 text-gray-500" /> : <Plus className="w-4 h-4 text-gray-500" />}
      </button>
      <div
        className={`grid transition-all duration-300 ease-out ${open ? "grid-rows-[1fr] opacity-100 pb-4" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <p className="text-sm text-gray-700 leading-relaxed pr-6">
            {a ??
              "We specialize in web development, mobile app creation, digital marketing, and custom software development. Our team delivers modern, scalable solutions tailored to your business needs."}
          </p>
        </div>
      </div>
    </div>
  );
}

function Index() {
  const brands = ["Xbox", "PlayStation", "Unlock", "AI", "Switch", "Joy-Con"];
  const budgets = ["$5", "$15", "$25", "$50"];
  const faqs = [
    "How long does a typical project take?",
    "What's your pricing structure?",
    "Do you provide ongoing support after project completion?",
    "What technologies do you work with?",
    "How do we get started with a project?",
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <AnnouncementBar />

      {/* Header */}
      <header className="px-6 md:px-10 bg-white">
        <div className="flex items-center gap-4 py-3">
          <img src={LOGO} alt="Logo" className="w-11 h-11 rounded-md object-cover" />
          <div className="flex-1 max-w-2xl relative">
            <div className="flex items-center bg-white border border-gray-200 rounded-full shadow-sm pl-2 pr-4 h-10">
              <div className="w-6 h-6 rounded-full bg-pink-300 flex items-center justify-center mr-2">
                <Search className="w-3.5 h-3.5 text-white" />
              </div>
              <input
                placeholder="What are you looking for ?"
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-gray-400"
              />
            </div>
          </div>
          <button className="flex items-center gap-1 text-sm font-medium border border-gray-200 rounded-full px-4 h-10">
            USD <ChevronDown className="w-4 h-4" />
          </button>
        </div>
        <nav className="flex flex-wrap items-center gap-6 py-3 text-[13px] font-medium text-gray-800 border-b border-gray-100">
          <span className="text-gray-600">Trending</span>
          <span>Apps</span>
          <span>GAMES</span>
          <span>SOFTWARES</span>
          <span className="ml-auto">PRIVACY POLICY</span>
          <span>TERMS AND CONDITIONS</span>
        </nav>
      </header>

      {/* Hero / Browse by categories */}
      <section className="relative overflow-hidden">
        <img
          src={HERO_BG}
          alt=""
          className="absolute inset-0 w-full h-full object-cover -z-10"
        />
        {/* Side white vignette */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 md:w-56 -z-10 bg-gradient-to-r from-white/80 via-white/30 to-transparent backdrop-blur-[2px]" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 md:w-56 -z-10 bg-gradient-to-l from-white/80 via-white/30 to-transparent backdrop-blur-[2px]" />

        <div className="px-6 md:px-12 py-14">
          <h1 className="text-center text-3xl md:text-4xl font-extrabold tracking-wide text-white drop-shadow mb-10">
            BROWSE BY CATEGORIES
          </h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-3xl p-3 backdrop-blur-xl bg-white/70 border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
              >
                <ProductCard />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Random keys */}
      <section className="px-6 md:px-12 py-14">
        <SectionTitle>Random keys</SectionTitle>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5 max-w-6xl mx-auto mt-10">
          {Array.from({ length: 5 }).map((_, i) => (
            <ProductCard key={i} />
          ))}
        </div>
      </section>

      {/* Shop by brand */}
      <section className="px-6 md:px-12 py-10 border-t border-gray-100">
        <SectionTitle>Shop by brand</SectionTitle>
        <div className="flex flex-wrap items-center justify-around gap-8 mt-8 max-w-5xl mx-auto">
          {brands.map((b) => (
            <div
              key={b}
              className="w-20 h-20 rounded-2xl overflow-hidden backdrop-blur-md bg-white/60 border border-white/50 shadow-sm flex items-center justify-center"
            >
              <img src={LABEL} alt={b} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </section>

      {/* Best sellers */}
      <section className="px-6 md:px-12 py-14 border-t border-gray-100">
        <SectionTitle>BEST SELLERS 🔥</SectionTitle>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-6xl mx-auto mt-10">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCard key={i} />
          ))}
        </div>
      </section>

      {/* Budget */}
      <section className="px-6 md:px-12 py-14 border-t border-gray-100">
        <SectionTitle>Budget</SectionTitle>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-5xl mx-auto mt-10">
          {budgets.map((b) => (
            <div
              key={b}
              className="rounded-2xl px-5 py-4 backdrop-blur-xl bg-white/60 border border-white/50 shadow-md flex items-center justify-between"
            >
              <span className="text-sm font-semibold text-gray-800">
                UPTO :<br />
                <span className="text-base">{b}</span>
              </span>
              <img src={LABEL} alt="" className="w-12 h-10 object-cover rounded" />
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="px-6 md:px-12 py-14 border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-center text-2xl font-bold border-y border-gray-200 py-3">FAQS</h2>

          <div className="mt-6 rounded-2xl backdrop-blur-xl bg-white/70 border border-white/60 shadow-lg overflow-hidden">
            <FaqItem
              q="What services do you offer?"
              a="We specialize in web development, mobile app creation, digital marketing, and custom software development. From startup launches to enterprise-level projects, we handle everything from design and development to deployment and ongoing support."
              defaultOpen
            />
          </div>

          <div className="mt-4 rounded-2xl border border-gray-200 px-5">
            {faqs.map((q) => (
              <FaqItem key={q} q={q} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-10 border-t border-gray-200 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img src={LOGO} alt="Logo" className="w-9 h-9 rounded-md object-cover" />
              <span className="font-bold text-gray-900">KEYSTORE</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Your one-stop marketplace for digital keys, software subscriptions and gaming credits.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-3">Shop</h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li>Trending</li><li>Apps</li><li>Games</li><li>Softwares</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-3">Company</h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li>About Us</li><li>Privacy Policy</li><li>Terms & Conditions</li><li>Contact</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-3">Newsletter</h4>
            <p className="text-xs text-gray-600 mb-3">Get the latest deals to your inbox.</p>
            <div className="flex">
              <input
                placeholder="Email"
                className="flex-1 text-xs px-3 py-2 border border-gray-200 rounded-l-full outline-none"
              />
              <button className="text-xs font-semibold px-4 rounded-r-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white">
                Join
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 py-4 text-center text-[11px] text-gray-500">
          © {new Date().getFullYear()} KEYSTORE. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
