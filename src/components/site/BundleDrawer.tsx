import { useBundle, formatINR } from "./BundleContext";
import { X, Minus, Plus, Trash2, ShoppingBag, Sparkles, ShieldCheck } from "lucide-react";
import { useEffect } from "react";

export function BundleDrawer() {
  const { isOpen, close, items, count, total, setQty, remove, clear } = useBundle();

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div className={`fixed inset-0 z-[60] ${isOpen ? "" : "pointer-events-none"}`} aria-hidden={!isOpen}>
      {/* Backdrop */}
      <div
        onClick={close}
        className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />
      {/* Panel */}
      <aside
        className={`absolute right-0 top-0 h-full w-full sm:w-[420px] bg-white/85 backdrop-blur-2xl border-l border-white/60 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl grid place-items-center bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow-md">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <p className="font-extrabold text-gray-900 tracking-tight leading-tight">Your Bundle</p>
              <p className="text-[11px] text-gray-500">{count} item{count === 1 ? "" : "s"}</p>
            </div>
          </div>
          <button onClick={close} aria-label="Close" className="w-9 h-9 rounded-full grid place-items-center hover:bg-gray-100 transition">
            <X className="w-4 h-4" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="h-full grid place-items-center text-center px-6">
              <div>
                <div className="mx-auto w-16 h-16 rounded-2xl grid place-items-center bg-gradient-to-br from-violet-100 to-fuchsia-100 mb-4">
                  <Sparkles className="w-7 h-7 text-fuchsia-600" />
                </div>
                <p className="font-bold text-gray-900">Your bundle is empty</p>
                <p className="text-xs text-gray-500 mt-1">Add keys to build your perfect bundle.</p>
                <button
                  onClick={close}
                  className="mt-5 inline-flex items-center justify-center h-10 px-5 rounded-full text-xs font-semibold bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow"
                >
                  Continue browsing
                </button>
              </div>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((it) => (
                <li
                  key={it.id}
                  className="flex gap-3 p-3 rounded-2xl backdrop-blur-md bg-white/70 border border-white/70 shadow-sm"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                    {it.image && <img src={it.image} alt={it.title} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-gray-900 truncate">{it.title}</p>
                    {it.subtitle && <p className="text-[11px] text-gray-500 truncate">{it.subtitle}</p>}
                    <div className="flex items-center justify-between mt-2">
                      <div className="inline-flex items-center rounded-full border border-gray-200 bg-white/80">
                        <button
                          onClick={() => setQty(it.id, it.qty - 1)}
                          className="w-7 h-7 grid place-items-center hover:bg-gray-100 rounded-l-full"
                          aria-label="Decrease"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-[12px] font-semibold w-6 text-center">{it.qty}</span>
                        <button
                          onClick={() => setQty(it.id, it.qty + 1)}
                          className="w-7 h-7 grid place-items-center hover:bg-gray-100 rounded-r-full"
                          aria-label="Increase"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-bold text-gray-900">{formatINR(it.price * it.qty)}</span>
                        <button
                          onClick={() => remove(it.id)}
                          className="w-7 h-7 grid place-items-center text-gray-400 hover:text-red-500 transition"
                          aria-label="Remove"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <footer className="border-t border-gray-100 p-5 bg-white/70 backdrop-blur-xl space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-extrabold text-lg text-gray-900">{formatINR(total)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Instant delivery · Verified keys
            </div>
            <button className="w-full inline-flex items-center justify-center gap-2 h-12 rounded-full text-sm font-bold tracking-wide text-white bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500 shadow-lg hover:opacity-95 transition">
              <ShoppingBag className="w-4 h-4" /> Checkout · {formatINR(total)}
            </button>
            <button onClick={clear} className="w-full text-[11px] text-gray-500 hover:text-red-500 transition">
              Clear bundle
            </button>
          </footer>
        )}
      </aside>
    </div>
  );
}
