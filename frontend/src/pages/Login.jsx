import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { API_BASE, useAuth } from "../context/AuthContext";

export default function Login() {
  const nav = useNavigate();
  const { login } = useAuth();

  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function onSubmit(ev) {
    ev.preventDefault();
    setErr("");

    if (!form.email || !form.password) {
      setErr("Email and password are required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Login failed");

      login({ token: data.token, user: data.user });

      // 🔑 Role-based redirect
      if (data.user.role === "doctor") nav("/doctor", { replace: true });
      else nav("/patient", { replace: true });

    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Login to Your Account">
      <form onSubmit={onSubmit} className="space-y-4">

        {/* Email */}
        <div>
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm
              focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* Password */}
        <div>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-md border border-slate-200 px-3 py-2 pr-12 text-sm shadow-sm
                focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <button
              type="button"
              onClick={() => setShowPass((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1
                text-xs font-medium text-slate-600 hover:bg-slate-100"
            >
              {showPass ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {err && <p className="text-sm text-rose-600">{err}</p>}

        {/* Login button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white
            hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Signup */}
        <p className="text-center text-sm text-slate-600">
          Don’t have an account?{" "}
          <Link to="/signup" className="font-medium text-blue-700 hover:underline">
            Signup
          </Link>
        </p>

        {/* 🔐 Admin login link (subtle & safe) */}
        <div className="pt-2 text-center">
          <Link
            to="/admin/login"
            className="text-xs text-slate-500 hover:text-blue-700 hover:underline"
          >
            Are you an admin? Admin Login
          </Link>
        </div>

      </form>
    </AuthLayout>
  );
}
