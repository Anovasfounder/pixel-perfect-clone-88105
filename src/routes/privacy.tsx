import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { AnnouncementBar } from "@/components/site/AnnouncementBar";
import { Reveal } from "@/components/site/Reveal";
import { Shield } from "lucide-react";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — BundleByte" },
      { name: "description", content: "Learn how BundleByte collects, uses, stores and protects your personal information when you buy digital keys and software." },
      { property: "og:title", content: "Privacy Policy — BundleByte" },
      { property: "og:description", content: "How BundleByte collects, uses, stores and protects your personal information." },
      { property: "og:url", content: "https://glass-morph-vision.lovable.app/privacy" },
    ],
    links: [{ rel: "canonical", href: "https://glass-morph-vision.lovable.app/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <AnnouncementBar />
      <Header />
      <main className="max-w-3xl mx-auto px-6 md:px-12 py-12">
        <Reveal>
          <div className="rounded-3xl backdrop-blur-2xl bg-white/60 border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.08)] p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl grid place-items-center bg-gradient-to-br from-fuchsia-500 to-violet-600 text-white shadow-lg">
                <Shield className="w-6 h-6" />
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Privacy Policy</h1>
            </div>
            <p className="text-sm text-gray-500 mb-8">Last updated: June 15, 2026</p>
            <div className="space-y-6 text-[15px] leading-relaxed text-gray-700">
              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">1. Information we collect</h2>
                <p>We collect information you provide directly — name, email, payment details — and basic usage data to deliver your digital keys instantly and securely.</p>
              </section>
              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">2. How we use it</h2>
                <p>To process orders, deliver licenses, send purchase receipts, and improve the BundleByte marketplace. We never sell your personal data to third parties.</p>
              </section>
              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">3. Cookies</h2>
                <p>Essential cookies keep your cart and session working. Optional analytics cookies help us understand which products customers love.</p>
              </section>
              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">4. Your rights</h2>
                <p>You can request access, correction, or deletion of your data at any time by writing to support@bundlebyte.com.</p>
              </section>
              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">5. Contact</h2>
                <p>Questions about this policy? Reach us at support@bundlebyte.com.</p>
              </section>
            </div>
          </div>
        </Reveal>
      </main>
      <Footer />
    </div>
  );
}
