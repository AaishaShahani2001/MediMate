import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { API_BASE, useAuth } from "../context/AuthContext";
import heroImg from "../assets/header_img.png";

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
    if (!form.phone) {
      e.phone = "Contact number is required";
    } else if (!/^[0-9]{10}$/.test(form.phone)) {
      e.phone = "Enter a valid 10-digit phone number";
    }

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
    <AuthLayout title="Create Your Account" size="wide">
      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg lg:grid-cols-2">

        {/* ================= LEFT : FORM ================= */}
        <form
          onSubmit={onSubmit}
          className="space-y-4 p-8"
        >
          <h2 className="text-2xl font-bold text-slate-800">
            Join Our Health Platform
          </h2>

          <p className="text-sm text-slate-500">
            Create your account to manage appointments and health records
          </p>

          {/* Email */}
          <input
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm outline-none
            ${errors.email
                ? "border-red-300"
                : "border-slate-200 focus:ring-2 focus:ring-blue-200"
              }`}
          />
          {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}

          {/* Full Name */}
          <input
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm outline-none
            ${errors.name
                ? "border-red-300"
                : "border-slate-200 focus:ring-2 focus:ring-blue-200"
              }`}
          />
          {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}

          {/* Avatar */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Profile Photo (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatar(e.target.files[0])}
              className="mt-1 w-full text-sm
              file:mr-4 file:rounded-md file:border-0
              file:bg-blue-50 file:px-4 file:py-2
              file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={`w-full rounded-md border px-3 py-2 pr-12 text-sm shadow-sm outline-none
              ${errors.password
                  ? "border-red-300"
                  : "border-slate-200 focus:ring-2 focus:ring-blue-200"
                }`}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-blue-600"
            >
              {showPass ? "Hide" : "Show"}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-600">{errors.password}</p>}

          {/* Gender */}
          <div className="flex gap-4 text-sm">
            {["Male", "Female", "Other"].map((g) => (
              <label key={g} className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={form.gender === g}
                  onChange={() => setForm({ ...form, gender: g })}
                  className="text-blue-600 focus:ring-blue-200"
                />
                {g}
              </label>
            ))}
          </div>

          {/* Phone */}
          <input
            placeholder="Contact number"
            value={form.phone}
            onChange={(e) =>
              setForm({
                ...form,
                phone: e.target.value.replace(/\D/g, ""), // numbers only
              })
            }
            className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm outline-none
            ${errors.phone
                ? "border-red-300"
                : "border-slate-200 focus:ring-2 focus:ring-blue-200"
              }`}
          />
          {errors.phone && <p className="text-xs text-red-600">{errors.phone}</p>}

          {/* Blood Group */}
          <select
            value={form.blood}
            onChange={(e) => setForm({ ...form, blood: e.target.value })}
            className="w-full rounded-md border px-3 py-2 text-sm shadow-sm outline-none bg-white focus:ring-2 focus:ring-blue-200"
          >
            {BLOOD_GROUPS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>

          {err && <p className="text-sm text-red-600">{err}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>

          <p className="text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-blue-700 hover:underline">
              Login
            </Link>
          </p>
        </form>

        {/* ================= RIGHT : HERO ================= */}
        <div className="relative hidden lg:flex items-center justify-center bg-linear-to-br from-blue-50 to-cyan-100 p-6">
          <img
            src={heroImg}
            alt="Healthcare illustration"
            className="max-h-[420px] w-full object-contain"
          />
        </div>
      </div>
    </AuthLayout>
  );


}
