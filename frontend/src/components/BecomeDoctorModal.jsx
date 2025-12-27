import { useState } from "react";
import { API_BASE, useAuth } from "../context/AuthContext";

export default function BecomeDoctorModal({ onClose }) {
  const { token } = useAuth();

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
  });
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState("");

  function validate() {
    const e = {};
    if (!form.fullName) e.fullName = "Full name is required";
    if (!form.email) e.email = "Email is required";
    if (!form.phone) e.phone = "Contact number is required";
    if (!form.specialization) e.specialization = "Choose a specialization";
    if (!form.degree) e.degree = "Degree is required";
    if (!form.experience) e.experience = "Experience is required";
    if (!form.consultationFee) e.consultationFee = "Fee is required";
    if (docs.length === 0) e.docs = "NIC / documents required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function onPickFiles(e) {
    const files = Array.from(e.target.files || []);
    setDocs(files.slice(0, 3)); // NIC + docs
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setMsg("");

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      docs.forEach((f) => fd.append("documents", f));

      const res = await fetch(`${API_BASE}/api/doctor-applications`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");

      setMsg("Application submitted. Await admin approval.");
      setTimeout(onClose, 1200);
    } catch (err) {
      setMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h3 className="text-lg font-semibold">Become a Doctor</h3>
          <button onClick={onClose}>✕</button>
        </div>

        <form onSubmit={onSubmit} className="grid gap-4 p-5 md:grid-cols-2">
          <Input label="Full Name" value={form.fullName} onChange={(v) => setForm({ ...form, fullName: v })} error={errors.fullName} />
          <Input label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} error={errors.email} />
          <Input label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} error={errors.phone} />

          <Select
            label="Specialization"
            value={form.specialization}
            onChange={(v) => setForm({ ...form, specialization: v })}
            options={["General Physician", "Cardiology", "Dermatology", "Dental", "Neurology"]}
            error={errors.specialization}
          />

          <Input label="Degree" value={form.degree} onChange={(v) => setForm({ ...form, degree: v })} error={errors.degree} />
          <Input label="Experience (years)" value={form.experience} onChange={(v) => setForm({ ...form, experience: v })} error={errors.experience} />
          <Input label="Consultation Fee" value={form.consultationFee} onChange={(v) => setForm({ ...form, consultationFee: v })} error={errors.consultationFee} />

          <TextArea
            className="md:col-span-2"
            label="About"
            value={form.about}
            onChange={(v) => setForm({ ...form, about: v })}
          />

          <div className="md:col-span-2">
            <label className="text-sm font-medium">NIC / Certificates</label>
            <input type="file" multiple accept=".pdf,image/*" onChange={onPickFiles} />
            {errors.docs && <p className="text-xs text-red-600">{errors.docs}</p>}
          </div>

          {msg && <p className="md:col-span-2 text-sm text-blue-600">{msg}</p>}

          <div className="md:col-span-2 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="border px-4 py-2 rounded-md">Cancel</button>
            <button disabled={submitting} className="bg-blue-600 text-white px-5 py-2 rounded-md">
              {submitting ? "Submitting…" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* helpers */
function Input({ label, value, onChange, error }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full border rounded-md px-3 py-2" />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

function Select({ label, value, onChange, options, error }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full border rounded-md px-3 py-2">
        <option value="">Select</option>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

function TextArea({ label, value, onChange, className }) {
  return (
    <div className={className}>
      <label className="text-sm font-medium">{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} className="w-full border rounded-md px-3 py-2" />
    </div>
  );
}
