import { useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function PatientDashboard() {
  const [tab, setTab] = useState("profile"); // profile | edit | appointments | upload

  // demo patient starter data
  const [patient, setPatient] = useState({
    name: "Aaisha Shahani",
    email: "aaisha@example.com",
    phone: "+94 77 123 4567",
    dob: "2003-05-14",
    blood: "O+",
    gender: "Female",
    avatar: "", // data URL when uploaded
  });

  // edit form state
  const [form, setForm] = useState(patient);
  const [errors, setErrors] = useState({});
  const avatarInputRef = useRef(null);

  // demo appointments
  const appointments = [
    { id: "a1", doctor: "Prabhjot Singh", specialty: "Cardiologist", date: "2025-06-05", time: "09:30 AM", status: "Cancelled" },
    { id: "a2", doctor: "Prabhjot Singh", specialty: "Cardiologist", date: "2025-06-08", time: "10:00 AM", status: "Pending" },
  ];

  // demo uploads state
  const [reports, setReports] = useState([
    { id: "r1", name: "Blood_Test_Results.pdf", type: "PDF", size: "214 KB", date: "2025-06-01", status: "Reviewed" },
    { id: "r2", name: "ECG_Report.jpg", type: "Image", size: "482 KB", date: "2025-06-07", status: "Pending" },
  ]);
  const [dragOver, setDragOver] = useState(false);

  function validateProfile() {
    const e = {};
    if (!form.name) e.name = "Full name is required";
    if (!form.email) e.email = "Email is required";
    if (!form.phone) e.phone = "Phone is required";
    if (!form.dob) e.dob = "Date of birth is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleAvatarChange(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm((f) => ({ ...f, avatar: String(ev.target?.result || "") }));
    reader.readAsDataURL(file);
  }

  function onSaveProfile(e) {
    e.preventDefault();
    if (!validateProfile()) return;
    setPatient(form);               // apply changes (UI-only)
    setTab("profile");
  }
  function onCancelEdit() {
    setForm(patient);               // reset edits
    setErrors({});
    setTab("profile");
  }

  function onDropFiles(e) {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files || []);
    addFiles(files);
  }
  function onPickFiles(e) {
    addFiles(Array.from(e.target.files || []));
    e.target.value = "";
  }
  function addFiles(files) {
    if (!files.length) return;
    const mapped = files.slice(0, 5).map((f, idx) => ({
      id: "u" + Date.now() + "-" + idx,
      name: f.name,
      type: f.type?.includes("pdf") ? "PDF" : f.type?.startsWith("image/") ? "Image" : "File",
      size: human(f.size),
      date: new Date().toISOString().slice(0, 10),
      status: "Uploaded",
    }));
    setReports((r) => [...mapped, ...r]);
  }
  function human(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 102.4) / 10} KB`;
    return `${Math.round(bytes / 1024 / 102.4) / 10} MB`;
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          {/* Sidebar */}
          <aside className="md:col-span-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">Dashboard</h2>
              <nav className="flex flex-col gap-1">
                <SideItem active={tab==="profile"} onClick={()=>setTab("profile")} icon="👤" label="My Profile" />
                <SideItem active={tab==="appointments"} onClick={()=>setTab("appointments")} icon="📅" label="My Appointments" />
                <SideItem active={tab==="upload"} onClick={()=>setTab("upload")} icon="📤" label="Upload Report" />
                <SideItem icon="🤖" label="AI Chat Bot" disabled />
                <SideItem icon="🔒" label="Reset Password" disabled />
              </nav>
              <button className="mt-6 w-full rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700" type="button">
                Logout
              </button>
            </div>
          </aside>

          {/* Content */}
          <section className="md:col-span-9">
            {/* PROFILE (read) */}
            {tab === "profile" && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    {patient.avatar ? (
                      <img src={patient.avatar} alt="avatar" className="h-16 w-16 rounded-xl object-cover ring-1 ring-slate-200" />
                    ) : (
                      <div className="grid h-16 w-16 place-items-center rounded-xl bg-linear-to-tr from-blue-200 to-indigo-200 text-lg font-bold text-slate-800">
                        {patient.name.split(" ").map(n=>n[0]).slice(0,2).join("").toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h1 className="text-xl font-semibold text-slate-900">My Profile</h1>
                    <p className="text-sm text-slate-600">Manage your basic information</p>

                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Info label="Full Name" value={patient.name} />
                      <Info label="Email" value={patient.email} />
                      <Info label="Phone" value={patient.phone} />
                      <Info label="Date of Birth" value={patient.dob} />
                      <Info label="Blood Group" value={patient.blood} />
                      <Info label="Gender" value={patient.gender} />
                    </div>

                    <div className="mt-6 flex gap-3">
                      <button onClick={()=>setTab("edit")} className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                        Edit Profile
                      </button>
                     
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* EDIT PROFILE (form) */}
            {tab === "edit" && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h1 className="text-xl font-semibold text-slate-900">Edit Profile</h1>
                <p className="text-sm text-slate-600">Update your information (UI-only)</p>

                <form onSubmit={onSaveProfile} className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Avatar */}
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-slate-700">Avatar</label>
                    <div className="flex items-center gap-4">
                      {form.avatar ? (
                        <img src={form.avatar} className="h-16 w-16 rounded-xl object-cover ring-1 ring-slate-200" alt="avatar preview" />
                      ) : (
                        <div className="grid h-16 w-16 place-items-center rounded-xl bg-slate-100 text-slate-500">No Photo</div>
                      )}
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => avatarInputRef.current?.click()}
                          className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          Upload
                        </button>
                        {form.avatar && (
                          <button
                            type="button"
                            onClick={() => setForm((f)=>({ ...f, avatar: "" }))}
                            className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            Remove
                          </button>
                        )}
                        <input
                          ref={avatarInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e)=>handleAvatarChange(e.target.files?.[0])}
                        />
                      </div>
                    </div>
                  </div>

                  <Field label="Full name" value={form.name} onChange={(v)=>setForm({...form, name:v})} error={errors.name} />
                  <Field label="Email" type="email" value={form.email} onChange={(v)=>setForm({...form, email:v})} error={errors.email} />
                  <Field label="Phone" value={form.phone} onChange={(v)=>setForm({...form, phone:v})} error={errors.phone} />
                  <Field label="Date of birth" type="date" value={form.dob} onChange={(v)=>setForm({...form, dob:v})} error={errors.dob} />

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Blood group</label>
                    <select
                      value={form.blood}
                      onChange={(e)=>setForm({...form, blood:e.target.value})}
                      className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-200"
                    >
                      {["A+","A-","B+","B-","O+","O-","AB+","AB-"].map(g=>(
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Gender</label>
                    <select
                      value={form.gender}
                      onChange={(e)=>setForm({...form, gender:e.target.value})}
                      className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-200"
                    >
                      {["Female","Male","Other","Prefer not to say"].map(g=>(
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2 mt-2 flex gap-3">
                    <button type="submit" className="rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
                      Save changes
                    </button>
                    <button type="button" onClick={onCancelEdit} className="rounded-md border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* APPOINTMENTS */}
            {tab === "appointments" && (
              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h1 className="text-xl font-semibold text-slate-900">My Appointments</h1>
                  <p className="text-sm text-slate-600">Upcoming and past bookings</p>
                </div>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  {appointments.map((a) => <AppointmentCard key={a.id} data={a} />)}
                </div>
              </div>
            )}

            {/* UPLOAD REPORT */}
            {tab === "upload" && (
              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h1 className="text-xl font-semibold text-slate-900">Upload Report</h1>
                  <p className="text-sm text-slate-600">Attach lab results, prescriptions, or images (UI-only)</p>

                  {/* Dropzone */}
                  <div
                    onDragOver={(e)=>{e.preventDefault(); setDragOver(true);}}
                    onDragLeave={()=>setDragOver(false)}
                    onDrop={onDropFiles}
                    className={`mt-5 rounded-2xl border-2 border-dashed p-8 text-center transition
                      ${dragOver ? "border-blue-400 bg-blue-50" : "border-slate-300 bg-slate-50"}`}
                  >
                    <div className="mx-auto w-full max-w-md">
                      <p className="text-sm text-slate-600">Drag & drop files here</p>
                      <p className="text-xs text-slate-500">PDF, JPG, PNG (max ~5 shown)</p>
                      <div className="mt-4 flex items-center justify-center gap-2">
                        <input id="reportPicker" type="file" multiple className="hidden" onChange={onPickFiles} accept=".pdf,image/*" />
                        <label htmlFor="reportPicker" className="cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                          Choose Files
                        </label>
                        <button
                          type="button"
                          onClick={()=>document.getElementById("reportPicker").click()}
                          className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          Browse
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Table */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="mb-4 text-base font-semibold text-slate-900">My Reports</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="text-left text-slate-600">
                          <th className="px-3 py-2">File</th>
                          <th className="px-3 py-2">Type</th>
                          <th className="px-3 py-2">Size</th>
                          <th className="px-3 py-2">Uploaded</th>
                          <th className="px-3 py-2">Status</th>
                          <th className="px-3 py-2"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {reports.map((r) => (
                          <tr key={r.id} className="border-t">
                            <td className="px-3 py-2 font-medium text-slate-800">{r.name}</td>
                            <td className="px-3 py-2">{r.type}</td>
                            <td className="px-3 py-2">{r.size}</td>
                            <td className="px-3 py-2">{r.date}</td>
                            <td className="px-3 py-2">
                              <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold
                                ${r.status==="Reviewed" ? "border-emerald-200 bg-emerald-100 text-emerald-700"
                                  : r.status==="Pending" ? "border-yellow-200 bg-yellow-100 text-yellow-700"
                                  : "border-slate-200 bg-slate-100 text-slate-700"}`}>
                                {r.status}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-right">
                              <button className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                        {reports.length === 0 && (
                          <tr><td className="px-3 py-6 text-center text-slate-500" colSpan={6}>No reports yet</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

/* ---------- Small UI helpers ---------- */

function SideItem({ icon, label, active, disabled, onClick }) {
  const base = "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition";
  const a = active ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-blue-50 hover:text-blue-700";
  const d = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";
  return (
    <button type="button" onClick={disabled ? undefined : onClick} className={`${base} ${disabled ? d : a}`} disabled={disabled} title={disabled ? "Demo only" : undefined}>
      <span className="text-base">{icon}</span>
      <span className="font-medium">{label}</span>
    </button>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="text-sm font-medium text-slate-800">{value}</div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    Cancelled: "bg-amber-100 text-amber-700 border-amber-200",
    Pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    Confirmed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${map[status] || "bg-slate-100 text-slate-700 border-slate-200"}`}>
      {status}
    </span>
  );
}

function CalendarIcon() {
  return (
    <svg className="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3M4 11h16M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/>
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg className="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"/>
    </svg>
  );
}

function AppointmentCard({ data }) {
  const disabledJoin = data.status === "Cancelled";
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="mt-1 h-3 w-3 rounded-full bg-blue-500" />
          <div>
            <h3 className="text-lg font-semibold text-blue-700">{data.doctor}</h3>
            <p className="text-sm text-slate-600"><span className="font-medium">Specialty:</span> {data.specialty}</p>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-700">
              <span className="inline-flex items-center gap-2"><CalendarIcon /> {data.date}</span>
              <span className="inline-flex items-center gap-2"><ClockIcon /> {data.time}</span>
              <StatusBadge status={data.status} />
            </div>
            <button
              type="button"
              disabled={disabledJoin}
              className={`mt-4 rounded-full px-4 py-2 text-sm font-semibold shadow-sm
                ${disabledJoin ? "cursor-not-allowed bg-emerald-200 text-emerald-800" : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"}`}
            >
              Join the call
            </button>
          </div>
        </div>
        <div className="h-10 w-10 rounded-lg bg-blue-100" title="doctor avatar" />
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type="text", error }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e)=>onChange(e.target.value)}
        className={`w-full rounded-md border px-3 py-2 text-sm outline-none shadow-sm
          ${error ? "border-red-300 focus:ring-2 focus:ring-red-200" : "border-slate-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-200"}`}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
