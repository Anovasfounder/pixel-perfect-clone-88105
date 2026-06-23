import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useCategories, useProducts } from "@/lib/db";
import { FolderPlus, Trash2, KeyRound } from "lucide-react";

export const Route = createFileRoute("/admin/categories")({
  component: AdminCategories,
});

function AdminCategories() {
  const { items, add, update, remove, loading } = useCategories();
  const { items: products } = useProducts();
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("✨");
  const [isKey, setIsKey] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    if (!name.trim()) return;
    try {
      await add.mutateAsync({ name: name.trim(), icon, isKey });
      setName("");
      setIcon("✨");
      setIsKey(false);
    } catch (e: any) {
      setErr(e?.message || "Could not add category.");
    }
  };

  const count = (id: string) => products.filter((p) => p.categoryId === id).length;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Categories</h1>
        <p className="text-sm text-gray-500">
          Group your products. Mark a category as a <strong>Key category</strong> to swap the product form fields (platform + region).
        </p>
      </header>

      <form onSubmit={submit} className="rounded-3xl backdrop-blur-2xl bg-white/70 border border-white/70 shadow-sm p-5 flex flex-col sm:flex-row gap-3 sm:items-center">
        <input
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
          maxLength={2}
          className="w-16 h-11 text-center text-xl rounded-xl bg-white/80 border border-gray-200 focus:border-fuchsia-400 outline-none"
          placeholder="🎮"
        />
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category name (e.g. Productivity)"
          className="flex-1 h-11 px-3 rounded-xl bg-white/80 border border-gray-200 focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-100 outline-none text-sm"
        />
        <label className="inline-flex items-center gap-2 px-3 h-11 rounded-xl bg-white/80 border border-gray-200 cursor-pointer text-xs font-semibold text-gray-700 select-none">
          <input type="checkbox" checked={isKey} onChange={(e) => setIsKey(e.target.checked)} className="accent-fuchsia-600" />
          <KeyRound className="w-3.5 h-3.5" /> Key category
        </label>
        <button
          disabled={add.isPending}
          className="h-11 px-5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 shadow inline-flex items-center gap-1.5 disabled:opacity-60"
        >
          <FolderPlus className="w-4 h-4" /> {add.isPending ? "Adding…" : "Add category"}
        </button>
      </form>

      {err && <p className="text-xs text-red-500 -mt-3">{err}</p>}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {items.map((c) => (
          <div key={c.id} className="rounded-2xl backdrop-blur-xl bg-white/70 border border-white/70 shadow-sm p-4 hover:-translate-y-0.5 hover:shadow-lg transition">
            <div className="flex items-start justify-between">
              <div className="text-3xl">{c.icon}</div>
              <button onClick={() => remove.mutate(c.id)} className="w-8 h-8 rounded-full grid place-items-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <p className="mt-2 font-bold">{c.name}</p>
            <p className="text-[11px] text-gray-500">{count(c.id)} product{count(c.id) === 1 ? "" : "s"}</p>
            <label className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={c.isKey}
                onChange={(e) => update.mutate({ id: c.id, isKey: e.target.checked })}
                className="accent-fuchsia-600"
              />
              <KeyRound className="w-3 h-3" /> Key category
            </label>
          </div>
        ))}
        {!loading && items.length === 0 && (
          <p className="col-span-full text-center text-sm text-gray-500 py-10">No categories yet.</p>
        )}
        {loading && <p className="col-span-full text-center text-sm text-gray-500 py-10">Loading…</p>}
      </div>
    </div>
  );
}
