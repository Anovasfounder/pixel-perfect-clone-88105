import { createFileRoute } from "@tanstack/react-router";
import { useProducts } from "@/lib/db";
import { Flame, Check } from "lucide-react";

export const Route = createFileRoute("/admin/trending")({
  component: AdminTrending,
});

function AdminTrending() {
  const { items, update, loading } = useProducts();
  const trending = items.filter((p) => p.isTrending);

  const toggle = (id: string, next: boolean) => update.mutate({ id, isTrending: next });

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <Flame className="w-6 h-6 text-fuchsia-600" /> Trending Now
          </h1>
          <p className="text-sm text-gray-500">Pick products to feature in the homepage Trending Now section</p>
        </div>
        <div className="text-xs font-semibold text-fuchsia-700 bg-fuchsia-50 border border-fuchsia-100 px-3 py-1.5 rounded-full">
          {trending.length} selected
        </div>
      </header>

      <div className="rounded-3xl backdrop-blur-2xl bg-white/70 border border-white/70 shadow-sm overflow-hidden">
        {loading ? (
          <p className="p-10 text-center text-sm text-gray-500">Loading…</p>
        ) : items.length === 0 ? (
          <p className="p-10 text-center text-sm text-gray-500">Add products first to feature them here.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
            {items.map((p) => {
              const on = p.isTrending;
              return (
                <button
                  key={p.id}
                  onClick={() => toggle(p.id, !on)}
                  className={`text-left rounded-2xl border backdrop-blur-xl overflow-hidden transition hover:-translate-y-0.5 hover:shadow-lg ${
                    on
                      ? "bg-gradient-to-br from-fuchsia-50 to-violet-50 border-fuchsia-300 shadow-[0_8px_24px_-8px_rgba(217,70,239,0.35)]"
                      : "bg-white/80 border-white/80 shadow-sm"
                  }`}
                >
                  <div className="relative aspect-[4/3] bg-gray-100">
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
                    {on && (
                      <div className="absolute top-2 right-2 w-7 h-7 rounded-full grid place-items-center bg-gradient-to-br from-fuchsia-600 to-violet-600 text-white shadow-md">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <div className="p-3.5">
                    <p className="text-[13px] font-bold truncate">{p.title}</p>
                    <p className="text-[11px] text-gray-500 truncate">{p.subtitle}</p>
                    <p className="text-xs font-extrabold mt-1.5">₹{p.price.toLocaleString("en-IN")}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
