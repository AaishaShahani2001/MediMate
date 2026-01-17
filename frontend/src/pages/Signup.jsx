import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { API_BASE, useAuth } from "../context/AuthContext";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

export default function Signup() {
  const nav = useNavigate();
  const { login } = useAuth();

  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [avatar, setAvatar] = useState(null);

  const [form, setForm] = useState({
    email: "",
    name: "",
    password: "",
    gender: "Male",
    phone: "",
    blood: "O+",
  });
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!form.email) e.email = "Email is required";
    if (!form.name) e.name = "Full name is required";
    if (!form.password || form.password.length < 6) e.password = "Min 6 characters";
    if (!form.phone) e.phone = "Contact number is required";
    if (!form.blood) e.blood = "Select your blood group";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(ev) {
    ev.preventDefault();
    if (!validate()) return;
    setErr(""); setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("gender", form.gender);
      formData.append("phone", form.phone);
      formData.append("blood", form.blood);

      if (avatar) {
        formData.append("avatar", avatar); // optional
      }

      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Signup failed");
      login({ token: data.token, user: data.user });
      // Newly registered users are patients by default -> patient dashboard
      nav("/patient", { replace: true });
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Create Your Account">
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

        {/* Full Name */}
        <div>
          <input
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={`w-full rounded-md border px-3 py-2 text-sm outline-none shadow-sm
              ${errors.name ? "border-red-300 focus:ring-2 focus:ring-red-200"
                : "border-slate-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-200"}`}
          />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
        </div>

        {/* Optional Avatar */}
        <div>
          <label className="block mb-1 text-sm font-medium text-slate-700">
            Profile Photo (Optional)
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatar(e.target.files[0])}
            className="w-full text-sm text-slate-600
               file:mr-4 file:rounded-md file:border-0
               file:bg-blue-50 file:px-4 file:py-2
               file:text-sm file:font-semibold file:text-blue-700
               hover:file:bg-blue-100"
          />
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

        {/* Gender */}
        <div className="flex items-center gap-6 text-sm">
          {["Male", "Female", "Other", "Prefer not to say"].map((g) => (
            <label key={g} className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="gender"
                value={g}
                checked={form.gender === g}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-200"
              />
              {g}
            </label>
          ))}
        </div>

        {/* Contact Number */}
        <div>
          <input
            placeholder="Contact Number"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className={`w-full rounded-md border px-3 py-2 text-sm outline-none shadow-sm
              ${errors.phone ? "border-red-300 focus:ring-2 focus:ring-red-200"
                : "border-slate-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-200"}`}
          />
          {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
        </div>

        {/* Blood Group */}
        <div>
          <select
            value={form.blood}
            onChange={(e) => setForm({ ...form, blood: e.target.value })}
            className={`w-full rounded-md border px-3 py-2 text-sm outline-none shadow-sm bg-white
              ${errors.blood ? "border-red-300 focus:ring-2 focus:ring-red-200"
                : "border-slate-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-200"}`}
          >
            <option value="">Select Blood Group</option>
            {BLOOD_GROUPS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          {errors.blood && <p className="mt-1 text-xs text-red-600">{errors.blood}</p>}
        </div>

        {err && <p className="text-sm text-rose-600">{err}</p>}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>

        <p className="text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-blue-700 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
