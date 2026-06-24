import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { AnnouncementBar } from "@/components/site/AnnouncementBar";
import { Reveal } from "@/components/site/Reveal";
import { FileText, Truck, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — BundleByte" },
      { name: "description", content: "Terms governing purchases, delivery, account-based products and support on the BundleByte Store digital marketplace." },
      { property: "og:title", content: "Terms & Conditions — BundleByte" },
      { property: "og:description", content: "Terms governing purchases, delivery, account-based products and support on BundleByte Store." },
      { property: "og:url", content: "https://glass-morph-vision.lovable.app/terms" },
    ],
    links: [{ rel: "canonical", href: "https://glass-morph-vision.lovable.app/terms" }],
  }),
  component: TermsPage,
});

const termsSections: { h: string; body: React.ReactNode }[] = [
  { h: "1. Acceptance of Terms", body: <p>By using bundlebyte.store, you agree to these Terms of Service. If you do not agree, please do not use our website.</p> },
  { h: "2. Digital Products", body: <p>All products sold on BundleByte Store are digital (software license keys, subscription accounts, or digital access credentials). No physical products will be shipped.</p> },
  { h: "3. License Keys & Activation", body: (
    <ul className="list-disc pl-5 space-y-1">
      <li>License keys are delivered instantly via email after payment confirmation.</li>
      <li>Keys are provided "as-is" and are strictly non-refundable once delivered (see Refund Policy).</li>
      <li>It is your responsibility to ensure the product you purchase is compatible with your system/region.</li>
      <li>We are not the original software developer; we are an independent reseller. We do not provide software development support beyond basic activation assistance.</li>
    </ul>
  ) },
  { h: "4. Account-Based Products (Subscriptions/Shared Accounts)", body: (
    <ul className="list-disc pl-5 space-y-1">
      <li>For account-based products (e.g., streaming logins, VPN accounts, AI tool subscriptions), you will receive login credentials via email.</li>
      <li>You agree NOT to change the password, email, or any security settings of the provided account.</li>
      <li>You agree NOT to share the account credentials with anyone else.</li>
      <li>Account validity is as stated on the product page. We do not guarantee lifetime access unless explicitly mentioned.</li>
      <li>We are not liable if the account gets suspended due to abuse by other users (for shared accounts) or due to the original provider's terms of service enforcement.</li>
    </ul>
  ) },
  { h: "5. User Accounts", body: <p>You may be required to create an account on our website to access your orders. You are responsible for maintaining the confidentiality of your account credentials.</p> },
  { h: "6. Prohibited Uses", body: (
    <>
      <p>You may not:</p>
      <ul className="list-disc pl-5 mt-2 space-y-1">
        <li>Resell, redistribute, or share license keys or account credentials.</li>
        <li>Use our site for any unlawful purpose.</li>
        <li>Attempt to reverse-engineer, hack, or circumvent our systems.</li>
        <li>File false chargebacks or disputes (see Refund Policy).</li>
      </ul>
    </>
  ) },
  { h: "7. Intellectual Property", body: <p>All content on this website (logos, text, graphics) is the property of BundleByte Store unless otherwise stated.</p> },
  { h: "8. Limitation of Liability", body: <p>To the fullest extent permitted by law, BundleByte Store shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services.</p> },
  { h: "9. Governing Law", body: <p>These terms shall be governed by and construed in accordance with the laws of India, under the jurisdiction of the courts in New Delhi, Delhi.</p> },
  { h: "10. Changes to Terms", body: <p>We reserve the right to update these terms at any time. Continued use of the website constitutes acceptance of the updated terms.</p> },
  { h: "11. Contact", body: (
    <div className="space-y-1">
      <p><strong>Email:</strong> thebundlebyte@gmail.com</p>
      <p><strong>WhatsApp:</strong> +91 92657 43274</p>
      <p><strong>Phone:</strong> +91 92657 43274</p>
      <p><strong>Address:</strong> Third Floor, No. 55, 3B, Saidulajab, Sainik Farm Gadaipur, New Delhi, Delhi - 110030, India.</p>
    </div>
  ) },
];

