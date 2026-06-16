import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useProducts, useCategories } from "@/lib/adminStore";
import { PackagePlus, Trash2, Image as ImageIcon, IndianRupee, Link2, Tag, FileText, X } from "lucide-react";

export const Route = createFileRoute("/admin/products")({
  component: AdminProducts,
});

function AdminProducts() {
  const { items, add, remove } = useProducts();
  const { items: categories } = useCategories();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    description: "",
    categoryId: categories[0]?.id ?? "",
    price: "",
    oldPrice: "",
    image: "",
    paymentLink: "",
  });
  const [err, setErr] = useState("");

  const reset = () => setForm({ title: "", subtitle: "", description: "", categoryId: categories[0]?.id ?? "", price: "", oldPrice: "", image: "", paymentLink: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.categoryId || !form.price || !form.image || !form.paymentLink) {
      setErr("Fill in title, category, price, image and payment link.");
      return;
    }
    add({
      title: form.title.trim(),
      subtitle: form.subtitle.trim(),
      description: form.description.trim(),
      categoryId: form.categoryId,
      price: Number(form.price) || 0,
      oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
      image: form.image.trim(),
      paymentLink: form.paymentLink.trim(),
    });
    setErr("");
    reset();
    setShowForm(false);
  };

  const catName = (id: string) => categories.find((c) => c.id === id)?.name ?? "—";

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Products</h1>
          <p className="text-sm text-gray-500">Manage your store catalogue</p>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="inline-flex items-center gap-1.5 h-10 px-4 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-xs font-bold shadow hover:opacity-95 transition"
        >
          {showForm ? <><X className="w-3.5 h-3.5" /> Close</> : <><PackagePlus className="w-3.5 h-3.5" /> Add product</>}
        </button>
      </header>

      {showForm && (
        <form onSubmit={submit} className="rounded-3xl backdrop-blur-2xl bg-white/70 border border-white/70 shadow-sm p-6 grid md:grid-cols-2 gap-4">
          <Field icon={Tag} label="Product title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} placeholder="LinkedIn Premium" />
          <Field icon={Tag} label="Subtitle" value={form.subtitle} onChange={(v) => setForm({ ...form, subtitle: v })} placeholder="Sales Navigator" />

          <div className="md:col-span-2">
            <label className="text-[11px] font-semibold text-gray-700 mb-1.5 block flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              placeholder="Describe the product..."
              className="w-full px-3 py-2.5 rounded-xl bg-white/80 border border-gray-200 focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-100 outline-none text-sm transition"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-gray-700 mb-1.5 block">Category</label>
            <select
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="w-full h-11 px-3 rounded-xl bg-white/80 border border-gray-200 focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-100 outline-none text-sm transition"
            >
              {categories.length === 0 && <option value="">Add a category first</option>}
              {categories.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
            </select>
          </div>

          <Field icon={ImageIcon} label="Image URL" value={form.image} onChange={(v) => setForm({ ...form, image: v })} placeholder="https://..." />

          <Field icon={IndianRupee} label="Price (₹)" value={form.price} onChange={(v) => setForm({ ...form, price: v })} placeholder="2499" type="number" />
          <Field icon={IndianRupee} label="Old price (₹)" value={form.oldPrice} onChange={(v) => setForm({ ...form, oldPrice: v })} placeholder="3299 (optional)" type="number" />

          <div className="md:col-span-2">
            <Field icon={Link2} label="Payment gateway link" value={form.paymentLink} onChange={(v) => setForm({ ...form, paymentLink: v })} placeholder="https://rzp.io/l/xxxx" />
          </div>

          {err && <p className="md:col-span-2 text-xs text-red-500">{err}</p>}

          <div className="md:col-span-2 flex justify-end gap-2">
            <button type="button" onClick={() => { setShowForm(false); reset(); }} className="h-10 px-5 rounded-full text-xs font-semibold bg-white/80 border border-gray-200 hover:bg-gray-50 transition">Cancel</button>
            <button className="h-10 px-5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 shadow hover:opacity-95 transition">Save product</button>
          </div>
        </form>
      )}

      {/* List */}
      <div className="rounded-3xl backdrop-blur-2xl bg-white/70 border border-white/70 shadow-sm overflow-hidden">
        {items.length === 0 ? (
          <div className="p-10 text-center">
            <div className="mx-auto w-14 h-14 rounded-2xl grid place-items-center bg-gradient-to-br from-violet-100 to-fuchsia-100 mb-3">
              <PackagePlus className="w-6 h-6 text-fuchsia-600" />
            </div>
            <p className="font-bold">No products yet</p>
            <p className="text-xs text-gray-500 mt-1">Click "Add product" to create your first listing.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
            {items.map((p) => (
              <div key={p.id} className="group rounded-2xl bg-white/80 border border-white/80 backdrop-blur-xl shadow-sm overflow-hidden hover:-translate-y-0.5 hover:shadow-lg transition">
                <div className="aspect-[4/3] bg-gray-100">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[13px] font-bold truncate">{p.title}</p>
                      <p className="text-[11px] text-gray-500 truncate">{p.subtitle}</p>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-fuchsia-700 bg-fuchsia-50 border border-fuchsia-100 px-2 py-0.5 rounded-full shrink-0">{catName(p.categoryId)}</span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold">₹{p.price.toLocaleString("en-IN")}</span>
                      {p.oldPrice && <span className="text-xs line-through text-gray-400">₹{p.oldPrice.toLocaleString("en-IN")}</span>}
                    </div>
                    <button onClick={() => remove(p.id)} className="w-8 h-8 rounded-full grid place-items-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition" aria-label="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ icon: Icon, label, value, onChange, placeholder, type = "text" }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div>
      <label className="text-[11px] font-semibold text-gray-700 mb-1.5 block flex items-center gap-1.5"><Icon className="w-3.5 h-3.5" /> {label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-11 px-3 rounded-xl bg-white/80 border border-gray-200 focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-100 outline-none text-sm transition"
      />
    </div>
  );
}
