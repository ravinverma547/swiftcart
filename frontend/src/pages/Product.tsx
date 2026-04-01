import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../lib/api";

type Review = {
  id: string;
  rating: number;
  comment: string;
  user: { id: string; name: string };
  createdAt: string;
};

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

export default function Product(props: { token: string | null }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const canAdd = !!props.token && !!product && qty <= product.stock;

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await apiFetch<{ product: Product; reviews: Review[] }>(`/api/v1/products/${id}`);
        if (!mounted) return;
        setProduct(data.product);
        setReviews(data.reviews ?? []);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message ?? "Failed to load product");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, [id]);

  const addToCart = async () => {
    if (!props.token || !id || !product) {
      navigate("/login");
      return;
    }
    await apiFetch("/api/v1/cart/items", {
      method: "POST",
      token: props.token,
      body: { productId: id, quantity: qty },
    });
    navigate("/cart");
  };

  const submitReview = async (e: FormEvent) => {
    e.preventDefault();
    if (!props.token || !id) {
      navigate("/login");
      return;
    }
    try {
      setSubmittingReview(true);
      await apiFetch("/api/v1/reviews", {
        method: "POST",
        token: props.token,
        body: { productId: id, rating, comment },
      });
      // Refresh reviews list
      const data = await apiFetch<{ product: Product; reviews: Review[] }>(`/api/v1/products/${id}`);
      setProduct(data.product);
      setReviews(data.reviews ?? []);
      setComment("");
      setRating(5);
    } catch (e: any) {
      setError(e?.message ?? "Review submit failed");
    } finally {
      setSubmittingReview(false);
    }
  };

  const starsText = useMemo(() => {
    if (!product) return "—";
    return `${product.ratings.toFixed(1)} ⭐ (${product.numReviews} reviews)`;
  }, [product]);

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <div className="h-80 animate-pulse rounded-3xl border border-white/10 bg-white/5" />
        <div className="h-80 animate-pulse rounded-3xl border border-white/10 bg-white/5" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-5 text-sm text-rose-200">{error}</div>
    );
  }

  if (!product) {
    return <div className="text-sm text-slate-300">Product not found.</div>;
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <div className="text-sm text-slate-300">
          <Link to="/search" className="text-indigo-200 hover:text-white">
            Explore
          </Link>{" "}
          / {product.category} / <span className="text-white">{product.brand}</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 md:items-start">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
          <div className="relative overflow-hidden rounded-2xl bg-slate-900">
            <img
              src={product.images?.[0]}
              alt={product.name}
              className="h-[420px] w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-xs text-slate-300">{product.category}</div>
            <h1 className="mt-2 text-2xl font-semibold text-white">{product.name}</h1>
            <div className="mt-2 text-sm text-slate-300">{starsText}</div>
            <div className="mt-4 flex items-baseline gap-3">
              <div className="text-3xl font-semibold text-white">${product.price.toFixed(2)}</div>
              <div className="text-sm text-slate-300">stock: {product.stock}</div>
            </div>
            <p className="mt-4 text-sm text-slate-300 leading-relaxed">{product.description}</p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/30 px-3 py-2">
                <button
                  className="h-9 w-9 rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10"
                  onClick={() => setQty((v) => Math.max(1, v - 1))}
                  type="button"
                >
                  -
                </button>
                <div className="min-w-[28px] text-center text-sm font-semibold text-white">{qty}</div>
                <button
                  className="h-9 w-9 rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10"
                  onClick={() => setQty((v) => Math.min(product.stock || 1, v + 1))}
                  type="button"
                >
                  +
                </button>
              </div>

              <button
                disabled={!canAdd}
                onClick={addToCart}
                className="flex-1 rounded-2xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-fuchsia-500/20 hover:opacity-90 disabled:opacity-60"
              >
                Add to cart
              </button>
            </div>

            <div className="mt-3 text-xs text-slate-400">
              Tip: After adding to cart, checkout creates an order with snapshot items.
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">Add a review</h2>
            <form onSubmit={submitReview} className="mt-4 space-y-4">
              <div>
                <div className="text-xs text-slate-300">Rating</div>
                <div className="mt-2 flex gap-2">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const value = i + 1;
                    const active = value <= rating;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setRating(value)}
                        className={`h-10 w-10 rounded-xl border ${
                          active ? "border-indigo-400 bg-indigo-400/20" : "border-white/10 bg-white/5"
                        } text-white hover:bg-white/10`}
                      >
                        {value}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-300">Comment</div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 text-sm text-white placeholder:text-slate-600"
                  placeholder="Share what you liked..."
                  required
                />
              </div>

              <button
                disabled={submittingReview}
                className="w-full rounded-2xl bg-white/10 px-4 py-3 text-sm font-medium text-white hover:bg-white/15 disabled:opacity-60"
                type="submit"
              >
                {submittingReview ? "Submitting..." : "Submit review"}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Customer reviews</h2>
            <div className="mt-1 text-sm text-slate-300">{reviews.length} reviews</div>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {reviews.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-slate-950/30 p-4 text-sm text-slate-300">
              No reviews yet. Be the first!
            </div>
          ) : (
            reviews.map((r) => (
              <div key={r.id} className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-white">{r.user?.name ?? "User"}</div>
                  <div className="text-xs text-slate-300">⭐ {r.rating}</div>
                </div>
                <div className="mt-2 text-sm text-slate-300">{r.comment}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