const deliverySections: { h: string; body: React.ReactNode }[] = [
  { h: "1. Delivery Method", body: <p>All products are delivered digitally via email. No physical shipping is involved.</p> },
  { h: "2. Delivery Time", body: (
    <ul className="list-disc pl-5 space-y-1">
      <li><strong>Software Keys:</strong> Delivered instantly (within 1–5 minutes) after successful payment confirmation.</li>
      <li><strong>Account Credentials:</strong> Delivered within 1–15 minutes after payment confirmation.</li>
      <li>In rare cases (manual verification for Crypto payments or high-risk orders), delivery may take up to 24 hours.</li>
    </ul>
  ) },
  { h: "3. How to Receive Your Order", body: (
    <ul className="list-disc pl-5 space-y-1">
      <li>Check the email address you provided at checkout (including Spam/Junk folders).</li>
      <li>You can also log in to your account on bundlebyte.store to view your active orders and keys.</li>
    </ul>
  ) },
  { h: "4. Incorrect Email", body: <p>Please ensure you provide the correct email address at checkout. We are not responsible for keys or credentials sent to an incorrectly entered email address. We can attempt to resend to a corrected email if you verify your identity.</p> },
  { h: "5. Failed Delivery", body: <p>If you do not receive your order within 24 hours, contact us immediately at thebundlebyte@gmail.com with your order number and payment receipt.</p> },
];

const disclaimerSections: { h: string; body: React.ReactNode }[] = [
  { h: "1. No Affiliation", body: <p>BundleByte Store (bundlebyte.store) is an independent reseller and is NOT affiliated with, endorsed by, or sponsored by Microsoft, Adobe, Kaspersky, McAfee, Google, Netflix, Spotify, or any other software/streaming brand whose products or accounts we resell.</p> },
  { h: "2. Product Authenticity", body: <p>We source our software license keys from authorized distributors and wholesale channels. Our account-based products are obtained through legally compliant means. However, we do not develop or manufacture the software or services ourselves.</p> },
  { h: "3. \"As-Is\" Basis", body: <p>All products are provided "as-is" without warranties of any kind, either express or implied, including but not limited to fitness for a particular purpose.</p> },
  { h: "4. Third-Party Links", body: <p>Our website may contain links to third-party websites. We are not responsible for the content, privacy policies, or practices of these external sites.</p> },
  { h: "5. Accuracy of Information", body: <p>We strive to provide accurate product descriptions and pricing, but we do not warrant that descriptions, prices, or other content are error-free. In the event of a pricing error, we reserve the right to cancel the order and issue a full refund.</p> },
  { h: "6. Contact", body: (
    <div className="space-y-1">
      <p><strong>Email:</strong> thebundlebyte@gmail.com</p>
      <p><strong>Address:</strong> Third Floor, No. 55, 3B, Saidulajab, Sainik Farm Gadaipur, New Delhi, Delhi - 110030, India.</p>
    </div>
  ) },
];

function Card({
  icon,
  title,
  sections,
  gradient,
}: {
  icon: React.ReactNode;
  title: string;
  sections: { h: string; body: React.ReactNode }[];
  gradient: string;
}) {
  return (
    <Reveal>
      <div className="rounded-3xl backdrop-blur-2xl bg-white/60 border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.08)] p-8 md:p-12">
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-12 h-12 rounded-2xl grid place-items-center text-white shadow-lg ${gradient}`}>
            {icon}
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{title}</h1>
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
  );
}

function TermsPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <AnnouncementBar />
      <Header />
      <main className="max-w-3xl mx-auto px-6 md:px-12 py-12 space-y-10">
        <Card
          icon={<FileText className="w-6 h-6" />}
          title="Terms & Conditions"
          sections={termsSections}
          gradient="bg-gradient-to-br from-fuchsia-500 to-violet-600"
        />
        <Card
          icon={<Truck className="w-6 h-6" />}
          title="Delivery Policy"
          sections={deliverySections}
          gradient="bg-gradient-to-br from-sky-500 to-indigo-600"
        />
        <Card
          icon={<AlertCircle className="w-6 h-6" />}
          title="Disclaimer"
          sections={disclaimerSections}
          gradient="bg-gradient-to-br from-amber-500 to-orange-600"
        />
      </main>
      <Footer />
    </div>
  );
}
