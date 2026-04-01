import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

export default function Home(props: { token: string | null; role: "CUSTOMER" | "ADMIN" | null }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        setLoading(true);
        const data = await apiFetch<Product[]>("/api/v1/products?limit=8");
        if (!mounted) return;
        setProducts(data);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message ?? "Failed to load products");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, []);

  const featuredCategories = useMemo(() => {
    const set = new Set<string>();
    for (const p of products) set.add(p.category);
    return Array.from(set).slice(0, 4);
  }, [products]);

  const addToCart = async (productId: string) => {
    if (!props.token) {
      navigate("/login");
      return;
    }
    await apiFetch("/api/v1/cart/items", {
      method: "POST",
      token: props.token,
      body: { productId, quantity: 1 },
    });
    navigate("/cart");
  };

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/20 via-fuchsia-500/15 to-amber-400/10 p-8">
        <div className="absolute right-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute bottom-[-160px] left-[-120px] h-[360px] w-[360px] rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative grid gap-6 md:grid-cols-2 md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-100">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Fast demo eCommerce experience
            </div>
            <h1 className="mt-4 text-3xl font-semibold leading-tight md:text-5xl">
              Shopping, but <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-fuchsia-300">premium</span>.
            </h1>
            <p className="mt-3 text-slate-300">
              SwiftCart: JWT auth, product catalog, cart + checkout, orders, and reviews—everything in one clean portfolio project.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate("/search")}
                className="rounded-xl bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15"
              >
                Explore products
              </button>
              <button
                onClick={() => navigate(props.token ? "/cart" : "/login")}
                className="rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-fuchsia-500/20 hover:opacity-90"
              >
                {props.token ? "Go to cart" : "Login to start"}
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {featuredCategories.length ? (
                featuredCategories.map((c) => (
                  <div
                    key={c}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                    title={c}
                  >
                    <div className="text-xs text-slate-300">Category</div>
                    <div className="mt-1 text-sm font-semibold text-white">{c}</div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                  Loading categories...
                </div>
              )}
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs text-slate-300">Top pick</div>
              <div className="mt-1 text-base font-semibold text-white">{products[0]?.name ?? "—"}</div>
              <div className="mt-2 text-sm text-slate-300">
                {products[0] ? `From $${products[0].price.toFixed(2)}` : ""}
              </div>
              {products[0] && (
                <div className="mt-3 flex gap-3">
                  <Link
                    to={`/product/${products[0].id}`}
                    className="text-sm text-indigo-200 hover:text-white"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => addToCart(products[0].id)}
                    className="rounded-xl bg-indigo-500/20 px-3 py-1.5 text-sm text-white hover:bg-indigo-500/30"
                  >
                    Add to cart
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">Featured products</h2>
            <p className="mt-1 text-sm text-slate-300">A clean catalog with reviews + cart-ready UX.</p>
          </div>
          <button
            onClick={() => navigate("/search")}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white hover:bg-white/10"
          >
            View all
          </button>
        </div>

        {loading ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-44 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
            ))}
          </div>
        ) : error ? (
          <div className="mt-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">
            {error}
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p) => (
              <div
                key={p.id}
                className="group rounded-3xl border border-white/10 bg-white/5 p-4 transition hover:-translate-y-0.5 hover:bg-white/7"
              >
                <Link to={`/product/${p.id}`}>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-900">
                    <img
                      src={p.images?.[0]}
                      alt={p.name}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute left-3 top-3 rounded-full bg-indigo-500/90 px-2 py-1 text-xs font-medium text-white">
                      {p.brand}
                    </div>
                  </div>
                </Link>

                <div className="mt-4">
                  <div className="text-xs text-slate-300">{p.category}</div>
                  <div className="mt-1 line-clamp-2 text-sm font-semibold text-white">{p.name}</div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <div className="text-lg font-semibold text-white">${p.price.toFixed(2)}</div>
                    <div className="text-xs text-slate-300">in stock: {p.stock}</div>
                  </div>
                  <div className="mt-2 text-xs text-slate-300">
                    ⭐ {p.ratings.toFixed(1)} ({p.numReviews} reviews)
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => addToCart(p.id)}
                      className="flex-1 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-3 py-2 text-sm font-medium text-white hover:opacity-90"
                    >
                      Add
                    </button>
                    <Link
                      to={`/product/${p.id}`}
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white hover:bg-white/10"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

