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
      { name: "description", content: "How BundleByte Store collects, uses, stores and protects your personal information when you buy digital keys and software." },
      { property: "og:title", content: "Privacy Policy — BundleByte" },
      { property: "og:description", content: "How BundleByte Store collects, uses, stores and protects your personal information." },
      { property: "og:url", content: "https://glass-morph-vision.lovable.app/privacy" },
    ],
    links: [{ rel: "canonical", href: "https://glass-morph-vision.lovable.app/privacy" }],
  }),
  component: PrivacyPage,
});

const sections: { h: string; body: React.ReactNode }[] = [
  {
    h: "1. Introduction",
    body: <p>BundleByte Store ("we", "our", "us") respects your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website bundlebyte.store.</p>,
  },
  {
    h: "2. Information We Collect",
    body: (
      <>
        <p>We may collect:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li><strong>Personal Information:</strong> Name, email address, phone number, billing/shipping address.</li>
          <li><strong>Payment Information:</strong> Processed securely through third-party payment gateways (Cashfree, PayPal, Crypto processors). We do NOT store your credit/debit card details or crypto wallet private keys.</li>
          <li><strong>Usage Data:</strong> IP address, browser type, pages visited, time spent on pages.</li>
          <li><strong>Order History:</strong> Products purchased, license keys delivered, account credentials shared.</li>
        </ul>
      </>
    ),
  },
  {
    h: "3. How We Use Your Information",
    body: (
      <ul className="list-disc pl-5 space-y-1">
        <li>To process and deliver your orders (software keys and account credentials).</li>
        <li>To send order confirmations and delivery details via email.</li>
        <li>To provide customer support and activation/access assistance.</li>
        <li>To improve our website and services.</li>
        <li>To send promotional offers (only with your explicit consent).</li>
      </ul>
    ),
  },
  {
    h: "4. Data Security",
    body: <p>We implement appropriate technical and organizational measures to protect your personal data. However, no method of transmission over the internet is 100% secure.</p>,
  },
  {
    h: "5. Third-Party Sharing",
    body: (
      <>
        <p>We do not sell or rent your personal information. We may share data with:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Payment processors (Cashfree, PayPal, Crypto payment providers).</li>
          <li>Email service providers for order delivery.</li>
          <li>Analytics providers (e.g., Google Analytics).</li>
        </ul>
      </>
    ),
  },
  {
    h: "6. Your Rights",
    body: (
      <>
        <p>You have the right to:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Access, update, or delete your personal data.</li>
          <li>Withdraw consent at any time.</li>
          <li>Lodge a complaint with a data protection authority.</li>
        </ul>
      </>
    ),
  },
  {
    h: "7. Cookies",
    body: <p>We use cookies to enhance your browsing experience and analyze site traffic. You can disable cookies in your browser settings.</p>,
  },
  {
    h: "8. Contact Us",
    body: (
      <>
        <p>For any privacy-related questions, contact us at:</p>
        <p className="mt-2"><strong>Email:</strong> thebundlebyte@gmail.com</p>
        <p><strong>Address:</strong> Third Floor, No. 55, 3B, Saidulajab, Sainik Farm Gadaipur, New Delhi, Delhi - 110030, India.</p>
      </>
    ),
  },
  {
    h: "9. Changes to This Policy",
    body: <p>We may update this policy from time to time. The latest version will always be posted on this page.</p>,
  },
];

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
            <p className="text-sm text-gray-500 mb-8">Last Updated: June 22, 2026</p>
            <div className="space-y-6 text-[15px] leading-relaxed text-gray-700">
              {sections.map((s) => (
                <section key={s.h}>
                  <h2 className="text-lg font-bold text-gray-900 mb-2">{s.h}</h2>
                  {s.body}
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
