import { createFileRoute, Outlet, Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useSupabaseAuth, ADMIN_EMAIL } from "@/lib/db";
import { LayoutDashboard, PackagePlus, FolderTree, Mail, BarChart3, LogOut, Menu, X, Sparkles, ShieldCheck, Lock } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — BundleByte" }] }),
  component: AdminLayout,
});

const nav: Array<{ to: "/admin" | "/admin/products" | "/admin/categories" | "/admin/sales" | "/admin/newsletter"; label: string; icon: typeof LayoutDashboard; exact?: boolean }> = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/products", label: "Products", icon: PackagePlus },
  { to: "/admin/categories", label: "Categories", icon: FolderTree },
  { to: "/admin/sales", label: "Sales", icon: BarChart3 },
  { to: "/admin/newsletter", label: "Newsletter", icon: Mail },
];

function AdminLayout() {
  const { isAuthed, isAdmin, ready, signIn, signOut, user } = useSupabaseAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  if (!ready) {
    return (
      <div className="min-h-screen grid place-items-center bg-gradient-to-br from-violet-100 via-white to-pink-100">
        <div className="text-sm text-gray-500">Loading…</div>
      </div>
    );
  }

  if (!isAuthed) {
    return (
      <div className="min-h-screen grid place-items-center bg-gradient-to-br from-violet-200/60 via-white to-pink-200/60 px-5 relative overflow-hidden">
        <div className="absolute -top-40 -left-32 w-[420px] h-[420px] rounded-full bg-fuchsia-300/40 blur-3xl" />
        <div className="absolute -bottom-40 -right-32 w-[460px] h-[460px] rounded-full bg-violet-300/40 blur-3xl" />
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            setErr("");
            try {
              await signIn(form.email, form.password);
            } catch (e: any) {
              setErr(e?.message || "Invalid credentials");
            } finally {
              setBusy(false);
            }
          }}
          className="relative w-full max-w-sm rounded-3xl backdrop-blur-2xl bg-white/70 border border-white/70 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.25)] p-7 space-y-5"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl grid place-items-center bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-extrabold tracking-tight">BundleByte Admin</p>
              <p className="text-[11px] text-gray-500">Sign in to continue</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-gray-700">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder={ADMIN_EMAIL}
                className="mt-1 w-full h-11 px-3 rounded-xl bg-white/80 border border-gray-200 focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-100 outline-none text-sm transition"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-gray-700">Password</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="mt-1 w-full h-11 px-3 rounded-xl bg-white/80 border border-gray-200 focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-100 outline-none text-sm transition"
              />
            </div>
          </div>

          {err && <p className="text-xs text-red-500">{err}</p>}

          <button
            disabled={busy}
            className="w-full h-11 rounded-full text-sm font-bold text-white bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500 shadow-lg hover:opacity-95 transition disabled:opacity-60"
          >
            {busy ? "Please wait…" : "Sign in"}
          </button>

          <p className="text-[10px] text-center text-gray-400 inline-flex items-center justify-center gap-1 w-full">
            <Lock className="w-3 h-3" /> Restricted to authorised admin only.
          </p>
        </form>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center bg-gradient-to-br from-violet-100 via-white to-pink-100 px-5">
        <div className="max-w-sm text-center rounded-3xl backdrop-blur-2xl bg-white/70 border border-white/70 p-7 shadow">
          <p className="font-extrabold">Not an admin</p>
          <p className="text-xs text-gray-500 mt-2">
            You're signed in as <span className="font-mono">{user?.email}</span> but don't have admin access.
          </p>
          <button
            onClick={async () => { await signOut(); }}
            className="mt-4 inline-flex items-center gap-1.5 h-10 px-4 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-xs font-bold shadow"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign out
          </button>
        </div>
      </div>
    );
  }

  const isActive = (to: string, exact?: boolean) => (exact ? pathname === to : pathname === to || pathname.startsWith(to + "/"));

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-pink-50 text-gray-900">
      <div className="pointer-events-none fixed -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-fuchsia-200/40 blur-3xl" />
      <div className="pointer-events-none fixed -bottom-32 -right-32 w-[460px] h-[460px] rounded-full bg-violet-200/40 blur-3xl" />

      <aside
        className={`fixed z-40 top-0 left-0 h-full w-64 backdrop-blur-2xl bg-white/70 border-r border-white/60 shadow-xl transition-transform duration-300 md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl grid place-items-center bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="font-extrabold tracking-tight leading-tight">BundleByte</p>
              <p className="text-[10px] uppercase tracking-wider text-gray-500">Admin</p>
            </div>
          </Link>
          <button onClick={() => setOpen(false)} className="md:hidden w-8 h-8 rounded-full grid place-items-center hover:bg-gray-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="px-3 space-y-1">
          {nav.map((n) => {
            const Icon = n.icon;
            const active = isActive(n.to, n.exact);
            return (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                  active
                    ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-white/80"
                }`}
              >
                <Icon className="w-4 h-4" /> {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-4 left-0 right-0 px-3">
          <p className="text-[10px] text-gray-500 px-3 mb-2 truncate">{user?.email}</p>
          <button
            onClick={async () => {
              await signOut();
              navigate({ to: "/admin" });
            }}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-white/80 transition"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </aside>

      <div className="md:hidden sticky top-0 z-30 backdrop-blur-xl bg-white/70 border-b border-white/60 px-4 py-3 flex items-center gap-3">
        <button onClick={() => setOpen(true)} className="w-9 h-9 rounded-full grid place-items-center bg-white/80 border border-gray-200">
          <Menu className="w-4 h-4" />
        </button>
        <p className="font-extrabold tracking-tight">BundleByte Admin</p>
      </div>

      <main className="md:pl-64">
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-6 md:py-8">
          <Outlet />
        </div>
      </main>

      {open && (
        <div onClick={() => setOpen(false)} className="md:hidden fixed inset-0 z-30 bg-black/40 backdrop-blur-sm" />
      )}
    </div>
  );
}
