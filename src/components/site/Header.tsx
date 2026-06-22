import { Link, useNavigate } from "@tanstack/react-router";
import { Search, Menu, X, Sparkles } from "lucide-react";
import { useState } from "react";
import { useCategories } from "@/lib/db";

const LOGO = "https://i.ibb.co/DDkjtbgG/Whats-App-Image-2026-06-12-at-15-44-39.jpg";

export function Header() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { items: categories } = useCategories();

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/search", search: { q: query.trim() } });
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-white/40 supports-[backdrop-filter]:bg-white/60">
      <div className="px-4 sm:px-6 md:px-10">
        <div className="flex items-center gap-2 sm:gap-4 py-3">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src={LOGO} alt="Bundle Byte" className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-cover shadow-sm" />
            <span className="hidden sm:block font-extrabold tracking-tight text-gray-900 text-lg">
              Bundle<span className="text-fuchsia-600">Byte</span>
            </span>
          </Link>
          <form onSubmit={submitSearch} className="flex-1 min-w-0 max-w-2xl">
            <div className="flex items-center bg-white/80 backdrop-blur-md border border-gray-200 rounded-full shadow-sm pl-2 pr-3 sm:pr-4 h-10 focus-within:border-fuchsia-400 focus-within:ring-2 focus-within:ring-fuchsia-100 transition">
              <button type="submit" aria-label="Search" className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-400 to-fuchsia-500 flex items-center justify-center mr-2 shrink-0">
                <Search className="w-3.5 h-3.5 text-white" />
              </button>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What are you looking for ?"
                className="flex-1 min-w-0 bg-transparent outline-none text-sm placeholder:text-gray-400"
              />
            </div>
          </form>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            className="md:hidden shrink-0 w-10 h-10 grid place-items-center rounded-full border border-gray-200 bg-white/70 backdrop-blur-md"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex flex-wrap items-center gap-x-6 gap-y-2 py-3 text-[13px] font-medium text-gray-800 border-b border-gray-100">
          {categories.length === 0 && (
            <span className="flex items-center gap-1.5 text-gray-400"><Sparkles className="w-3.5 h-3.5" /> Categories coming soon</span>
          )}
          {categories.map((c) => (
            <Link
              key={c.id}
              to="/category/$id"
              params={{ id: c.id }}
              className="flex items-center gap-1.5 hover:text-fuchsia-600 transition"
              activeProps={{ className: "flex items-center gap-1.5 text-fuchsia-600" }}
            >
              <span className="text-base leading-none">{c.icon || "✨"}</span> {c.name}
            </Link>
          ))}
          <Link to="/privacy" className="ml-auto hover:text-fuchsia-600 transition">PRIVACY POLICY</Link>
          <Link to="/terms" className="hover:text-fuchsia-600 transition">TERMS AND CONDITIONS</Link>
        </nav>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden pb-4 animate-fade-in">
            <div className="mt-2 rounded-2xl backdrop-blur-xl bg-white/80 border border-white/60 shadow-lg p-2">
              {categories.length === 0 && (
                <div className="px-3 py-2.5 text-sm text-gray-400">Categories coming soon</div>
              )}
              {categories.map((c) => (
                <Link
                  key={c.id}
                  to="/category/$id"
                  params={{ id: c.id }}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-fuchsia-50 text-sm font-medium text-gray-800"
                >
                  <span className="text-base leading-none">{c.icon || "✨"}</span> {c.name}
                </Link>
              ))}
              <div className="h-px bg-gray-100 my-1" />
              <Link to="/privacy" onClick={() => setOpen(false)} className="block px-3 py-2.5 rounded-xl hover:bg-fuchsia-50 text-sm font-medium">Privacy Policy</Link>
              <Link to="/terms" onClick={() => setOpen(false)} className="block px-3 py-2.5 rounded-xl hover:bg-fuchsia-50 text-sm font-medium">Terms & Conditions</Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
