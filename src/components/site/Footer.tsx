import { Link } from "@tanstack/react-router";
import { Instagram, Twitter, Youtube, Mail } from "lucide-react";

const LOGO = "https://i.ibb.co/DDkjtbgG/Whats-App-Image-2026-06-12-at-15-44-39.jpg";

export function Footer() {
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
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-gray-700">
          <Link to="/privacy" className="hover:text-fuchsia-600 transition">Privacy Policy</Link>
          <span className="text-gray-300">•</span>
          <Link to="/terms" className="hover:text-fuchsia-600 transition">Terms & Conditions</Link>
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
