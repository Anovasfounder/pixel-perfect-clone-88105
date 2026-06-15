import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { AnnouncementBar } from "@/components/site/AnnouncementBar";
import { Reveal } from "@/components/site/Reveal";
import { FileText } from "lucide-react";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — BundleByte" },
      { name: "description", content: "The terms under which you use the BundleByte marketplace." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  const sections = [
    { h: "1. Acceptance of terms", p: "By using BundleByte you agree to these terms. If you do not agree, please do not use the service." },
    { h: "2. Digital products", p: "All keys and licenses sold on BundleByte are digital goods delivered instantly via email after successful payment." },
    { h: "3. Refunds", p: "Because digital keys are non-revocable once revealed, refunds are limited to genuinely invalid or unusable keys reported within 24 hours." },
    { h: "4. Acceptable use", p: "Resale, automated scraping, and fraudulent payments are strictly prohibited and will result in account suspension." },
    { h: "5. Pricing", p: "All prices are listed in Indian Rupees (₹) and inclusive of applicable taxes unless stated otherwise." },
    { h: "6. Liability", p: "BundleByte is not liable for losses arising from misuse of purchased software or third-party platform changes." },
    { h: "7. Changes", p: "We may update these terms periodically. Continued use of the service after changes constitutes acceptance." },
  ];
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <AnnouncementBar />
      <Header />
      <main className="max-w-3xl mx-auto px-6 md:px-12 py-12">
        <Reveal>
          <div className="rounded-3xl backdrop-blur-2xl bg-white/60 border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.08)] p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl grid place-items-center bg-gradient-to-br from-fuchsia-500 to-violet-600 text-white shadow-lg">
                <FileText className="w-6 h-6" />
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Terms & Conditions</h1>
            </div>
            <p className="text-sm text-gray-500 mb-8">Last updated: June 15, 2026</p>
            <div className="space-y-6 text-[15px] leading-relaxed text-gray-700">
              {sections.map((s) => (
                <section key={s.h}>
                  <h2 className="text-lg font-bold text-gray-900 mb-2">{s.h}</h2>
                  <p>{s.p}</p>
                </section>
              ))}
            </div>
          </div>
        </Reveal>
      </main>
      <Footer />
    </div>
  );
}
