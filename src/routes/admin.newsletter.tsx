import { createFileRoute } from "@tanstack/react-router";
import { useNewsletter } from "@/lib/adminStore";
import { Mail, Trash2, Download } from "lucide-react";

export const Route = createFileRoute("/admin/newsletter")({
  component: AdminNewsletter,
});

function AdminNewsletter() {
  const { items, remove } = useNewsletter();

  const exportCsv = () => {
    const rows = ["email,date", ...items.map((i) => `${i.email},${new Date(i.date).toISOString()}`)];
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Newsletter</h1>
          <p className="text-sm text-gray-500">{items.length} subscriber{items.length === 1 ? "" : "s"}</p>
        </div>
        {items.length > 0 && (
          <button onClick={exportCsv} className="inline-flex items-center gap-1.5 h-10 px-4 rounded-full bg-white/80 border border-gray-200 text-xs font-bold hover:bg-gray-50 transition">
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        )}
      </header>

      <div className="rounded-3xl backdrop-blur-2xl bg-white/70 border border-white/70 shadow-sm overflow-hidden">
        {items.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto w-14 h-14 rounded-2xl grid place-items-center bg-gradient-to-br from-violet-100 to-fuchsia-100 mb-3">
              <Mail className="w-6 h-6 text-fuchsia-600" />
            </div>
            <p className="font-bold">No subscribers yet</p>
            <p className="text-xs text-gray-500 mt-1">Emails captured on the site will appear here.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {items.map((s) => (
              <li key={s.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-white/60 transition">
                <div className="w-9 h-9 rounded-full grid place-items-center bg-gradient-to-br from-violet-100 to-fuchsia-100 text-fuchsia-700">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{s.email}</p>
                  <p className="text-[11px] text-gray-500">{new Date(s.date).toLocaleString("en-IN")}</p>
                </div>
                <button onClick={() => remove(s.id)} className="w-8 h-8 rounded-full grid place-items-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition">
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
