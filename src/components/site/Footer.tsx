import { Link } from "@tanstack/react-router";
import { Instagram, Twitter, Youtube, Mail, Send, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { subscribeEmail } from "@/lib/db";

const LOGO = "https://i.ibb.co/DDkjtbgG/Whats-App-Image-2026-06-12-at-15-44-39.jpg";

export function Footer() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const [busy, setBusy] = useState(false);

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || busy) return;
    setBusy(true);
    try {
      await subscribeEmail(v);
      setDone(true);
      setEmail("");
      setTimeout(() => setDone(false), 2800);
    } catch {
      // fail silently for the user
    } finally {
      setBusy(false);
    }
  };

  return (
    <footer className="mt-12 border-t border-gray-200 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-10 flex flex-col items-center text-center gap-6">
        <Link to="/" className="flex items-center gap-2">
          <img src={LOGO} alt="Bundle Byte" className="w-10 h-10 rounded-xl object-cover" />
          <span className="font-extrabold text-xl tracking-tight text-gray-900">
            Bundle<span className="text-fuchsia-600">Byte</span>
          </span>
        </Link>
        <p className="text-sm text-gray-600 max-w-md">
          Your one-stop marketplace for digital keys, software subscriptions and gaming credits.
        </p>

        <form onSubmit={subscribe} className="w-full max-w-md flex flex-col sm:flex-row gap-2 backdrop-blur-xl bg-white/70 border border-white/70 rounded-2xl p-2 shadow-sm">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Get launch deals in your inbox"
              className="w-full h-11 pl-10 pr-3 rounded-xl bg-white/80 border border-gray-200 focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-100 outline-none text-sm transition"
            />
          </div>
          <button className="h-11 px-5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500 shadow inline-flex items-center justify-center gap-1.5">
            {done ? <><CheckCircle2 className="w-4 h-4" /> Subscribed</> : <>Subscribe <Send className="w-3.5 h-3.5" /></>}
          </button>
        </form>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-gray-700">
          <Link to="/privacy" className="hover:text-fuchsia-600 transition">Privacy Policy</Link>
          <span className="text-gray-300">•</span>
          <Link to="/terms" className="hover:text-fuchsia-600 transition">Terms & Conditions</Link>
          <span className="text-gray-300">•</span>
          <Link to="/admin" className="hover:text-fuchsia-600 transition">Admin</Link>
        </nav>
        <div className="flex items-center gap-3">
          {[Instagram, Twitter, Youtube, Mail].map((Icon, i) => (
            <button key={i} className="w-9 h-9 grid place-items-center rounded-full backdrop-blur-md bg-white/70 border border-white/60 shadow-sm hover:bg-fuchsia-50 hover:text-fuchsia-600 transition">
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>
      <div className="border-t border-gray-200 py-4 text-center text-[11px] text-gray-500">
        © {new Date().getFullYear()} BundleByte. All rights reserved.
      </div>
    </footer>
  );
}
