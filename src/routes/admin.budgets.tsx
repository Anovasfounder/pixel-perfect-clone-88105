import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useBudgets } from "@/lib/db";
import { Wallet, Trash2, Plus } from "lucide-react";

export const Route = createFileRoute("/admin/budgets")({
  component: AdminBudgets,
});

function AdminBudgets() {
  const { items, add, remove, loading } = useBudgets();
  const [label, setLabel] = useState("");
  const [max, setMax] = useState("");
  const [err, setErr] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    const m = Number(max);
    if (!label.trim() || !m || m <= 0) {
      setErr("Provide a label and a positive max amount.");
      return;
    }
    try {
      await add.mutateAsync({ label: label.trim(), maxAmount: m, sortOrder: items.length + 1 });
      setLabel("");
      setMax("");
    } catch (e: any) {
      setErr(e?.message || "Could not add budget.");
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Budgets</h1>
        <p className="text-sm text-gray-500">Customise the budget tiers shown on the homepage</p>
      </header>

      <form onSubmit={submit} className="rounded-3xl backdrop-blur-2xl bg-white/70 border border-white/70 shadow-sm p-5 grid sm:grid-cols-[1fr_180px_auto] gap-3">
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Display label (e.g. ₹499)"
          className="h-11 px-3 rounded-xl bg-white/80 border border-gray-200 focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-100 outline-none text-sm"
        />
        <input
          value={max}
          onChange={(e) => setMax(e.target.value)}
          type="number"
          placeholder="Max amount (₹)"
          className="h-11 px-3 rounded-xl bg-white/80 border border-gray-200 focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-100 outline-none text-sm"
        />
        <button
          disabled={add.isPending}
          className="h-11 px-5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 shadow inline-flex items-center gap-1.5 disabled:opacity-60"
        >
          <Plus className="w-4 h-4" /> {add.isPending ? "Adding…" : "Add tier"}
        </button>
      </form>
      {err && <p className="text-xs text-red-500 -mt-3">{err}</p>}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {items.map((b) => (
          <div key={b.id} className="rounded-2xl backdrop-blur-xl bg-white/70 border border-white/70 shadow-sm p-4 hover:-translate-y-0.5 hover:shadow-lg transition">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl grid place-items-center bg-gradient-to-br from-violet-100 to-fuchsia-100 text-fuchsia-700">
                <Wallet className="w-4 h-4" />
              </div>
              <button onClick={() => remove.mutate(b.id)} className="w-8 h-8 rounded-full grid place-items-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <p className="mt-2 text-xs uppercase tracking-wider text-gray-500 font-semibold">Upto</p>
            <p className="text-lg font-extrabold">{b.label}</p>
            <p className="text-[11px] text-gray-500">≤ ₹{b.maxAmount.toLocaleString("en-IN")}</p>
          </div>
        ))}
        {!loading && items.length === 0 && (
          <p className="col-span-full text-center text-sm text-gray-500 py-10">No budget tiers yet.</p>
        )}
        {loading && <p className="col-span-full text-center text-sm text-gray-500 py-10">Loading…</p>}
      </div>
    </div>
  );
}
