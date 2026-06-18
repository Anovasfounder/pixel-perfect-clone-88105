import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { useSales } from "@/lib/db";
import { IndianRupee, ShoppingCart, Users } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export const Route = createFileRoute("/admin/sales")({
  component: AdminSales,
});

function AdminSales() {
  const { items, loading } = useSales();

  const total = items.reduce((s, x) => s + x.amount, 0);
  const customers = new Set(items.map((i) => i.customerEmail)).size;

  const chart = useMemo(() => {
    const days: { day: string; amount: number }[] = [];
    const now = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toDateString();
      const label = d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
      days.push({ day: label, amount: items.filter((s) => new Date(s.createdAt).toDateString() === key).reduce((a, b) => a + b.amount, 0) });
    }
    return days;
  }, [items]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Sales</h1>
        <p className="text-sm text-gray-500">All completed orders</p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          { label: "Total revenue", value: "₹" + total.toLocaleString("en-IN"), icon: IndianRupee, grad: "from-violet-500 to-fuchsia-500" },
          { label: "Orders", value: items.length, icon: ShoppingCart, grad: "from-pink-500 to-rose-500" },
          { label: "Unique customers", value: customers, icon: Users, grad: "from-blue-500 to-indigo-500" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl backdrop-blur-2xl bg-white/70 border border-white/70 shadow-sm p-4">
            <div className={`w-9 h-9 rounded-xl grid place-items-center bg-gradient-to-br ${s.grad} text-white shadow-md mb-3`}>
              <s.icon className="w-4 h-4" />
            </div>
            <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold">{s.label}</p>
            <p className="text-2xl font-extrabold mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-3xl backdrop-blur-2xl bg-white/70 border border-white/70 shadow-sm p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Revenue trend (14 days)</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="#999" />
              <YAxis tick={{ fontSize: 11 }} stroke="#999" />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #eee" }} />
              <Line type="monotone" dataKey="amount" stroke="#a855f7" strokeWidth={2.5} dot={{ r: 3, fill: "#a855f7" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-3xl backdrop-blur-2xl bg-white/70 border border-white/70 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-sm text-gray-500">Loading…</div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-sm text-gray-500">No sales yet — orders will appear here in real time.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/50 text-[11px] uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold">Customer</th>
                  <th className="text-left px-5 py-3 font-semibold">Email</th>
                  <th className="text-left px-5 py-3 font-semibold">Product</th>
                  <th className="text-left px-5 py-3 font-semibold">Date</th>
                  <th className="text-right px-5 py-3 font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((s) => (
                  <tr key={s.id} className="hover:bg-white/60 transition">
                    <td className="px-5 py-3 font-semibold">{s.customerName}</td>
                    <td className="px-5 py-3 text-gray-600">{s.customerEmail}</td>
                    <td className="px-5 py-3 text-gray-600">{s.productTitle}</td>
                    <td className="px-5 py-3 text-gray-600">{new Date(s.createdAt).toLocaleDateString("en-IN")}</td>
                    <td className="px-5 py-3 text-right font-bold">₹{s.amount.toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
