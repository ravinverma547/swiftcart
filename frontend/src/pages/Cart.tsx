import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../lib/api";

type CartItem = {
  productId: string;
  quantity: number;
  price: number;
  name: string;
  image: string;
};

type Cart = {
  userId: string;
  items: CartItem[];
};

export default function Cart(props: { token: string }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<Cart | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<Cart>("/api/v1/cart", { token: props.token });
      setCart(data);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const total = useMemo(() => {
    const items = cart?.items ?? [];
    return items.reduce((sum, it) => sum + it.quantity * it.price, 0);
  }, [cart]);

  const updateQty = async (productId: string, quantity: number) => {
    if (!quantity || quantity < 1) return;
    setUpdating(productId);
    try {
      const data = await apiFetch<Cart>("/api/v1/cart/items/" + productId, {
        method: "PATCH",
        token: props.token,
        body: { quantity },
      });
      setCart(data);
    } catch (e: any) {
      setError(e?.message ?? "Update failed");
    } finally {
      setUpdating(null);
    }
  };

  const remove = async (productId: string) => {
    setUpdating(productId);
    try {
      const data = await apiFetch<Cart>("/api/v1/cart/items/" + productId, {
        method: "DELETE",
        token: props.token,
      });
      setCart(data);
    } catch (e: any) {
      setError(e?.message ?? "Remove failed");
    } finally {
      setUpdating(null);
    }
  };

  const items = cart?.items ?? [];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-white">Your cart</h1>
            <p className="mt-1 text-sm text-slate-300">Add products in seconds. Checkout to generate orders.</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-400">Total</div>
            <div className="text-2xl font-semibold text-white">${total.toFixed(2)}</div>
          </div>
        </div>

        {error && <div className="mt-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">{error}</div>}

        {loading ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/30 p-5 text-sm text-slate-300">
            Your cart is empty.
            <div className="mt-3">
              <button
                onClick={() => navigate("/search")}
                className="rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
              >
                Browse products
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {items.map((it) => (
              <div key={it.productId} className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="h-24 w-24 overflow-hidden rounded-2xl bg-slate-900">
                  <img src={it.image} alt={it.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-white">{it.name}</div>
                      <div className="mt-1 text-xs text-slate-300">Price: ${it.price.toFixed(2)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-white">${(it.price * it.quantity).toFixed(2)}</div>
                      <div className="mt-2">
                        <button
                          onClick={() => remove(it.productId)}
                          disabled={updating === it.productId}
                          className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white hover:bg-white/10 disabled:opacity-60"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/30 px-3 py-2">
                      <button
                        type="button"
                        className="h-8 w-8 rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10"
                        onClick={() => updateQty(it.productId, it.quantity - 1)}
                        disabled={updating === it.productId}
                      >
                        -
                      </button>
                      <div className="min-w-[30px] text-center text-sm font-semibold text-white">{it.quantity}</div>
                      <button
                        type="button"
                        className="h-8 w-8 rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10"
                        onClick={() => updateQty(it.productId, it.quantity + 1)}
                        disabled={updating === it.productId}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-semibold text-white">Ready to checkout?</div>
            <div className="mt-1 text-sm text-slate-300">Checkout will create an order snapshot in Mongo.</div>
          </div>
          <div className="flex gap-2">
            <Link
              to="/search"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
            >
              Add more
            </Link>
            <button
              onClick={() => navigate("/checkout")}
              disabled={items.length === 0}
              className="rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

