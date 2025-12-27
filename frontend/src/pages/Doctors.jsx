import { useMemo, useState } from "react";
import DoctorCard from "../components/DoctorCard";
import CategoryPills from "../components/CategoryPills";
import { CATEGORIES, DOCTORS } from "../data/doctors";
import BecomeDoctorModal from "../components/BecomeDoctorModal";


export default function Doctors() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [openApply, setOpenApply] = useState(false);

  const filtered = useMemo(() => {
    const byCat = cat === "All" ? DOCTORS : DOCTORS.filter((d) => d.category === cat);
    const byQ = q.trim()
      ? byCat.filter(
          (d) =>
            d.name.toLowerCase().includes(q.toLowerCase()) ||
            d.category.toLowerCase().includes(q.toLowerCase())
        )
      : byCat;
    return byQ;
  }, [q, cat]);

  return (
    <main className="min-h-screen bg-white">
      {/* Top */}
      <section className="border-b bg-linear-to-br from-blue-50 via-white to-indigo-50">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Find your doctor</h1>
              <p className="text-slate-600">Filter by specialty or search by name.</p>
            </div>
            <button
              onClick={() => setOpenApply(true)}
              className="rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700"
            >
              Become a Doctor
            </button>
          </div>

          <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <div className="relative">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search by doctor or category…"
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 pl-10 text-sm text-slate-800 placeholder-slate-400 shadow-sm focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200 md:max-w-md"
                />
                <svg className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
                </svg>
              </div>
            </div>
            <CategoryPills categories={CATEGORIES} active={cat} onChange={setCat} />
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-600">
            No doctors found for your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((d) => (
              <DoctorCard key={d.id} doc={d} />
            ))}
          </div>
        )}
      </section>

      {/* Apply Modal */}
      {openApply && <BecomeDoctorModal onClose={() => setOpenApply(false)} />}
    </main>
  );
}

/* ================== Modal ================== */

function BecomeDoctorModal({ onClose }) {
  const [submitting, setSubmitting] = useState(false);
  const [docs, setDocs] = useState([]);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    specialization: "",
    degree: "",
    experience: "",
    consultationFee: "",
    about: "",
    avatar: null,
  });
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!form.fullName) e.fullName = "Full name is required";
    if (!form.email) e.email = "Email is required";
    if (!form.phone) e.phone = "Contact number is required";
    if (!form.specialization) e.specialization = "Choose a specialization";
    if (!form.degree) e.degree = "Degree is required";
    if (!form.experience) e.experience = "Experience is required";
    if (!form.consultationFee) e.consultationFee = "Fee is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function onPickFiles(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setDocs((old) => [...old, ...files.slice(0, 5)]);
    e.target.value = "";
  }

  function onSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setTimeout(() => {
      alert(
        `Doctor application submitted (UI-only)
Name: ${form.fullName}
Email: ${form.email}
Specialization: ${form.specialization}
Experience: ${form.experience}
Docs attached: ${docs.length}`
      );
      setSubmitting(false);
      onClose();
    }, 400);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h3 className="text-lg font-semibold text-slate-900">Become a Doctor</h3>
          <button onClick={onClose} className="rounded-md p-1.5 text-slate-600 hover:bg-slate-100" aria-label="Close">
            ✕
          </button>
        </div>

        {/* Body */}
        <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 px-5 py-5 md:grid-cols-2">
          <Field label="Full Name" value={form.fullName} onChange={(v) => setForm({ ...form, fullName: v })} error={errors.fullName} />
          <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} error={errors.email} />
          <Field label="Contact Number" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} error={errors.phone} />
          <Select
            label="Specialization"
            value={form.specialization}
            onChange={(v) => setForm({ ...form, specialization: v })}
            options={["General Physician","Dermatology","Dental","Cardiology","Pediatrics","Neurology","Psychiatry","Orthopedics"]}
            error={errors.specialization}
          />
          <Field label="Degree" value={form.degree} onChange={(v) => setForm({ ...form, degree: v })} error={errors.degree} />
          <Field label="Experience (years)" value={form.experience} onChange={(v) => setForm({ ...form, experience: v })} error={errors.experience} />
          <Field label="Consultation Fee" value={form.consultationFee} onChange={(v) => setForm({ ...form, consultationFee: v })} placeholder="e.g., LKR 3000" error={errors.consultationFee} />
          <TextArea className="md:col-span-2" label="About" rows={4} value={form.about} onChange={(v) => setForm({ ...form, about: v })} placeholder="Short bio about your experience and approach" />

          {/* Uploads */}
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">Documents (degree/license)</label>
            <div className="flex items-center gap-3">
              <input id="docPicker" type="file" multiple className="hidden" accept=".pdf,image/*" onChange={onPickFiles} />
              <label htmlFor="docPicker" className="cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                Choose Files
              </label>
              <span className="text-xs text-slate-500">PDF, JPG, PNG up to ~5 files</span>
            </div>
            {docs.length > 0 && (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                {docs.map((f, i) => (
                  <li key={i}>{f.name}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Avatar */}
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">Profile Photo (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setForm({ ...form, avatar: e.target.files?.[0] || null })}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* Actions */}
          <div className="md:col-span-2 mt-2 flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300">
              {submitting ? "Submitting…" : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ===== helpers ===== */

function Field({ label, value, onChange, type = "text", placeholder = "", error }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200
          ${error ? "border-red-300 focus:ring-red-200" : "border-slate-200"}`}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

function Select({ label, value, onChange, options = [], error }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-md border bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200
          ${error ? "border-red-300 focus:ring-red-200" : "border-slate-200"}`}
      >
        <option value="">Select</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

function TextArea({ label, value, onChange, rows = 4, placeholder = "", className = "" }) {
  return (
    <div className={className}>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full resize-y rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
      />
    </div>
  );
}
