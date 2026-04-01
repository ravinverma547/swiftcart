import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../lib/api";
import type { DecodedJwt, Role } from "../lib/jwt";
import { decodeJwt } from "../lib/jwt";

type AuthState = {
  token: string;
  role: Role | null;
  email: string | null;
  userId: string | null;
};

export default function Login(props: { onAuth: (next: AuthState) => void }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@swiftcart.demo");
  const [password, setPassword] = useState("admin1234");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true);
      const result = await apiFetch<{
        token: string;
        user: { id: string; name: string; email: string; role: Role };
        role: Role;
      }>("/api/v1/auth/login", {
        method: "POST",
        body: { email, password },
      });

      const token = result.token;
      const decoded: DecodedJwt | null = decodeJwt(token);

      props.onAuth({
        token,
        role: result.role ?? decoded?.role ?? null,
        email: result.user?.email ?? decoded?.email ?? null,
        userId: result.user?.id ?? decoded?.userId ?? null,
      });
      navigate("/");
    } catch (err: any) {
      setError(err?.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-2xl font-semibold">Login</h1>
        <p className="mt-1 text-sm text-slate-300">JWT-based auth to unlock cart, checkout, and reviews.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-xs text-slate-300">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/30 px-4 py-2 text-sm text-white placeholder:text-slate-500"
            />
          </div>
          <div>
            <label className="text-xs text-slate-300">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/30 px-4 py-2 text-sm text-white placeholder:text-slate-500"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">
              {error}
            </div>
          )}

          <button
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
            type="submit"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <button
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
            type="button"
            onClick={() => navigate("/signup")}
          >
            Create account
          </button>
        </form>
      </div>
    </div>
  );
}

