import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

export default function Signup() {
  const [showPass, setShowPass] = useState(false);
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

  function onSubmit(ev) {
    ev.preventDefault();
    if (!validate()) return;
    alert(
      `Sign Up (UI-only)
        Email: ${form.email}
        Name: ${form.name}
        Gender: ${form.gender}
        Phone: ${form.phone}
        Blood Group: ${form.blood}`
    );
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
          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              name="gender"
              value="Male"
              checked={form.gender === "Male"}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-200"
            />
            Male
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              name="gender"
              value="Female"
              checked={form.gender === "Female"}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-200"
            />
            Female
          </label>
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

        {/* Submit */}
        <button
          type="submit"
          className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Sign Up
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
