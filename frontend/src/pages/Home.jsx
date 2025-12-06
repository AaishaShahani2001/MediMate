import { Link } from "react-router-dom";
import { useState } from "react";

const CATEGORIES = [
  { key: "general", name: "General Physician", emoji: "🩺", blurb: "Colds, fever, checkups" },
  { key: "derma", name: "Dermatology", emoji: "🌿", blurb: "Skin & hair" },
  { key: "dental", name: "Dental", emoji: "🦷", blurb: "Teeth & oral care" },
  { key: "cardio", name: "Cardiology", emoji: "❤️", blurb: "Heart health" },
  { key: "pedi", name: "Pediatrics", emoji: "👶", blurb: "Child care" },
  { key: "neuro", name: "Neurology", emoji: "🧠", blurb: "Brain & nerves" },
];

export default function Home() {
  // simple UI-only state for contact form
  const [contact, setContact] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!contact.name) e.name = "Full name is required";
    if (!contact.email) e.email = "Email is required";
    if (!contact.message) e.message = "Please enter a message";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function submitContact(ev) {
    ev.preventDefault();
    if (!validate()) return;
    alert(`Message sent (UI-only)
From: ${contact.name} <${contact.email}>
Message: ${contact.message}`);
    setContact({ name: "", email: "", message: "" });
    setErrors({});
  }

  return (
    <main className="min-h-screen bg-white">
      {/* HERO */}
      <section className="relative overflow-hidden border-b bg-linear-to-br from-blue-50 via-white to-indigo-50">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-20">
          <div>
            <h1 className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl md:text-5xl">
              Find the right doctor, fast.
            </h1>
            <p className="mt-3 max-w-prose text-slate-600">
              Browse categories, view profiles, and book appointments in minutes. Clean UI — perfect for your semester demo.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                to="/doctors"
                className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700"
              >
                Browse Doctors
              </Link>
              <Link
                to="/signup"
                className="rounded-md border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50"
              >
                Get Started
              </Link>
            </div>

            <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-600">
              <li className="flex items-center gap-2">✅ Trusted professionals</li>
              <li className="flex items-center gap-2">✅ Easy booking</li>
              <li className="flex items-center gap-2">✅ Free account</li>
            </ul>
          </div>

          {/* decorative art block */}
          <div className="relative h-72 w-full rounded-2xl bg-linear-to-tr from-blue-200 to-indigo-200 shadow-inner md:h-96">
            <div className="absolute -left-6 -top-6 h-28 w-28 rounded-full bg-white/70 blur" />
            <div className="absolute -bottom-8 right-6 h-36 w-36 rounded-full bg-white/60 blur" />
            <div className="absolute left-10 top-10 h-24 w-24 rounded-2xl bg-white/80 backdrop-blur" />
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-slate-900">Popular Categories</h2>
          <p className="text-slate-600">Pick a specialty to see available doctors</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              type="button"
              className="group rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
            >
              <span className="mb-1 block text-3xl">{c.emoji}</span>
              <div className="font-semibold text-slate-900 group-hover:text-blue-700">{c.name}</div>
              <div className="text-sm text-slate-600">{c.blurb}</div>
            </button>
          ))}
        </div>

        <div className="mt-8">
          <Link
            to="/doctors"
            className="inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto"
          >
            See All Doctors
          </Link>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-y bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-slate-900">How it works</h2>
            <p className="text-slate-600">Three quick steps to better care</p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="relative rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="absolute -top-3 left-4 grid h-9 w-9 place-items-center rounded-full border bg-indigo-50 font-bold text-indigo-700">
                  {i}
                </div>
                {i === 1 && (
                  <>
                    <h3 className="mt-4 text-base font-semibold text-slate-900">Choose a category</h3>
                    <p className="text-sm text-slate-600">Filter doctors by specialty and availability.</p>
                  </>
                )}
                {i === 2 && (
                  <>
                    <h3 className="mt-4 text-base font-semibold text-slate-900">View doctor profile</h3>
                    <p className="text-sm text-slate-600">See experience, about section, and rating.</p>
                  </>
                )}
                {i === 3 && (
                  <>
                    <h3 className="mt-4 text-base font-semibold text-slate-900">Book a slot</h3>
                    <p className="text-sm text-slate-600">Pick a date (next 7 days) and time (08:30–17:30).</p>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GET IN TOUCH (contact form) */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Left: illustration/card */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <div className="relative aspect-16/12 w-full overflow-hidden rounded-xl bg-linear-to-tr from-amber-100 via-white to-amber-50">
              {/* simple illustration using shapes */}
              <div className="absolute left-6 top-6 h-20 w-20 rounded-full bg-blue-200" />
              <div className="absolute right-10 top-10 h-20 w-32 rounded-xl bg-white/80 backdrop-blur" />
              <div className="absolute bottom-8 left-1/2 h-10 w-40 -translate-x-1/2 rounded-xl bg-blue-500/20" />
              <div className="absolute inset-0 grid place-items-center text-6xl">📞 ✉️ 📍</div>
            </div>
          </div>

          {/* Right: form card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">Get in Touch with Us</h2>

            <form onSubmit={submitContact} className="mt-6 space-y-4">
              {/* Full Name */}
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Full Name</label>
                <input
                  value={contact.name}
                  onChange={(e) => setContact({ ...contact, name: e.target.value })}
                  placeholder="Your Name"
                  className={`w-full rounded-md border px-3 py-2 text-sm outline-none shadow-sm
                    ${errors.name ? "border-red-300 focus:ring-2 focus:ring-red-200"
                                  : "border-slate-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-200"}`}
                />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Email Address</label>
                <input
                  type="email"
                  value={contact.email}
                  onChange={(e) => setContact({ ...contact, email: e.target.value })}
                  placeholder="you@example.com"
                  className={`w-full rounded-md border px-3 py-2 text-sm outline-none shadow-sm
                    ${errors.email ? "border-red-300 focus:ring-2 focus:ring-red-200"
                                    : "border-slate-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-200"}`}
                />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
              </div>

              {/* Message */}
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Message</label>
                <textarea
                  rows={5}
                  value={contact.message}
                  onChange={(e) => setContact({ ...contact, message: e.target.value })}
                  placeholder="Your message…"
                  className={`w-full resize-y rounded-md border px-3 py-2 text-sm outline-none shadow-sm
                    ${errors.message ? "border-red-300 focus:ring-2 focus:ring-red-200"
                                      : "border-slate-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-200"}`}
                />
                {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message}</p>}
              </div>

              <button
                type="submit"
                className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 md:w-auto"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="mx-auto max-w-7xl px-4 pb-12">
        <div className="flex flex-col items-start justify-between gap-4 rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-10 text-white md:flex-row md:items-center md:gap-6">
          <div>
            <h3 className="text-xl font-semibold">Ready to book your appointment?</h3>
            <p className="text-blue-100">Create a free account to save your details and bookings.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/signup" className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50">
              Create Account
            </Link>
            <Link to="/login" className="rounded-md bg-black/20 px-4 py-2 text-sm font-semibold backdrop-blur hover:bg-black/30">
              Login
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
