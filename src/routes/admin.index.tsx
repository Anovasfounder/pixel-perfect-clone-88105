import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { useProducts, useCategories, useSales, useNewsletter } from "@/lib/adminStore";
import { Package, FolderTree, Mail, TrendingUp, IndianRupee, ShoppingCart, ArrowUpRight } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, Legend } from "recharts";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

const PIE_COLORS = ["#a855f7", "#ec4899", "#3b82f6", "#10b981", "#f59e0b", "#6366f1"];

function Dashboard() {
  const { items: products } = useProducts();
  const { items: categories } = useCategories();
  const { items: sales } = useSales();
  const { items: subs } = useNewsletter();

  const totalRevenue = sales.reduce((s, x) => s + x.amount, 0);

  // Sales over last 7 days
  const chartData = useMemo(() => {
    const days: { day: string; sales: number; orders: number }[] = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toDateString();
      const label = d.toLocaleDateString("en-IN", { weekday: "short" });
      const day = sales.filter((s) => new Date(s.date).toDateString() === key);
      days.push({ day: label, sales: day.reduce((a, b) => a + b.amount, 0), orders: day.length });
    }
    return days;
  }, [sales]);

  // Top products
  const topProducts = useMemo(() => {
    const m = new Map<string, { name: string; revenue: number }>();
    sales.forEach((s) => {
      const cur = m.get(s.productTitle) || { name: s.productTitle, revenue: 0 };
      cur.revenue += s.amount;
      m.set(s.productTitle, cur);
    });
    return Array.from(m.values()).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  }, [sales]);

  // Category distribution
  const byCategory = useMemo(() => {
    return categories.map((c) => ({
      name: c.name,
      value: products.filter((p) => p.categoryId === c.id).length,
    })).filter((c) => c.value > 0);
  }, [categories, products]);

  const stats = [
    { label: "Revenue", value: "₹" + totalRevenue.toLocaleString("en-IN"), icon: IndianRupee, grad: "from-violet-500 to-fuchsia-500" },
    { label: "Orders", value: sales.length, icon: ShoppingCart, grad: "from-pink-500 to-rose-500" },
    { label: "Products", value: products.length, icon: Package, grad: "from-blue-500 to-indigo-500" },
    { label: "Categories", value: categories.length, icon: FolderTree, grad: "from-emerald-500 to-teal-500" },
    { label: "Subscribers", value: subs.length, icon: Mail, grad: "from-amber-500 to-orange-500" },
  ];

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Dashboard</h1>
          <p className="text-sm text-gray-500">Overview of your store performance</p>
        </div>
        <Link
          to="/admin/products"
          className="inline-flex items-center gap-1.5 h-10 px-4 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-xs font-bold shadow hover:opacity-95 transition"
        >
          Add product <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </header>

      {/* Stat bento grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl backdrop-blur-2xl bg-white/70 border border-white/70 shadow-sm p-4 hover:-translate-y-0.5 hover:shadow-lg transition">
            <div className={`w-9 h-9 rounded-xl grid place-items-center bg-gradient-to-br ${s.grad} text-white shadow-md mb-3`}>
              <s.icon className="w-4 h-4" />
            </div>
            <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold">{s.label}</p>
            <p className="text-xl md:text-2xl font-extrabold mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Charts bento */}
      <div className="grid md:grid-cols-3 gap-3">
        <div className="md:col-span-2 rounded-3xl backdrop-blur-2xl bg-white/70 border border-white/70 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Revenue (last 7 days)</p>
              <p className="text-2xl font-extrabold">₹{chartData.reduce((a, b) => a + b.sales, 0).toLocaleString("en-IN")}</p>
            </div>
            <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold"><TrendingUp className="w-4 h-4" /> Live</div>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#d946ef" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#d946ef" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#999" />
                <YAxis tick={{ fontSize: 11 }} stroke="#999" />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #eee" }} />
                <Area type="monotone" dataKey="sales" stroke="#d946ef" strokeWidth={2} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl backdrop-blur-2xl bg-white/70 border border-white/70 shadow-sm p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Products by category</p>
          <div className="h-56">
            {byCategory.length === 0 ? (
              <div className="h-full grid place-items-center text-xs text-gray-400">No products yet</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={byCategory} dataKey="value" nameKey="name" outerRadius={70} innerRadius={40}>
                    {byCategory.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <div className="rounded-3xl backdrop-blur-2xl bg-white/70 border border-white/70 shadow-sm p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Top products</p>
          <div className="h-56">
            {topProducts.length === 0 ? (
              <div className="h-full grid place-items-center text-xs text-gray-400">No sales yet</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProducts}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="#999" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#999" />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #eee" }} />
                  <Bar dataKey="revenue" fill="#a855f7" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="rounded-3xl backdrop-blur-2xl bg-white/70 border border-white/70 shadow-sm p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Recent sales</p>
          {sales.length === 0 ? (
            <p className="text-xs text-gray-400 py-8 text-center">No sales yet — they'll appear here.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {sales.slice(0, 5).map((s) => (
                <li key={s.id} className="flex items-center gap-3 py-2.5">
                  <div className="w-9 h-9 rounded-full grid place-items-center bg-gradient-to-br from-violet-100 to-fuchsia-100 text-fuchsia-700 text-xs font-bold">
                    {s.customerName.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold truncate">{s.customerName}</p>
                    <p className="text-[11px] text-gray-500 truncate">{s.productTitle}</p>
                  </div>
                  <p className="text-[13px] font-bold">₹{s.amount.toLocaleString("en-IN")}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
