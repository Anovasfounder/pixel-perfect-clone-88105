import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useCategories, useProducts } from "@/lib/adminStore";
import { FolderPlus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/categories")({
  component: AdminCategories;
});

function AdminCategories() {
  const { items, add, remove } = useCategories();
  const { items: products } = useProducts();
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("✨");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    add({ name: name.trim(), icon });
    setName("");
    setIcon("✨");
  };

  const count = (id: string) => products.filter((p) => p.categoryId === id).length;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Categories</h1>
        <p className="text-sm text-gray-500">Group your products for easy browsing</p>
      </header>

      <form onSubmit={submit} className="rounded-3xl backdrop-blur-2xl bg-white/70 border border-white/70 shadow-sm p-5 flex flex-col sm:flex-row gap-3">
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
        <button className="h-11 px-5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 shadow inline-flex items-center gap-1.5">
          <FolderPlus className="w-4 h-4" /> Add category
        </button>
      </form>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {items.map((c) => (
          <div key={c.id} className="rounded-2xl backdrop-blur-xl bg-white/70 border border-white/70 shadow-sm p-4 hover:-translate-y-0.5 hover:shadow-lg transition">
            <div className="flex items-start justify-between">
              <div className="text-3xl">{c.icon}</div>
              <button onClick={() => remove(c.id)} className="w-8 h-8 rounded-full grid place-items-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <p className="mt-2 font-bold">{c.name}</p>
            <p className="text-[11px] text-gray-500">{count(c.id)} product{count(c.id) === 1 ? "" : "s"}</p>
          </div>
        ))}
        {items.length === 0 && (
          <p className="col-span-full text-center text-sm text-gray-500 py-10">No categories yet.</p>
        )}
      </div>
    </div>
  );
}
