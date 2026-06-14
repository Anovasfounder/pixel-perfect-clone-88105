import { createFileRoute } from "@tanstack/react-router";
import { Search, ChevronDown } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Digital Keys & Software Marketplace" },
      { name: "description", content: "Browse trending apps, games, software keys and best sellers at unbeatable prices." },
    ],
  }),
  component: Index,
});

const product = {
  title: "LinkedIn Recruiter Lite",
  subtitle: "LinkedIn Premium Sales Navigator",
  oldPrice: "$40",
  price: "$30",
};

function ProductCard({ rounded = false }: { rounded?: boolean }) {
  return (
    <div className={`bg-white border border-gray-200 shadow-sm p-3 flex flex-col ${rounded ? "rounded-3xl" : "rounded-2xl"}`}>
      <div className="aspect-square w-full rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden mb-3">
        <div className="w-full h-full bg-gradient-to-br from-emerald-900 to-emerald-700 flex items-center justify-center text-white/60 text-xs">
          [ Product Image ]
        </div>
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
      {/* Announcement */}
      <div className="w-full text-center text-[12px] py-2 text-gray-700">announcement goes here .</div>

      {/* Header */}
      <header className="px-6 md:px-10">
        <div className="flex items-center gap-4 py-2">
          <div className="w-10 h-10 rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-xs">
            LOGO
          </div>
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
        <nav className="flex items-center gap-6 py-3 text-[13px] font-medium text-gray-800 border-b border-gray-100">
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
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(135deg, #1a0b2e 0%, #2d1b4e 30%, #6b2d8f 60%, #d946a3 100%)",
          }}
        />
        <div className="absolute inset-0 -z-10 opacity-40 bg-[radial-gradient(circle_at_20%_30%,#ff6bcb,transparent_50%),radial-gradient(circle_at_80%_70%,#3b82f6,transparent_50%)]" />
        <div className="px-6 md:px-12 py-14">
          <h1 className="text-center text-3xl md:text-4xl font-extrabold tracking-wide text-white mb-10">
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
              className="w-20 h-20 rounded-2xl backdrop-blur-md bg-white/60 border border-white/50 shadow-sm flex items-center justify-center text-gray-400 text-xs"
            >
              {b}
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
              <div className="w-10 h-8 bg-gradient-to-br from-yellow-200 to-green-200 rounded" />
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="px-6 md:px-12 py-14 border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-center text-2xl font-bold border-y border-gray-200 py-3">FAQS</h2>

          <div className="mt-6 rounded-2xl backdrop-blur-xl bg-white/70 border border-white/60 shadow-lg p-6">
            <p className="font-semibold text-gray-900">What services do you offer?</p>
            <p className="text-sm text-gray-700 mt-3 leading-relaxed">
              We specialize in web development, mobile app creation, digital marketing, and custom
              software development. Our team delivers modern, scalable solutions tailored to your
              business needs.
            </p>
            <p className="text-sm text-gray-700 mt-3 leading-relaxed">
              From startup launches to enterprise-level projects, we handle everything from design
              and development to deployment and ongoing support.
            </p>
          </div>

          <div className="mt-4 divide-y divide-gray-200 border-y border-gray-200">
            {faqs.map((q) => (
              <div key={q} className="flex items-center justify-between py-4">
                <span className="text-sm font-medium text-gray-900">{q}</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-10" />
    </div>
  );
}
