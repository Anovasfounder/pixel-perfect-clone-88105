import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { AnnouncementBar } from "@/components/site/AnnouncementBar";
import { Reveal } from "@/components/site/Reveal";
import { ProductCard, defaultProduct } from "@/components/site/ProductCard";
import { ShoppingCart, ShieldCheck, Zap, BadgeCheck, Star, ChevronRight, Plus } from "lucide-react";
import { useBundle } from "@/components/site/BundleContext";

const PRODUCT_IMG = "https://i.ibb.co/F1zdP7n/Rectangle-207.png";

export const Route = createFileRoute("/product/$id")({
  head: () => ({
    meta: [
      { title: "Product — BundleByte" },
      { name: "description", content: "Premium digital keys with instant delivery." },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { id } = Route.useParams();
  const title = id.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
  const { add: addToBundle, open: openBundle } = useBundle();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <AnnouncementBar />
      <Header />

      <nav className="max-w-6xl mx-auto px-6 md:px-12 pt-6 text-xs text-gray-500 flex items-center gap-1.5">
        <Link to="/" className="hover:text-fuchsia-600">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-700 font-medium truncate">{title}</span>
      </nav>

      <main className="max-w-6xl mx-auto px-6 md:px-12 py-10">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Poster */}
          <Reveal>
            <div className="relative rounded-3xl overflow-hidden backdrop-blur-xl bg-gradient-to-br from-violet-100/70 via-pink-100/60 to-blue-100/70 border border-white/60 shadow-[0_20px_60px_-20px_rgba(168,85,247,0.45)] p-4">
              <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-fuchsia-400/30 blur-3xl" />
              <div className="absolute -bottom-16 -left-12 w-56 h-56 rounded-full bg-violet-400/30 blur-3xl" />
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-white">
                <img src={PRODUCT_IMG} alt={title} className="w-full h-full object-cover" />
              </div>
              <div className="relative mt-4 grid grid-cols-4 gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="aspect-square rounded-xl overflow-hidden bg-white/80 backdrop-blur border border-white/60">
                    <img src={PRODUCT_IMG} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Details */}
          <Reveal delay={120}>
            <div className="flex flex-col gap-5">
              <div className="inline-flex w-fit items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-fuchsia-700 bg-fuchsia-50 border border-fuchsia-100 px-3 py-1 rounded-full">
                <BadgeCheck className="w-3.5 h-3.5" /> Verified Key · Instant Delivery
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">{title}</h1>
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-0.5 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <span className="text-gray-600">4.9 · 2,340 reviews</span>
              </div>
              <p className="text-[15px] leading-relaxed text-gray-700">
                Unlock the full power of {title} with an officially licensed digital key delivered straight
                to your inbox. Enjoy premium features, priority support and lifetime activation — all at a
                fraction of the retail price.
              </p>

              {/* Pricing card */}
              <div className="rounded-3xl backdrop-blur-2xl bg-white/70 border border-white/70 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] p-5">
                <div className="flex items-end gap-3">
                  <span className="text-3xl font-extrabold text-gray-900">₹2,499</span>
                  <span className="text-lg line-through text-gray-400 mb-1">₹3,299</span>
                  <span className="ml-auto text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">SAVE 24%</span>
                </div>
                <button
                  onClick={() =>
                    navigate({
                      to: "/checkout",
                      search: { productId: id, title, price: 2499, image: PRODUCT_IMG, paymentLink: "https://razorpay.com/payment-link/" },
                    })
                  }
                  className="mt-4 w-full inline-flex items-center justify-center gap-2 h-12 rounded-full text-sm font-bold tracking-wide text-white bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500 shadow-lg hover:shadow-xl hover:opacity-95 transition"
                >
                  <ShoppingCart className="w-4 h-4" /> BUY NOW
                </button>
                <button
                  onClick={() => addToBundle({ id, title, subtitle: "Digital key", price: 2499, image: PRODUCT_IMG })}
                  className="mt-2 w-full inline-flex items-center justify-center gap-2 h-11 rounded-full text-sm font-semibold text-gray-900 bg-white/70 border border-gray-200 hover:bg-gray-50 transition"
                >
                  <Plus className="w-4 h-4" /> Add to bundle
                </button>
              </div>

              {/* Bento perks */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { i: Zap, t: "Instant delivery", d: "Key in 30 seconds" },
                  { i: ShieldCheck, t: "Secure payment", d: "Razorpay protected" },
                  { i: BadgeCheck, t: "100% genuine", d: "Verified licenses" },
                ].map((b, k) => (
                  <div key={k} className="rounded-2xl backdrop-blur-xl bg-white/60 border border-white/60 shadow-sm p-3">
                    <b.i className="w-5 h-5 text-fuchsia-600 mb-2" />
                    <p className="text-[12px] font-bold text-gray-900">{b.t}</p>
                    <p className="text-[11px] text-gray-500">{b.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* Related */}
        <Reveal>
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-6">You might also like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <ProductCard key={i} product={{ ...defaultProduct, id: `${defaultProduct.id}-${i}` }} />
              ))}
            </div>
          </section>
        </Reveal>
      </main>

      <Footer />
    </div>
  );
}
