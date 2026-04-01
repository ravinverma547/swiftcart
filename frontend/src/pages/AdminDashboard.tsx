import { FormEvent, useEffect, useMemo, useState } from "react";
import { apiFetch } from "../lib/api";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  brand: string;
  stock: number;
  ratings: number;
  numReviews: number;
};

type Order = {
  id: string;
  status: "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  totalPrice: number;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  orderItems: Array<any>;
};

const statuses: Order["status"][] = ["PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function AdminDashboard(props: { token: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "New SwiftCart Product",
    description: "A premium demo item for portfolio screenshots.",
    price: "39.99",
    images: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
    category: "Demo",
    brand: "SwiftCart",
    stock: "25",
  });

  const [creating, setCreating] = useState(false);

  const [statusDraft, setStatusDraft] = useState<Record<string, Order["status"]>>({});
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const stats = useMemo(() => {
    const total = orders.length;
    const delivered = orders.filter((o) => o.status === "DELIVERED").length;
    const shipped = orders.filter((o) => o.status === "SHIPPED").length;
    return { total, delivered, shipped };
  }, [orders]);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [p, o] = await Promise.all([
        apiFetch<Product[]>("/api/v1/products?limit=50"),
        apiFetch<Order[]>("/api/v1/orders/admin", { token: props.token }),
      ]);
      setProducts(p ?? []);
      setOrders(o ?? []);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCreateProduct = async (e: FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError(null);
    try {
      const created = await apiFetch<Product>("/api/v1/products", {
        method: "POST",
        token: props.token,
        body: {
          name: form.name,
          description: form.description,
          price: Number(form.price),
          images: [form.images],
          category: form.category,
          brand: form.brand,
          stock: Number(form.stock),
          variants: null,
        },
      });
      setProducts((prev) => [created, ...prev]);
    } catch (e: any) {
      setError(e?.message ?? "Create product failed");
    } finally {
      setCreating(false);
    }
  };

  const deleteProduct = async (id: string) => {
    setError(null);
    try {
      await apiFetch(`/api/v1/products/${id}`, { method: "DELETE", token: props.token });
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (e: any) {
      setError(e?.message ?? "Delete failed");
    }
  };

  const updateStatus = async (orderId: string) => {
    const next = statusDraft[orderId];
    if (!next) return;
    setUpdatingStatus(orderId);
    setError(null);
    try {
      await apiFetch(`/api/v1/orders/admin/${orderId}/status`, {
        method: "PATCH",
        token: props.token,
        body: { status: next },
      });
      await load();
    } catch (e: any) {
      setError(e?.message ?? "Status update failed");
    } finally {
      setUpdatingStatus(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">Admin Dashboard</h1>
        <p className="text-sm text-slate-300">
          Admin can create products and update order status (great for portfolio).
        </p>
        <div className="mt-3 flex gap-3 flex-wrap">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <div className="text-xs text-slate-300">Orders</div>
            <div className="mt-1 text-lg font-semibold text-white">{stats.total}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <div className="text-xs text-slate-300">Shipped</div>
            <div className="mt-1 text-lg font-semibold text-white">{stats.shipped}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <div className="text-xs text-slate-300">Delivered</div>
            <div className="mt-1 text-lg font-semibold text-white">{stats.delivered}</div>
          </div>
        </div>
      </div>

      {error && <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-5 text-sm text-rose-200">{error}</div>}

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-56 animate-pulse rounded-3xl border border-white/10 bg-white/5" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-lg font-semibold">Create Product</h2>
              <form onSubmit={onCreateProduct} className="mt-4 space-y-3">
                <div>
                  <label className="text-xs text-slate-300">Name</label>
                  <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/30 px-4 py-2 text-sm text-white" />
                </div>
                <div>
                  <label className="text-xs text-slate-300">Description</label>
                  <input value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/30 px-4 py-2 text-sm text-white" />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-xs text-slate-300">Price</label>
                    <input value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/30 px-4 py-2 text-sm text-white" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300">Stock</label>
                    <input value={form.stock} onChange={(e) => setForm((p) => ({ ...p, stock: e.target.value }))} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/30 px-4 py-2 text-sm text-white" />
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-xs text-slate-300">Brand</label>
                    <input value={form.brand} onChange={(e) => setForm((p) => ({ ...p, brand: e.target.value }))} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/30 px-4 py-2 text-sm text-white" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300">Category</label>
                    <input value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/30 px-4 py-2 text-sm text-white" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-300">Image URL</label>
                  <input value={form.images} onChange={(e) => setForm((p) => ({ ...p, images: e.target.value }))} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/30 px-4 py-2 text-sm text-white" />
                </div>
                <button
                  disabled={creating}
                  className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-fuchsia-500/20 hover:opacity-90 disabled:opacity-60"
                  type="submit"
                >
                  {creating ? "Creating..." : "Create product"}
                </button>
              </form>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-lg font-semibold">Products (Manage)</h2>
              <div className="mt-4 space-y-3">
                {products.slice(0, 6).map((p) => (
                  <div key={p.id} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/30 p-4">
                    <div className="flex items-center gap-3">
                      <img src={p.images?.[0]} alt={p.name} className="h-12 w-12 rounded-xl object-cover" />
                      <div>
                        <div className="text-sm font-semibold text-white">{p.name}</div>
                        <div className="text-xs text-slate-400">${p.price.toFixed(2)} • stock {p.stock}</div>
                      </div>
                    </div>
                    <button
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white hover:bg-white/10"
                      type="button"
                      onClick={() => deleteProduct(p.id)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
                {products.length > 6 && (
                  <div className="text-xs text-slate-400">Showing first 6 products.</div>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">Orders (Status Update)</h2>
            <div className="mt-4 space-y-3">
              {orders.slice(0, 8).map((o) => (
                <div key={o.id} className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="text-sm font-semibold text-white">{o.id}</div>
                      <div className="mt-1 text-xs text-slate-400">{new Date(o.createdAt).toLocaleString()}</div>
                      <div className="mt-1 text-xs text-slate-300">
                        Payment: {o.paymentMethod} • {o.paymentStatus}
                      </div>
                      <div className="mt-2 text-sm text-slate-200">Items: {o.orderItems?.length ?? 0}</div>
                    </div>
                    <div className="flex flex-col items-start gap-2 sm:items-end">
                      <div className="text-xs text-slate-300">Current status</div>
                      <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white">{o.status}</div>
                      <div className="flex gap-2">
                        <select
                          value={statusDraft[o.id] ?? o.status}
                          onChange={(e) =>
                            setStatusDraft((prev) => ({ ...prev, [o.id]: e.target.value as Order["status"] }))
                          }
                          className="rounded-xl border border-white/10 bg-slate-950/30 px-3 py-2 text-sm text-white"
                        >
                          {statuses.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          disabled={updatingStatus === o.id}
                          onClick={() => updateStatus(o.id)}
                          className="rounded-xl bg-white/10 px-3 py-2 text-sm font-medium text-white hover:bg-white/15 disabled:opacity-60"
                        >
                          {updatingStatus === o.id ? "Updating..." : "Update"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {orders.length === 0 && <div className="text-sm text-slate-300">No orders found.</div>}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

