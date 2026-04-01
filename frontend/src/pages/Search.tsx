import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
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

export default function Search() {
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const category = params.get("category") ?? "";

  const queryString = useMemo(() => {
    const parts: string[] = [];
    if (q.trim()) parts.push(`q=${encodeURIComponent(q.trim())}`);
    if (category.trim()) parts.push(`category=${encodeURIComponent(category.trim())}`);
    parts.push("limit=24");
    return parts.length ? `?${parts.join("&")}` : "?limit=24";
  }, [q, category]);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiFetch<Product[]>(`/api/v1/products${queryString}`);
        if (!mounted) return;
        setProducts(data);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message ?? "Failed to search");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, [queryString]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const p of products) set.add(p.category);
    return Array.from(set).sort().slice(0, 8);
  }, [products]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      if (q.trim()) next.set("q", q.trim());
      else next.delete("q");
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <form onSubmit={onSubmit} className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex-1">
            <label className="text-xs text-slate-300">Search</label>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Try: headphones, watch, coffee..."
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/30 px-4 py-2 text-sm text-white placeholder:text-slate-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              className="rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
              type="submit"
            >
              Search
            </button>
            <button
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
              type="button"
              onClick={() => {
                setQ("");
                setParams({ category: category || "", q: "" });
              }}
            >
              Reset
            </button>
          </div>
        </form>

        {categories.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((c) => {
              const active = category === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setParams((prev) => {
                    const next = new URLSearchParams(prev);
                    if (active) next.delete("category");
                    else next.set("category", c);
                    return next;
                  })}
                  className={`rounded-full px-3 py-1 text-xs ${
                    active ? "bg-indigo-500/25 text-white" : "border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-52 animate-pulse rounded-3xl border border-white/10 bg-white/5" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-5 text-sm text-rose-200">{error}</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <div key={p.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <Link to={`/product/${p.id}`}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-900">
                  <img src={p.images?.[0]} alt={p.name} className="h-full w-full object-cover" />
                </div>
              </Link>
              <div className="mt-3">
                <div className="text-xs text-slate-300">{p.category}</div>
                <div className="mt-1 text-sm font-semibold text-white">{p.name}</div>
                <div className="mt-2 flex items-baseline justify-between gap-2">
                  <div className="text-base font-semibold text-white">${p.price.toFixed(2)}</div>
                  <div className="text-xs text-slate-300">⭐ {p.ratings.toFixed(1)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

