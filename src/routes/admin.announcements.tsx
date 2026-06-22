import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useAnnouncements } from "@/lib/db";
import { Megaphone, Trash2, Plus, Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/admin/announcements")({
  component: AdminAnnouncements,
});

function AdminAnnouncements() {
  const { items, add, remove, toggle, loading } = useAnnouncements();
  const [message, setMessage] = useState("");
  const [err, setErr] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    if (!message.trim()) {
      setErr("Message is required.");
      return;
    }
    try {
      await add.mutateAsync({ message: message.trim(), sortOrder: items.length + 1, active: true });
      setMessage("");
    } catch (e: any) {
      setErr(e?.message || "Could not add announcement.");
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Announcements</h1>
        <p className="text-sm text-gray-500">Messages shown in the rotating bar at the top of the site</p>
      </header>

      <form onSubmit={submit} className="rounded-3xl backdrop-blur-2xl bg-white/70 border border-white/70 shadow-sm p-5 grid sm:grid-cols-[1fr_auto] gap-3">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="✨ Free shipping on all orders this week"
          className="h-11 px-3 rounded-xl bg-white/80 border border-gray-200 focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-100 outline-none text-sm"
        />
        <button
          disabled={add.isPending}
          className="h-11 px-5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 shadow inline-flex items-center gap-1.5 disabled:opacity-60"
        >
          <Plus className="w-4 h-4" /> {add.isPending ? "Adding…" : "Add"}
        </button>
      </form>
      {err && <p className="text-xs text-red-500 -mt-3">{err}</p>}

      <div className="space-y-2">
        {items.map((a) => (
          <div key={a.id} className="rounded-2xl backdrop-blur-xl bg-white/70 border border-white/70 shadow-sm p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl grid place-items-center ${a.active ? "bg-gradient-to-br from-violet-100 to-fuchsia-100 text-fuchsia-700" : "bg-gray-100 text-gray-400"}`}>
              <Megaphone className="w-4 h-4" />
            </div>
            <p className={`flex-1 text-sm font-medium ${a.active ? "text-gray-900" : "text-gray-400 line-through"}`}>{a.message}</p>
            <button
              onClick={() => toggle.mutate({ id: a.id, active: !a.active })}
              className="w-9 h-9 rounded-full grid place-items-center text-gray-500 hover:text-fuchsia-600 hover:bg-fuchsia-50 transition"
              aria-label={a.active ? "Hide" : "Show"}
            >
              {a.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
            <button onClick={() => remove.mutate(a.id)} className="w-9 h-9 rounded-full grid place-items-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {!loading && items.length === 0 && (
          <p className="text-center text-sm text-gray-500 py-10">No announcements yet.</p>
        )}
        {loading && <p className="text-center text-sm text-gray-500 py-10">Loading…</p>}
      </div>
    </div>
  );
}
