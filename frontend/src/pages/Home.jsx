import { Link } from "react-router-dom";
import { useState } from "react";
import heroImg from "../assets/about_image.png";
import contactImg from "../assets/contact_image.png";


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
      <section className=" mt-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-blue-400 via-indigo-400 to-blue-500" />
        <div className="absolute inset-0 bg-white/40" />

        <div className="relative mx-auto max-w-7xl px-4 py-20">
          <div className="grid grid-cols-1 items-center gap-12 rounded-4xl
      bg-linear-to-br from-white via-blue-50 to-indigo-50 
      p-10 shadow-[0_30px_80px_-20px_rgba(37,99,235,0.35)] 
      backdrop-blur md:grid-cols-2 md:p-16">

            {/* LEFT CONTENT */}
            <div>
              <h1 className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl md:text-5xl">
                Smart Healthcare,
                <span className="block text-blue-600">
                  One Click Away
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-slate-600 text-base md:text-lg">
                HealthVA connects patients with verified doctors, simplifies
                appointment booking, and offers AI-assisted health guidance —
                all from one secure platform.
              </p>

              <div className="mt-7 flex flex-wrap gap-4">
                <Link
                  to="/doctors"
                  className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold 
              text-white shadow-md hover:bg-blue-700 hover:shadow-lg transition"
                >
                  Find a Doctor
                </Link>

                <Link
                  to="/signup"
                  className="rounded-lg bg-white px-6 py-3 text-sm font-semibold 
              text-blue-700 shadow-sm ring-1 ring-slate-200 
              hover:bg-blue-50 transition"
                >
                  Create Account
                </Link>
              </div>

              <div className="mt-7 flex flex-wrap gap-6 text-sm text-slate-600">
                <span className="flex items-center gap-2">✔ Verified Specialists</span>
                <span className="flex items-center gap-2">✔ Secure Appointments</span>
                <span className="flex items-center gap-2">✔ AI Health Support</span>
              </div>
            </div>

            {/* RIGHT IMAGE */}
            <div className="relative flex justify-center">
              {/* Soft glow behind image */}
              <div className="absolute -inset-8 rounded-full bg-blue-300/40 blur-3xl" />

              <img
                src={heroImg}
                alt="Healthcare professionals"
                className="relative w-full max-w-md rounded-2xl 
            object-cover shadow-xl ring-1 ring-white/60"
              />
            </div>
          </div>
        </div>
      </section>




      {/* ================= CATEGORIES ================= */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        {/* Header */}
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Popular Medical Specialties
          </h2>
          <p className="mt-2 text-slate-600">
            Choose a category to find the right healthcare professional
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              type="button"
              className="group relative overflow-hidden rounded-2xl 
          border border-slate-200 bg-white p-6 text-left 
          shadow-sm transition-all duration-300
          hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg"
            >
              {/* soft hover glow */}
              <div className="absolute inset-0 opacity-0 
          bg-linear-to-br from-blue-50 via-white to-indigo-50 
          transition group-hover:opacity-100" />

              <div className="relative">
                {/* Icon */}
                <div className="mb-4 flex h-14 w-14 items-center justify-center 
            rounded-xl bg-blue-100 text-3xl text-blue-700 
            group-hover:bg-blue-600 group-hover:text-white transition">
                  {c.emoji}
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-slate-900 
            group-hover:text-blue-700 transition">
                  {c.name}
                </h3>

                {/* Description */}
                <p className="mt-1 text-sm text-slate-600">
                  {c.blurb}
                </p>

                {/* CTA hint
          <div className="mt-4 text-sm font-medium text-blue-600 opacity-0 
            transition group-hover:opacity-100">
            View Doctors →
          </div> */}
              </div>
            </button>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <Link
            to="/doctors"
            className="inline-flex items-center justify-center rounded-lg 
        bg-blue-600 px-6 py-3 text-sm font-semibold text-white 
        shadow hover:bg-blue-700 hover:shadow-md transition"
          >
            See All Doctors
          </Link>
        </div>
      </section>


      {/* HOW IT WORKS */}
      <section className="relative bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-16">

          {/* Header */}
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              How HealthVA Works
            </h2>
            <p className="mt-2 text-slate-600">
              Get medical care in three simple steps
            </p>
          </div>

          {/* Timeline */}
          <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3">

            {/* Connector line (desktop only) */}
            <div className="absolute left-0 right-0 top-10 hidden h-0.5 bg-blue-100 md:block" />

            {/* STEP 1 */}
            <StepCard
              step="1"
              title="Choose a Specialty"
              desc="Browse medical categories and select the doctor that fits your needs."
              icon="🩺"
            />

            {/* STEP 2 */}
            <StepCard
              step="2"
              title="View Doctor Profile"
              desc="Check qualifications, experience, and consultation details."
              icon="👨‍⚕️"
            />

            {/* STEP 3 */}
            <StepCard
              step="3"
              title="Book an Appointment"
              desc="Select a date and time slot and confirm your appointment."
              icon="📅"
            />

          </div>
        </div>
      </section>


      {/* ================= GET IN TOUCH ================= */}

      <section className="relative overflow-hidden">
        {/* Calm background */}
        <div className="absolute inset-0 bg-linear-to-br from-blue-600 via-indigo-600 to-purple-600" />
        <div className="absolute inset-0 bg-white/50" />

        <div className="relative mx-auto max-w-7xl px-4 py-20">
          {/* Unified Card */}
          <div className="grid grid-cols-1 overflow-hidden rounded-4xl
      border border-slate-200 bg-white/90 shadow-[0_30px_80px_-20px_rgba(59,130,246,0.25)]
      backdrop-blur md:grid-cols-2">

            {/* LEFT: IMAGE SIDE */}
            <div className="relative p-8 md:p-12">
              {/* soft glow */}
              <div className="absolute -top-12 -left-12 h-48 w-48 rounded-full bg-blue-200/40 blur-3xl" />
              <div className="absolute -bottom-12 -right-12 h-48 w-48 rounded-full bg-indigo-200/40 blur-3xl" />

              <img
                src={contactImg}
                alt="Contact HealthVA"
                className="relative w-full rounded-2xl object-cover shadow-lg"
              />

              {/* overlay text */}
              <div className="absolute bottom-12 left-12 right-12 rounded-xl
          bg-white/80 backdrop-blur px-4 py-3 shadow">
                <h3 className="text-sm font-semibold text-slate-900">
                  We’re Here to Help
                </h3>
                <p className="text-xs text-slate-600">
                  Questions, feedback, or support — reach out anytime.
                </p>
              </div>
            </div>

            {/* RIGHT: FORM SIDE */}
            <div className="p-8 md:p-12">
              <h2 className="text-2xl font-bold text-slate-900">
                Get in Touch with HealthVA
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Send us a message and our team will get back to you.
              </p>

              <form onSubmit={submitContact} className="mt-8 space-y-4">
                {/* Full Name */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Full Name
                  </label>
                  <input
                    value={contact.name}
                    onChange={(e) =>
                      setContact({ ...contact, name: e.target.value })
                    }
                    placeholder="Your Name"
                    className={`w-full rounded-md border px-3 py-2 text-sm outline-none shadow-sm
                ${errors.name
                        ? "border-red-300 focus:ring-2 focus:ring-red-200"
                        : "border-slate-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-200"
                      }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={contact.email}
                    onChange={(e) =>
                      setContact({ ...contact, email: e.target.value })
                    }
                    placeholder="you@example.com"
                    className={`w-full rounded-md border px-3 py-2 text-sm outline-none shadow-sm
                ${errors.email
                        ? "border-red-300 focus:ring-2 focus:ring-red-200"
                        : "border-slate-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-200"
                      }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    value={contact.message}
                    onChange={(e) =>
                      setContact({ ...contact, message: e.target.value })
                    }
                    placeholder="Your message…"
                    className={`w-full resize-y rounded-md border px-3 py-2 text-sm outline-none shadow-sm
                ${errors.message
                        ? "border-red-300 focus:ring-2 focus:ring-red-200"
                        : "border-slate-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-200"
                      }`}
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs text-red-600">{errors.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="mt-2 w-full rounded-lg bg-blue-600 px-6 py-3
              text-sm font-semibold text-white shadow hover:bg-blue-700
              hover:shadow-md transition md:w-auto"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>


      {/* ================= CTA BANNER ================= */}
      <section className="mt-6 mx-auto max-w-7xl px-4 pb-16">
        <div
          className="relative overflow-hidden rounded-4xl
    bg-linear-to-br from-blue-100 via-white to-indigo-100
    px-8 py-12 shadow-[0_30px_80px_-30px_rgba(59,130,246,0.25)]
    ring-1 ring-slate-200 md:px-12"
        >
          {/* subtle glow */}
          <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />

          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            {/* Text */}
            <div className="max-w-xl">
              <h3 className="text-2xl font-semibold text-slate-900">
                Ready to book your appointment?
              </h3>
              <p className="mt-2 text-slate-600">
                Create a free account to manage appointments, track bookings,
                and connect with verified doctors.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center
          rounded-lg bg-blue-600 px-6 py-3
          text-sm font-semibold text-white
          shadow hover:bg-blue-700 transition"
              >
                Create Account
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center justify-center
          rounded-lg border border-slate-300
          bg-white px-6 py-3
          text-sm font-semibold text-slate-700
          hover:bg-slate-50 transition"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}

function StepCard({ step, title, desc, icon }) {
  return (
    <div className="relative z-10 rounded-2xl border border-slate-200 bg-white p-6 
      shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

      {/* Step Circle */}
      <div className="mb-4 flex h-12 w-12 items-center justify-center 
        rounded-full bg-blue-600 text-lg font-bold text-white">
        {step}
      </div>

      {/* Icon */}
      <div className="mb-3 text-3xl">{icon}</div>

      {/* Content */}
      <h3 className="text-lg font-semibold text-slate-900">
        {title}
      </h3>
      <p className="mt-2 text-sm text-slate-600 leading-relaxed">
        {desc}
      </p>
    </div>
  );
}
