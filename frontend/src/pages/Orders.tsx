import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";

type Order = {
  id: string;
  status: "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  paymentMethod: string;
  paymentStatus: string;
  totalPrice: number;
  orderItems: Array<any>;
  shippingAddress?: any;
  createdAt: string;
};

export default function Orders(props: { token: string }) {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiFetch<Order[]>("/api/v1/orders", { token: props.token });
        if (!mounted) return;
        setOrders(data ?? []);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message ?? "Failed to load orders");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, [props.token]);

  const statusColor = (status: Order["status"]) => {
    if (status === "DELIVERED") return "bg-emerald-500/15 text-emerald-200 border-emerald-500/30";
    if (status === "SHIPPED") return "bg-indigo-500/15 text-indigo-200 border-indigo-500/30";
    if (status === "CANCELLED") return "bg-rose-500/15 text-rose-200 border-rose-500/30";
    return "bg-white/5 text-slate-200 border-white/10";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Your Orders</h1>
        <p className="mt-1 text-sm text-slate-300">Checkout creates order snapshot items (useful for portfolio demos).</p>
      </div>

      {error && (
        <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-5 text-sm text-rose-200">{error}</div>
      )}

      {loading ? (
        <div className="grid gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-44 animate-pulse rounded-3xl border border-white/10 bg-white/5" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
          No orders yet. Add items to your cart and checkout.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="text-sm text-slate-300">Order ID</div>
                  <div className="mt-1 text-white text-sm font-semibold">{o.id}</div>
                  <div className="mt-2 text-xs text-slate-400">{new Date(o.createdAt).toLocaleString()}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`rounded-full border px-3 py-1 text-xs ${statusColor(o.status)}`}>{o.status}</div>
                  <div className="text-right">
                    <div className="text-xs text-slate-300">Total</div>
                    <div className="text-lg font-semibold text-white">${(o.totalPrice ?? 0).toFixed(2)}</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
                  <div className="text-xs text-slate-300">Payment</div>
                  <div className="mt-1 text-sm text-white">{o.paymentMethod}</div>
                  <div className="mt-2 text-xs text-slate-400">Status: {o.paymentStatus}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
                  <div className="text-xs text-slate-300">Items ({o.orderItems?.length ?? 0})</div>
                  <div className="mt-2 space-y-2">
                    {(o.orderItems ?? []).slice(0, 4).map((it, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-3 text-sm">
                        <div className="truncate text-slate-200">{it.name ?? it.productId}</div>
                        <div className="text-slate-300">
                          {it.quantity} x ${(it.price ?? 0).toFixed(2)}
                        </div>
                      </div>
                    ))}
                    {(o.orderItems ?? []).length > 4 && (
                      <div className="text-xs text-slate-400">+ more items</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

