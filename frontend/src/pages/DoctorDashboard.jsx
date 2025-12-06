import { useState } from "react";

export default function DoctorDashboard() {
  const [tab, setTab] = useState("profile"); // profile | appointments | password
  const [edit, setEdit] = useState(false);

  // demo doctor info
  const [doc, setDoc] = useState({
    name: "Prabhjot Singh",
    email: "ghaiprabghghai@gmail.com",
    gender: "Male",
    phone: "9592023223",
    specialization: "Cardiologist",
    degree: "MBBS, MD (Cardio)",
    experience: "10 years",
    fee: "LKR 3,000",
    location: "Colombo, Sri Lanka",
    about:
      "Cardiologist focused on preventive cardiology, hypertension, and lifestyle counseling. Passionate about patient education and evidence-based care.",
    avatar:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=300&auto=format&fit=crop", // demo
  });

  // demo appointments
  const [appointments, setAppointments] = useState([
    {
      id: "ap1",
      patient: "Aaisha Shahani",
      date: "2025-06-05",
      time: "09:30 AM",
      status: "Cancelled",
      mode: "Video",
    },
    {
      id: "ap2",
      patient: "Kavindu Perera",
      date: "2025-06-08",
      time: "10:00 AM",
      status: "Pending",
      mode: "Video",
    },
    {
      id: "ap3",
      patient: "Ishara Jayasinghe",
      date: "2025-06-10",
      time: "02:30 PM",
      status: "Confirmed",
      mode: "In-person",
    },
  ]);

  function setStatus(id, next) {
    setAppointments((list) => list.map((a) => (a.id === id ? { ...a, status: next } : a)));
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          {/* Sidebar */}
          <aside className="md:col-span-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">Dashboard</h2>
              <nav className="flex flex-col gap-1">
                <SideItem icon="👤" label="My Profile" active={tab === "profile"} onClick={() => setTab("profile")} />
                <SideItem icon="📅" label="All Appointments" active={tab === "appointments"} onClick={() => setTab("appointments")} />
                <SideItem icon="🔒" label="Reset Password" active={tab === "password"} onClick={() => setTab("password")} />
              </nav>
              <button className="mt-6 w-full rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700" type="button">
                Logout
              </button>
            </div>
          </aside>

          {/* Main content */}
          <section className="md:col-span-9">
            {/* Profile */}
            {tab === "profile" && (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                <div className="mb-5 flex items-center justify-between">
                  <h1 className="text-2xl font-semibold text-slate-900">Welcome</h1>
                  <div className="flex items-center gap-3">
                    <img
                      src={doc.avatar}
                      alt="doctor"
                      className="h-20 w-20 rounded-full object-cover ring-2 ring-blue-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field label="Name" value={doc.name} readOnly={!edit} onChange={(v)=>setDoc({...doc, name:v})} />
                  <Field label="Email" value={doc.email} readOnly={!edit} onChange={(v)=>setDoc({...doc, email:v})} />
                  <Field label="Gender" value={doc.gender} readOnly={!edit} onChange={(v)=>setDoc({...doc, gender:v})} />
                  <Field label="Contact Number" value={doc.phone} readOnly={!edit} onChange={(v)=>setDoc({...doc, phone:v})} />
                  <Field label="Specialization" value={doc.specialization} readOnly={!edit} onChange={(v)=>setDoc({...doc, specialization:v})} />
                  <Field label="Degree" value={doc.degree} readOnly={!edit} onChange={(v)=>setDoc({...doc, degree:v})} />
                  <Field label="Experience" value={doc.experience} readOnly={!edit} onChange={(v)=>setDoc({...doc, experience:v})} />
                  <Field label="Consultation Fee" value={doc.fee} readOnly={!edit} onChange={(v)=>setDoc({...doc, fee:v})} />
                  <Field label="Location" value={doc.location} readOnly={!edit} onChange={(v)=>setDoc({...doc, location:v})} />
                  <TextArea
                    className="md:col-span-2"
                    label="About"
                    value={doc.about}
                    readOnly={!edit}
                    onChange={(v)=>setDoc({...doc, about:v})}
                  />
                </div>

                <div className="mt-6 flex gap-3">
                  {!edit ? (
                    <button
                      onClick={() => setEdit(true)}
                      className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => setEdit(false)}
                        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setEdit(false)}
                        className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* All Appointments */}
            {tab === "appointments" && (
              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                  <h1 className="text-xl font-semibold text-slate-900">All Appointments</h1>
                  <p className="text-sm text-slate-600">Today & upcoming (demo)</p>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  {appointments.map((a) => (
                    <AppointmentCard key={a.id} data={a} onStatus={(s)=>setStatus(a.id, s)} />
                  ))}
                </div>
              </div>
            )}

            {/* Reset Password */}
            {tab === "password" && (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                <h1 className="text-xl font-semibold text-slate-900">Reset Password</h1>
                <p className="text-sm text-slate-600">UI-only</p>
                <form className="mt-5 max-w-md space-y-4">
                  <Input label="Current password" type="password" placeholder="••••••••" />
                  <Input label="New password" type="password" placeholder="At least 6 characters" />
                  <Input label="Confirm new password" type="password" placeholder="Repeat new password" />
                  <button className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto">
                    Update Password
                  </button>
                </form>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

/* ------- small UI helpers ------- */

function SideItem({ icon, label, active, onClick }) {
  const base = "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition";
  const a = active ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-blue-50 hover:text-blue-700";
  return (
    <button type="button" onClick={onClick} className={`${base} ${a}`}>
      <span className="text-base">{icon}</span>
      <span className="font-medium">{label}</span>
    </button>
  );
}

function Field({ label, value, onChange, readOnly = true }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      <input
        value={value}
        readOnly={readOnly}
        onChange={(e) => onChange?.(e.target.value)}
        className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200
          ${readOnly ? "bg-slate-50 border-slate-200" : "bg-white border-slate-300"}`}
      />
    </div>
  );
}

function TextArea({ label, value, onChange, readOnly = true, className = "" }) {
  return (
    <div className={className}>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      <textarea
        rows={4}
        value={value}
        readOnly={readOnly}
        onChange={(e) => onChange?.(e.target.value)}
        className={`w-full resize-y rounded-md border px-3 py-2 text-sm shadow-sm focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200
          ${readOnly ? "bg-slate-50 border-slate-200" : "bg-white border-slate-300"}`}
      />
    </div>
  );
}

function Input({ label, type = "text", placeholder = "" }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
      />
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    Cancelled: "bg-amber-100 text-amber-700 border-amber-200",
    Pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    Confirmed: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Completed: "bg-blue-100 text-blue-700 border-blue-200",
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

function AppointmentCard({ data, onStatus }) {
  const disabledJoin = data.status === "Cancelled";
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{data.patient}</h3>
          <div className="mt-1 text-sm text-slate-600">{data.mode}</div>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-700">
            <span className="inline-flex items-center gap-2"><CalendarIcon /> {data.date}</span>
            <span className="inline-flex items-center gap-2"><ClockIcon /> {data.time}</span>
            <StatusBadge status={data.status} />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={disabledJoin}
              className={`rounded-full px-4 py-2 text-sm font-semibold shadow-sm
                ${disabledJoin ? "cursor-not-allowed bg-emerald-200 text-emerald-800" : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"}`}
            >
              Join the call
            </button>

            {/* quick actions */}
            <select
              value={data.status}
              onChange={(e) => onStatus?.(e.target.value)}
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 shadow-sm focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <button
              type="button"
              className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              View Details
            </button>
          </div>
        </div>

        <div className="h-10 w-10 rounded-lg bg-blue-100" title="patient avatar" />
      </div>
    </div>
  );
}
