import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE, useAuth } from "../context/AuthContext";

export default function AdminLogin() {
  const nav = useNavigate();
  const { login } = useAuth();

  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    if (!form.email || !form.password) {
      setErr("Email and password are required");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Invalid admin credentials");

      login({ token: data.token, user: data.user });
      nav("/admin", { replace: true });
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center px-4 py-14">
        <div className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900 text-center">Admin Login</h1>
          <p className="mt-1 text-center text-sm text-slate-600">Authorized staff only</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <input
                type="email"
                placeholder="Admin email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full rounded-md border border-slate-200 px-3 py-2 pr-12 text-sm shadow-sm focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs text-slate-600 hover:bg-slate-100">
                  {show ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {err && <p className="text-sm text-rose-600">{err}</p>}

            <button type="submit" disabled={loading} className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300">
              {loading ? "Logging in..." : "Login"}
            </button>

            <p className="text-center text-xs text-slate-500">
              Not an admin? <Link to="/login" className="font-medium text-blue-700 hover:underline">User Login</Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
