import { ProductImage } from "@/components/ui/product-image";
import { PRODUCTS } from "@/lib/data/products";

const demoOrders = [
  { id: "CC001", customer: "Priya S.", total: 8297, status: "processing", time: "2 min ago" },
  { id: "CC002", customer: "Arjun M.", total: 4999, status: "confirmed", time: "15 min ago" },
  { id: "CC003", customer: "Rahul K.", total: 12450, status: "shipped", time: "1 hr ago" },
  { id: "CC004", customer: "Sneha P.", total: 3299, status: "delivered", time: "3 hrs ago" },
];

const statusColors: Record<string, string> = {
  confirmed: "text-emerald-400",
  processing: "text-amber-400",
  shipped: "text-cyan-400",
  delivered: "text-violet-400",
};

export default function AdminDashboardPage() {
  const topProducts = [...PRODUCTS].sort((a, b) => b.reviews - a.reviews).slice(0, 5);
  const lowStock = PRODUCTS.filter((p) => p.stock < 30);

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold">Dashboard</h1>
          <p className="text-slate-400 text-sm">Welcome back, Admin</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Revenue (Month)" value="₹12.4L" trend="↑ 18%" />
        <StatCard label="Orders Today" value="47" trend="↑ 12%" />
        <StatCard label="New Users" value="128" trend="This week" />
        <StatCard label="Return Rate" value="2.3%" trend="↓ 0.5%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="glass rounded-2xl p-6">
          <h2 className="font-display text-lg font-bold mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {demoOrders.map((o) => (
              <div key={o.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div>
                  <p className="font-medium text-sm">#{o.id}</p>
                  <p className="text-xs text-slate-400">{o.customer} · {o.time}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">₹{o.total.toLocaleString("en-IN")}</p>
                  <p className={`text-xs capitalize ${statusColors[o.status]}`}>{o.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="font-display text-lg font-bold mb-4">Top Products</h2>
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3 py-2">
                <span className="w-6 h-6 rounded-full bg-violet-500/20 text-violet-300 text-xs flex items-center justify-center font-bold">{i + 1}</span>
                <ProductImage src={p.image} alt="" width={40} height={40} className="w-10 h-10 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.name}</p>
                  <p className="text-xs text-slate-400">{p.reviews} orders</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <h2 className="font-display text-lg font-bold mb-4">Low Stock Alerts</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-white/10">
                <th className="text-left py-3 pr-4">Product</th>
                <th className="text-left py-3 pr-4">Stock</th>
                <th className="text-left py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {lowStock.map((p) => (
                <tr key={p.id} className="border-b border-white/5">
                  <td className="py-3 pr-4">{p.name}</td>
                  <td className="py-3 pr-4"><span className="text-amber-400 font-semibold">{p.stock}</span></td>
                  <td className="py-3"><button className="text-xs text-violet-400 hover:underline">Restock</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function StatCard({ label, value, trend }: { label: string; value: string; trend: string }) {
  return (
    <div className="glass rounded-2xl p-5">
      <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">{label}</p>
      <p className="font-display text-2xl font-bold gradient-text">{value}</p>
      <p className="text-xs text-emerald-400 mt-1">{trend}</p>
    </div>
  );
}
