import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useProducts, useCategories, useBrands } from "@/lib/db";
import { PackagePlus, Trash2, Image as ImageIcon, IndianRupee, Link2, Tag, FileText, X, Gamepad2, Globe, Store, KeyRound } from "lucide-react";

export const Route = createFileRoute("/admin/products")({
  component: AdminProducts,
});

function AdminProducts() {
  const { items, add, remove, loading } = useProducts();
  const { items: categories } = useCategories();
  const { items: brands } = useBrands();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    description: "",
    categoryId: "",
    brandId: "",
    price: "",
    oldPrice: "",
    image: "",
    paymentLink: "",
    platform: "",
    region: "Global",
  });
  const [err, setErr] = useState("");

  const selectedCategory = useMemo(
    () => categories.find((c) => c.id === (form.categoryId || categories[0]?.id || "")),
    [categories, form.categoryId]
  );
  const isKeyMode = !!selectedCategory?.isKey;

  const reset = () =>
    setForm({ title: "", subtitle: "", description: "", categoryId: "", brandId: "", price: "", oldPrice: "", image: "", paymentLink: "", platform: "", region: "Global" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const categoryId = form.categoryId || categories[0]?.id || "";
    if (!form.title || !categoryId || !form.price || !form.image || !form.paymentLink) {
      setErr("Fill in title, category, price, image and payment link.");
      return;
    }
    if (isKeyMode && !form.platform) {
      setErr("This is a Key category — platform is required.");
      return;
    }
    try {
      await add.mutateAsync({
        title: form.title.trim(),
        subtitle: form.subtitle.trim(),
        description: form.description.trim(),
        categoryId,
        brandId: form.brandId || null,
        price: Number(form.price) || 0,
        oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
        image: form.image.trim(),
        paymentLink: form.paymentLink.trim(),
        isKey: isKeyMode,
        platform: isKeyMode ? form.platform.trim() : undefined,
        region: isKeyMode ? (form.region.trim() || "Global") : undefined,
      });
      setErr("");
      reset();
      setShowForm(false);
    } catch (e: any) {
      setErr(e?.message || "Could not save product.");
    }
  };

  const catName = (id: string | null) => categories.find((c) => c.id === id)?.name ?? "—";
  const brandName = (id: string | null) => brands.find((b) => b.id === id)?.name ?? "";

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Products</h1>
          <p className="text-sm text-gray-500">All listings — including keys. Picking a <strong>Key category</strong> swaps the form fields.</p>
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
          <Field icon={Tag} label={isKeyMode ? "Key title" : "Product title"} value={form.title} onChange={(v) => setForm({ ...form, title: v })} placeholder={isKeyMode ? "Minecraft Java Edition" : "LinkedIn Premium"} />
          <Field icon={Tag} label="Subtitle" value={form.subtitle} onChange={(v) => setForm({ ...form, subtitle: v })} placeholder={isKeyMode ? "Lifetime Key" : "Sales Navigator"} />

          <div className="md:col-span-2">
            <label className="text-[11px] font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              placeholder={isKeyMode ? "Activation details, what's included..." : "Describe the product..."}
              className="w-full px-3 py-2.5 rounded-xl bg-white/80 border border-gray-200 focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-100 outline-none text-sm transition"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-gray-700 mb-1.5 block">Category</label>
            <select
              value={form.categoryId || categories[0]?.id || ""}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="w-full h-11 px-3 rounded-xl bg-white/80 border border-gray-200 focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-100 outline-none text-sm transition"
            >
              {categories.length === 0 && <option value="">Add a category first</option>}
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.name}{c.isKey ? " · Key" : ""}
                </option>
              ))}
            </select>
            {isKeyMode && (
              <p className="mt-1.5 text-[10px] font-semibold text-fuchsia-700 inline-flex items-center gap-1">
                <KeyRound className="w-3 h-3" /> Key category — platform & region fields enabled
              </p>
            )}
          </div>

          <div>
            <label className="text-[11px] font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5"><Store className="w-3.5 h-3.5" /> Brand</label>
            <select
              value={form.brandId}
              onChange={(e) => setForm({ ...form, brandId: e.target.value })}
              className="w-full h-11 px-3 rounded-xl bg-white/80 border border-gray-200 focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-100 outline-none text-sm transition"
            >
              <option value="">— No brand —</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>{b.icon || "🏷️"} {b.name}</option>
              ))}
            </select>
            {brands.length === 0 && (
              <p className="mt-1.5 text-[10px] text-gray-500">Add brands in the Brands section to enable Shop by brand.</p>
            )}
          </div>

          {isKeyMode && (
            <>
              <Field icon={Gamepad2} label="Platform" value={form.platform} onChange={(v) => setForm({ ...form, platform: v })} placeholder="PC / Xbox / PlayStation" />
              <Field icon={Globe} label="Region" value={form.region} onChange={(v) => setForm({ ...form, region: v })} placeholder="Global / India / EU" />
            </>
          )}

          <Field icon={ImageIcon} label="Image URL" value={form.image} onChange={(v) => setForm({ ...form, image: v })} placeholder="https://..." />

          <Field icon={IndianRupee} label="Price (₹)" value={form.price} onChange={(v) => setForm({ ...form, price: v })} placeholder="2499" type="number" />
          <Field icon={IndianRupee} label="Old price (₹)" value={form.oldPrice} onChange={(v) => setForm({ ...form, oldPrice: v })} placeholder="3299 (optional)" type="number" />

          <div className="md:col-span-2">
            <Field icon={Link2} label="Payment gateway link" value={form.paymentLink} onChange={(v) => setForm({ ...form, paymentLink: v })} placeholder="https://rzp.io/l/xxxx" />
          </div>

          {err && <p className="md:col-span-2 text-xs text-red-500">{err}</p>}

          <div className="md:col-span-2 flex justify-end gap-2">
            <button type="button" onClick={() => { setShowForm(false); reset(); }} className="h-10 px-5 rounded-full text-xs font-semibold bg-white/80 border border-gray-200 hover:bg-gray-50 transition">Cancel</button>
            <button disabled={add.isPending} className="h-10 px-5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 shadow hover:opacity-95 transition disabled:opacity-60">
              {add.isPending ? "Saving…" : isKeyMode ? "Save key" : "Save product"}
            </button>
          </div>
        </form>
      )}

      <div className="rounded-3xl backdrop-blur-2xl bg-white/70 border border-white/70 shadow-sm overflow-hidden">
        {loading ? (
          <p className="p-10 text-center text-sm text-gray-500">Loading…</p>
        ) : items.length === 0 ? (
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
                      <p className="text-[11px] text-gray-500 truncate">
                        {p.isKey ? `${p.platform ?? ""}${p.region ? " · " + p.region : ""}` : p.subtitle}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${p.isKey ? "text-amber-700 bg-amber-50 border-amber-100" : "text-fuchsia-700 bg-fuchsia-50 border-fuchsia-100"}`}>
                        {p.isKey ? "KEY" : catName(p.categoryId)}
                      </span>
                      {p.brandId && (
                        <span className="text-[10px] font-semibold text-gray-600 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
                          {brandName(p.brandId)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold">₹{p.price.toLocaleString("en-IN")}</span>
                      {p.oldPrice && <span className="text-xs line-through text-gray-400">₹{p.oldPrice.toLocaleString("en-IN")}</span>}
                    </div>
                    <button onClick={() => remove.mutate(p.id)} className="w-8 h-8 rounded-full grid place-items-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition" aria-label="Delete">
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
      <label className="text-[11px] font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5"><Icon className="w-3.5 h-3.5" /> {label}</label>
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
