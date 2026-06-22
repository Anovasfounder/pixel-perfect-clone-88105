import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { AnnouncementBar } from "@/components/site/AnnouncementBar";
import { Reveal } from "@/components/site/Reveal";
import { ShieldCheck, ArrowRight, CheckCircle2, Mail, User as UserIcon, ExternalLink } from "lucide-react";
import { recordSale, fetchProductPaymentLink } from "@/lib/db";

export const Route = createFileRoute("/checkout")({
  validateSearch: (s: Record<string, unknown>) => ({
    productId: typeof s.productId === "string" ? s.productId : undefined,
    title: typeof s.title === "string" ? s.title : undefined,
    price: typeof s.price === "number" ? s.price : Number(s.price) || undefined,
    image: typeof s.image === "string" ? s.image : undefined,
  }),
  head: () => ({ meta: [{ title: "Checkout — BundleByte" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: CheckoutPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  email: z.string().trim().email("Enter a valid email").max(160),
});

const formatINR = (n: number) => `₹${n.toLocaleString("en-IN")}`;

function CheckoutPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();

  const product = search.productId && search.title && search.price
    ? { id: search.productId, title: search.title, price: Number(search.price), image: search.image }
    : null;

  const [form, setForm] = useState({ name: "", email: "" });
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [ready, setReady] = useState(false);
  const [paymentLink, setPaymentLink] = useState<string>("");
  const [submitError, setSubmitError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const errs: { name?: string; email?: string } = {};
      parsed.error.issues.forEach((i) => {
        errs[i.path[0] as "name" | "email"] = i.message;
      });
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitError("");
    if (!product) return;
    try {
      await recordSale({
        productId: product.id,
        productTitle: product.title,
        customerName: form.name,
        customerEmail: form.email,
        amount: product.price,
      });
    } catch {
      // continue — fulfilment uses the verified payment link below
    }
    try {
      const link = await fetchProductPaymentLink(product.id);
      if (!link || !/^https:\/\//i.test(link)) {
        setSubmitError("Payment is temporarily unavailable for this product. Please try again later.");
        return;
      }
      setPaymentLink(link);
      setReady(true);
    } catch {
      setSubmitError("Could not start payment. Please try again.");
    }
  };


  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <AnnouncementBar />
        <Header />
        <main className="max-w-3xl mx-auto px-5 py-20 text-center">
          <h1 className="text-2xl font-bold">No product selected</h1>
          <p className="mt-2 text-gray-600">Head back and pick something to buy.</p>
          <button
            onClick={() => navigate({ to: "/" })}
            className="mt-6 inline-flex items-center gap-2 px-5 h-11 rounded-full text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600"
          >
            Browse products
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 via-white to-pink-50 text-gray-900 font-sans">
      <AnnouncementBar />
      <Header />

      <main className="max-w-5xl mx-auto px-5 md:px-10 py-10">
        <Reveal>
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Secure checkout</h1>
            <p className="text-sm text-gray-600 mt-1">Enter your details — we'll send your keys to your inbox instantly.</p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-[1fr_360px] gap-6">
          <Reveal>
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl backdrop-blur-2xl bg-white/70 border border-white/70 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.15)] p-6 md:p-8 space-y-5"
            >
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Full name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Jane Doe"
                    className="w-full h-12 pl-10 pr-4 rounded-xl bg-white/80 border border-gray-200 focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-100 outline-none text-sm transition"
                  />
                </div>
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full h-12 pl-10 pr-4 rounded-xl bg-white/80 border border-gray-200 focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-100 outline-none text-sm transition"
                  />
                </div>
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div className="flex items-center gap-2 text-[12px] text-gray-600 bg-emerald-50/70 border border-emerald-100 rounded-xl p-3">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Your details are encrypted & never shared.
              </div>

              {!ready ? (
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 h-12 rounded-full text-sm font-bold tracking-wide text-white bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500 shadow-lg hover:opacity-95 transition"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 text-sm">
                    <CheckCircle2 className="w-4 h-4" /> Details saved. You can pay now.
                  </div>
                  <a
                    href={paymentLink}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 h-12 rounded-full text-sm font-bold tracking-wide text-white bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 shadow-lg hover:opacity-95 transition"
                  >
                    Pay now · {formatINR(product.price)} <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}
            </form>
          </Reveal>

          <Reveal delay={100}>
            <aside className="rounded-3xl backdrop-blur-2xl bg-white/70 border border-white/70 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.15)] p-5 sticky top-24">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Order summary</p>
              <div className="flex gap-3 items-center">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                  {product.image && <img src={product.image} alt="" className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold truncate">{product.title}</p>
                  <p className="text-[11px] text-gray-500">Qty 1</p>
                </div>
                <span className="text-[13px] font-bold">{formatINR(product.price)}</span>
              </div>
              <div className="border-t border-gray-200 mt-4 pt-3 flex items-center justify-between">
                <span className="text-sm text-gray-600">Total</span>
                <span className="text-lg font-extrabold">{formatINR(product.price)}</span>
              </div>
              <Link to="/" className="block text-center text-[12px] text-fuchsia-600 font-semibold mt-3">← Continue shopping</Link>
            </aside>
          </Reveal>
        </div>
      </main>

      <Footer />
    </div>
  );
}
