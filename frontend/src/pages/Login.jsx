import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";

export default function Login() {
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!form.email) e.email = "Email is required";
    if (!form.password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function onSubmit(ev) {
    ev.preventDefault();
    if (!validate()) return;
    alert(`Login (UI-only)\nEmail: ${form.email}`);
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
            className={`w-full rounded-md border px-3 py-2 text-sm outline-none shadow-sm
              ${errors.email ? "border-red-300 focus:ring-2 focus:ring-red-200"
                              : "border-slate-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-200"}`}
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
        </div>

        {/* Password with Show */}
        <div>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={`w-full rounded-md border px-3 py-2 pr-12 text-sm outline-none shadow-sm
                ${errors.password ? "border-red-300 focus:ring-2 focus:ring-red-200"
                                   : "border-slate-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-200"}`}
            />
            <button
              type="button"
              onClick={() => setShowPass((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
            >
              {showPass ? "Hide" : "Show"}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Login
        </button>

        <p className="text-center text-sm text-slate-600">
          Don’t have an account?{" "}
          <Link to="/signup" className="font-medium text-blue-700 hover:underline">
            Signup
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
