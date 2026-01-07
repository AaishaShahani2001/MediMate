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
          className="grid gap-6 p-4 sm:p-6 md:grid-cols-2"
        >
          {/* Basic info */}
          <Section title="Basic Information">
            <Input label="Full Name" value={form.fullName} onChange={(v) => setForm({ ...form, fullName: v })} error={errors.fullName} />
            <Input label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} error={errors.email} />
            <Input label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} error={errors.phone} />
          </Section>

          {/* Professional info */}
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
            <Input label="Degree" value={form.degree} onChange={(v) => setForm({ ...form, degree: v })} error={errors.degree} />
            <Input label="Experience (years)" value={form.experience} onChange={(v) => setForm({ ...form, experience: v })} error={errors.experience} />
            <Input label="Consultation Fee" value={form.consultationFee} onChange={(v) => setForm({ ...form, consultationFee: v })} error={errors.consultationFee} />
          </Section>

          {/* About */}
          <div className="md:col-span-2">
            <TextArea
              label="About You"
              value={form.about}
              onChange={(v) => setForm({ ...form, about: v })}
              placeholder="Brief description about your experience"
            />
          </div>

          {/* Uploads */}
          <UploadBox
            label="NIC Upload (Required)"
            accept=".pdf,image/*"
            onChange={(f) => setNicFile(f)}
            error={errors.nic}
          />

          <UploadBox
            label="Certifications / License"
            accept=".pdf,image/*"
            multiple
            onChange={(files) => setCertFiles(files)}
            error={errors.cert}
          />

          {/* Message */}
          {msg && (
            <p className="md:col-span-2 text-center text-sm text-blue-700">
              {msg}
            </p>
          )}

          {/* Actions */}
          <div className="md:col-span-2 flex flex-col-reverse sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto rounded-md border px-4 py-2 text-sm font-medium hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              disabled={submitting}
              className="w-full sm:w-auto rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-blue-300"
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
