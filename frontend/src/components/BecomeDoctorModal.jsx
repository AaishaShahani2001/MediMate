import { useState } from "react";
import { API_BASE, useAuth } from "../context/AuthContext";

export default function BecomeDoctorModal({ onClose }) {
  const { token } = useAuth();

  const [submitting, setSubmitting] = useState(false);

  // files
  const [nicFile, setNicFile] = useState(null);
  const [certFiles, setCertFiles] = useState([]);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    specialization: "",
    degree: "",
    experience: "",
    consultationFee: "",
    workplace: "",
    about: "",
  });

  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState("");

  function validate() {
    const e = {};
    if (!form.fullName) e.fullName = "Full name is required";
    if (!form.email) e.email = "Email is required";
    if (!form.phone) e.phone = "Contact number is required";
    if (!form.specialization) e.specialization = "Choose specialization";
    if (!form.degree) e.degree = "Degree is required";
    if (!form.experience) e.experience = "Experience is required";
    if (!form.consultationFee) e.consultationFee = "Fee is required";
    if (!form.workplace) e.workplace = "Hospital / clinic is required";
    if (!nicFile) e.nic = "NIC is required";
    if (certFiles.length === 0) e.cert = "At least one certificate is required";

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setMsg("");

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append("nic", nicFile);
      certFiles.forEach((f) => fd.append("certifications", f));

      const res = await fetch(`${API_BASE}/api/doctor-applications`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Submission failed");

      setMsg("✅ Application submitted. Await admin approval.");
      setTimeout(onClose, 1400);
    } catch (err) {
      setMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-3 sm:px-4">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-xl overflow-y-auto max-h-[95vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 sm:px-6 py-4 bg-blue-50">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900">
            👨‍⚕️ Become a Doctor
          </h3>
          <button onClick={onClose} className="text-slate-600 hover:text-black">
            ✕
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={onSubmit}
          className="grid grid-cols-1 gap-8 p-5 sm:p-6 md:grid-cols-12"
        >
          {/* ================= BASIC INFO ================= */}
          <div className="md:col-span-6 space-y-4">
            <Section title="Basic Information">
              <Input
                label="Full Name"
                value={form.fullName}
                onChange={(v) => setForm({ ...form, fullName: v })}
                error={errors.fullName}
              />
              <Input
                label="Email"
                value={form.email}
                onChange={(v) => setForm({ ...form, email: v })}
                error={errors.email}
              />
              <Input
                label="Phone"
                value={form.phone}
                onChange={(v) => setForm({ ...form, phone: v })}
                error={errors.phone}
              />
            </Section>
          </div>

          {/* ================= PROFESSIONAL INFO ================= */}
          <div className="md:col-span-6 space-y-4">
            <Section title="Professional Details">
              <Select
                label="Specialization"
                value={form.specialization}
                onChange={(v) => setForm({ ...form, specialization: v })}
                options={[
                  "General Physician",
                  "Cardiology",
                  "Dermatology",
                  "Pediatrics",
                  "Dental",
                  "Neurology",
                ]}
                error={errors.specialization}
              />

              <Input
                label="Degree"
                value={form.degree}
                onChange={(v) => setForm({ ...form, degree: v })}
                error={errors.degree}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Experience (years)"
                  value={form.experience}
                  onChange={(v) => setForm({ ...form, experience: v })}
                  error={errors.experience}
                />
                <Input
                  label="Consultation Fee"
                  value={form.consultationFee}
                  onChange={(v) => setForm({ ...form, consultationFee: v })}
                  error={errors.consultationFee}
                />
              </div>

              <Input
                label="Hospital / Clinic"
                value={form.workplace}
                onChange={(v) => setForm({ ...form, workplace: v })}
                error={errors.workplace}
              />
            </Section>
          </div>

          {/* ================= ABOUT ================= */}
          <div className="md:col-span-12">
            <Section title="About You">
              <TextArea
                value={form.about}
                onChange={(v) => setForm({ ...form, about: v })}
                placeholder="Brief description about your medical experience, approach to care, and specialties."
              />
            </Section>
          </div>

          {/* ================= DOCUMENT UPLOADS ================= */}
          <div className="md:col-span-12">
            <Section title="Verification Documents">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <UploadBox
                  label="NIC Upload (Required)"
                  accept=".pdf,image/*"
                  onChange={(f) => setNicFile(f)}
                  error={errors.nic}
                />
                <UploadBox
                  label="Certifications / Medical License"
                  accept=".pdf,image/*"
                  multiple
                  onChange={(files) => setCertFiles(files)}
                  error={errors.cert}
                />
              </div>
            </Section>
          </div>

          {/* ================= MESSAGE ================= */}
          {msg && (
            <div className="md:col-span-12">
              <p className="rounded-lg bg-blue-50 px-4 py-2 text-center text-sm font-medium text-blue-700">
                {msg}
              </p>
            </div>
          )}

          {/* ================= ACTIONS ================= */}
          <div className="md:col-span-12 flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              disabled={submitting}
              className="rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-blue-300"
            >
              {submitting ? "Submitting…" : "Submit Application"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

/* ---------------- UI HELPERS ---------------- */

function Section({ title, children }) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-slate-700">{title}</h4>
      {children}
    </div>
  );
}

function Input({ label, value, onChange, error }) {
  return (
    <div>
      <label className="text-xs font-medium text-slate-600">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-300"
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

function Select({ label, value, onChange, options, error }) {
  return (
    <div>
      <label className="text-xs font-medium text-slate-600">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-300"
      >
        <option value="">Select</option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="text-xs font-medium text-slate-600">{label}</label>
      <textarea
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-300"
      />
    </div>
  );
}

function UploadBox({ label, accept, multiple, onChange, error }) {
  return (
    <div className="rounded-xl border border-dashed p-4 hover:bg-slate-50 transition">
      <label className="text-xs font-medium text-slate-600">{label}</label>
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) =>
          multiple
            ? onChange(Array.from(e.target.files || []))
            : onChange(e.target.files?.[0])
        }
        className="mt-2 block w-full text-sm"
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
