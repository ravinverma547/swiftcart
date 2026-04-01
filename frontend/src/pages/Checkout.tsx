import { FormEvent, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../lib/api";

export default function Checkout(props: { token: string }) {
  const navigate = useNavigate();
  const [street, setStreet] = useState("221B Baker Street");
  const [city, setCity] = useState("London");
  const [state, setState] = useState("Greater London");
  const [zipCode, setZipCode] = useState("NW1 6XE");
  const [country, setCountry] = useState("UK");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "STRIPE" | "RAZORPAY">("COD");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return street && city && state && zipCode && country && paymentMethod;
  }, [street, city, state, zipCode, country, paymentMethod]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      await apiFetch("/api/v1/orders/checkout", {
        method: "POST",
        token: props.token,
        body: {
          shippingAddress: { street, city, state, zipCode, country },
          paymentMethod,
        },
      });
      navigate("/orders");
    } catch (err: any) {
      setError(err?.message ?? "Checkout failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-white">Checkout</h1>
      <p className="mt-1 text-sm text-slate-300">Your cart gets converted to an order snapshot.</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-5 rounded-3xl border border-white/10 bg-white/5 p-6">
        {error && <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">{error}</div>}

        <div>
          <div className="text-sm font-semibold text-white">Shipping Address</div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-xs text-slate-300">Street</label>
              <input value={street} onChange={(e) => setStreet(e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/30 px-4 py-2 text-sm text-white" required />
            </div>
            <div>
              <label className="text-xs text-slate-300">City</label>
              <input value={city} onChange={(e) => setCity(e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/30 px-4 py-2 text-sm text-white" required />
            </div>
            <div>
              <label className="text-xs text-slate-300">State</label>
              <input value={state} onChange={(e) => setState(e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/30 px-4 py-2 text-sm text-white" required />
            </div>
            <div>
              <label className="text-xs text-slate-300">ZIP Code</label>
              <input value={zipCode} onChange={(e) => setZipCode(e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/30 px-4 py-2 text-sm text-white" required />
            </div>
            <div>
              <label className="text-xs text-slate-300">Country</label>
              <input value={country} onChange={(e) => setCountry(e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/30 px-4 py-2 text-sm text-white" required />
            </div>
          </div>
        </div>

        <div>
          <div className="text-sm font-semibold text-white">Payment Method</div>
          <div className="mt-3 flex gap-2 flex-wrap">
            {(["COD", "STRIPE", "RAZORPAY"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setPaymentMethod(m)}
                className={`rounded-xl border px-4 py-2 text-sm font-medium ${
                  paymentMethod === m ? "border-indigo-400 bg-indigo-400/20 text-white" : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate("/cart")}
            className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white hover:bg-white/10"
          >
            Back to cart
          </button>
          <button
            type="submit"
            disabled={submitting || !canSubmit}
            className="flex-1 rounded-2xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-fuchsia-500/20 hover:opacity-90 disabled:opacity-60"
          >
            {submitting ? "Placing order..." : "Place order"}
          </button>
        </div>
      </form>
    </div>
  );
}

